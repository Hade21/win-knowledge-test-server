import exepress from "express";
import { signin, signup, getId } from "../controllers/auth";
import {
  authorizeAccount,
  signinValidator,
  signupValidator,
} from "../validator/auth";

const router = exepress.Router();

router.post("/signup", signupValidator, signup);
router.post("/signin", signinValidator, signin);
router.get("/:id", authorizeAccount, getId);

export default router;
