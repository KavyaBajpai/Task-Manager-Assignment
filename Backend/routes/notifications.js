import express from "express";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notificationControllers.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const notificationRouter = express.Router();
notificationRouter.use(authenticate);

notificationRouter.get("/getAll", getNotifications);
notificationRouter.get("/unreadCount", getUnreadCount);
notificationRouter.patch("/:id/read", markAsRead);
notificationRouter.patch("/mark-all", markAllAsRead);
notificationRouter.delete("/:id", deleteNotification);

export default notificationRouter;
