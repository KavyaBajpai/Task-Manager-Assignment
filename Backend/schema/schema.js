import { pgTable, serial, varchar, text, integer, date, boolean, timestamp } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm";

export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 256 }).unique().notNull(),
  password: text("password").notNull(), // hashed
  name: varchar("name", { length: 255 }),
  role: varchar("role", { length: 10 }).default("user").notNull(), // "admin" or "user"
  organizationId: integer("organization_id")
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 20 }).default("todo").notNull(), // e.g., todo, in_progress, done
  priority: varchar("priority", { length: 10 }).default("medium").notNull(), // e.g., low, medium, high
  dueDate: date("due_date"),
  assignedTo: integer("assigned_to")
    .references(() => users.id, { onDelete: "set null" }),
  organizationId: integer("organization_id")
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: date("created_at").defaultNow(),
});

export const attachments = pgTable("attachments", {
  id: serial("id").primaryKey(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileUrl: varchar("file_url", { length: 512 }).notNull(), // local path or S3/Firebase URL
  taskId: integer("task_id")
    .references(() => tasks.id, { onDelete: "cascade" })
    .notNull(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  organizationId: integer("organization_id")
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

export const organizationRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  tasks: many(tasks),
  notifications: many(notifications),
}));

export const userRelations = relations(users, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id],
  }),
  assignedTasks: many(tasks),
  notifications: many(notifications),
}));

export const taskRelations = relations(tasks, ({ one, many }) => ({
  attachments: many(attachments),
  assignedUser: one(users, {
    fields: [tasks.assignedTo],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [tasks.organizationId],
    references: [organizations.id],
  }),
}));

export const attachmentRelations = relations(attachments, ({ one }) => ({
  task: one(tasks, {
    fields: [attachments.taskId],
    references: [tasks.id],
  }),
}));

export const notificationRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [notifications.organizationId],
    references: [organizations.id],
  }),
}));