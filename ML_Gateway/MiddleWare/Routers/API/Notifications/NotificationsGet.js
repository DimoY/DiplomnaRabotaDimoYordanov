var express = require('express');
const userModel = require('../../../../model/model/User/user');
const AuthMiddleWare = require("../../../Others/userIsAuthenticated")

class Notification{
    constructor(){
    }

    async _viewGet(req,res,next){
        console.log(req.username)
        let user = await userModel.findOne({
            username:req.username
        })
        res.json({ "notifications":user.notifications});
    
    }


    viewFactory(){
        var router = express.Router();
        let viewGetFunction = this._viewGet.bind(this)
        router.get("/",AuthMiddleWare,viewGetFunction)
        return router
    }
}
module.exports = Notification