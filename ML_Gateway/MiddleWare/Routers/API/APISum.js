var express = require('express');
var router = express.Router();
const faceRouter = require('./Face/FaceRouterSum');
const cameraRouter = require("./Camera/CameraRouterSum")
const userRouter = require("./User/UserRouterSum")
const webSocketInterfaceRouter = require("./WebSocketInterface/webSocketInterfaceRouterSum")
const ImageShlyzRouter = require("./ImageShlyz/ImageShlyzRouterSum")
const NotificationRouter = require("./Notifications/NotificationsRouterSum")
const CrashRouter = require("./Crash/CrashRouterSum")

router.use("/face",faceRouter)
router.use("/camera",cameraRouter)
router.use("/user",userRouter)
router.use("/ws",webSocketInterfaceRouter)
router.use("/-private",ImageShlyzRouter)
router.use("/notifications",NotificationRouter)
router.use("/crash",CrashRouter)


module.exports = router;