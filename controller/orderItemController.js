const OrderItemModel = require("../models/orderitem");

exports.addOrderItem = async (req, res, next) => {
  try {
    const orderItem = await OrderItemModel.create({
      quantity: req.body.quantity,
      product: req.body.product,
    });
    if (!orderItem) {
      return res.status(404).json({
        status: "fail",
        message: "Fail to create order item for the product",
      });
    }
    res.status(201).json({
      status: "success",
      data: orderItem,
    });
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      message: err.message,
    });
  }
};

exports.getOrderItems = async (req, res, next) => {
  try {
    const orderItems = await OrderItemModel.find();
    if (orderItems) {
      res.status(201).json({
        status: "success",
        data: orderItems,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      message: err.message,
    });
  }
};
