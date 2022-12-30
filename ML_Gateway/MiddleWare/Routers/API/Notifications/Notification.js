var express = require('express');
const userModel = require('../../../../model/model/User/user');
class Notification{
    constructor(notificationLevel,notificationInfo){
        this.notificationLevel = notificationLevel
        this.notificationInfo = notificationInfo
    }

    async _view(req,res,next){
        const username = req.body["username"]
        const person = req.body["person"]
        let user = await userModel.findOne({
            username : username
        })
        user.notifications.push({
            title:String(this.notificationInfo["title"]+person),
            description:String(this.notificationInfo["description"]+person),
            notificationType:String(this.notificationLevel)
        })

        user = await userModel.updateOne({
            username : user.username
        },user)
        res.json({"status":"ok"})
    }
    viewFactory(){
        var router = express.Router();
        let testFunc = this._view.bind(this)
        router.post("/",testFunc)
        return router
    }
}
module.exports = Notification