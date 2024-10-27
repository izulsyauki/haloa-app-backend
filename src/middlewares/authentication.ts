import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
    username: string;
    // tambahkan properti lain yang mungkin ada di token Anda
}

export const authentication = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            res.status(401).json({ message: "Token not found" });
            return;
        }

        const token = authorization.split(" ")[1];

        if (!token) {
            res.status(401).json({ message: "Token not valid" });
            return ;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "RAHASIA") as DecodedToken;

        if (!decoded || !decoded.username) {
            res.status(401).json({ message: "Token not valid" });
            return
        }

        res.locals.user = decoded;

        next();
    } catch (error) {
        console.log("Error in authentication middleware:", error);
        res.status(401).json({ message: "Authentication failed" });
    }
};
