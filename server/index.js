import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRouter from './routes/AuthRoute.js';
import movieRouter from './routes/MovieRoute.js';
import categoriesRouter from './routes/CategoriesRoute.js';
import uploadRouter from './controllers/UploadFile.js';
import errorHandler from './middlewares/errorMiddleware.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

//connect db
connectDB();

// main route
app.get("/", (req, res) => {
    res.send("running.....")
});

//other routes
app.use("/api/auth", authRouter);
app.use("/api/movies", movieRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/upload", uploadRouter);

//error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on the port : ${PORT}`);
})