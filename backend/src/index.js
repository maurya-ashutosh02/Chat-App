import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path"
import { protectRoute } from "./middlewares/auth.middleware.js";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cors from 'cors'
import { app, server } from './lib/socket.js'
dotenv.config();


app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true,
    }
))

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));





const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use("/app/auth", authRoutes);
app.use("/app/messages", messageRoutes);


if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
    })}



server.listen(PORT, () => {
    console.log("Server is running on port  :" + PORT);
    connectDB();
})
