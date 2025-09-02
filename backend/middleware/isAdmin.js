
import { User } from "../model/User.js";
import { ROLES } from "../utils/constant.js";

export const isAdmin = async (req, res, next) => {
  try {
    const userId = req.id; // Get from verified token

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!ROLES.includes(user.role)) {
      return res.status(403).json({ message: "You are not allowed to access this resource" });
    }
   req.role=user.role;
    next();
  } catch (error) {
    console.error("Error in isAdmin middleware:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
