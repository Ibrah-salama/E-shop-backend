const express = require("express");
const CategoryModel = require("../models/category");
const categoryController = require('../controller/categoryController')
const router = express.Router();
const mongoose = require('mongoose')

router.get("/", categoryController.getCategories)

router.post("/",categoryController.addCategory);

router.get("/:categoryId",categoryController.getCategory);

router.delete("/:categoryId", categoryController.deleteCategory);

router.patch("/:categoryId", categoryController.updateCategory);

module.exports = router;
