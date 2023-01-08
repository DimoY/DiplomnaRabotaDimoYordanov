const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const userModel = require('../../model/model/User/user');

async function UserIsAuthenticated(req,res,next) {
    const token = req.headers["x-access-token"]
    if(token == undefined){
        res.json({"status":"error","reason":"There is no token, weird ..."})
        return;
    }
    let decoded;
    try {
        decoded = jwt.verify(token,process.env.JWTSecret)
    } catch (error) {
        res.json({status:"error", reason:" jwt Problem",error:error.toString()})
    }
    
    const user = await userModel.findOne({
        username:decoded.username
    })
    if(!user){
        res.json({"status":"error","reason":"Username is not correct"})
        return;
    }
    let password = decoded.password
    if(!bcrypt.compareSync( password,user.password)){
        res.json({status:"error", reason:"Password is not correct"})
        return;
    }
    req.username = decoded["username"]
    req.password = decoded["password"]
    next()
}

module.exports = UserIsAuthenticated;