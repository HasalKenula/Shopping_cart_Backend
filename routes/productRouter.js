import express from "express"
import { createProduct, deleteProduct, getAllProduct, getProductByID, searchProducts, updateProduct } from "../controllers/productController.js";

const productRouter=express.Router();
productRouter.get("/", getAllProduct)
productRouter.post("/", createProduct)
productRouter.get("/search/:query", searchProducts)
productRouter.get("/:productID", getProductByID)
productRouter.delete("/:productID",deleteProduct)
productRouter.put("/:productID", updateProduct)

export default productRouter