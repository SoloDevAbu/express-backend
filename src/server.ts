import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/database';
import userRoutes from './routes/user.routes';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database connection
connectDB();

// Routes
app.use('/api/v1/users', userRoutes);

// Error handling middleware
app.use((_err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(_err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});