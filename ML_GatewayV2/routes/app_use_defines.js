const express = require("express")
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require("mongoose")

const APIRouter = require('../MiddleWare/Router');
//const {  mongoose } = require("mongoose");

function AppUseDefines(app) {
    mongoose.connect(process.env.ATLAS_URI)
    mongoose.connection.on('error', err => {
        console.log(err);
      });

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.use(express.static(path.join(__dirname, 'public')));

    app.use(bodyParser.urlencoded({ extended: true }));
 
    app.use(bodyParser.json());

    app.use("/api",APIRouter)
    
    app.listen(3333);
}
module.exports = AppUseDefines;



