const mongoose = require("mongoose");

const orderItemSchema = mongoose.Schema({
  product: { type: mongoose.Schema.oObjectId, ref: "Product" },
  quantity: { type: Number },
});

const OrderItemModel = mongoose.model("OrderItem", orderItemSchema);

module.exports = OrderItemModel;
