import express from "express"
import { createProduct, deleteProduct, getAllProduct, getProductByID, searchProducts, updateProduct } from "../controllers/productController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const productRouter=express.Router();

productRouter.get("/", getAllProduct)
productRouter.post("/", authMiddleware, createProduct)
productRouter.get("/search/:query", searchProducts)
productRouter.get("/:productID", getProductByID)
productRouter.delete("/:productID", authMiddleware, deleteProduct)
productRouter.put("/:productID", authMiddleware, updateProduct)

export default productRouter

//this create productRouter