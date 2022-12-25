const { query } = require('express');
var express = require('express');
var router = express.Router();
const dbo = require("../../../../db/conn")




/* GET home page. */
router.post('/', function (req, res, next) {
    console.log(req.params)
    if(req.query["camera-id"] == undefined){
        res.status(400).send("Query is malformed");
        return
    }
    if(req.params["camera"] == undefined){
        req.params["camera"] = []
    }
    id = req["query"]["camera-id"]
    const CameraInfo = {
        listing_id: id,
        last_modified: new Date(),
        session_id: 12,
        type: "Camera",
        faces: []
      };
    var db = dbo.getDb();
    db.collection("cameras")
    .insertOne(CameraInfo, function (err, result) {
    if (err) {
        res.status(400).send("Error inserting camera!");
        return
    } else {
        console.log(`Added a new camera with id ${result.insertedId}`);

        req.params["camera"].push(CameraInfo)
    }
    res.json({ "Added camera": true,"error":false });
    });
});

module.exports = router;