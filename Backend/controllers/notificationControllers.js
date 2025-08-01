import { connectToDB } from "../config/db.js";
import { notifications, users } from "../schema/schema.js";
import { eq, and, count } from "drizzle-orm";

// 1. Get all notifications for logged-in user
export const getNotifications = async (req, res) => {
  const db = await connectToDB();
  try {
    // If admin, get all notifications from their organization
    if (req.user.role === "admin") {
      const adminUser = await db.select().from(users).where(eq(users.id, req.user.userId));
      if (!adminUser[0]) {
        return res.status(404).json({ error: "Admin user not found" });
      }
      
      const orgNotifications = await db.select().from(notifications)
        .where(eq(notifications.organizationId, adminUser[0].organizationId))
        .orderBy(notifications.createdAt);

      res.status(200).json(orgNotifications);
    } else {
      // Regular users see only their notifications
      const userNotifs = await db.select().from(notifications)
        .where(eq(notifications.userId, req.user.userId))
        .orderBy(notifications.createdAt);

      res.status(200).json(userNotifs);
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications", details: err.message });
  }
};

export const getUnreadCount = async (req, res) => {
  const db = await connectToDB();

  try {
    // If admin, get unread count for their organization
    if (req.user.role === "admin") {
      const adminUser = await db.select().from(users).where(eq(users.id, req.user.userId));
      if (!adminUser[0]) {
        return res.status(404).json({ error: "Admin user not found" });
      }
      
      const result = await db.select({ count: count() }).from(notifications)
        .where(and(
          eq(notifications.organizationId, adminUser[0].organizationId),
          eq(notifications.isRead, false)
        ));

      res.status(200).json({ count: result[0]?.count || 0 });
    } else {
      // Regular users see only their unread count
      const result = await db.select({ count: count() }).from(notifications)
        .where(and(
          eq(notifications.userId, req.user.userId),
          eq(notifications.isRead, false)
        ));

      res.status(200).json({ count: result[0]?.count || 0 });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch unread count", details: err.message });
  }
};

export const getUnreadNotifications = async (req, res) => {
  const db = await connectToDB();

  try {
    // If admin, get unread notifications for their organization
    if (req.user.role === "admin") {
      const adminUser = await db.select().from(users).where(eq(users.id, req.user.userId));
      if (!adminUser[0]) {
        return res.status(404).json({ error: "Admin user not found" });
      }
      
      const unread = await db.select().from(notifications)
        .where(and(
          eq(notifications.organizationId, adminUser[0].organizationId),
          eq(notifications.isRead, false)
        ))
        .orderBy(notifications.createdAt);

      res.status(200).json({ notifications: unread });
    } else {
      // Regular users see only their unread notifications
      const unread = await db.select().from(notifications)
        .where(and(
          eq(notifications.userId, req.user.userId),
          eq(notifications.isRead, false)
        ))
        .orderBy(notifications.createdAt);

      res.status(200).json({ notifications: unread });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch unread notifications", details: err.message });
  }
};

// 2. Mark a single notification as read
export const markAsRead = async (req, res) => {
  const db = await connectToDB();
  const notifId = parseInt(req.params.id);

  try {
    if (req.user.role === "admin") {
      const adminUser = await db.select().from(users).where(eq(users.id, req.user.userId));
      if (!adminUser[0]) {
        return res.status(404).json({ error: "Admin user not found" });
      }
      
      await db.update(notifications)
        .set({ isRead: true })
        .where(and(
          eq(notifications.id, notifId),
          eq(notifications.organizationId, adminUser[0].organizationId)
        ));
    } else {
      await db.update(notifications)
        .set({ isRead: true })
        .where(and(
          eq(notifications.id, notifId),
          eq(notifications.userId, req.user.userId)
        ));
    }

    res.status(200).json({ message: "Notification marked as read" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update notification", details: err.message });
  }
};

// 3. Mark all as read
export const markAllAsRead = async (req, res) => {
  const db = await connectToDB();

  try {
    if (req.user.role === "admin") {
      const adminUser = await db.select().from(users).where(eq(users.id, req.user.userId));
      if (!adminUser[0]) {
        return res.status(404).json({ error: "Admin user not found" });
      }
      
      await db.update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.organizationId, adminUser[0].organizationId));
    } else {
      await db.update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.userId, req.user.userId));
    }

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update notifications", details: err.message });
  }
};

// 4. Delete a notification
export const deleteNotification = async (req, res) => {
  const db = await connectToDB();
  const notifId = parseInt(req.params.id);

  try {
    if (req.user.role === "admin") {
      const adminUser = await db.select().from(users).where(eq(users.id, req.user.userId));
      if (!adminUser[0]) {
        return res.status(404).json({ error: "Admin user not found" });
      }
      
      await db.delete(notifications)
        .where(and(
          eq(notifications.id, notifId),
          eq(notifications.organizationId, adminUser[0].organizationId)
        ));
    } else {
      await db.delete(notifications)
        .where(and(
          eq(notifications.id, notifId),
          eq(notifications.userId, req.user.userId)
        ));
    }

    res.status(200).json({ message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete notification", details: err.message });
  }
};

