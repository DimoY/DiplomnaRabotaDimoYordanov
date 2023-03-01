const camera = require("../Camera/camera");
const face = require("../Face/face");
const notification = require("../Notification/Notification");

module.exports = {
	username: {type:String, required:true,unique:true},
	password: {type:String, required:true},
	cameras:[camera],
	faces:[face],
	notifications:[notification],
	sensitivity:Number,
	
};