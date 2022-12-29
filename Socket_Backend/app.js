var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
const axios = require("axios")
const sharp = require("sharp")

const AWS = require("aws-sdk")


const S3  = new AWS.S3()



app.ws('/:cameraid', function(ws, req) {
  ws.on('message', async function(msg) {
    if(msg.slice(0,5).toString() != "array"){
        ws.send("Only array type supported");
    }
    frames = (new DataView(msg.buffer,5,4)).getInt32(littleEndian=false)
    height = (new DataView(msg.buffer,9,4)).getInt32(littleEndian=false)
    width = (new DataView(msg.buffer,13,4)).getInt32(littleEndian=false)
    chanes = 3
    for (let index = 0; index < height; index++) {
        for (let index2 = 0; index2 < width*chanes; index2+=chanes) {
            let k = msg[index*width*chanes+index2]
            msg[index*width*chanes+index2] = msg[index*width*chanes+index2+1]
            msg[index*width*chanes+index2+1] = k
        }
    }
    const image = sharp(Uint8Array.from(msg.slice(0,width*height*chanes)), {
        // because the input does not contain its dimensions or how many channels it has
        // we need to specify it in the constructor options
        raw: {
          width: width,
          height: height,
          channels: chanes,
        }
      }).png()
    let  datetime = (new Date()).toTimeString()
    console.log(req.params["cameraid"]+"_Image.png")
    
    data = await image.toBuffer()
    headers = { 'Content-Type': 'application/json;charset=utf-8' }
    let imageSizeSent = 25000
    for(let i = 0;i<data.length/imageSizeSent;i++){
      let response = await axios({
        method: 'post',
        url: 'http://localhost:3000/api/ws/add/',
        data: {width:width,height:height,end:(i+1)>=data.length/imageSizeSent,"fragment":i,"camera-id":req.params["cameraid"],"date":datetime,"data":data.slice(i*imageSizeSent,i*imageSizeSent+imageSizeSent)},
        headers: headers,
        
    })
    }
    
    console.log('socket', req.testing);
  });
});

app.listen(3350);