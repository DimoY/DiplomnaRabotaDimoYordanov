var express = require('express');
var router = express.Router();
var sharp = require("sharp");
const axios = require('axios');

const userModel = require('../../model/model/User/user');
const AuthMiddleWare = require("../Others/userIsAuthenticated")

const AWS = require("aws-sdk")

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

router.post('/browser/', AuthMiddleWare, async function (req, res, next) {
    if(req.body["faceArray"] == undefined){
        res.json({ "reason": "Face was not given","status":"error" });
    }
    const image=  new Uint8Array(Object.values(req.body["faceArray"]))

    if(req.body["personName"] == undefined){
        res.json({ "reason": "No person name provided","status":"error" });
        return
    }
    let user = await userModel.findOne({
        username:req.username
    })
    console.log(req.username,req.password)
    let imageBuffer =  sharp(image)
    const imageS3Promise = imageBuffer.png().toBuffer()
    let imageS3 = await imageS3Promise
    const key_value = user._id.toString()+"_"+Math.floor(Math.random()*1000000).toString()+"_Image.png"
    const resultS3Image = await S3.putObject({
        Body: imageS3,
        Bucket: "diplomna-rabota",
        Key:key_value
    }).promise()
    console.log(resultS3Image)
    const data = PredictBasedOnPath(imageBuffer.resize(112,112))
   
    flag = false
    let id = 0
    let id2 = 0
    for(const personIndex in user.faces){
        if(user.faces[personIndex].personName == req.body["personName"] ){
            id = personIndex+1
            id2 = user.faces[personIndex].face.length
            flag = true
            user.faces[personIndex].face.push({face:(await data)[0],createdAt:new Date(),pictureAt:key_value})   
        }
    }
    if(flag == false){
        try {
            id = user.faces.length
        } catch (error) {
            id = 0
        }
        
        user.faces.push({
            face:[{face:(await data)[0],createdAt:new Date(),pictureAt:key_value}],
            personName:req.body["personName"],
            hashedAt: new Date()
        })
    }
    
    user = await userModel.updateOne({
        username:user.username
    },user)
    
    res.json({ "data": true,"status":"ok" });
});


module.exports = router;