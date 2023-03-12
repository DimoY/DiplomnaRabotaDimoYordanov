var express = require('express');
const Notification = require('./Notification');
const NotificationsGet = require("./NotificationsGet")
var router = express.Router();
//създаване на клас за нотификация на базата на приоритет и текст
let faceRecognised = new Notification("High",{
    "title":"<person> was spoted on camera <camera>"
})

let crashRecognised = new Notification("High",{
    "title":"A crash happened on camera <camera>"
})

let maskPlacement = new Notification("High",{
    "title":"Mask was not found or not put correctly on <camera>"
})


let notificationsGetRouter = new NotificationsGet()

router.use("/-private-FaceRecognised-Notification",faceRecognised.viewFactory())
router.use("/-private-CarCrashing-Notification",crashRecognised.viewFactory())
router.use("/-private-MaskWornIncorectly-Notification",crashRecognised.viewFactory())
router.use("/",notificationsGetRouter.viewFactory())

module.exports = router;