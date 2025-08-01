import { connectToDB } from "../config/db.js";
import { notifications, users } from "../schema/schema.js";
import { eq } from "drizzle-orm";

export const sendNotification = async (userId, message) => {
  const db = await connectToDB();

  try {
    // Get the user's organization ID
    const user = await db.select().from(users).where(eq(users.id, userId));
    if (!user[0]) {
      console.error("User not found for notification");
      return;
    }

    await db.insert(notifications).values({
      userId,
      message,
      isRead: false,
      organizationId: user[0].organizationId,
      createdAt: new Date()
    });
    console.log("notification sent from util file")
  } catch (err) {
    console.error("Failed to send notification:", err.message);
  }
};
