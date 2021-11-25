const express = require("express");
const UserModel = require("../models/user");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose')


router.post("/",async (req,res,next)=>{
  try{
    const user = await UserModel.create({
      name: req.body.name,
      email: req.body.email,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      street: req.body.street,
      apartment: req.body.apartment,
      password: req.body.password,
      isAdmin: req.body.isAdmin
    })
    if(user){
      res.status(201).json({
        status:"success",
        data:user
      })
    }
  }catch(err){
    res.status(400).json({
      status:"fail",
      message:err.message
    })
  }

})
router.post("/signup", async (req, res, next) => {
  try {
    const newUser = await UserModel.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      street: req.body.street,
      apartment: req.body.apartment,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
    });
    if (newUser) {
      res.status(201).json({
        status: "success",
        data: newUser,
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err.message,
    });
  }
});

router.get("/", async (req, res, next) => {
  const users = await UserModel.find();
  if (!users) {
    return res.status(500).json({
      status: Fail,
      message: "Fial in gettin users",
    });
  }
  res.status(200).json({
    status: "success",
    data: users,
  });
});

router.get("/:userId", async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const user = await UserModel.findById({ _id: userId });
    if (user) {
      res.status(200).json({
        status: "success",
        data: user,
      });
    } else {
      res.status(401).json({
        status: "Fail",
        message: "user not found!",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err.message,
    });
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        status: "Fail",
        message: "User not found!",
      });
    }
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
      const token = jwt.sign(
        { userId: user.id , isAdmin: user.isAdmin},
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
      res.status(200).json({
        status: "success",
        token,
      });
    }else{
        return res.status(404).json({
            status: "Fail",
            message: "User or password my be wrong!",
          });
    }
  } catch (err) {
    res.status(404).json({
      status: "Fail",
      message: err.message,
    });
  }
});

router.get("/get/count", async(req,res,next)=>{
  try{
    const userCount = await UserModel.countDocuments()
    if(!userCount) return res.status(500).json({ succss:false})
    res.status(200).json({
      status: "success",
      count: userCount
    })
  }catch(err){
    res.status(400).json({
      status:"Fail",
      message: err.message
    })
  }
})

router.delete("/:userId", async (req, res, next) => {
  if(!mongoose.isValidObjectId(req.params.userId)){
    res.status(400).json({
      status:"fail",
      message:"invalid id"
    })
  }
  try {
   const user = await UserModel.findByIdAndDelete(req.params.userId);
   if(!user){
      return res.status(404).send("No user found with that id!")
   }
   res.status(204).json({status:"success", data:null})
   } catch (err) {
    res.status(404).json({
      status: "Fail",
      message: err.message,
    });
  }
});

router.patch("/:id", async (req,res,next)=>{
  if(!mongoose.isValidObjectId(req.params.userId)){
    res.status(400).json({
      status:"fail",
      message:"invalid id"
    })
  }
  try{
    const updatedUser = await UserModel.findByIdAndUpdate(req.params.id,{
      name: req.body.name,
      email: req.body.email,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      street: req.body.street,
      apartment: req.body.apartment,
      password: req.body.password,
      isAdmin: req.body.isAdmin
    },{
      new:true
    })
    
    if(updatedUser){
      res.status(200).json({
        status:"success",
        data:updatedUser
      })
    }

   }catch(err){
    res.status(400).json({
      status:"fail",
      message:err.message
    })
  }


})

module.exports = router;
