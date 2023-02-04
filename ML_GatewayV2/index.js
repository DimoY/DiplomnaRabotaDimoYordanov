var express = require('express');
const sharp = require("sharp")


require("dotenv").config({ path: "./config.env" });

const AppUseDefines = require('./routes/app_use_defines');

const ImageShlyz = require("./MiddleWare/ImageShlyz/getFrame");
const { cameras } = require('./model/schema/User/user');

const app = express();
var expressWs = require('express-ws')(app);
    

    
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

    app.ws('/stream/:cameraid/', async function(ws, req) {
      ws.on('message', async function(msg) {
        if(camera_map[req.params["cameraid"]]!=undefined){
          let buffer = await camera_map[req.params["cameraid"]].jpeg().toBuffer()
          ws.send(JSON.stringify(buffer.toJSON()["data"]))
          await new Promise(r => setTimeout(r, 500));
        }
      })
      console.log("connect")
  });
}

setWebSocket(app)

module.exports = app;
