import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


export const protectRoute = async (req, res, next) => {
    try {
        const tokens = req.cookies.jwt;
        if (!tokens) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = jwt.verify(tokens, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized-Invalid Token" });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();

    } catch (error) {
        console.error("Authentication Error:", error.message);
        res.status(500).json({ message: "Internal server error" });


    }
}

