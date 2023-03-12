var express = require('express');
const userModel = require('../../model/model/User/user');

var SHA256 = require("crypto-js/sha256");

class Notification{
    constructor(notificationLevel,notificationInfo){
        this.notificationLevel = notificationLevel
        this.notificationInfo = notificationInfo
    }

    async _viewAdd(req,res,next){
        // функция използвана от рутера за добавяне на нотификация
        // чрез програмния интерфейс

        const username = req.body["username"]
        let user = await userModel.findOne({
            username : username
        })
        let img = req.body["S3ImageKey"]
        
        const camera = user.cameras.filter((e)=>{return e._id == req.body["camera-id"]})[0];
        let hashContent = SHA256(String(this.notificationInfo["title"].replace("<person>",req.body["item"]).replace("<camera>",camera["name"])))

        const notificationAvailable = user.notifications.filter((e)=>{
            return hashContent == e.hash && e.end==-1
        })
        if(notificationAvailable.length == 0){
            user = this.addNotification(user, req, camera, img, hashContent);
    
        }else{
            if((new Date()).getTime()-(notificationAvailable[0].start+notificationAvailable[0].times_seen) > 5000){
                user = this.setFunctionEnd(user, hashContent);
                user = this.addNotification(user, req, camera, img, hashContent)
            }else{
                user = this.addTime(user, hashContent, notificationAvailable);
            }
        }


        
        user = await userModel.updateOne({
            username : user.username
        },user)
        res.json({"status":"ok"})
    }



    addTime(user, hashContent, notificationAvailable) {
        for (let i in user.notifications) {
            if (user.notifications[i].hash == hashContent) {
                user.notifications[i].times_seen += (new Date()).getTime() - (notificationAvailable[0].start + notificationAvailable[0].times_seen);
            }
        }
        return user
    }

    addNotification(user, req, camera, img, hashContent) {
        user.notifications.push({
            title: String(this.notificationInfo["title"].replace("<person>", req.body["item"]).replace("<camera>", camera["name"])),
            notificationType: String(this.notificationLevel),
            S3ImgKey: img.replace(" ", "+"),
            FullS3Img: req.body["FullS3Image"],
            start: (new Date()).getTime(),
            end: -1,
            times_seen: 0,
            hash: hashContent
        });
        return user
    }

    setFunctionEnd(user, hashContent) {
        for (let i in user.notifications) {
            if (user.notifications[i].hash == hashContent) {
                user.notifications[i].end = 0;
            }
        }
        return user
    }

    viewFactory(){
        var router = express.Router();
        let viewAddFunction = this._viewAdd.bind(this)
        router.post("/",viewAddFunction)
        return router
    }

    
}
module.exports = Notification

