const express = require("express")
const path = require('path');
var helmet = require("helmet")
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const oauthserver = require('node-oauth2-server');


const APIRouter = require('../MiddleWare/Routers/API/APISum');
const {  mongoose } = require("mongoose");

function AppUseDefines(app) {
    mongoose.connect(process.env.ATLAS_URI)
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(helmet())
    app.use(bodyParser.urlencoded({ extended: true }));
 
    app.use(bodyParser.json());

    
    app.use("/api",APIRouter);
}
module.exports = AppUseDefines;
