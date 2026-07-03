import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoutes.js';
import accommodationRouter from './routes/accommodationRoutes.js';
import reservationRouter from './routes/reservationRoutes.js';

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

connectDB();
connectCloudinary();

// CORS configuration
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://mern-stack-capstone-project-frntend.onrender.com/',
];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());

// API Routes
app.use('/api/users', userRouter);
app.use('/api/accommodations', accommodationRouter);
app.use('/api/reservations', reservationRouter);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
    res.send("API Working");
});

app.listen(port, () => console.log('Server started on port: ' + port));
