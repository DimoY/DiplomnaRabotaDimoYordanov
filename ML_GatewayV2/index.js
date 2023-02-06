var express = require('express');
const sharp = require("sharp")


require("dotenv").config({ path: "./config.env" });

const AppUseDefines = require('./routes/app_use_defines');

const ImageShlyz = require("./MiddleWare/ImageShlyz/getFrame");
const userModel = require('./model/model/User/user');
const bcrypt = require("bcryptjs");

const app = express();
var expressWs = require('express-ws')(app);
    
const jwt = require("jsonwebtoken")
    
AppUseDefines(app)

let camera_map = {}

let setWebSocket = (app)=>{
    app.ws('/camera-input/:cameraid/', function(ws, req) {
        ws.on('message', async function(msg) {

            var date1 = new Date();
            if (msg.slice(0, 5).toString() != "array") {
                ws.send("Only array type supported");
              }
              frames = (new DataView(msg.buffer, 5, 4)).getInt32(littleEndian = false)
              width = (new DataView(msg.buffer, 9, 4)).getInt32(littleEndian = false)
              height = (new DataView(msg.buffer, 13, 4)).getInt32(littleEndian = false)
              chanes = 3
              for (let index = 0; index < height; index++) {
                for (let index2 = 0; index2 < width * chanes; index2 += chanes) {
                  let k = msg[index * width * chanes + index2]
                  msg[index * width * chanes + index2] = msg[index * width * chanes + index2 + 1]
                  msg[index * width * chanes + index2 + 1] = k
                }
              }
              const image = sharp(Uint8Array.from(msg.slice(0, width * height * chanes)), {
                // because the input does not contain its dimensions or how many channels it has
                // we need to specify it in the constructor options
                raw: {
                  width: width,
                  height: height,
                  channels: chanes,
                }
              })
              camera_map[req.params["cameraid"]] = image
              await ImageShlyz(req.params["cameraid"],image)
              var date2 = new Date();
              var diff = date2 - date1; //milliseconds interval
              console.log(diff)
              //let data = image.toBuffer()
              //console.log(req.params["cameraid"] + "_Image.png")
              //image.toFile(req.params["cameraid"] + "_Image.png")
        });
        console.log("connect")
    });

    app.ws('/notifications-user/', function(ws, req) {
      ws.on('message', async function(msg) {
        const token = msg
        console.log(token)
        if(token == undefined){
            console.log({"status":"error","reason":"There is no token, weird ..."})
            return;
        }
        let decoded;
        try {
            decoded = jwt.verify(token,process.env.JWTSecret)
        } catch (error) {
            console.log({status:"error", reason:" jwt Problem",error:error.toString()})
            return
        }
        if(decoded == undefined){
            console.log({"status":"error","reason":"You are not coorect"})
            return
        }
        const user = await userModel.findOne({
            username:decoded.username
        })
        if(!user){
            console.log({"status":"error","reason":"Username is not correct"})
            return;
        }
        let password = decoded.password
        if(!bcrypt.compareSync( password,user.password)){
            console.log({status:"error", reason:"Password is not correct"})
            return;
        }
        ws.send(JSON.stringify(user.notifications))
      });
      console.log("connect")
  });

    
}

setWebSocket(app)

module.exports = app;
