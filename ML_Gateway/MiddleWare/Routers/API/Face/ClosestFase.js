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
        url: 'http://localhost:8501/v1/models/face_recognition:predict',
        data: data,
        headers: headers
    })
    return response["data"]["predictions"]

}

router.post('/-private/', async function (req, res, next) {
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

    let imageBuffer =  sharp(Uint8Array.from(image.flat().flat()), {
        raw: {
          width: imageSize["width"],
          height: imageSize["height"],
          channels: 3
        }
      })
    const imageS3 = imageBuffer.png().toBuffer()
    let data = PredictBasedOnPath(imageBuffer.resize(32,32))
    let user = await userModel.findOne({
        username:req.body["username"]
    })
    flag = false
    data = await data
    let faces = user.faces.map(
        (e)=>{
            let val = e.face.map(
                (e)=>{
                    let sum = 0;
                    for(let i = 0;i<512;i++){
                        sum+=Math.abs(e.face[i]-data[0][i])
                    }
                    return sum
                }
            )
            return Math.min(...val)
        }
    )
    let min = Math.min(...faces)
    let i = 0
    for(i in faces){
        if(faces[i] == min){
            break
        }
    }
    let key,found,name
    if(min>200){
        key = user._id.toString()+"_unrecognised_"+new Date().toString()+"_"+Math.floor(Math.random() * 10000000000).toString(16)+"_Image.png"
        found  = false
        name = "unrecognised"
    }else{
        key = user._id.toString()+"_"+user.faces[i].personName+"_"+new Date().toString()+"_"+Math.floor(Math.random() * 10000000000).toString(16)+"_Image.png"
        found = true    
        name = user.faces[i].personName
    }
    const resultS3Image = await S3.putObject({
        Body: await imageS3,
        Bucket: "diplomna-rabota",
        Key: key
    }).promise()
    res.json({ "found": found,"diff":min,"person":name,"status":"ok" });
    
    
});


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

    console.log(req.username,req.password)
    let imageBuffer =  sharp(Uint8Array.from(image.flat().flat()), {
        raw: {
          width: imageSize["width"],
          height: imageSize["height"],
          channels: 3
        }
      })
    const imageS3 = imageBuffer.png().toBuffer()
    let data = PredictBasedOnPath(imageBuffer.resize(32,32))
    let user = await userModel.findOne({
        username:req.username
    })
    flag = false
    data = await data
    let faces = user.faces.map(
        (e)=>{
            let val = e.face.map(
                (e)=>{
                    let sum = 0;
                    for(let i = 0;i<512;i++){
                        sum+=Math.abs(e.face[i]-data[0][i])
                    }
                    return sum
                }
            )
            return Math.min(...val)
        }
    )
    let min = Math.min(...faces)
    let i = 0
    for(i in faces){
        if(faces[i] == min){
            break
        }
    }
    let key,found
    if(min>100){
        key = user._id.toString()+"_unrecognised_"+new Date().toString()+"_"+Math.floor(Math.random() * 10000000000).toString(16)+"_Image.png"
        found  = false
    }else{
        key = user._id.toString()+"_"+user.faces[i].personName+"_"+new Date().toString()+"_"+Math.floor(Math.random() * 10000000000).toString(16)+"_Image.png"
        found = true    
    }
    const resultS3Image = await S3.putObject({
        Body: await imageS3,
        Bucket: "diplomna-rabota",
        Key: key
    }).promise()
    res.json({ "found": found,"person":user.faces[i].personName,"status":"ok" });
    
    
});

module.exports = router;