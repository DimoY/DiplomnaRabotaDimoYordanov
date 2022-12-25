var express = require('express');
var router = express.Router();
const userModel = require('../../../../model/model/user');

router.post('/', async function (req, res, next) {
    console.log(req.body)
    try {
        const user = await userModel.create({
            username:req.body.username,
            password:req.body.password
        })
        res.json({status:"ok"})
    } catch (error) {
        //TODO CHECK ERROR
        console.log(error)
        res.json({status:"Error"})
    }
});

module.exports = router;