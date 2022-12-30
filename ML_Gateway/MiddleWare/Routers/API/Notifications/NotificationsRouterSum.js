var express = require('express');
const Notification = require('./Notification');
var router = express.Router();

faceRecognised = new Notification("High",{
    "title":"face was found ",
    "description":"face was found of person named: "
})

router.use("/-private-FaceRecognised-Notification",faceRecognised.viewFactory())


module.exports = router;