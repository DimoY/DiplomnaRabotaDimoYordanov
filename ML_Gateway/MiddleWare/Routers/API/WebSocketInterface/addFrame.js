const sharp = require("sharp")
var express = require('express');
var router = express.Router();

const userModel = require('../../../../model/model/User/user');

const AWS = require("aws-sdk")

MapObj = new Map()

router.post('/', async function (req, res, next) {
   /* if(req.body["cameraName"] == undefined){
        res.json({ "reason": "No camera name provided","status":"error" });
        return
    }
    
 */
    //console.log(req)
    querry = req.body["camera-id"]+req.body["date"]
    if(MapObj.has(querry)){
      data = [...MapObj.get(querry),...req.body["data"]["data"]]
      MapObj.set(querry,data)
    }else{
      MapObj.set(querry,req.body["data"]["data"])
    }
    if(req.body["end"]){
      console.log(querry)
      const image = sharp(Uint8Array.from(MapObj.get(querry))).png().toFile("123.png")
    }
    res.json({ "status":"ok" });
});

module.exports = router;