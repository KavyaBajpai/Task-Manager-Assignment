TaskManager 
===============

TaskManager is a full-stack task management system tailored for teams working within organizational boundaries. It features real-time updates, clean user roles, and a notification system designed to keep users informed of task activities.

Features
--------

- Login and registration with secure JWT-based authentication
- Admin/User roles with organization-level boundaries
- Real-time notifications for task activity using WebSockets
- Task management (create, update, delete, filter, assign)
- User management for admins (view, update, delete users)
- Notification center to view, mark, and delete alerts

API Overview & Usage
--------------------

### Authentication APIs

1. **POST /api/auth/register**  
   Registers a new user. Only used when setting up the app or for open registration.  
   Fields: `email`, `password`, `name`  
   Default role is `user`. Admin creation should be controlled manually.

2. **POST /api/auth/login**  
   Logs in an existing user and returns a JWT token to be used in protected requests.  
   Fields: `email`, `password`

### User APIs (Admin Only)

1. **GET /api/users**  
   Returns a list of all users within the admin's organization.

2. **GET /api/users/getById/:id**  
   Fetches a specific user's details by ID. Admin access only.

3. **PUT /api/users/update/:id**  
   Updates a user's role or details. Used to promote a user to admin or change name.

4. **DELETE /api/users/delete/:id**  
   Removes a user from the database. Tasks assigned to them can optionally be reassigned.

5. **GET /api/users/getAll**  
   Fetches all users details by organization. Admin access only.


### Task APIs

1. **POST /api/tasks/create**  
   Creates a new task and assigns it to a user in the same organization.  
   Fields: `title`, `description`, `priority`, `dueDate`, `assignedTo`

2. **GET /api/tasks**  
   Retrieves all tasks viewable by the logged-in user.  
   Admins see all tasks in their organization.  
   Supports query params like `status`, `priority`, `dueDate`.

3. **GET /api/tasks/:id**  
   Fetches a specific task. Regular users must be the assignee. Admins must belong to the org.

4. **PUT /api/tasks/:id**  
   Updates task details. Notifies the assignee if reassigned or changed.

5. **DELETE /api/tasks/:id**  
   Deletes a task and notifies the assignee.

### Notification APIs

1. **GET /api/notifications**  
   Returns all notifications for the logged-in user, ordered by latest.

2. **GET /api/notifications/unread**  
   Returns only unread notifications.

3. **PATCH /api/notifications/:id/read**  
   Marks a single notification as read.

4. **PATCH /api/notifications/mark-all**  
   Marks all notifications as read for the current user.

5. **DELETE /api/notifications/:id**  
   Permanently deletes a notification.

Notification System
-------------------

When a task is created, assigned, updated, or deleted, the system:

- Saves a persistent notification in the DB
- APIs fetch unread notifications about task updates to user's dashboard

Organization Segregation
------------------------

All users, tasks, and notifications are scoped by organization.

- Admins can manage only users/tasks in their own org.
- Tasks cannot be assigned to users from other organizations.
- Data queries always filter by organization_id.

Setup Instructions
------------------

1. Backend:

    cd backend  
    npm install  
    Create a .env file with DATABASE_URL and JWT_SECRET  
    npx drizzle-kit push  (first time only)  
    npm run dev  

2. Frontend:

    cd frontend  
    npm install  
    npm run dev  

Access app at http://localhost:5173

Demo Video Link
-------------
https://www.loom.com/share/d839a7d447284e7dba56e70338eab8b7

Deployed Link
-------------
https://task-manager-assignment-frontend-kohl.vercel.app/
