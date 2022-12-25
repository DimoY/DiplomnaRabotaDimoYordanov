var express = require('express');
var router = express.Router();
var sharp = require("sharp");
const axios = require('axios');

const userModel = require('../../../../model/model/User/user');
const dbo = require("../../../../db/conn")
const AuthMiddleWare = require("../../../Others/userIsAuthenticated")


function IsIpCorrect(ip) {
    if(! Array.isArray(ip)){
        return false
    }
    if(ip.length!=4){
        return false
    }
    for (const key in ip) {
        if(ip[key]<0 || ip[key]>255){
            return false
        }
    }
    return true
    
}



function DeleteCameraName(user,cameraName) {
    user.cameras = user.cameras.filter(
        (e)=>{
            return e.name != cameraName
        }
    )
    return user
}

function DeleteCameraIP(user,ip) {
    user.cameras = user.cameras.filter(
        (e)=>{
            return (e.ip[0] != ip[0] && 
            e.ip[1] != ip[1] &&
            e.ip[2] != ip[2] &&
            e.ip[3] != ip[3] )
        }
    )
    return user
}

router.delete('/name/', AuthMiddleWare, async function (req, res, next) {
   if(req.body["cameraName"] == undefined){
        res.json({ "reason": "No camera name provided","status":"error" });
        return
    }

    let user = await userModel.findOne({
        username:req.username
    })
    
    user = await userModel.updateOne({
        username:user.username
    },DeleteCameraName(user,req.body["cameraName"]))
    
    res.json({ "status":"ok" });
});
router.delete("/ip/",AuthMiddleWare,async function (req,res,next) {
    if(req.body["ip"] == undefined ){
        res.json({ "reason": "No ip provided","status":"error" });
        return
    }
    if(!IsIpCorrect(req.body["ip"])){
        res.json({ "reason": "Wrong ip provided","status":"error" });
        return
    }
    let user = await userModel.findOne({
        username:req.username
    })
    user = await userModel.updateOne({
        username:user.username
    },DeleteCameraIP(user,req.body["ip"]))
    
    res.json({ "status":"ok" });
})
module.exports = router;