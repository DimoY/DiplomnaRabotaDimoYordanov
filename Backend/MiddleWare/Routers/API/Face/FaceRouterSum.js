var express = require('express');
var router = express.Router();
const faceRouter = require('./faceRecognition');
router.use("/recognise",faceRouter)
module.exports = router;