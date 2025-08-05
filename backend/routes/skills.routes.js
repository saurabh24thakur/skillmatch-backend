import express from "express";
import { uploadSkills, getMySkills, getAllUserSkills,getCoursesBySkillMatch } from "../controller/skills.controller.js";
import { auth } from "../controller/user.controller.js"; 

const skillsRouter = express.Router();

skillsRouter.post('/upload', auth, uploadSkills); 
skillsRouter.get('/my', auth, getMySkills);      
skillsRouter.get('/all', getAllUserSkills);      
skillsRouter.get('/find-courses-by-match', auth, getCoursesBySkillMatch); 

export default skillsRouter;