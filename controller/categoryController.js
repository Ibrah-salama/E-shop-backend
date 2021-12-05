const CategoryModel = require("../models/category");

exports.getCategories = async (req, res, next) => {
  const categories = await CategoryModel.find();
  if (!categories) {
    res.status(500).json({
      status: Fail,
    });
  }
  res.status(200).json({ status: "success", data: categories });
};

exports.addCategory = async (req, res, next) => {
  try {
    const category = req.body;
    const newCategory = await CategoryModel.create(category);
    if (newCategory) {
      res.status(201).json({
        status: "success",
        data: newCategory,
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err.message,
    });
  }
};
exports.getCategory = async (req, res, next) => {
  const categoryId = req.params.categoryId;
  try {
    const category = await CategoryModel.findById({ _id: categoryId });
    if (category) {
      res.status(200).json({
        status: "success",
        data: category,
      });
    } else {
      res.status(401).json({
        status: "Fail",
        message: "Category not found!",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err.message,
    });
  }
};

exports.deleteCategory = async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.categoryId)) {
    res.status(400).json({
      status: "fail",
      message: "invalid id",
    });
  }
  try {
    const category = await CategoryModel.findByIdAndDelete(
      req.params.categoryId
    );
    if (!category) {
      return res.status(401).json({
        status: "Fail",
        message: "Category not found!",
      });
    }
    res.status(204).json({
      status: "success",
      message: "Category deleted successfully!",
    });
  } catch (err) {
    res.status(404).json({
      status: "Fail",
      message: err.message,
    });
  }
};
exports.updateCategory = async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.productId)) {
    res.status(400).json({
      status: "fail",
      message: "invalid id",
    });
  }
  try {
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      { _id: req.params.categoryId },
      {
        name: req.body.name,
        color: req.body.color,
        icon: req.body.icon,
      },
      //this obj returns new data
      { new: true }
    );
    if (!updatedCategory) {
      res.status(401).json({
        status: "Fail",
        message: "Category not found!",
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "Category updated successfully!",
        data: updatedCategory,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      message: err.message,
    });
  }
};
