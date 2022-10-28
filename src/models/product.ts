import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: String,
    desc: String,
    price: Number,
    creator: {
      uid: String,
      name: String,
    },
    thumbnail: String,
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
