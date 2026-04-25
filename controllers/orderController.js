import Order from "../models/order.js";
import Product from "../models/product.js"
import { isAdmin } from "./userController.js";


export async function createOrder(req, res) {
    console.log(req.body);


    if (req.user == null) {
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    }

    try {
        const latestOrder = await Order.findOne().sort({ date: -1 });

        let orderId = "ORD000001";
        if (latestOrder != null) {
            let latestOrderId = latestOrder.orderId;
            let latestOrderNumberString = latestOrderId.replace("ORD", "");
            let latestOrderNumber = parseInt(latestOrderNumberString);

            let newOrderNumber = latestOrderNumber + 1;
            let newOrderNumberString = newOrderNumber.toString().padStart(6, "0");

            orderId = "ORD" + newOrderNumberString;
        }

        const items = []
        let total = 0

        for (let i = 0; i < req.body.items.length; i++) {
            const product = await Product.findOne({ productID: req.body.items[i].productID })

            if (product == null) {
                return res.status(400).json({
                    message: `Product with ID ${req.body.items[i].productID} not found`
                })
            }

            items.push({
                productID: product.productID,
                name: product.name,
                price: product.price,
                quantity: req.body.items[i].quantity,
                image: product.images[0]
            })

            total += product.price * req.body.items[i].quantity
        }

        let name = req.body.name
        if (name == null) {
            name = req.user.firstName + " " + req.user.lastName
        }

        const newOrder = new Order({
            orderId: orderId,
            email: req.user.email,
            name: name,
            address: req.body.address,
            total: total,
            items: items,
            phone: req.body.phone,
        })

        await newOrder.save();

        return res.json({
            message: "Order placed succeessfully",
            orderId: orderId
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error Placing order",
            error: error.message,
        })
    }

}

export async function getOrders(req, res) {
    if (req.user == null) {
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    }


    if (isAdmin(req)) {
        const orders = await Order.find().sort({ date: -1 })

        res.json(orders)
    } else {
        const orders = await Order.find({ email: req.user.email }).sort({ date: -1 })

        res.json(orders)
    }
}

export async function updateOrderStatus(req, res) {
    if (!isAdmin(req)) {
        res.status(401).json({
            message: "Unauthorized",
        });
        return;
    }

    try {
        const orderId = req.params.orderId;
        const status = req.body.status;
        const notes = req.body.notes;

        await Order.updateOne({ orderId: orderId }, { status: status, notes: notes });

        res.json({
            message: "Order status updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating order status",
            error: error.message,
        });
    }
}