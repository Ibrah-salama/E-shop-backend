const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const logger = require("morgan");
const morgan = require("morgan");
const fs = require("fs");
const mongoose = require("mongoose");
const cors = require('cors')
const api = process.env.API_URL;
const authJWT = require("./helpers/authHandler")
const {errHandler} = require('./helpers/err-handler')
//Routes 
const productsRoutes = require('./routes/products')
const usersRoutes = require('./routes/users')
const ordersRoutes = require('./routes/orders')
const categoriesRoutes = require('./routes/categories')
const orderItemsRoutes = require('./routes/orderItems')
const app = express();
app.use(cors())
app.options('*',cors())

app.use(express.json());
app.use( logger("common", {stream: fs.createWriteStream("./access.log", { flags: "a" }),}));
app.use(morgan("dev"));
app.use(authJWT())
app.use(errHandler)

app.use(`${api}/products`,productsRoutes)  
app.use(`${api}/users`,usersRoutes)  
app.use(`${api}/orders`,ordersRoutes)  
app.use(`${api}/categories`,categoriesRoutes)  
app.use(`${api}/orderItems`,orderItemsRoutes)  

const DB =process.env.DB_URL
mongoose.connect(DB,{
        useNewUrlParser:true,
        useUnifiedTopology: true
}).then((con) => {

  console.log("Connected successfull with atlas");

}).catch(err=> console.log(err))

app.listen(3000, (err) => {
  if (err) {
    console.log("Error connecting on port 3000");
  } else {
    console.log(api);
    console.log("Connected successfully on port 3000 ");
  }
});
