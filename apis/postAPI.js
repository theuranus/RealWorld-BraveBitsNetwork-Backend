const authenticate = require('../auth/authenticate')
const post = require('../model/postModel')

module.exports = function(app) {

    app.get('/globalpost', (req, res) => {
        post.find({})
            .populate("user")
            .sort({date: "DESC"})
            .then((posts) => {
                res.send(posts)
            })
    })

    app.get('/tags', (req, res) => {
        post.find({})
            .distinct('tagList')
            .then((tags) => {
                res.send(tags)
            })
    })

    app.post('/myFeed', authenticate, (req, res) => {
        post.find({ user: { $in: req.user.followList }})
        .populate('user')
        .sort({date: "DESC"})
        .then(posts => {
            res.send(posts)
        })
    })

    app.get('/getPostTag/:tagName', (req, res) => {
        const tagName = req.params.tagName
        post.find({ tagList: {$in : tagName} })
            .populate('user')
            .sort({date: "DESC"})
            .then(posts => {
                res.send(posts)
            })
    })

    app.post('/doLikePost', authenticate, (req, res) => {
        post.findById(req.body.postId)
        .populate('user')
        .populate('comments.user')
        .then(post => {
            post.doLikeOrUnlike(req.user)
            return post
        })
        .then(post => res.send(post))
    })

    app.post('/addNewComment', authenticate, (req, res) => {
        const newComment = {
            user: req.user._id,
            content: req.body.content,
            date: new Date()
        }
        post.findById(req.body.postId)
        .then(postx => {
            postx.addComment(newComment)
            return postx
        })
        .then(postx => res.send(postx))
    })

    app.get('/post/:id', (req, res) => {
        post.findById(req.params.id)
        .populate('user')
        .populate('comments.user')
        .then(postx => {
            res.send(postx)
        })
    })

    app.post('/addNewPost', authenticate, (req, res) => {
        const newPost = {
            favoritePerson: [],
            tagList: req.body.tagList,
            user: req.user._id,
            describe: req.body.description,
            date: new Date(),
            title: req.body.title,
            content: req.body.content,
            comments: []
        }
        post.create(newPost, (err, postx) => {
            if (err) {
                res.send({message: "Something wrong"})
            } else {
                res.send(postx)
            }
        })
        
    })

    app.post('/editPost', authenticate, (req, res) => {
        const editedArticle = req.body
        post.findByIdAndUpdate(editedArticle._id, { $set: editedArticle}, (err, updatedArticle) => {
            if (err) {
                res.send({message: 'something wrong here'})
            } else {
                res.send(updatedArticle)
            }
        })
    })

    app.post('/deletePost', authenticate, (req, res) => {
        post.findOneAndDelete({_id: req.body.postId}, (err) => {
            if (err) {
                res.send({message: 'something wrong here'})
            } else {
                res.send({status: 200})
            }
        })
    })

    app.post('/deleteComment', authenticate, (req, res) => {
        post.findById(req.body.postId)
        .populate('user')
        .populate('comments.user')
        .then(postx => {
            let removeIndex = postx.comments
                                .map(cmt => cmt._id.toString())
                                .indexOf(req.body.commentId)
            postx.comments.splice(removeIndex, 1);
            return postx.save()
        })
        .then(postx => res.send(postx))
    })

    app.get('/articles/:uid', (req, res) => {
        post.find({user: req.params.uid})
        .populate('user')
        .then(posts => {
            res.send(posts)
        })
    })

    app.get('/favorited/:uid', (req, res) => {
        post.find({favoritePerson: { $in: req.params.uid }})
        .populate('user')
        .then(posts => {
            res.send(posts)
        })
    })
}