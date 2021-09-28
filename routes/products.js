const express = require("express");
const CategoryModel = require("../models/category");
const router = express.Router();
const ProductModel = require("../models/product");
const mongoose = require("mongoose");
const multer = require("multer");

const fileTypeMap = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  jpg: "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = fileTypeMap[file.mimetype];
    let uploadErrot = new Error("Invalid image type");
    if (isValid) {
      uploadErrot = null;
    }
    cb(uploadErrot, "public/uploads");
  },
  filename: function (req, file, cb) {
    const extension = fileTypeMap[file.mimetype];
    const fileName = `${
      file.originalname.replace(" ", "_").split(".")[0]
    }_${Date.now()}`;
    cb(null, `${fileName}.${extension}`);
  },
});
const uploadOptions = multer({ storage: storage });

router.get("/", async (req, res, next) => {
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }
  const prod = await ProductModel.find(filter).populate({
    path: "category",
    select: "name -_id",
  });
  if (!prod) {
    res.status(200).json({
      status: "success",
      data: {},
    });
  }
  res.status(200).json({
    status: "success",
    data: prod,
  });
});

router.get("/get/count", async (req, res, next) => {
  try {
    const products = await ProductModel.countDocuments();
    if (!products) return res.status(500).json({ succss: false });
    res.status(200).json({
      status: "success",
      count: products,
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err.message,
    });
  }
});

router.get("/get/featured/:count", async (req, res, next) => {
  const count = req.params.count ? req.params.count : 0;
  try {
    const featuredProducts = await ProductModel.find({ featured: true }).limit(
      +count
    );
    if (!featuredProducts) return res.status(500).json({ succss: false });
    res.status(200).json({
      status: "success",
      featuredProducts: featuredProducts,
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err.message,
    });
  }
});

router.get("/:productId", async (req, res, next) => {
  const prod = await ProductModel.findById(req.params.productId).populate({
    path: "category",
    select: "name -_id",
  });
  if (!prod) {
    res.status(200).json({
      status: "success",
      data: {},
    });
  }
  res.status(200).json({
    status: "success",
    data: prod,
  });
});

router.post("/", uploadOptions.single("image"), async (req, res, next) => {
  try {
    const category = await CategoryModel.findById(req.body.category);
    if (!category) {
      return res
        .status(500)
        .json({ status: "Fail", message: "Invalid Category!" });
    }
    const file = req.file;
    if (!file) {
      return res
        .status(500)
        .json({ status: "Fail", message: "There is no image in the request!" });
    }
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    const fileName = `${basePath}${req.file.filename}`;

    const newProduct = await ProductModel.create({
      name: req.body.name,
      description: req.body.description,
      richDestination: req.body.richDestination,
      image: fileName,
      images: req.body.images,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      isFeatured: req.body.isFeatured,
      dateCreated: req.body.dateCreated,
    });
    if (!newProduct)
      return res.status(500).json({
        status: "Fail",
        message: err.message,
      });
    res.status(201).json({
      status: "Success",
      data: newProduct,
    });
  } catch (err) {
    res.status(500).json({
      status: "Failure",
      message: err.message,
    });
  }
});

router.patch(
  "/:productId",
  uploadOptions.single("image"),
  async (req, res, next) => {
    try {
      if (req.body.category) {
        const category = await CategoryModel.findById(req.body.category);
        if (!category) {
          return res
            .status(500)
            .json({ status: "Fail", message: "Invalid Category!" });
        }
      }
      const product = await ProductModel.findById(req.params.productId);
      if (!product) return res.status(404).send("Invalid product");

      const file = req.file;

      let imagePath;
      if (file) {
        const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
        const fileName = `${basePath}${req.file.filename}`;
        imagePath = fileName;
      } else {
        imagePath = product.image;
      }

      const updatedProduct = await ProductModel.findByIdAndUpdate(
        { _id: req.params.productId },
        {
          name: req.body.name,
          description: req.body.description,
          richDestination: req.body.richDestination,
          image: imagePath,
          images: req.body.images,
          brand: req.body.brand,
          price: req.body.price,
          category: req.body.category,
          countInStock: req.body.countInStock,
          rating: req.body.rating,
          isFeatured: req.body.isFeatured,
          dateCreated: req.body.dateCreated,
        },
        { new: true }
      );
      if (updatedProduct)
        res.status(201).json({
          status: "Success",
          data: updatedProduct,
        });
      if (!updatedProduct)
        res.status(500).json({
          status: "Faild",
          message: "Faild to update the product",
        });
    } catch (err) {
      res.status(500).json({
        status: "Fail",
        message: err.message,
      });
    }
  }
);

router.delete("/:productId", async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.productId)) {
    res.status(400).json({
      status: "fail",
      message: "invalid id",
    });
  }
  try {
    const product = await ProductModel.findByIdAndDelete(req.params.productId);
    if (!product) {
      return res.status(404).send("No product found with that id!");
    }
    res.status(204).json({ status: "success", data: null });
  } catch (err) {
    res.status(404).json({
      status: "Fail",
      message: err.message,
    });
  }
});

router.put(
  "/gallery-images/:productId",
  uploadOptions.array("images", 20),
  async (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.productId)) {
      return next("err");
    }
    const files = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    if (files) {
      files.map((file) => {
        imagesPaths.push(`${basePath}${file.filename}`)
      });
    }
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      { _id: req.params.productId },
      {
        images: imagesPaths,
      },
      { new: true }
    );
      if(!updatedProduct){
        return res.status(500).send("The product cannot be updated")
      }
      res.status(200).json({
        status:"success",
        data: updatedProduct
      })
  }
);

module.exports = router;
