import mongoose from "mongoose";
import PostModel from "../models/post.model.js";

const postsController = {
  // =========================
  // CREATE POST
  // =========================
  createPost: async (req, res) => {
    try {
      const { userId, content } = req.body;

      // userId bắt buộc theo đề
      if (!userId) {
        return res.status(400).send({
          success: false,
          message: "userId là bắt buộc"
        });
      }

      // content bắt buộc
      if (!content) {
        return res.status(400).send({
          success: false,
          message: "content là bắt buộc"
        });
      }

      // Không cho dùng apiKey của người A
      // nhưng gửi userId của người B
      if (userId !== req.user._id.toString()) {
        return res.status(403).send({
          success: false,
          message: "Bạn không có quyền tạo bài post cho user này"
        });
      }

      const newPost = await PostModel.create({
        userId,
        content
      });

      return res.status(201).send({
        success: true,
        message: "Tạo bài post thành công",
        data: newPost
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: error.message
      });
    }
  },

  // =========================
  // UPDATE POST
  // =========================
  updatePost: async (req, res) => {
    try {
      const { id } = req.params;
      const { content } = req.body;

      // Kiểm tra id MongoDB có hợp lệ không
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
          success: false,
          message: "Id bài post không hợp lệ"
        });
      }

      if (!content) {
        return res.status(400).send({
          success: false,
          message: "content là bắt buộc"
        });
      }

      // Tìm post
      const currentPost = await PostModel.findById(id);

      if (!currentPost) {
        return res.status(404).send({
          success: false,
          message: "Không tìm thấy bài post"
        });
      }

      // Authorization:
      // Chỉ người tạo post mới được sửa
      if (currentPost.userId !== req.user._id.toString()) {
        return res.status(403).send({
          success: false,
          message: "Bạn không có quyền chỉnh sửa bài post này"
        });
      }

      currentPost.content = content;

      await currentPost.save();

      return res.status(200).send({
        success: true,
        message: "Cập nhật bài post thành công",
        data: currentPost
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: error.message
      });
    }
  }
};

export default postsController;