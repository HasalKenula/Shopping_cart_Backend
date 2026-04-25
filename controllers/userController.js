import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();


export function createUser(req, res) {

    const data = req.body
    const hashedPassword = bcrypt.hashSync(data.password, 10)

    const user = new User({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: hashedPassword,

    })

    user.save().then(
        () => {
            res.json({
                message: "User crated successfully"
            })
        }
    )
}

export function loginUser(req, res) {
    const email = req.body.email
    const password = req.body.password

    User.find({ email: email }).then(
        (users) => {
            if (users[0] == null) {
                res.status(404).json({
                    message: "User not found"
                })
            } else {
                const user = users[0]

                if (user.isBlocked) {
                    res.status(403).json({
                        message: "User is blocked. Contact admin.",
                    });
                    return;
                }


                const isPasswordCorrect = bcrypt.compareSync(password, user.password)


                if (isPasswordCorrect) {
                    const payload = {
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                        isEmailVerified: user.isEmailVerified,
                        image: user.image
                    }

                    const token = jwt.sign(payload, process.env.JWT_SECRET, {
                        expiresIn: "150h"
                    })
                    res.status(200).json({
                        message: "Login successful",
                        token: token,
                        role: user.role
                    })
                } else {
                    res.status(401).json({
                        message: "Invalid password"
                    })
                }
            }
        }
    )
}


export function isAdmin(req) {
    if (req.user == null) {


        return false
    }

    if (req.user.role != "admin") {


        return false
    }
    return true
}

export function getUser(req, res) {
    if (req.user == null) {
        res.status(401).json({
            message: "Unauthorized",
        });
        return;
    }

    res.json(req.user);
}


export async function getAllUsers(req, res) {
    if (!isAdmin(req)) {
        res.status(401).json({
            message: "Unauthorized"
        })
        return
    }

    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching users",
            error: error.message
        })
    }
}

export async function UpdateUserStatus(req, res) {
    if (!isAdmin(req)) {
        res.status(401).json({
            message: "Unauthorized"
        })
        return
    }

    const email = req.params.email;

    if (req.user.email === email) {
        res.status(400).json({
            message: "Admin cannot change their own status"
        })
        return
    }

    const isBlocked = req.body.isBlocked;

    try {
        await User.updateOne(
            { email: email },
            { $set: { isBlocked: isBlocked } }
        )
        res.status(200).json({
            message: "User status Updated successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: "Error updating user status",
            error: error.message
        })
    }
}