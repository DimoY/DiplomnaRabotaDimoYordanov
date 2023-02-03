const sharp = require("sharp")
var express = require('express');
var router = express.Router();

const userModel = require('../../model/model/User/user');

const AWS = require("aws-sdk");
const { default: axios, AxiosError } = require("axios");
const { username } = require("../../model/schema/User/user");
const camera = require("../../model/schema/Camera/camera");
const S3 = new AWS.S3()

MapObj = new Map()


async function GetCrash(sharp_image) {
    let data = await sharp_image.clone().resize(128,128).raw().toBuffer()
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

async function GetFaces(sharp_image,metadata) {
    
    let image = await sharp_image.clone().resize(metadata.width/4,metadata.height/4).raw().toBuffer()

    let data = await axios({
        method: "post",
        url: "http://localhost:5000/api/faceRecognition/",
        data: { "data": image, "width": metadata.width/4, "height": metadata.height/4 }
    })
    return data

}


async function GetEncoding(sharp_image) {
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

async function calculateFaceInfo(imageS3,user,data){
    let faces = user.faces.map(
        (e)=>{
            let val = e.face.map(
                (e)=>{
                    let sum = 0;
                    for(let i = 0;i<1024;i++){
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
        //key = user._id.toString()+"_unrecognised_"+new Date().toString()+"_"+Math.floor(Math.random() * 10000000000).toString(16)+"_Image.png"
        key = ""
        found  = false
        name = "unrecognised"
    }else{
        let date = new Date()
        key = user._id.toString()+"_"+user.faces[i].personName+"_"+date.getMilliseconds()+"_"+date.getSeconds()+"_"+Math.floor(Math.random() * 10000000000).toString(16)+"_Image.png"
        found = true    
        name = user.faces[i].personName
        const resultS3Image = await S3.putObject({
            Body: await imageS3,
            Bucket: "diplomna-rabota",
            Key: key
        }).promise()
        console.log(resultS3Image)
    }
    return {"found": found,"diff":min,"person":name,"status":"ok" ,"S3Imagekey":key}
}

async function ImageShlyz(camera_id,imageSharpObject) {


    let user = await userModel.findOne({
        "cameras._id": camera_id
    })

    let camera = user.cameras.filter((e)=>{return e._id == camera_id})


    if(camera[0]["cameraType"] == "in car"){
        
        let data = await GetCrash(imageSharpObject)
        
        if(data[0]>data[1]){
            notificationResp  = await axios({
                method:"post",
                url:"http://localhost:3333/api/notifications/-private-CarCrashing-Notification/",
                data:{"username":user.username,"item":"","camera-id":camera_id},
                headers:{}
            })
        }
    }
    let metadata = await imageSharpObject .metadata()
    let data = await GetFaces(imageSharpObject,metadata)

    await data["data"]["res"].forEach(async function(element ) {

        element["MinY"]*=4
        element["MinX"]*=4
        element["Width"]*=4
        element["Height"]*=4

        
        let face_croped = imageSharpObject.extract({left: element["MinX"], top: element["MinY"], width: element["Width"], height: element["Height"]})
        face_croped.png().toFile("123.png")
        image = face_croped.resize(32,32)


        encoding = await GetEncoding(image)

        let response = await calculateFaceInfo(image.png().toBuffer(),user,encoding)
        console.log(response)
        //console.log(response["data"])
        if(response["found"] == true){
            
            notificationResp  = await axios({
                method:"post",
                url:"http://localhost:3333/api/notifications/-private-FaceRecognised-Notification/",
                data:{"username":user.username,"item":response["person"],"S3ImageKey":response["S3Imagekey"],"camera-id":camera_id},
                headers:{}
            })
        }
    });
}

module.exports = ImageShlyz;