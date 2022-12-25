var express = require('express');
var router = express.Router();
var sharp = require("sharp");
const axios = require('axios');
const dbo = require("../../../../db/conn")

path = "/run/media/dimoy/d910ca3f-8188-4f99-b7f3-9d2d45aaa2f6/home/dn/Documents/DiplomnaFolder/Backend/detcted2q.jpg"
async function PredictBasedOnPath(path) {
    let data = await sharp(path)
        .resize(32, 32)
        .raw()
        .toBuffer()


    listOfBuffers = []
    for (let i = 0; i < 32; i++) {
        imageColor = []
        for (let j = 0; j < 96; j += 3) {
            imageColor.push(data.slice(i * 32 * 3 + j, i * 32 * 3 + j + 3).toJSON()["data"])
        }
        listOfBuffers.push(imageColor)
    }
    data = { "signature_name": "serving_default", "instances": [listOfBuffers] }
    headers = { 'Content-Type': 'application/json;charset=utf-8' }
    let response = await axios({
        method: 'post',
        url: 'http://localhost:8501/v1/models/face_recognition:predict',
        data: data,
        headers: headers
    })
    return response["data"]["predictions"]

}



router.post('/', function (req, res, next) {
    PredictBasedOnPath(path).then(
        (data)=>{
            
            const faceInfo = {
                listing_id: req.body.id,
                last_modified: new Date(),
                session_id: 12,
                direction: data[0]
              };
            var db = dbo.getDb();
            db.collection("faces")
            .insertOne(faceInfo, function (err, result) {
            if (err) {
                res.status(400).send("Error inserting face!");
            } else {
                console.log(`Added a new face with id ${result.insertedId}`);
            }
            });
            res.json({ "data": data,"error":false });
        }
    )
    
});

module.exports = router;