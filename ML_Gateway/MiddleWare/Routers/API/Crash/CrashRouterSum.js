var express = require('express');
var router = express.Router();
const crashCheck = require('./crashCheck');
router.use("/",crashCheck)
module.exports = router;