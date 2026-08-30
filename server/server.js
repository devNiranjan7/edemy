import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";

// App config
const app = express();
const port = process.env.PORT || 4000;
connectDB();

// Middlewares
app.use(express.json());
app.use(cors());

// API endpoints

// routes
app.get("/", (req, res) => {
    res.send("API WORKING.");
});
app.post("/clerk", express.json(), clerkWebhooks);

app.listen(port, () => console.log("Server started on PORT:", port));
