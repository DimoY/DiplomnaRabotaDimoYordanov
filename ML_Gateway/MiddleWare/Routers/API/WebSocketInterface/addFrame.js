const sharp = require("sharp")
var express = require('express');
var router = express.Router();

const userModel = require('../../../../model/model/User/user');

const AWS = require("aws-sdk");
const { default: axios } = require("axios");
const S3 = new AWS.S3()

MapObj = new Map()

router.post('/', async function (req, res, next) {
   /* if(req.body["cameraName"] == undefined){
        res.json({ "reason": "No camera name provided","status":"error" });
        return
    }
    
 */
    //console.log(req)
    querry = req.body["camera-id"]+"_"+req.body["date"]
    if(MapObj.has(querry)){
      data = [...MapObj.get(querry),...req.body["data"]["data"]]
      MapObj.set(querry,data)
    }else{
      MapObj.set(querry,req.body["data"]["data"])
    }
    if(req.body["end"]){
      let key = querry+"_"+Math.floor(Math.random()*1000000000).toString()+"_Image.png"
      const image = sharp(Uint8Array.from(MapObj.get(querry))).png()
      const resultS3Image = await S3.putObject({
        Body: await image.toBuffer(),
        Bucket: "diplomna-rabota",
        Key:key
      }).promise()
      console.log(querry)
    
      let headers = { 'Content-Type': 'application/json;charset=utf-8' }
      let data = {"KEY":key}
      let resp = await axios({
        method: "post",
        url: 'http://localhost:3000/api/-private/-private-add/',
        data: data,
        headers:headers
      })
    }
    res.json({ "status":"ok" });
});

module.exports = router;