var express = require('express');
var router = express.Router();

const userModel = require('../../model/model/User/user');
const AuthMiddleWare = require("../Others/userIsAuthenticated")


router.post('/', AuthMiddleWare, async function (req, res, next) {
    let user = await userModel.findOne({
        username:req.username
    })
    if(req.body["setting"] == "High"){
        user.sensitivity = 120000
    }
    else  if(req.body["setting"] == "Medium"){
        user.sensitivity = 150000
    } 
    else if(req.body["setting"] == "Low"){
        user.sensitivity = 180000
    }else{
        res.json({ "error":true,"status":"error" });
        return
    }

    res.json({ "error":false,"status":"ok" });
});


module.exports = router;