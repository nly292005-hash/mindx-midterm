import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },

    content: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const PostModel = mongoose.model("posts", postSchema);

export default PostModel;