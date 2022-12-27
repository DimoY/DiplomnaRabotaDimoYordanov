var express = require('express');
var router = express.Router();
const cameraAddRouter = require('./addCamera');
const cameraDeleteRouter = require("./removeCamera")
const cameraGetRouter = require("./getCameras")
const cameraUpdateRouter = require("./updateCamera")
router.use("/add",cameraAddRouter)
router.use("/remove",cameraDeleteRouter)
router.use("/get",cameraGetRouter)
router.use("/update",cameraUpdateRouter)
module.exports = router;