const CategoryModel = require("../models/Category.model");
const ErrorHander = require("../utils/errorhandaler");
// const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create Category Controller
module.exports.creatCategory = async (req, res, next) => {
    const { category, categoryContent, Status } = req.body;

    const imagePath = req.files.image ? req.files.image[0].path : null;
    const categoryData = {
        image: imagePath,
        category,
        categoryContent,
        Status,
    };

    // Get file paths

    const newCategory = await CategoryModel.create(categoryData);

    if (!newCategory) {
        return next(new ErrorHander("Category cannot be created...", 404));
    }

    res.status(200).json({
        success: true,
        Category: newCategory,
    });
};


//get all Categorys
module.exports.getallCategorys = async (req, res) => {
    try {
        const Categorys = await CategoryModel.find().sort({ updatedAt: -1 }); // Sorting by updatedAt in descending order;
        res.status(200).json({
            success: true,
            Categorys,
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch Categorys" });
    }
};

//getsingleCategorys
module.exports.getsingleCategorys = async (req, res, next) => {
    let id = req.query.id;
    let Category = await CategoryModel.findById(id);

    if (!Category) {
        return next(new ErrorHander("Cannot found Categorys..", 404));
    }
    res.status(200).json({
        success: true,
        Category,
    });
};

//Delete Category
module.exports.deleteCategory = async (req, res, next) => {
    let id = req.query.id;
    try {
        const deleteCategory = await CategoryModel.findByIdAndDelete(id);
        if (!deleteCategory) {
            return next(new ErrorHander("Categorys not found", 404));
        }
        return res.status(200).json({ message: "Categorys deleted successfully" });
    } catch (err) {
        return res.status(500).json({ err });
    }
};

// Update Category
module.exports.updateCategorys = async (req, res, next) => {
    let id = req.query.id;
    const { category, categoryContent, Status } = req.body;

      const oldData = await CategoryModel.findById(id);
    const imagePath = req.files?.image
            ? req.files?.image[0].path
            : oldData?.image;
    
    let Category = await CategoryModel.findById(id);

    if (!Category) {
        return next(new ErrorHander("Cannot found Category..", 404));
    }
    try {
        const updatedCategory = await CategoryModel.findByIdAndUpdate(
            id,
            {
                category, categoryContent, Status,image:imagePath
            },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        return res.status(200).json({
            success: true,
            msg: "Updated successfully...",
            updatedCategory,
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to update Category" });
    }
};
