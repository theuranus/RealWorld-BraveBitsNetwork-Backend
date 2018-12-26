const mongoose = require("mongoose")
const Schema = mongoose.Schema

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  favoritePerson: [{
    type: Schema.Types.ObjectId,
    ref: 'user'
  }],
  describe: String,
  date: Date,
  title: String,
  content: String,
  tagList: [{ type: String }],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
      },
      content: String,
      date: Date
    }
  ]
});

PostSchema.methods.doLikeOrUnlike = function(user) {
  const index = this.favoritePerson.indexOf(user._id)
  if (index === -1) {
    this.favoritePerson.push(user._id)
  } else {
    this.favoritePerson.remove(user._id)
  }
  this.save()
}

PostSchema.methods.addComment = function(newComment) {
  this.comments.unshift(newComment)
  this.save()
}

const post = mongoose.model("post", PostSchema)

module.exports = post
