const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

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
    required: [true, "Please provide us a password to secure yourself!"],
  },
  street: { type: String, default: "" },
  apartment: { type: String, default: "" },
  city: { type: String, default: "" },
  zip: { type: String, default: "" },
  country: { type: String, default: "" },
  phone: { type: String, required: [true, "Please provide your phone!"] },
  isAdmin: { type: Boolean, default: false},
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.virtual("id").get(function () {
  const id = this._id.toHexString();
  return id
});

userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
