var express = require('express');
var router = express.Router();


const userModel = require('../../model/model/User/user');
const AuthMiddleWare = require("../Others/userIsAuthenticated")

function DeleteCameraId(user,id) {
    user.cameras = user.cameras.filter(
        (e)=>{
            return e._id != id
        }
    )
    return user
}

router.delete("/",AuthMiddleWare,async function (req,res,next) {
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
    user = await userModel.updateOne({
        username:user.username
    },DeleteCameraId(user,req.body["id"]))
    
    res.json({ "status":"ok" });
})
module.exports = router;