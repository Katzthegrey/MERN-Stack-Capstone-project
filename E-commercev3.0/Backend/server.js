import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoutes.js';
import accommodationRouter from './routes/accommodationRoutes.js';
import reservationRouter from './routes/reservationRoutes.js';

const app = express();
const port = process.env.PORT || 4000;

connectDB();
connectCloudinary();

app.use(express.json());
app.use(cors());

app.use('/api/users', userRouter);
app.use('/api/accommodations', accommodationRouter);
app.use('/api/reservations', reservationRouter);

app.get('/', (req, res) => {
    res.send("API Working");
});

app.listen(port, () => console.log('Server started on port: ' + port));
