# TaskMaster Frontend

A modern, clean, and minimalistic React frontend for the TaskMaster task management application.

## Features

- 🎨 **Modern UI/UX**: Clean, minimalistic design with smooth animations
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- 🔐 **Authentication**: Secure login with JWT tokens
- 📋 **Task Management**: Full CRUD operations for tasks
- 🔔 **Notifications**: Real-time notification system
- 📊 **Dashboard**: Analytics and task overview
- 🎯 **Search & Filter**: Advanced task filtering and search
- ⚡ **Fast Performance**: Optimized with React and Vite

## Tech Stack

- **React 19** - Latest React with hooks
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Toastify** - Toast notifications
- **Vite** - Fast build tool and dev server

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on `http://localhost:5000`

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd Frontend/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx      # Top navigation header
│   ├── Layout.jsx      # Main layout wrapper
│   ├── ProtectedRoute.jsx # Authentication guard
│   └── Sidebar.jsx     # Navigation sidebar
├── pages/              # Page components
│   ├── Dashboard.jsx   # Main dashboard
│   ├── Landing.jsx     # Landing page
│   ├── Login.jsx       # Authentication page
│   ├── Tasks.jsx       # Task management
│   └── Notifications.jsx # Notifications page
├── App.jsx             # Main app component
├── main.jsx           # App entry point
└── index.css          # Global styles
```

## Features Overview

### Dashboard
- Task statistics and overview
- Recent tasks display
- Quick access to main features

### Task Management
- Create, edit, and delete tasks
- Set priority levels (Low, Medium, High)
- Add due dates and descriptions
- Filter by status and search functionality
- Mark tasks as completed

### Notifications
- View all notifications
- Different notification types (task, reminder, system)
- Read/unread status indicators

### Authentication
- Secure login with email/password
- JWT token-based authentication
- Protected routes
- Automatic logout on token expiry

## API Integration

The frontend integrates with the following backend endpoints:

- `POST /api/auth/login` - User authentication
- `GET /api/tasks/getAll` - Fetch all tasks
- `POST /api/tasks/create` - Create new task
- `PUT /api/tasks/update/:id` - Update task
- `DELETE /api/tasks/delete/:id` - Delete task
- `GET /api/notifications/getAll` - Fetch notifications

## Styling

The application uses Tailwind CSS for styling with:
- Custom color scheme
- Responsive design
- Smooth animations and transitions
- Modern UI components
- Consistent spacing and typography

## Development

### Adding New Features

1. Create new components in the `components/` directory
2. Add new pages in the `pages/` directory
3. Update routing in `App.jsx`
4. Add any new API calls following the existing pattern

### Code Style

- Use functional components with hooks
- Follow React best practices
- Use Tailwind CSS for styling
- Implement proper error handling
- Add loading states for async operations

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the backend is running and CORS is properly configured
2. **Authentication Issues**: Check if the JWT token is valid and not expired
3. **API Connection**: Verify the backend URL in API calls

### Development Tips

- Use the browser's developer tools to debug
- Check the Network tab for API call issues
- Use React DevTools for component debugging
- Monitor the console for error messages

## Contributing

1. Follow the existing code structure
2. Use meaningful component and variable names
3. Add proper error handling
4. Test on different screen sizes
5. Ensure accessibility standards

## License

This project is part of the TaskMaster application.
