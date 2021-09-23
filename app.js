const express = require("express");
const dotenv = require("dotenv");
const logger = require("morgan");
const morgan = require("morgan");
const fs = require("fs");
const mongoose = require("mongoose");

const ProductModel = require('./models/product')

const app = express();
app.use(express.json());

app.use(
  logger("common", {
    stream: fs.createWriteStream("./access.log", { flags: "a" }),
  })
  );
  
  app.use(morgan("dev"));
  
  dotenv.config({ path: "./config.env" });

const DB =process.env.DB_URL
mongoose.connect(DB,{
        useNewUrlParser:true,
        useUnifiedTopology: true
}).then((con) => {

  console.log("Connected successfull with atlas");

}).catch(err=> console.log(err))

const api = process.env.API_URL;

app.get(`${api}/products`, (req, res) => {
  const prod = ProductModel.find().then(data=>{ console.log(data)
    res.send(data);
  }).catch(err=>{ console.log(err)})
});

app.post(`${api}/products`, (req, res) => {
  const prod = req.body;
  ProductModel.create(prod).then(res=>{
    console.log(res)
    res.send(prod);
  }).catch(err=> console.log(err))
  console.log(prod);

});

app.listen(3000, (err) => {
  if (err) {
    console.log("Error connecting on port 3000");
  } else {
    console.log(api);
    console.log("Connected successfully on port 3000 ");
  }
});
