import express from "express";
import { authorizeAccount } from "../validator/auth";
import {
  createProduct,
  deleteProduct,
  getMyProduct,
  getProduct,
  getProductByID,
  updateProduct,
} from "../controllers/product";

const router = express.Router();

router.get("/", getProduct);
router.post("/", authorizeAccount, createProduct);
router.patch("/:id", authorizeAccount, updateProduct);
router.delete("/:id", authorizeAccount, deleteProduct);
router.get("/:id", authorizeAccount, getProductByID);
router.get("/myproducts/:id", authorizeAccount, getMyProduct);

export default router;
