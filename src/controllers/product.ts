import Product from "../models/product";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.find();
    return res.status(200).json({ message: "success", data: product });
  } catch (error) {
    if (error instanceof Error)
      return res.status(404).json({ message: error.message });
  }
};

export const getProductByID = async (req: Request, res: Response) => {
  const { id: _id } = req.params;
  try {
    const product = await Product.findById({ _id });
    if (product) {
      return res.status(200).json({ message: "success", data: product });
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const product = req.body;
  const newProduct = new Product(product);
  try {
    await newProduct.save();
    return res.status(201).json(newProduct);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return res.status(409).json({ message: error.message });
    }
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: _id } = req.params;
  const product = req.body;
  const updateProduct = await Product.findById({ _id });
  try {
    if (!updateProduct)
      return res.status(404).json({ message: "No product found with id" });

    const updatedProduct = await Product.findByIdAndUpdate(
      _id,
      { ...product, _id },
      { new: true }
    );

    return res.status(200).json(updatedProduct);
  } catch (error) {
    if (error instanceof Error)
      return res.status(409).json({ message: error.message });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: _id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(_id))
      return res.status(404).json({ message: "No post found with id" });
    await Product.findByIdAndRemove(_id);

    return res.status(200).json({ message: "Post deleted succesfully" });
  } catch (error) {
    if (error instanceof Error)
      return res.status(404).json({ message: error.message });
  }
};
