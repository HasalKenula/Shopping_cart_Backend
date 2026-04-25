import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export function createProduct(req, res) {

    if (!isAdmin(req)) {
        res.status(403).json({
            message: "Forbidden",
        });
        return;
    }

    const product = new Product(req.body)

    product.save().then(

        () => {
            res.json({
                message: "Product created succeessfully"
            })
        }

    ).catch(
        (error) => {
            res.status(500).json({
                message: "Error creating product",
                error: error.message
            })
        }
    )
}

export function getAllProduct(req, res) {
    if (isAdmin(req)) {
        Product.find().then(
            (product) => {
                res.json(product)
            }
        ).catch(
            (error) => {
                res.status(500).json({
                    message: "Error fetching product",
                    error: error.message
                })
            }
        )
    } else {
        Product.find({ isAvailable: true }).then(
            (product) => {
                res.json(product)
            }
        ).catch(
            (error) => {
                res.status(500).json({
                    message: "Error fetching product",
                    error: error.message
                })
            }
        )
    }
}

export function deleteProduct(req, res) {
    if (!isAdmin(req)) {
        res.status(403).json({
            message: "only admin can delete products"
        })

        return
    }

    const productID = req.params.productID

    Product.deleteOne({ productID: productID }).then(
        () => {
            res.json({
                message: "Product deletes successfully"
            })
        }
    )
}

export function updateProduct(req, res) {
    if (!isAdmin(req)) {
        res.status(403).json({
            message: "only admin can delete products"
        })

        return
    }

    const productID = req.params.productID

    Product.updateOne({ productID: productID }, req.body).then(
        () => {
            res.json({
                message: "Product updated sussfully"
            })
        }
    )
}


export function getProductByID(req, res) {
    const productID = req.params.productID

    Product.findOne({ productID: productID }).then(

        (product) => {
            if (product == null) {
                res.status(404).json({
                    message: "Product not found"
                })
            } else {

                if (product.isAvailable) {
                    res.json(product)
                } else {
                    if (isAdmin(req)) {
                        res.json(product)
                    } else {
                        res.status(404).json({
                            message: "Product not found"
                        })
                    }
                }
            }
        }
    ).catch(
        (error) => {
            res.status(500).json({
                message: "Error fetching product",
                error: error.message
            })
        }
    )
}

export async function searchProducts(req, res) {
    const query = req.params.query

    try {
        const products = await Product.find(
            {
                $or: [
                    { name: { $regex: query, $options: "i" } },
                    { altNames: { $elemMatch: { $regex: query, $options: "i" } } }
                ],
                isAvailable: true
            }
        )
        return res.json(products)
    } catch (error) {
        res.status(500).json({
            message: "Error seaching product",
            error: error.message
        })
    }
}