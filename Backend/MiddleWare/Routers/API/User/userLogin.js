var express = require('express');
var router = express.Router();
const userModel = require('../../../../model/model/user');
const jwt = require("jsonwebtoken")

router.post('/', async function (req, res, next) {
    console.log(req.body)
    
    const user = await userModel.findOne({
        username:req.body.username,
        password:req.body.password
    })
    if(user){
        const token = jwt.sign({
            username:req.body.name,
            password:req.body.password
        },"secret")
        res.json({status:"ok",user:token})
    }else{
        res.json({status:"error",user:false})
    }
    
});

module.exports = router;