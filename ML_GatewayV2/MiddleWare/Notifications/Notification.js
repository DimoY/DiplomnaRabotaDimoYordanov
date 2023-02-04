var express = require('express');
const userModel = require('../../model/model/User/user');

class Notification{
    constructor(notificationLevel,notificationInfo){
        this.notificationLevel = notificationLevel
        this.notificationInfo = notificationInfo
    }

    async _viewAdd(req,res,next){
        const username = req.body["username"]
        let user = await userModel.findOne({
            username : username
        })
        let img = req.body["S3ImageKey"]
        
        const camera = user.cameras.filter((e)=>{return e._id == req.body["camera-id"]})[0];

        user.notifications.push({
            title:String(this.notificationInfo["title"].replace("<person>",req.body["item"]).replace("<camera>",camera["name"])),
            notificationType:String(this.notificationLevel),
            S3ImgKey:img.replace(" ","+")
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