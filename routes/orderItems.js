const express = require("express");
const orderItemController = require('../controller/orderItemController')

const router = express.Router();

router.get("/", orderItemController.getOrderItems)
router.post("/",orderItemController.addOrderItem);


module.exports = router;
