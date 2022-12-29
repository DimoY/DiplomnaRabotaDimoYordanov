const sharp = require("sharp")
var express = require('express');
var router = express.Router();

const userModel = require('../../../../model/model/User/user');

const AWS = require("aws-sdk")
const S3 = new AWS.S3()

MapObj = new Map()

router.post('/', async function (req, res, next) {
    const resultS3Image = await S3.getObject({
        Bucket: "diplomna-rabota",
        Key: req.body["KEY"]
    }).promise()
    image = resultS3Image["Body"]
})

module.exports = router;