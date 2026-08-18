import { Request, Response } from "express";
import { Product } from "../models/Product.js";
import { Category } from "../models/Category.js";

export async function getProducts(req: Request, res: Response): Promise<void> {
  const { category } = req.query;
  const filter: Record<string, any> = { active: true };
  if (category) {
    filter.category = category;
  }

  const products = await Product.find(filter).sort({ sortOrder: 1, price: 1 });
  res.json({ success: true, data: products });
}

export async function getProductBySlug(req: Request, res: Response): Promise<void> {
  const { slug } = req.params;
  const product = await Product.findOne({ slug, active: true });
  if (!product) {
    res.status(404).json({ success: false, message: "Product not found", code: "NOT_FOUND" });
    return;
  }
  res.json({ success: true, data: product });
}

export async function getCategories(req: Request, res: Response): Promise<void> {
  const categories = await Category.find().sort({ sortOrder: 1 });
  res.json({ success: true, data: categories });
}
