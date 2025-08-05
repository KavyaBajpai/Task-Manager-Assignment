import { connectToDB } from "../config/db.js";
import { tasks, users } from "../schema/schema.js";
import { attachments, taskRelations, attachmentRelations } from "../schema/schema.js";
import { eq, and } from "drizzle-orm";
import { sendNotification } from '../utils/notifyer.js'

export const createTask = async (req, res) => {
  const db = await connectToDB();
  const { title, description, dueDate, priority, assignedTo } = req.body;

  try {
    // Get the current user's organization ID
    const currentUser = await db.select().from(users).where(eq(users.id, req.user.userId));
    if (!currentUser[0]) {
      return res.status(404).json({ error: "User not found" });
    }

    const [task] = await db.insert(tasks).values({
      title,
      description,
      dueDate,
      priority,
      assignedTo: assignedTo ? parseInt(assignedTo) : req.user.userId,
      organizationId: currentUser[0].organizationId,
    }).returning();
    
    await sendNotification(assignedTo, "You have been assigned a new task: ${title}");
  
    if (req.files && req.files.length > 0) {
      const existing = await db.query.attachments.findMany({
        where: eq(attachments.taskId, task.id),
      });

      if (existing.length + req.files.length > 3) {
        return res.status(400).json({ error: "Max 3 attachments allowed" });
      }

      const toInsert = req.files.map((file) => ({
        taskId: task.id,
        fileName: file.originalname,
        fileUrl: file.path,
      }));

      await db.insert(attachments).values(toInsert);
    }

    res.status(201).json({ message: "Task created", task });
  } catch (err) {
    res.status(500).json({ error: "Error creating task", details: err.message });
  }
};

export const getAllTasks = async (req, res) => {
  const db = await connectToDB();
  const { status, priority, dueDate } = req.query;

  try {
    // Only admin can see all tasks
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    // Get the admin's organization ID
    const adminUser = await db.select().from(users).where(eq(users.id, req.user.userId));
    if (!adminUser[0]) {
      return res.status(404).json({ error: "Admin user not found" });
    }

    const conditions = [eq(tasks.organizationId, adminUser[0].organizationId)];

    if (status) conditions.push(eq(tasks.status, status));
    if (priority) conditions.push(eq(tasks.priority, priority));
    if (dueDate) conditions.push(eq(tasks.dueDate, dueDate));

    const taskList = await db.query.tasks.findMany({
      where: and(...conditions),
      with: {
        attachments: true,
      },
    });

    res.status(200).json(taskList);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks", details: err.message, err });
  }
};

export const getUserTasks = async (req, res) => {
  const db = await connectToDB();
  const { status, priority, dueDate } = req.query;

  try {
    const conditions = [eq(tasks.assignedTo, req.user.userId)];

    if (status) conditions.push(eq(tasks.status, status));
    if (priority) conditions.push(eq(tasks.priority, priority));
    if (dueDate) conditions.push(eq(tasks.dueDate, dueDate));

    const userTasks = await db.query.tasks.findMany({
      where: and(...conditions),
      with: {
        attachments: true,
      },
    });

    res.status(200).json(userTasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user tasks", details: err.message });
  }
};

export const toggleTaskStatus = async (req, res) => {
  const db = await connectToDB();
  const taskId = parseInt(req.params.id);

  try {
    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, taskId),
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Check if user is authorized to modify this task
    if (req.user.role !== "admin" && task.assignedTo !== req.user.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // For admins, also check if the task belongs to their organization
    if (req.user.role === "admin") {
      const adminUser = await db.select().from(users).where(eq(users.id, req.user.userId));
      if (!adminUser[0] || task.organizationId !== adminUser[0].organizationId) {
        return res.status(403).json({ error: "Unauthorized - task belongs to different organization" });
      }
    }

    // Toggle the status
    const newStatus = task.status === "completed" ? "pending" : "completed";
    
    await db.update(tasks)
      .set({ status: newStatus })
      .where(eq(tasks.id, taskId));

    res.status(200).json({ 
      message: `Task ${newStatus === "completed" ? "completed" : "marked as pending"}`,
      status: newStatus 
    });
  } catch (err) {
    res.status(500).json({ error: "Error toggling task status", details: err.message });
  }
};

export const getTaskById = async (req, res) => {
  const db = await connectToDB();
  const taskId = parseInt(req.params.id);
  console.log("received param: \n", taskId);
  if (isNaN(taskId)) {
    console.log("param is NAN.\n");
    return res.status(400).json({ error: "Invalid Task ID", rawId: req.params.id });
  }
  try {
    console.log("reached line 82\n");
    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, taskId),
      // with: {
      //   attachments: true,
      // },
    });
    console.log("reached line 88\n");
    if (!task) return res.status(404).json({ error: "Task not found" });
    console.log("reached line 89\n");
    
    // Check authorization
    if (req.user.role !== "admin" && task.assignedTo !== req.user.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // For admins, also check if the task belongs to their organization
    if (req.user.role === "admin") {
      const adminUser = await db.select().from(users).where(eq(users.id, req.user.userId));
      if (!adminUser[0] || task.organizationId !== adminUser[0].organizationId) {
        return res.status(403).json({ error: "Unauthorized - task belongs to different organization" });
      }
    }
    
    console.log("reached line 90\n");
    console.log("obtained task: \n", task);
    res.status(201).json({ task, message: "task obtained" });
  } catch (err) {
    console.error("getTaskById error:", err);
    res.status(500).json({ error: "Error fetching task", details: err.message });
  }
};

