const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: String,
    displayName: String,
    password: String,
    about: String,
    imgURL: String,
    favoriteList: [
        {
            type: Schema.Types.ObjectId,
            ref: 'post'
        }
    ],
    followList: [
        {
            type: Schema.Types.ObjectId,
            ref: 'user'
        }
    ]
})

UserSchema.methods.doFollowUser = function(userIdFollowing) {
    const index = this.followList.indexOf(userIdFollowing)
    if (index === -1) {
        this.followList.push(userIdFollowing)
    } else {
        this.followList.remove(userIdFollowing)
    }
    this.save()
}

const user = mongoose.model('user', UserSchema)

module.exports = user