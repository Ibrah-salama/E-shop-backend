const express = require("express");
const router = express.Router();
const ProductModel = require("../models/product")

router.get("/", async (req, res, next) => {
  const prod = await ProductModel.find();
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

router.post("/", async (req, res, next) => {
  const product = req.body;
  try {
    const newProduct = await ProductModel.create(product);
    if (newProduct) {
      res.status(200).json({
        status: "Success",
        data: newProduct,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      message: err.message,
    });
  }
});
module.exports = router;
