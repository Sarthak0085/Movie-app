import jwt from 'jsonwebtoken';
import User from "../models/UserModel.js";

// authenticated user and get token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "1d"
    });
};

//protection or authorized middleware
const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    //check if token exists
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            // verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            //get user id from decoded token
            req.user = await User.findById(decoded.id).select("-password");
            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not Authorized, token failed");
        }
    }

    // if token does not exist
    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});

// admin middleawre
const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error("Not authorized as an Admin");
    }
}
export {
    generateToken,
    authMiddleware,
    isAdmin,
};