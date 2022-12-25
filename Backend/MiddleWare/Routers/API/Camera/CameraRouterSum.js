var express = require('express');
var router = express.Router();
const cameraRouter = require('./addCamera');
router.use("/add",cameraRouter)
module.exports = router;