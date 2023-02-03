var express = require('express');
var router = express.Router();
const faceRouter = require('./Face/FaceRouterSum');
const cameraRouter = require("./Camera/CameraRouterSum")
const userRouter = require("./User/UserRouterSum")
const NotificationRouter = require("./Notifications/NotificationsRouterSum")

router.use("/face",faceRouter)
router.use("/camera",cameraRouter)
router.use("/user",userRouter)
router.use("/notifications",NotificationRouter)


module.exports = router;