var express = require('express');
var router = express.Router();

const userModel = require('../../model/model/User/user');
const AuthMiddleWare = require("../Others/userIsAuthenticated")


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

router.put("/",AuthMiddleWare,async function (req,res,next) {
    if(req.body["id"] == undefined ){
        res.json({ "reason": "No id provided","status":"error" });
        return
    }
    if(Number.isInteger(req.body["id"])){
        res.json({ "reason": "Id is wrong type","status":"error" });
        return
    }
    
    let user = await userModel.findOne({
        username:req.username
    })
    for (const key in user.cameras) {
        if(req.body["ip"] != undefined){
            if(IsIpCorrect(req.body["ip"])){
                user.cameras[key].ip = req.body["ip"]
            }
        }
        if(req.body["cameraName"] != undefined){
            user.cameras[key].name = req.body["cameraName"].toString()
        }
    }
    user = await userModel.updateOne({
        username:user.username
    },user)
    
    res.json({ "status":"ok" });
})

module.exports = router;