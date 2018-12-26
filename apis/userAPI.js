const user = require('../model/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const secret = require('../config/index').secret
const authenticate = require('../auth/authenticate')

module.exports = function(app) {

    app.post('/login', (req, res) => {
        const username = req.body.username
        const password = req.body.password
        user.findOne({username: username}, (err, user) => {
            if (err) throw err
            if(!user) {
                res.send({message: "Username not match"})
            } else {
                const isMatchedPWD = bcrypt.compareSync(password, user.password)
                if(!isMatchedPWD) {
                    res.send({message: "Password not match"})
                } else {
                    const token = jwt.sign({ id: user._id}, secret, { expiresIn: 24*60*60 })
                    res.send({token: token, user: user})
                }
            }
        })
    })

    app.post('/register', (req, res) => {
        user.findOne({username: req.body.username}, (err, userx) => {
            if(err) throw err
            if(userx) {
                res.send({message: "Username existed"})
            } else {
                const hashPWD = bcrypt.hashSync(req.body.password, 8)
                user.create({
                    username: req.body.username,
                    displayName: req.body.displayName,
                    password: hashPWD,
                    about: req.body.about,
                    imgURL: "data:image/png;base64,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",
                    favoriteList: [],
                    followList: []
                }, (err, data) => {
                    if (err) {
                        res.send({message: "Something wrong. Please try again"})
                    }
                    const token = jwt.sign({id: data._id}, secret, {expiresIn: 60*24*60})
                    res.send({token: token, user: data})
                })
            }
        })
        
    })

    app.post("/api/user/me", (req, res) => {
        const token = req.headers.authorization;
        const data = jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                res.send({ message: 'not auth' })
            }
            user.findById(decoded.id, (err, userx) => {
                if (err) {
                    res.send({ message: 'not auth' })
                }
                res.send(userx)
            })
        })
        
    })

    app.post('/doFollowUser', authenticate, (req, res) => {
        user.findById(req.user._id)
        .then(userx => {
            userx.doFollowUser(req.body.userIdFollowing)
            return userx
        })
        .then(userx => res.send(userx))       
    })

    app.post('/doUpdateUser', authenticate, (req, res) => {
        const updateUser = req.body
        if (updateUser.password) {
            updateUser.password = bcrypt.hashSync(updateUser.password, 8)
        }
        user.findByIdAndUpdate(updateUser._id, { $set: updateUser}, (err) => {
            if (err) {
                res.send({message: 'something wrong here'})
            } else {
                user.findById(req.body._id, (error, userx) => {
                    if(error) {
                        res.send({message: 'something wrong here'})
                    } else {
                        res.send(userx)
                    }
                })
            }
        })
    })

    app.get('/profile/:uid', (req, res) => {
        user.findById(req.params.uid)
        .then(userx => {
            res.send(userx)
        })
    })
}