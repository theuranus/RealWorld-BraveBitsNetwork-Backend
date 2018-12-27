const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.port || 3005
const config = require('./config/index')

const userAPI = require('./apis/userAPI')
const postAPI = require('./apis/postAPI')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true}))
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    res.header("Access-Control-Allow-Methods", "*")
    next()
})

mongoose.connect(config.getDbConnectionString(), { useNewUrlParser: true }, () => {console.log('mongo is ready')})

userAPI(app);
postAPI(app);

app.listen(port, () => {console.log('server is ready')})

