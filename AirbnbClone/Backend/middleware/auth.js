import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/** Verify JWT token and attach user info to the request.*/
const auth = async (req, res, next) => {
    const { token } = req.headers;

    if (!token) {
        return res.status(401).json({ success: false, message: "Not authorized. Please log in." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        if (!user.isActive) {
            return res.status(403).json({ success: false, message: "Account has been deactivated" });
        }

        req.userId = decoded.id;
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: error.message });
    }
};

/**
 * Restrict access to host users only.
 */
const hostAuth = async (req, res, next) => {
    if (!req.user || req.user.role !== 'host') {
        return res.status(403).json({ success: false, message: "Host access required" });
    }
    next();
};

export default auth;
export { hostAuth };