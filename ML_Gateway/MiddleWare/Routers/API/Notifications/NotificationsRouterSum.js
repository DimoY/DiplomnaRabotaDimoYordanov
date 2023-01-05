var express = require('express');
const Notification = require('./Notification');
const NotificationsGet = require("./NotificationsGet")
var router = express.Router();

let faceRecognised = new Notification("High",{
    "title":"face was found ",
    "description":"face was found of person named: "
})

let notificationsGetRouter = new NotificationsGet()

router.use("/-private-FaceRecognised-Notification",faceRecognised.viewFactory())
router.use("/",notificationsGetRouter.viewFactory())

module.exports = router;