import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userControllers.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.use(authenticate);
userRouter.use(authorizeAdmin);

userRouter.get("/getAll", getAllUsers);
userRouter.get("/getById/:id", getUserById);
userRouter.put("/update/:id", updateUser);
userRouter.delete("/delete/:id", deleteUser);

export default userRouter;
