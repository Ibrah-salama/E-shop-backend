const UserModel = require("../models/user");

exports.login = async (req, res, next) => {
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
  }

  exports.createUser = async (req,res,next)=>{
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
  
  }

  exports.signup =  async (req, res, next) => {
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
  }