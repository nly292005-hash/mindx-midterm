import express from "express";
import postsController from "../controllers/posts.controller.js";
import authentication from "../middlewares/auth.middleware.js";

const router = express.Router();

// Tạo post
router.post(
  "/",
  authentication,
  postsController.createPost
);

// Update post
router.patch(
  "/:id",
  authentication,
  postsController.updatePost
);

export default router;