import PostMessage from "../models/postMessages";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

export const getPost = async (req: Request, res: Response) => {
  try {
    const post = await PostMessage.find();
    return res.status(200).json(post);
  } catch (error) {
    if (error instanceof Error)
      return res.status(404).json({ message: error.message });
  }
};

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const post = req.body;
  const newPost = new PostMessage(post);
  try {
    await newPost.save();
    return res.status(201).json(newPost);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return res.status(409).json({ message: error.message });
    }
  }
};

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: _id } = req.params;
  const post = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(_id))
      return res.status(404).json({ message: "No post found with id" });

    const updatedPost = await PostMessage.findByIdAndUpdate(
      _id,
      { ...post, _id },
      { new: true }
    );

    return res.status(200).json(updatedPost);
  } catch (error) {
    if (error instanceof Error)
      return res.status(409).json({ message: error.message });
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: _id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(_id))
      return res.status(404).json({ message: "No post found with id" });
    await PostMessage.findByIdAndRemove(_id);

    return res.status(200).json({ message: "Post deleted succesfully" });
  } catch (error) {
    if (error instanceof Error)
      return res.status(404).json({ message: error.message });
  }
};
