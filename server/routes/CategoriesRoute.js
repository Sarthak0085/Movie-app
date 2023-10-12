import express from "express";
import * as CategoriesController from "../controllers/CategoriesController.js";
import { AuthMiddleware, isAdmin } from "../middlewares/auth.js";

const router = express.Router();


//*********** PUBLIC ROUTES *************/
router.get("/", CategoriesController.getCategories);

//*************ADMIN ROUTES *************/
router.post("/", AuthMiddleware, isAdmin, CategoriesController.createCategory);
router.put("/:id", AuthMiddleware, isAdmin, CategoriesController.updateCategory);
router.delete("/:id", AuthMiddleware, isAdmin, CategoriesController.deleteCategory);

export default router;