const express = require("express");
const UserModel = require("../models/user");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const userController = require("../controller/userController");
const authController = require("../controller/authController");

router.get("/", userController.getUsers);
router.post("/", authController.createUser);

router.post("/login", authController.login);
router.post("/signup", authController.signup);

router.get("/:userId", userController.getUser);
router.delete("/:userId", userController.deleteUser);
router.patch("/:id", userController.updateUser);

router.get("/get/count", userController.getUsersCount);

module.exports = router;
