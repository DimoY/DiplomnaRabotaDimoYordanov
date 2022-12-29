var express = require('express');
var router = express.Router();

var addFrameRouter = require("./addFrame")

router.use("/add",addFrameRouter)

module.exports = router;