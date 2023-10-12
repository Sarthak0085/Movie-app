import express from "express";
import * as userController from "../controllers/UserController.js";
import { authMiddleware, isAdmin } from "../middlewares/auth.js";

const router = express.Router();

/*************** PUBLIC ROUTES ******************/
router.post("/", userController.registerUser);
router.post("/login", userController.loginUser);

/*************** PRIVATE ROUTES ******************/
router.put("/", uthMiddleware, userController.updateUserProfile);
router.delete("/", authMiddleware, userController.deleteUser);
router.put("/password", authMiddleware, userController.changePassword);
router.post("/")




export default router;