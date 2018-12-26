var configValue = require('./config');

module.exports = {
    getDbConnectionString: function() {
        return `mongodb://${configValue.username}:${configValue.password}@ds133762.mlab.com:33762/realworldapp`
    }, 
    secret: "bravebits"
}