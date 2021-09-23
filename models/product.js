const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: [true, "A product must has a name!"],
  },
  description: { type: String },
  richDescription: { type: String },
  image: { type: String },
  images: [String],
  brand: { type: String },
  price: { type: Number },
  category: { type: mongoose.Schema.ObjectId, ref: "Category" },
  countInStock: { type: Number },
  rating: { type: Number },
  isFeatured: { type: Boolean, default: false },
  dateCreated: { type: Date, default: Date.now() },
});

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
