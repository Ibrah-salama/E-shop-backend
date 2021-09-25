const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: [true, "A product must has a name!"],
  },
  description: { type: String, required: [true, "A product must has a name!"] },
  richDescription: { type: String, default: "" },
  image: { type: String, default: "" },
  images: [{ type: String }],
  brand: { type: String, default: "" },
  price: { type: Number, default: 0 },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  countInStock: { type: Number, required: true, min: 0, max: 256 },
  rating: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  dateCreated: { type: Date, default: Date.now() },
});

productSchema.virtual('id').get(function(){
  return this._id.toHexString()
})

productSchema.set('toObject', { virtuals: true })
productSchema.set('toJSON', { virtuals: true })

productSchema.pre('save',function(next){
  console.log("here")
  next()
})


const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
