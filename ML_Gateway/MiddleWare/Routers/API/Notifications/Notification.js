var express = require('express');
const userModel = require('../../../../model/model/User/user');

class Notification{
    constructor(notificationLevel,notificationInfo){
        this.notificationLevel = notificationLevel
        this.notificationInfo = notificationInfo
    }

    async _viewAdd(req,res,next){
        const username = req.body["username"]
        const person = req.body["person"]
        let user = await userModel.findOne({
            username : username
        })
        let img = req.body["S3ImageKey"]

        user.notifications.push({
            title:String(this.notificationInfo["title"]+person),
            description:String(this.notificationInfo["description"]+person),
            notificationType:String(this.notificationLevel),
            S3ImgKey:img
        })

        user = await userModel.updateOne({
            username : user.username
        },user)
        res.json({"status":"ok"})
    }



    viewFactory(){
        var router = express.Router();
        let viewAddFunction = this._viewAdd.bind(this)
        router.post("/",viewAddFunction)
        return router
    }
}
module.exports = Notification