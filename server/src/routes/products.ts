import { Router } from "express";
import { getProducts, getProductBySlug, getCategories } from "../controllers/productController.js";

const router = Router();

router.get("/products", getProducts);
router.get("/products/:slug", getProductBySlug);
router.get("/categories", getCategories);

export default router;
