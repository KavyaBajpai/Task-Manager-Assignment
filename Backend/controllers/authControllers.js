import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connectToDB } from "../config/db.js";
import { users, organizations } from "../schema/schema.js";
import { eq } from "drizzle-orm";

export const registerUser = async (req, res) => {
  const { email, password, role, organizationId } = req.body;
  const db = await connectToDB();

  try {
    const hashed = await bcrypt.hash(password, 10);

    let orgId = organizationId;
    if (!orgId) {
      const firstOrg = await db.select().from(organizations).limit(1);
      if (firstOrg.length === 0) {
        return res.status(400).json({ error: "No organizations available" });
      }
      orgId = firstOrg[0].id;
    }

    // Insert new user
    const insertedUsers = await db
      .insert(users)
      .values({
        email,
        password: hashed,
        role,
        organizationId: orgId,
      })
      .returning(); 

    const user = insertedUsers[0];

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

   
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: "User registered successfully!",
      token,
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Registration failed. Email might already exist.",
      message: err.message,
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const db = await connectToDB();
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) return res.status(400).json({ error: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Wrong password" });

  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });

  res.status(201).json({ message:"User Logged In Successfully!",token, user });
};
