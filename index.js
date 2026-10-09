import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import usersRouter from "./routes/users.route.js";
import postsRouter from "./routes/posts.route.js";

// Đọc .env
dotenv.config();

const app = express();

// Middleware đọc JSON body
app.use(express.json());

// Route test server
app.get("/", (req, res) => {
  res.send({
    success: true,
    message: "MERN Midterm Server is running"
  });
});

// Users API
app.use("/users", usersRouter);

// Posts API
app.use("/posts", postsRouter);

// Kết nối MongoDB
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log("MongoDB connection error:");
    console.log(error.message);
  });

// Start server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});