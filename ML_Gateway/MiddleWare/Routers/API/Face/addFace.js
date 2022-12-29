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

    listOfBuffers = []
    for (let i = 0; i < 32; i++) {
        imageColor = []
        for (let j = 0; j < 96; j += 3) {
            imageColor.push(data.slice(i * 32 * 3 + j, i * 32 * 3 + j + 3).toJSON()["data"])
        }
        listOfBuffers.push(imageColor)
    }

    data = { "signature_name": "serving_default", "instances": [listOfBuffers] }
    headers = { 'Content-Type': 'application/json;charset=utf-8' }
    let response = await axios({
        method: 'post',
        url: 'http://localhost:8501/v1/models/face_recognition:predict',
        data: data,
        headers: headers
    })
    return response["data"]["predictions"]

}


router.post('/', AuthMiddleWare, async function (req, res, next) {
    if(req.body["faceArray"] == undefined){
        res.json({ "reason": "Face was not given","status":"error" });
    }
    const image=  req.body["faceArray"]
    if(!Array.isArray(image)){
        res.json({ "reason": "Face is not array","status":"error" });
    }
    if(req.body["image-height"] == undefined || req.body["image-width"] == undefined){
        res.json({ "reason": "Face image size is not provided","status":"error" });
    }
    if(!Number.isInteger(req.body["image-height"]) || !Number.isInteger(req.body["image-width"])){
        res.json({ "reason": "Face image size is not an integer","status":"error" });
    }
    const imageSize = {
        width :req.body["image-width"],
        height:req.body["image-height"]
    }
    if(req.body["personName"] == undefined){
        res.json({ "reason": "No person name provided","status":"error" });
        return
    }
    console.log(req.username,req.password)
    let imageBuffer =  sharp(Uint8Array.from(image.flat().flat()), {
        raw: {
          width: imageSize["width"],
          height: imageSize["height"],
          channels: 3
        }
      })
    const imageS3 = await imageBuffer.png().toBuffer()
    const data = await PredictBasedOnPath(imageBuffer.resize(32,32))
    let user = await userModel.findOne({
        username:req.username
    })
    flag = false
    let id = 0
    let id2 = 0
    for(const personIndex in user.faces){
        if(user.faces[personIndex].personName == req.body["personName"] ){
            id = personIndex+1
            id2 = user.faces[personIndex].face.length
            flag = true
            user.faces[personIndex].face.push({face:data[0],createdAt:new Date()})   
        }
    }
    if(flag == false){
        try {
            id = user.faces.length()
        } catch (error) {
            id = 0
        }
        
        user.faces.push({
            face:[{face:data[0],createdAt:new Date()}],
            personName:req.body["personName"],
            hashedAt: new Date()
        })
    }
    
    const resultS3Image = await S3.putObject({
        Body: imageS3,
        Bucket: "diplomna-rabota",
        Key:user._id.toString()+"_"+id.toString()+"_"+id2.toString()+"_Image.png"
    }).promise()
    user = await userModel.updateOne({
        username:user.username
    },user)
    
    res.json({ "data": true,"status":"ok" });
});

module.exports = router;