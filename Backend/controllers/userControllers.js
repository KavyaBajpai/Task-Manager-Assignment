import { connectToDB } from "../config/db.js";
import { users } from "../schema/schema.js";
import { eq } from "drizzle-orm";

export const getAllUsers = async (req, res) => {
  const db = await connectToDB();
  try {
    // Get the admin's organization ID
    const adminUser = await db.select().from(users).where(eq(users.id, req.user.userId));
    if (!adminUser[0]) {
      return res.status(404).json({ error: "Admin user not found" });
    }
    
    // Filter users by the admin's organization
    const organizationUsers = await db.select().from(users).where(eq(users.organizationId, adminUser[0].organizationId));
    res.status(200).json({ users: organizationUsers });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users", details: err.message });
  }
};

export const getUserById = async (req, res) => {
  const db = await connectToDB();
  const userId = parseInt(req.params.id);
  try {
    // Get the admin's organization ID
    const adminUser = await db.select().from(users).where(eq(users.id, req.user.userId));
    if (!adminUser[0]) {
      return res.status(404).json({ error: "Admin user not found" });
    }
    
    // Get user and verify they belong to the same organization
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) return res.status(404).json({ error: "User not found" });
    
    if (user.organizationId !== adminUser[0].organizationId) {
      return res.status(403).json({ error: "Access denied - user belongs to different organization" });
    }
    
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user", details: err.message });
  }
};

export const updateUser = async (req, res) => {
  const db = await connectToDB();
  const userId = parseInt(req.params.id);
  const { role } = req.body; 

  try {
    // Get the admin's organization ID
    const adminUser = await db.select().from(users).where(eq(users.id, req.user.userId));
    if (!adminUser[0]) {
      return res.status(404).json({ error: "Admin user not found" });
    }
    
    // Get user and verify they belong to the same organization
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    if (user.organizationId !== adminUser[0].organizationId) {
      return res.status(403).json({ error: "Access denied - user belongs to different organization" });
    }
    
    await db.update(users).set({ role }).where(eq(users.id, userId));
    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update user", details: err.message });
  }
};

export const deleteUser = async (req, res) => {
  const db = await connectToDB();
  const userId = parseInt(req.params.id);
  try {
    // Get the admin's organization ID
    const adminUser = await db.select().from(users).where(eq(users.id, req.user.userId));
    if (!adminUser[0]) {
      return res.status(404).json({ error: "Admin user not found" });
    }
    
    // Get user and verify they belong to the same organization
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    if (user.organizationId !== adminUser[0].organizationId) {
      return res.status(403).json({ error: "Access denied - user belongs to different organization" });
    }
    
    await db.delete(users).where(eq(users.id, userId));
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user", details: err.message });
  }
};
