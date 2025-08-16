import express from "express";
import cors from "cors"; // 1. Import the cors package
import userRouter from "./routes/user.routes.js";
import skillsRouter from "./routes/skills.routes.js";

const app = express();

// --- CORS Configuration ---
// 2. Define your CORS options
const corsOptions = {
  origin: "http://localhost:5173", // This is the only origin that will be allowed to make requests
  optionsSuccessStatus: 200 // For legacy browser support
};

// 3. Apply the CORS middleware BEFORE your routes
app.use(cors(corsOptions));

// --- Other Middleware ---
app.use(express.json());


// --- API Routes ---
// To match your frontend's baseURL, let's add an '/api' prefix
app.use('/user', userRouter);
app.use('/skills', skillsRouter);


// --- Start Server ---
app.listen('3000', (req, res) => {
    console.log("App is running on port 3000");
    console.log("Accepting requests from http://localhost:5173");
});