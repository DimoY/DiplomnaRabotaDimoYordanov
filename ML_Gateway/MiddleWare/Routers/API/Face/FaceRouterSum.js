var express = require('express');
var router = express.Router();
const faceAddRouter = require('./addFace');
const faceGetRouter = require('./getFaces');
const faceClosestRouter = require('./ClosestFase');
router.use("/add",faceAddRouter)
router.use("/get",faceGetRouter)
router.use("/closest",faceClosestRouter)
module.exports = router;