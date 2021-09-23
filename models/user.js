const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must has a name!"],
    minLength: 3,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "A user must has a email!"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide us a valid email!"],
  },
  password: {
    type: String,
    minLength: 8,
    select: false,
    required: [true, "Please provide us a password to secure yourself!"],
  },
  street: { type: String },
  apartment: { type: String },
  city: { type: String },
  zip: { type: string },
  country: { type: String },
  phone: { type: String },
  isAdmin: { type: Boolean },
});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password,12)
    next()
})

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
