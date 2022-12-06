const UserModel = require("../models/user");

exports.getUsers = async (req, res, next) => {
  const page = +req.query.page || 1
  const limit = +req.query.limit || 3
  const skip = (page-1)*limit
  if(req.query.page || req.query.limit){
      const users =  await UserModel.find({},{},{createdAt:-1}).limit(3)
      console.log(users)
      res.status(200).json({
        status: "success",
        data: users,
      });
      
    }else{
      const users = await UserModel.find()
      console.log(users)
        res.status(200).json({
    status: "success",
    data: users,
  });
  }


  // const users = await UserModel.find();
  // if (!users) {
  //   return res.status(500).json({
  //     status: Fail,
  //     message: "Fial in gettin users",
  //   });
  // }
  // res.status(200).json({
  //   status: "success",
  //   data: users,
  // });
};
exports.getUser = async (req, res, next) => {
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
};
exports.addUser = exports.getUsersCount = async (req, res, next) => {
  try {
    const userCount = await UserModel.countDocuments();
    if (!userCount) return res.status(500).json({ succss: false });
    res.status(200).json({
      status: "success",
      count: userCount,
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err.message,
    });
  }
};
exports.deleteUser = async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.userId)) {
    res.status(400).json({
      status: "fail",
      message: "invalid id",
    });
  }
  try {
    const user = await UserModel.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).send("No user found with that id!");
    }
    res.status(204).json({ status: "success", data: null });
  } catch (err) {
    res.status(404).json({
      status: "Fail",
      message: err.message,
    });
  }
};
exports.updateUser = async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.userId)) {
    res.status(400).json({
      status: "fail",
      message: "invalid id",
    });
  }
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        street: req.body.street,
        apartment: req.body.apartment,
        password: req.body.password,
        isAdmin: req.body.isAdmin,
      },
      {
        new: true,
      }
    );

    if (updatedUser) {
      res.status(200).json({
        status: "success",
        data: updatedUser,
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