export const updateTask = async (req, res) => {
  const db = await connectToDB();
  const taskId = parseInt(req.params.id);
  const { title, description, dueDate, priority, status } = req.body;

  try {
    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, taskId),
    });

    if (!task) return res.status(404).json({ error: "Task not found" });

    // Check authorization
    if (req.user.role !== "admin" && task.assignedTo !== req.user.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // For admins, also check if the task belongs to their organization
    if (req.user.role === "admin") {
      const adminUser = await db.select().from(users).where(eq(users.id, req.user.userId));
      if (!adminUser[0] || task.organizationId !== adminUser[0].organizationId) {
        return res.status(403).json({ error: "Unauthorized - task belongs to different organization" });
      }
    }
    
    console.log("task ID is: \n", taskId);
    console.log("user's id is: \n", task.assignedTo);
    console.log("updating task at line 123")
    await db.update(tasks)
      .set({ title, description, dueDate, priority, status })
      .where(eq(tasks.id, taskId))
      .returning();
    
      console.log("sending notification at line 129")
    await sendNotification(task.assignedTo, "Task ${task.title} has been updated.")
      console.log("notification sent at line 131")
    if (req.files && req.files.length > 0) {
      const existing = await db.query.attachments.findMany({
        where: eq(attachments.taskId, taskId),
      });

      if (existing.length + req.files.length > 3) {
        return res.status(400).json({ error: "Cannot exceed 3 total attachments" });
      }

      const toInsert = req.files.map((file) => ({
        taskId,
        fileName: file.originalname,
        fileUrl: file.path,
      }));

      await db.insert(attachments).values(toInsert);
    }

    res.status(201).json({ message: "Task updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error updating task", details: err.message });
  }
};

export const deleteTask = async (req, res) => {
  const db = await connectToDB();
  const taskId = parseInt(req.params.id);

  try {
    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, taskId),
      with: { attachments: true },
    });

    if (!task) return res.status(404).json({ error: "Task not found" });

    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // For admins, also check if the task belongs to their organization
    const adminUser = await db.select().from(users).where(eq(users.id, req.user.userId));
    if (!adminUser[0] || task.organizationId !== adminUser[0].organizationId) {
      return res.status(403).json({ error: "Unauthorized - task belongs to different organization" });
    }

    
    // task.attachments.forEach((file) => {
    //   if (fs.existsSync(file.fileUrl)) fs.unlinkSync(file.fileUrl);
    // });

    
    await db.delete(tasks).where(eq(tasks.id, taskId));
    
    await sendNotification(task.assignedTo, "Task ${task.title} has been deleted.")

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting task", details: err.message });
  }
};