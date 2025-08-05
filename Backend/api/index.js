import cors from 'cors';
import express from 'express';
import { connectToDB } from './config/db.js';
import authRouter from './routes/auth.js'
import taskRouter from './routes/tasks.js'
import notificationRouter from './routes/notifications.js'
import userRouter from './routes/users.js'

connectToDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//api end-points
app.use('/api/auth', authRouter)
app.use('/api/tasks', taskRouter)
app.use('/api/user', userRouter)
app.use('/api/notifications', notificationRouter)

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

export default app;