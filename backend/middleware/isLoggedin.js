

import jwt from "jsonwebtoken";

export const isloggedin = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(400).json({ message: "Token not found" });
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!verifyToken || !verifyToken.userId) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.id = verifyToken.userId; // attach user ID to request
    next();
  } catch (error) {
    console.log("Error in isLoggedIn middleware:", error);
    return res.status(500).json({ message: "Authentication failed" });
  }
};
