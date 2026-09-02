import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import { clerkWebhooks, stripeWebhooks } from "./controllers/webhooks.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./config/cloudinary.js";
import educatorRouter from "./routes/educatorRoute.js";
import courseRouter from "./routes/courseRoute.js";
import userRouter from "./routes/userRoute.js";

// App config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// Middlewares
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

// routes
app.get("/", (req, res) => {
    res.send("API WORKING.");
});
app.post("/clerk", express.json(), clerkWebhooks);
app.use("/api/educator", educatorRouter);
app.use("/api/course", courseRouter);
app.use("/api/user", userRouter);

app.listen(port, () => console.log("Server started on PORT:", port));
