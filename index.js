import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import {authMiddleware} from "./middleware/authMiddleware.js";
import dotenv from "dotenv"
import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import orderRouter from "./routes/orderRouter.js";

dotenv.config()
const mongoURI = process.env.MONGO_URL




mongoose.connect(mongoURI).then(
    () => {
        console.log("Connected to MongoDB Cluster")
    }
)


const app = express()

app.use(cors())

app.use(express.json())



app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", authMiddleware, orderRouter);

app.listen(3000,
    () => {
        console.log("server is running")
    }
)