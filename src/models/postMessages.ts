import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    caption: String,
    creator: String,
    tags: [String],
    selectedFile: String,
    likes: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const PostMessage = mongoose.model("PostMessage", postSchema);

export default PostMessage;
