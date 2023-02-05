var express = require('express');
var router = express.Router();
const faceAddRouter = require('./addFace');
const faceGetRouter = require('./getFaces');
const sensitivityRouter = require('./Sensitivity');
router.use("/add",faceAddRouter)
router.use("/get",faceGetRouter)
router.use("/change-sensitivity",sensitivityRouter)
module.exports = router;