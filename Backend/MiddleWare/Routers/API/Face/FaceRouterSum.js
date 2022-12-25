var express = require('express');
var router = express.Router();
const faceRouter = require('./addFace');
router.use("/add",faceRouter)
module.exports = router;