import { body } from "express-validator";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const signupValidator = [
  body("fullname")
    .exists({ checkFalsy: true })
    .withMessage("Fullname is required")
    .bail()
    .isString()
    .withMessage("Fullname must be a string"),
  body("email")
    .exists({ checkFalsy: true })
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Email is invalid"),
  body("password")
    .exists({ checkFalsy: true })
    .withMessage("Password is required")
    .bail()
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 8, max: 24 })
    .withMessage("Password must be at least 6 characters long"),
  body("profilePicture")
    .optional()
    .isString()
    .withMessage("Profile picture is invalid"),
  body("gender")
    .exists({ checkFalsy: true })
    .isIn(["Male", "Female"])
    .withMessage("Gender is invalid"),
];

export const signinValidator = [
  body("email").isEmail().withMessage("Email is invalid!").bail(),
  body("password")
    .exists({ checkFalsy: true })
    .withMessage("Password required")
    .isString()
    .withMessage("Password is invalid!")
    .bail()
    .isLength({ min: 8, max: 24 })
    .withMessage("Password must be at least 8 character"),
];

export const authorizeAccount = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers["authorization"];
  const token = header && header?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  } else {
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
      (err, user) => {
        if (err) {
          return res.status(403).json({ message: "Forbidden Access!" });
        } else {
          req.body.user = user;
          next();
        }
      }
    );
  }
};
