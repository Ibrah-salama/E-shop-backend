const express = require("express");
const productController = require('../controller/productController')
const router = express.Router();


router.get("/",productController.getProducts);

router.get("/get/count", productController.getProductsCount);

router.get("/get/featured/:count", productController.getFeatured);

router.get("/:productId",productController.getProduct);

router.post("/", productController.uploadOptions.single("image"), productController.addProduct);

router.patch("/:productId",productController.uploadOptions.single('image'),productController.updateProduct);

router.delete("/:productId", productController.deleteProduct);

router.put('/gallery-images/:id', productController.uploadOptions.array('images', 10),productController.updateGallery);

module.exports = router;
