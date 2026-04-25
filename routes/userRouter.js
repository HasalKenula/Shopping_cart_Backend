import express from "express";
import { createUser, getAllUsers, getUser, loginUser, UpdateUserStatus } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const userRouter = express.Router()

userRouter.post("/",createUser)
userRouter.post("/login",loginUser)
userRouter.get("/", authMiddleware,getUser)
userRouter.get("/all", authMiddleware, getAllUsers)
userRouter.put("/toggle-block/:email", authMiddleware, UpdateUserStatus)

export default userRouter;