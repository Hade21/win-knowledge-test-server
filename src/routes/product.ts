import express from "express";
import { authorizeAccount } from "../validator/auth";
import {
  createProduct,
  deleteProduct,
  getProduct,
  updateProduct,
} from "../controllers/product";

const router = express.Router();

router.get("/", getProduct);
router.post("/", authorizeAccount, createProduct);
router.patch("/:id", authorizeAccount, updateProduct);
router.delete("/:id", authorizeAccount, deleteProduct);

export default router;
