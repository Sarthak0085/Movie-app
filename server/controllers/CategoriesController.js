import Categories from "../models/CategoriesModel";
import asyncHandler from "express-async-handler";

//*********** Public Controller ******************/

// get all categories
const getCategories = asyncHandler(async (req, res) => {
    try {
        // find all categories in databse
        const categories = await Categories.find({});
        //send all categories to the client
        res.json(categories);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//********** Admin Controller *********************/

//create new category

const createCategory = asyncHandler(async (req, res) => {
    try {
        // get request from the body
        const { title } = req.body;
        // craete category
        const category = new Categories({
            title,
        });
        //save this to database
        const createdCategory = await category.save();
        //send new category to the client
        res.status(201).json(createdCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// upadte category
const updateCategory = asyncHandler(async (req, res) => {
    try {
        // get category from request params id
        const category = await Categories.findById(req.params.id);
        // if ctaegory is found then update the category
        if (category) {
            // update the category
            category.title = req.body.title || category.title;
            // save category to database
            const updatedCategory = await category.save();
            //send updated ctaegory to the client
            res.status(201).json(updatedCategory);
        }
        else {
            res.status(404).json({ message: "Category not found" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// delete category
const deleteCategory = asyncHandler(async (req, res) => {
    try {
        // get category from request params id
        const category = await Categories.findById(req.params.id);
        // if ctaegory is found then delete the category
        if (category) {
            // delete the category
            await category.remove();
            //send updated ctaegory to the client
            res.status(201).json({message : "Category Removed"});
        }
        else {
            res.status(404).json({ message: "Category not found" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
}