const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    orderItems:[ {type: mongoose.Schema.ObjectId , ref:'OrderItem'}],
    shippingAddress1: { type:String},
    shippingAddress2: { type:String},
    city: { type:String },
    zip: { type:String },
    country: { type:String },
    phone: { type: Number}, 
    status: { type:String}, 
    totalPrice: { type: Number }, 
    user : { type : mongoose.Schema.ObjectId, ref: 'User' },
    dateOrdered: { type: Date }
})

const OrderModel = mongoose.model('Order', Schema)

module.exports = OrderModel