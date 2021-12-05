const { Mongoose } = require("mongoose");
const ProductModel = require("../models/product");
const multer = require("multer");


const FILE_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg",
  };
  
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const isValid = FILE_TYPE_MAP[file.mimetype];
      let uploadError = new Error("invalid image type");
  
      if (isValid) {
        uploadError = null;
      }
      cb(uploadError, "public/uploads");
    },
    filename: function (req, file, cb) {
      const fileName = file.originalname.split(".").join("-");
      const extension = FILE_TYPE_MAP[file.mimetype];
      cb(null, `${fileName}-${Date.now()}.${extension}`);
    },
  });

exports.uploadOptions = multer({ storage: storage });

exports.getProducts =  async (req, res, next) => {
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
  }
exports.addProduct = async (req, res, next) => {
    try {
      const category = await CategoryModel.findById(req.body.category);
      if (!category)
        return res
          .status(500)
          .json({ status: "Fail", message: "Invalid Category!" });
  
      const file = req.file;
      if (!file) return res.status(400).send("no image in the request!");
  
      const fileName = req.file.filename;
      const basePath = `${req.protocol}://${req.get("host")}/public/uploads`;
      const newProduct = await ProductModel.create({
        name: req.body.name,
        description: req.body.description,
        richDestination: req.body.richDestination,
        image: `${basePath}/${fileName}`,
        images: req.body.images,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        isFeatured: req.body.isFeatured,
        dateCreated: req.body.dateCreated,
      });

      res.status(201).json({
        status: "Success",
        data: newProduct,
      });
    } catch (err) {
      res.status(500).json({
        status: "Fail",
        message: err.message,
      });
    }
  }
exports.getProduct =  async (req, res, next) => {
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
  }
exports.updateProduct =  async (req, res, next) => {
    try {
      if (req.body.category) {
        const category = await CategoryModel.findById(req.body.category);
        if (!category) {
          return res
            .status(500)
            .json({ status: "Fail", message: "Invalid Category!" });
        }
      }
      const product = await ProductModel.findById(req.params.productId)
      if(!product) return res.status(400).send('Invalid product!')
  
      const file = req.file 
      let imagepath; 
      if(file){
        const fileName = file.filename
        const baseUrl = `${req.protocol}://${req.get('host')}/public/uploads/`
        imagepath = `${baseUrl}${fileName}`
      }else{
        imagepath = product.image
      }
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        { _id: req.params.productId },
        {
          name: req.body.name,
          description: req.body.description,
          richDestination: req.body.richDestination,
          image: imagepath,
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
        res.status(201).json( {status:"success", data:updatedProduct});
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
exports.deleteProduct = async (req, res, next) => {
    if (!Mongoose.isValidObjectId(req.params.productId)) {
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
  }
exports.getProductsCount = async (req, res, next) => {
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
  } 
exports.getFeatured =async (req, res, next) => {
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
  } 
exports.updateGallery =  async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id');
    }
    const files = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
  
    if (files) {
        files.map((file) => {
            imagesPaths.push(`${basePath}${file.filename}`);
        });
    }
    const product = await ProductModel.findByIdAndUpdate(
        req.params.id,
        {
            images: imagesPaths
        },
        { new: true }
    );
  
    if (!product) return res.status(500).send('the gallery cannot be updated!');
  
    res.send(product);
  }

