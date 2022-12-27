var express = require('express');
var router = express.Router();

var userLoginRouter = require("./userLogin")
var userRegisterRouter = require("./userRegister")


router.use("/register",userRegisterRouter)
router.use("/login",userLoginRouter)

module.exports = router;