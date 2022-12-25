const camera = require("../Camera/camera");
const face = require("../Face/face");

module.exports = {
	username: {type:String, required:true,unique:true},
	password: {type:String, required:true},
	cameras:[camera],
	faces:[face]
};