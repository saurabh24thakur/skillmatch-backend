import express from "express";
import userRouter from "./routes/user.routes.js";
import skillsRouter from "./routes/skills.routes.js";

const app=express();
app.use(express.json());


app.use('/user',userRouter);
app.use('/skills',skillsRouter);



app.listen('3000',(req,res)=>{
    console.log("App is running on port 3000")
})