var express = require('express');
var router = express.Router();
var sharp = require("sharp");
const axios = require('axios');

const userModel = require('../../../../model/model/User/user');

const dbo = require("../../../../db/conn")
const AuthMiddleWare = require("../../../Others/userIsAuthenticated")

path = "/run/media/dimoy/d910ca3f-8188-4f99-b7f3-9d2d45aaa2f6/home/dn/Documents/DiplomnaFolder/Backend/detcted2q.jpg"
async function PredictBasedOnPath(path) {
    let data = await sharp(path)
        .resize(32, 32)
        .raw()
        .toBuffer()


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
    const data = await PredictBasedOnPath(path)

    console.log(req.username,req.password)
    let user = await userModel.findOne({
        username:req.username
    })

    user.faces.push(data)
    user = await userModel.updateOne({
        username:user.username
    },user)
    console.log(user)
    res.json({ "data": data,"status":"ok" });
});

module.exports = router;