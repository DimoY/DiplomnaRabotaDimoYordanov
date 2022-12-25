const { MongoClient } = require("mongodb");
const connectionString = process.env.ATLAS_URI//"mongodb+srv://DimoY:1acRuZ93V5wvBK8U@bazinga0.g2c1mdm.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbConnection;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      if (err || !db) {
        return callback(err);
      }

      dbConnection = db.db("sample_face_info");
      console.log("Successfully connected to MongoDB.");

      return callback();
    });
  },

  getDb: function () {
    return dbConnection;
  },

  addCameraObj: async function(cameraInfo){
    let camera_collection = db.collection("cameras")
    let output = await camera_collection.insertOne(cameraInfo, function (err, result) {
    if (err) {
        return
    } else {
    }
    })
    return output
  },

};