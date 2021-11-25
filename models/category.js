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

categorySchema.virtual('id').get(function(){
  return this._id
})

categorySchema.set('toObject', { virtuals: true })
categorySchema.set('toJSON', { virtuals: true })
categorySchema.pre('save',function(next){
  next()
})

const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;
