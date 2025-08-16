import express from "express";
import { signup, login, currentUser, auth } from "../controller/user.controller.js";

const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.get('/me', auth, currentUser);

export default userRouter;