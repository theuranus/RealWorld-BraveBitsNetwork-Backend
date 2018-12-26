const secret = require('../config/index').secret
const jwt = require('jsonwebtoken')
const user = require('../model/userModel')

module.exports = function authenticate(req, res, next) {
    const token = req.headers.authorization
    if (!token) {
        res.send({message: "not auth"})
    } else {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                res.send({message: "not auth"})
            } else {
                user.findById(decoded.id)
                .then(userx => {
                    if (userx) {
                        req.user = userx;
                        next()
                    } else {
                        res.send({message: "not auth"})
                    }
                }) 
            }
            
        })
    }
}