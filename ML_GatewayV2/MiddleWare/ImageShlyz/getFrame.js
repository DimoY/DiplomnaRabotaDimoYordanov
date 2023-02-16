const sharp = require("sharp");

const userModel = require('../../model/model/User/user');

const AWS = require("aws-sdk");
const { default: axios } = require("axios");
const S3 = new AWS.S3()

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
    
    let image = await sharp_image.clone().resize(Math.round(metadata.width/4),Math.round(metadata.height/4)).raw().toBuffer()

    let data = await axios({
        method: "post",
        url: "http://localhost:5000/api/faceRecognition/",
        data: { "data": image, "width": Math.round(metadata.width/4), "height": Math.round(metadata.height/4) }
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

async function GetMaskInfo(sharp_image) {
    let data = await sharp_image.clone().resize(64,64).raw().toBuffer()
    data = { "signature_name": "serving_default", "instances": [data.toJSON()["data"]] }
    headers = { 'Content-Type': 'application/json;charset=utf-8' }
    let response = await axios({
        method: 'post',
        url: 'http://localhost:8503/v1/models/mask_recognition:predict',
        data: data,
        headers: headers
    })
    return response["data"]["predictions"]

}

function faceListMinDifference(user, data) {
    return user.faces.map(
        (e) => {
            let val = e.face.map(
                (e) => {
                    let sum = 0;
                    for (let i = 0; i < e.face.length; i++) {
                        sum += Math.abs(e.face[i] - data[0][i]);
                    }
                    return sum;
                }
            );
            return Math.min(...val);
        }
    );
}
function getIndexMostSimilarFace(faces) {
    let min = Math.min(...faces);
    let i = 0;
    for (i in faces) {
        if (faces[i] == min) {
            break;
        }
    }
    return { min, i };
}

async function calculateFaceInfo(imageS3,user,data){
    let faces = faceListMinDifference(user, data)
    let { min, i } = getIndexMostSimilarFace(faces);
    let key,found,name
    if(min>user.sensitivity){
        key = ""
        found  = false
        name = "unrecognised"
    }else{
        let date = new Date()
        key = user._id.toString()+"_"+user.faces[i].personName+"_"+date.getMilliseconds()+"_"+date.getSeconds()+"_"+Math.floor(Math.random() * 10000000000).toString(16)+"_Image.png"
        found = true    
        name = user.faces[i].personName
        await SaveToS3(key,imageS3)
    }
    return {"found": found,"diff":min,"person":name,"status":"ok" ,"S3Imagekey":key}
}





function CheckIfCarCrashed(data) {
    return data[0][0]>data[0][1]+0.2
}

async function SaveToS3(key,image){
    const resultS3Image = await S3.putObject({
        Body: await image,
        Bucket: "diplomna-rabota",
        Key: key
    }).promise()
}

async function SendCrashNotification(user,camera_id,key,camera_id) {
    notificationResp  = await axios({
        method:"post",
        url:"http://localhost:3333/api/notifications/-private-CarCrashing-Notification/",
        data:{"username":user.username,"item":"","camera-id":camera_id,"S3ImageKey":key,"camera-id":camera_id,"FullS3Image":key},
        headers:{}
    })
}

async function onCarCrash(imageSharpObject, camera_id, user) {
    let data = await GetCrash(imageSharpObject);

    if (CheckIfCarCrashed(data)) {
        let s3Store = imageSharpObject.jpeg().toBuffer();
        let date = new Date();
        key = "full_img_" + camera_id + "_" + date.getMilliseconds() + "_" + date.getSeconds() + ".jpg";
        await SaveToS3(key, s3Store);
        imageWasSaved = true;
        await SendCrashNotification(user, camera_id, key, camera_id);
    }
    return { key, imageWasSaved };
}

function extractImage(element, imageSharpObject) {
    element["MinY"] *= 4;
    element["MinX"] *= 4;
    element["Width"] *= 4;
    element["Height"] *= 4;


    let face_croped = imageSharpObject.extract({ left: element["MinX"], top: element["MinY"], width: element["Width"], height: element["Height"] });
    face_croped.png().toFile("123.png");
    image = face_croped.resize(112, 112);
    return image
}

async function notificationFaceFound(user, response, camera_id, key) {
    notificationResp = await axios({
        method: "post",
        url: "http://localhost:3333/api/notifications/-private-FaceRecognised-Notification/",
        data: { "username": user.username, "item": response["person"], "S3ImageKey": response["S3Imagekey"], "camera-id": camera_id, "FullS3Image": key },
        headers: {}
    });
}

async function notificationMaskNotFound(user,response, camera_id, key) {
    notificationResp = await axios({
        method: "post",
        url: "http://localhost:3333/api/notifications/-private-FaceRecognised-Notification/",
        data: { "username": user.username, "item": "", "S3ImageKey": response["S3Imagekey"], "camera-id": camera_id, "FullS3Image": key },
        headers: {}
    });
}

async function onFaceFound(element, imageSharpObject, user, imageWasSaved, key, camera) {
    image = extractImage(element, imageSharpObject);
    encoding = await GetEncoding(image);
    let response = await calculateFaceInfo(image.png().toBuffer(), user, encoding);
    if(camera.maskCheck==true && response["diff"]<1000000){
        let res = await GetMaskInfo(image)
        console.log(res)
        if(res[2]>0.9){
            if (imageWasSaved != true) {
                let s3Store = imageSharpObject.jpeg().toBuffer();
                let date = new Date();
                key = "full_img_" + camera._id + "_" + date.getMilliseconds() + "_" + date.getSeconds() + ".jpg";
                imageWasSaved=true;
                SaveToS3(key, s3Store);
            }
            notificationMaskNotFound(user,response,camera._id,key)
        }
    }
    if (camera.faceRecognition==true && response["found"] == true) {
        await notificationFaceFound(user, response, camera._id, key);
    }
}

async function ImageShlyz(camera_id,imageSharpObject) {

    let imageWasSaved = false
    let key = ""
    let user = await userModel.findOne({
        "cameras._id": camera_id
    })

    let camera = user.cameras.filter((e)=>{return e._id == camera_id})


    if(camera[0]["cameraType"] == "in car"){
        
        ({ key, imageWasSaved } = await onCarCrash(imageSharpObject, camera_id, user));
    }
    let metadata = await imageSharpObject .metadata()
    let data = await GetFaces(imageSharpObject,metadata)
    await data["data"]["res"].forEach(async function(element ) {
        await onFaceFound(element, imageSharpObject, user, imageWasSaved, key, camera);
    });
}

module.exports = ImageShlyz;

