import { Request, Response } from "express";
import { validationResult } from "express-validator";
import userModel from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
require("dotenv").config();

export const signup = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const {
    fullname,
    email,
    username,
    profilePicture,
    gender,
    dateofbirth,
    phone,
  } = req.body;
  const password = await bcrypt.hash(req.body.password, 12);

  const newUser = new userModel({
    fullname,
    email,
    username,
    password,
    profilePicture,
    gender,
    dateofbirth,
    phone,
  });

  try {
    const savedUser = await newUser.save();
    const user = { username: savedUser.username, password: savedUser.password };
    return res.status(201).json({ message: "success", user });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const signin = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { user, password } = req.body;
  const username = await userModel.findOne({ username: user }).lean();
  const email = await userModel.findOne({ email: user }).lean();

  try {
    if (!username && !email) {
      return res.status(403).json({ message: "Account doest exist!" });
    }
    if (username) {
      if (await bcrypt.compare(password, username.password)) {
        const token = jwt.sign(
          { id: username._id, username: username.username },
          process.env.ACCESS_TOKEN_SECRET as string,
          { expiresIn: "1d" }
        );
        console.log(token);
        return res
          .status(200)
          .json({ uid: username._id, username: username.username, token });
      }
      return res.status(403).json({ message: "Invalid Password!" });
    }
    if (email) {
      if (await bcrypt.compare(password, email.password)) {
        console.log(email);
        const token = jwt.sign(
          { id: email._id, username: email.username },
          process.env.ACCESS_TOKEN_SECRET as string,
          { expiresIn: "1d" }
        );
        return res
          .status(200)
          .json({ uid: email._id, username: email.username, token });
      }
      return res.status(403).json({ message: "Invalid Password!" });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const getId = async (req: Request, res: Response) => {
  const { id: _id } = req.params;

  try {
    const user = userModel.findById(_id);
    return res.status(200).json({ message: "User found", data: user });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
