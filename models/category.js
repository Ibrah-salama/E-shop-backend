const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category must has a name!"],
    minLength: 3,
  },
  color: { type: String },
  icon: { type: String },
  image: { type: String },
});

const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;
