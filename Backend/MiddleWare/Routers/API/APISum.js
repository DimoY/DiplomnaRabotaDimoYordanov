var express = require('express');
var router = express.Router();
const faceRouter = require('./Face/FaceRouterSum');
const cameraRouter = require("./Camera/CameraRouterSum")
const userRouter = require("./User/UserRouterSum")
router.use("/face",faceRouter)
router.use("/camera",cameraRouter)
router.use("/user",userRouter)
module.exports = router;