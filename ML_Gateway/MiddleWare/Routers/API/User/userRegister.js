var express = require('express');
var router = express.Router();
const userModel = require('../../../../model/model/User/user');
const bcrypt = require("bcryptjs")

var salt = bcrypt.genSaltSync(10);
router.post('/', async function (req, res, next) {
    console.log(req.body)
    try {
        sent = req.body.password
        var hash = bcrypt.hashSync(sent, 8);
        const user = await userModel.create({
            username:req.body.username,
            password:hash,
            faces:[],
            cameras:[],
            notifications:[]
        })
        res.json({status:"ok"})
    } catch (error) {
        //TODO CHECK ERROR
        console.log(error)
        res.json({status:"Error"})
    }
});

module.exports = router;