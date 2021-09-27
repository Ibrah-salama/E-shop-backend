const mongoose = require("mongoose");

const orderItemSchema = mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
});

const OrderItemModel = mongoose.model("OrderItem", orderItemSchema);

module.exports = OrderItemModel;
