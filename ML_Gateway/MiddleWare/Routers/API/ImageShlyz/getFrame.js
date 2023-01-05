const sharp = require("sharp")
var express = require('express');
var router = express.Router();

const userModel = require('../../../../model/model/User/user');

const AWS = require("aws-sdk");
const { default: axios, AxiosError } = require("axios");
const { username } = require("../../../../model/schema/User/user");
const S3 = new AWS.S3()

MapObj = new Map()

router.post('/', async function (req, res, next) {
    const resultS3Image = await S3.getObject({
        Bucket: "diplomna-rabota",
        Key: req.body["KEY"]
    }).promise()
    imageSharpObject = sharp(resultS3Image["Body"])
    image = imageSharpObject.raw().toBuffer()
    let user = await userModel.findOne({
        "cameras._id": req.body["camera-id"]
    })
    console.log(user["username"])
    image = await image
    let metadata = await imageSharpObject.metadata()
    let data = await axios({
        method: "post",
        url: "http://localhost:5000/api/faceRecognition/",
        data: { "data": image, "width": metadata.width, "height": metadata.height }
    })
    console.log(metadata)
    await data["data"]["res"].forEach(async function(element ) {
        let img = new Uint8Array()
        let heightIndex = element["MinY"]*metadata.width*3
        let widthIndex = element["MinX"]*3
        for (let yInxdex = 0; yInxdex < element["Height"]; yInxdex++) {
            let additionalHeightIndex = yInxdex*metadata.width*3
            let begin = heightIndex+additionalHeightIndex+widthIndex
            img = new Uint8Array([...img,...image.slice(begin,begin+element["Width"]*3).toJSON()["data"]])
        }
        image = await sharp(img,
            {
                raw:{
                    width:element["Width"],
                    height:element["Height"],
                    channels:3
                }
            }).raw().resize(32,32).toBuffer()
        response  = await axios({
            method:"post",
            url:"http://localhost:3000/api/face/closest/-private/",
            data:{username:user.username,"faceArray":image.toJSON()["data"],"image-height":32,"image-width":32},
            headers:{}
        })
        console.log(response["data"])
        if(response["data"]["found"] == true){
            
            notificationResp  = await axios({
                method:"post",
                url:"http://localhost:3000/api/notifications/-private-FaceRecognised-Notification/",
                data:{"username":user.username,"person":response["data"]["person"],"S3ImageKey":response["data"]["S3Imagekey"]},
                headers:{}
            })
        }
    });
    res.json({ "status": "ok" })
})

module.exports = router;