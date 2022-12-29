var express = require('express');
var router = express.Router();
const faceRouter = require('./Face/FaceRouterSum');
const cameraRouter = require("./Camera/CameraRouterSum")
const userRouter = require("./User/UserRouterSum")
const webSocketInterfaceRouter = require("./WebSocketInterface/webSocketInterfaceRouterSum")

router.use("/face",faceRouter)
router.use("/camera",cameraRouter)
router.use("/user",userRouter)
router.use("/ws",webSocketInterfaceRouter)
module.exports = router;