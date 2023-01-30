var express = require('express');
var router = express.Router();
var sharp = require("sharp");
const axios = require('axios');

const userModel = require('../../../../model/model/User/user');
const AuthMiddleWare = require("../../../Others/userIsAuthenticated")

const AWS = require("aws-sdk")

var PNG = require('pngjs').PNG;

const S3  = new AWS.S3()

path = "/run/media/dimoy/d910ca3f-8188-4f99-b7f3-9d2d45aaa2f6/home/dn/Documents/DiplomnaFolder/Backend/detcted2q.jpg"


async function PredictBasedOnPath(sharp_image) {
    let data = await sharp_image.raw().toBuffer()
    data = { "signature_name": "serving_default", "instances": [data.toJSON()["data"]] }
    headers = { 'Content-Type': 'application/json;charset=utf-8' }
    let response = await axios({
        method: 'post',
        url: 'http://localhost:8502/v1/models/crashing_recognition:predict',
        data: data,
        headers: headers
    })
    return response["data"]["predictions"]

}

router.post('', async function (req, res, next) {
    if(req.body["img"] == undefined){
        res.json({ "reason": "Image was not given","status":"error" });
    }
    const image=  req.body["img"]
    if(!Array.isArray(image)){
        res.json({ "reason": "Image is not array","status":"error" });
    }

    let imageBuffer =  sharp(Uint8Array.from(image))
    const imageS3 = imageBuffer.png().toBuffer()
    let data = await PredictBasedOnPath(imageBuffer)
    flag = false

    res.json({ "result":data[0]>data[1],"status":"ok"});
    
    
});

module.exports = router;