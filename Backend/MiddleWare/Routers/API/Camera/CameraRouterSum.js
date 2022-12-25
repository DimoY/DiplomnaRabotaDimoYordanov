var express = require('express');
var router = express.Router();
const cameraAddRouter = require('./addCamera');
const cameraDeleteRouter = require("./removeCamera")
router.use("/add",cameraAddRouter)
router.use("/remove",cameraDeleteRouter)
module.exports = router;