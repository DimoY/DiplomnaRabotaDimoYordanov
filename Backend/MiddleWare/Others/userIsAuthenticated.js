const jwt = require("jsonwebtoken")

function UserIsAuthenticated(req,res,next) {
    const token = req.headers["x-access-token"]
    if(token == undefined){
        res.json({"status":"error"})
    }
    const decoded = jwt.verify(token,process.env.JWTSecret)
    console.log(decoded)
    next()
}

module.exports = UserIsAuthenticated;