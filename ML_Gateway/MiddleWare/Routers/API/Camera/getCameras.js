var express = require('express');

var router = express.Router();

const userModel = require('../../../../model/model/User/user');
const AuthMiddleWare = require("../../../Others/userIsAuthenticated")

router.get("/",AuthMiddleWare,async function (req,res,next) {
    let user = await userModel.findOne({
        username:req.username
    })
    res.json({ "cameras":user.cameras });
})
router.get("/id/",AuthMiddleWare,async function (req,res,next) {
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
    res.json({ "cameras":user.cameras.filter((e)=>{return e._id = req.body["id"]}) });
})
module.exports = router;