import { Request, Response } from "express";
import { validationResult } from "express-validator";
import userModel from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
require("dotenv-vault-core").config();

export const signup = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { fullname, email, profilePicture, gender } = req.body;
  const password = await bcrypt.hash(req.body.password, 12);

  const newUser = new userModel({
    fullname,
    email,
    password,
    profilePicture,
    gender,
  });
  const exist = await userModel.findOne({ email });
  try {
    if (!exist) {
      const savedUser = await newUser.save();
      console.log(exist);
      const user = {
        email: savedUser.email,
        password: savedUser.password,
      };
      return res.status(201).json({ message: "success", user });
    } else {
      return res.status(422).json({ message: "Email has been taken!" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

export const signin = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  const user = await userModel.findOne({ email }).lean();
  const ACCESS_TOKEN: string = process.env.ACCESS_TOKEN_SECRET as string;

  try {
    if (!user) {
      return res.status(403).json({ message: "Account doest exist!" });
    }
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { id: user._id, fullname: user.fullname },
        ACCESS_TOKEN,
        { expiresIn: "1d" }
      );
      console.log(ACCESS_TOKEN);
      return res
        .status(200)
        .json({ uid: user._id, fullname: user.fullname, token });
    }
    return res.status(403).json({ message: "Invalid Password!" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const getId = async (req: Request, res: Response) => {
  const { id: _id } = req.params;

  try {
    const user = await userModel.findById({ _id });
    if (user) {
      return res.status(200).json({ message: "User found", data: user });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};
