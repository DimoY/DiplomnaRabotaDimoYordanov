var express = require('express');
const sharp = require("sharp")


require("dotenv").config({ path: "./config.env" });

const AppUseDefines = require('./routes/app_use_defines');

const ImageShlyz = require("./MiddleWare/ImageShlyz/getFrame");
const userModel = require('./model/model/User/user');
const bcrypt = require("bcryptjs");
const {SHA256} = require("crypto-js")

const app = express();
var expressWs = require('express-ws')(app);
    
    
AppUseDefines(app)


let setWebSocket = (app)=>{

    function DecodeSizes(msg) {
      frames = (new DataView(msg.buffer, 5, 4)).getInt32(littleEndian = false)
      width = (new DataView(msg.buffer, 9, 4)).getInt32(littleEndian = false)
      height = (new DataView(msg.buffer, 13, 4)).getInt32(littleEndian = false)
      return {
        frames:frames,
        width:width,
        height:height
      }
    }

    app.ws('/camera-input/:cameraid/', function(ws, req) {
        ws.on('message', async function(msg) {
            // реформатиране на изображението
            // така че да е подходящо за създаване на sharp обект	
               
            if (msg.slice(0, 5).toString() != "array") {
                ws.send("Only array type supported");
              }
              const {frames:frames,width:width,height:height} = DecodeSizes(msg)
              chanes = 3
              for (let frame=0;frame<frames;frame++){
                const offset = frame*width*height*chanes
                for (let index = 0; index < height; index++) {
                  for (let index2 = 0; index2 < width * chanes; index2 += chanes) {
                    let k = msg[offset+ index * width * chanes + index2]
                    msg[offset+ index * width * chanes + index2] = msg[offset+index * width * chanes + index2 + 1]
                    msg[offset+ index * width * chanes + index2 + 1] = k
                  }
                }
                const image = sharp(Uint8Array.from(msg.slice(offset,offset+ width * height * chanes)), {
                  raw: {
                    width: width,
                    height: height,
                    channels: chanes,
                  }
                })
                // подаване като параметър на шлюз функцията нашето изображение
                ImageShlyz(req.params["cameraid"],image)
              }
        });
    });

    
}

setWebSocket(app)

module.exports = app;
