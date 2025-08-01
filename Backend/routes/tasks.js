import express from 'express';
import { createTask,
  getAllTasks,
  getUserTasks,
  getTaskById,
  updateTask,
  deleteTask,
  toggleTaskStatus,} from '../controllers/taskControllers.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { uploadFiles } from '../middlewares/fileUpload.js';
const taskRouter = express.Router();

taskRouter.use(authenticate); 

taskRouter.get("/getAll", getAllTasks);
taskRouter.get("/getUserTasks", getUserTasks);
taskRouter.get("/getById/:id", getTaskById);
taskRouter.post("/create", uploadFiles, createTask);
taskRouter.put("/update/:id", uploadFiles, updateTask);
taskRouter.patch("/toggle/:id", toggleTaskStatus);
taskRouter.delete("/delete/:id", deleteTask);

export default taskRouter;