const ordersController = require('../controller/orderController')
const express = require("express");
const OrderModel = require("../models/order");
const OrderItemModel = require("../models/orderitem");
const router = express.Router();
const mongoose = require('mongoose')
const {errHandler} = require('../helpers/err-handler');
const { json } = require("express");

router.get("/",ordersController.getOrders);

router.post("/",ordersController.addOrder);

router.get("/get/totalsales",ordersController.getTotalSales)

router.get("/:orderId", ordersController.getOrder);

router.delete("/:orderId",ordersController.deleteOrder);

router.patch("/:orderId",ordersController.updateOrder);

router.get("/get/count",ordersController.getOrdersCount)

router.get("/get/userorders/:userid", ordersController.getUsersOrders);

module.exports = router;
