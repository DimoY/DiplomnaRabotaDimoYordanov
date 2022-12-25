const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const userModel = require('../../model/model/User/user');

async function UserIsAuthenticated(req,res,next) {
    const token = req.headers["x-access-token"]
    if(token == undefined){
        res.json({"status":"error"})
        return;
    }
    const decoded = jwt.verify(token,process.env.JWTSecret)
    const user = await userModel.findOne({
        username:req.body.username
    })
    if(!user){
        res.json({"status":"error"})
        return;
    }
    let password = req.body.password
    if(!bcrypt.compareSync( password,user.password)){
        res.json({status:"error"})
        return;
    }
    req.username = decoded["username"]
    req.password = decoded["password"]
    next()
}

module.exports = UserIsAuthenticated;