const OrderModel = require("../models/order");

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await OrderModel.find()
      .populate({
        path: "user",
        select: "name",
      })
      .sort({ dateOrdered: -1 });
    if (orders) {
      res.status(200).json({
        status: "success",
        data: orders,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      message: err.message,
    });
  }
};
exports.addOrder = async (req, res, next) => {
  try {
    const orderItemsIds = Promise.all(
      req.body.orderItems.map(async (orderItem) => {
        let newOrderItem = await OrderItemModel.create({
          product: orderItem.product,
          quantity: orderItem.quantity,
        });
        return newOrderItem._id.toString();
      })
    );
    const ordersIdsResolved = await orderItemsIds;

    const totalPrices = await Promise.all(
      ordersIdsResolved.map(async (orderItemId) => {
        const orderItem = await OrderItemModel.findById(orderItemId).populate(
          "product",
          "price"
        );
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice;
      })
    );
    const totlaPrice = totalPrices.reduce((a, b) => a + b, 0);
    const newOrder = await OrderModel.create({
      orderItems: ordersIdsResolved,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      status: req.body.status,
      totalPrice: totlaPrice,
      user: req.body.user,
      dateOrdered: req.body.dateOrdered,
    });
    if (newOrder) {
      res.status(201).json({
        status: "Success",
        data: newOrder,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      message: err.message,
    });
  }
};
exports.getTotalSales = async (req, res, next) => {
  const totalSales = await OrderModel.aggregate([
    { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
  ]);
  if (!totalSales) {
    return res.status(500).json({
      status: "Fail",
      message: "failure",
    });
  }
  return res.status(200).json({
    status: "success",
    data: totalSales.pop().totalsales,
  });
};
exports.getOrder = async (req, res, next) => {
  try {
    const order = await OrderModel.findById(req.params.orderId)
      .populate({
        path: "user",
        select: "name",
      })
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
          select: "name price brand",
          populate: { path: "category", select: "name" },
        },
      })
      .sort({ dateOrdered: -1 });
    if (order) {
      res.status(200).json({
        status: "success",
        data: order,
      });
    }

    if (!order) {
      return next(errHandler("There is no orders with that id", req, res));
    }
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      message: err.message,
    });
  }
};
exports.deleteOrder = async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.productId)) {
    return next("err");
  }
  try {
    const order = await OrderModel.findByIdAndDelete(req.params.orderId);
    const items = await Promise.all(
      order.orderItems.map((it) => it.toString())
    );

    const deletedOrderItems = await OrderItemModel.findByIdAndRemove({
      _id: { $in: items },
    });
    if (!order) {
      return res.status(401).json({
        status: "Fail",
        message: "Order not found!",
      });
    }
    res.status(204).json({
      status: "success",
      message: "Order deleted successfully!",
    });
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      message: err.message,
    });
  }
};
exports.updateOrder = async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.productId)) {
    res.status(400).json({
      status: "fail",
      message: "invalid id",
    });
  }
  try {
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      { _id: req.params.orderId },
      {
        status: req.body.status,
      },
      //this obj returns new data
      { new: true }
    );
    if (!updatedOrder) {
      res.status(401).json({
        status: "Fail",
        message: "Order not found!",
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "Order updated successfully!",
        data: updatedOrder,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      message: err.message,
    });
  }
};

exports.getOrdersCount = async (req, res, next) => {
  try {
    const orders = await OrderModel.countDocuments();
    if (!orders) return res.status(500).json({ succss: false });
    res.status(200).json({
      status: "success",
      count: orders,
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err.message,
    });
  }
};

exports.getUsersOrders = async (req, res, next) => {
  try {
    const userOrders = await OrderModel.find({ user: req.params.userid })
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
          select: "name",
          populate: { path: "category", select: "name" },
        },
      })
      .sort({ dateOrdered: -1 });
    if (userOrders) {
      res.status(200).json({
        status: "success",
        data: userOrders,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      message: err.message,
    });
  }
};
