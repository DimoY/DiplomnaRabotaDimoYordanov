var express = require('express');
var router = express.Router();
const faceAddRouter = require('./addFace');
const faceGetRouter = require('./getFaces');
const faceUpdateRouter = require('./updateFace');
router.use("/add",faceAddRouter)
router.use("/get",faceGetRouter)
router.use("/update",faceUpdateRouter)
module.exports = router;