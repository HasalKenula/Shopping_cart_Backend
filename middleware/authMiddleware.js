import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config()
export const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
        return res.status(401).json({ message: "Token required" });
    }

    const token = authHeader.replace("Bearer ", "");


    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            console.log("JWT error:", error.message);
            return res.status(401).json({ message: "Invalid token" });
        }


        req.user = decoded;
        next();
    });
};
