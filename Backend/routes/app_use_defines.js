const express = require("express")
const path = require('path');
var helmet = require("helmet")
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const oauthserver = require('node-oauth2-server');


const indexRouter = require('../MiddleWare/Routers/index');
const usersRouter = require('../MiddleWare/Routers/users');
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
    
    app.oauth = oauthserver({
    model: require("../model/model"), // See below for specification
    grants: ['password'],
    debug: true
    });
    
    app.all('/oauth/token', app.oauth.grant());
    
    app.get('/', app.oauth.authorise(), function (req, res) {
    res.send('Secret area');
    });
    
    app.use(app.oauth.errorHandler());
    app.use('/', indexRouter);
    app.use('/users', usersRouter);
    app.use("/api",APIRouter);
}
module.exports = AppUseDefines;
