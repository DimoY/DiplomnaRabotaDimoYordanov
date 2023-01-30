var express = require('express');
var router = express.Router();
const userModel = require('../../../../model/model/User/user');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

router.post('/', async function (req, res, next) {
    console.log(req.body)
    
    const user = await userModel.findOne({
        username:req.body.username
    })
    if(user){
        
        let password = req.body.password
        if(!bcrypt.compareSync( password,user.password)){
            res.json({status:"error",user:false})
            return
        }
        const token = jwt.sign({
            username:req.body.username,
            password:req.body.password
        },process.env.JWTSecret)
        res.json({status:"ok",user:token})
    }else{
        res.json({status:"error",user:false})
    }
    
});

module.exports = router;