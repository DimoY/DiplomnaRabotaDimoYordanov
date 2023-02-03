var express = require('express');
var router = express.Router();
const faceAddRouter = require('./addFace');
const faceGetRouter = require('./getFaces');
router.use("/add",faceAddRouter)
router.use("/get",faceGetRouter)
module.exports = router;