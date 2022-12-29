var express = require('express');
var router = express.Router();

var addFrameRouter = require("./getFrame")

router.use("/-private-add",addFrameRouter)

module.exports = router;