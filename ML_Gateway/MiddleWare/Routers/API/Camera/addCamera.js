var express = require('express');
var router = express.Router();

const userModel = require('../../../../model/model/User/user');
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


router.post('/', AuthMiddleWare, async function (req, res, next) {
    console.log(req.body)
   if(req.body["cameraName"] == undefined){
        res.json({ "reason": "No camera name provided","status":"error" });
        return
    }
    if(req.body["ip"] == undefined ){
        res.json({ "reason": "No ip provided","status":"error" });
        return
    }
    if(!IsIpCorrect(req.body["ip"])){
        res.json({ "reason": "Wrong ip provided","status":"error" });
        return
    }
    console.log(req.username,req.password)
    let user = await userModel.findOne({
        username:req.username
    })
    for (const iterator of user.cameras) {
        if(iterator.name == req.body["cameraName"] || iterator.ip == req.body["ip"]){
            res.json({ "reason": "Camera already exists","status":"error" });
            return
        }
    }
    user.cameras.push({
        ip:req.body["ip"],
        name:req.body["cameraName"],
        createdAt: new Date(),
        updatedAt: new Date()
    })
    user = await userModel.updateOne({
        username:user.username
    },user)
    
    res.json({ "status":"ok" });
});

module.exports = router;