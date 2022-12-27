var express = require('express');
require("dotenv").config({ path: "./config.env" });
const AppUseDefines = require('./routes/app_use_defines');
const { MongoClient, ServerApiVersion } = require('mongodb');

const dbo = require("./db/conn");

const app = express();

AppUseDefines(app)





module.exports = app;
