const mongoose = require('mongoose')


const commentsSchema = new mongoose.Schema({
    comment_id: {type: String, required: true},
    blog_id: {type: String, required: true},
    user_id: {type: String, required: true},
    content: {type: String, required: true},
    created_at: {type: Date, required: true}
})

const Comment = new mongoose.model('Comment', commentsSchema, 'comments')


module.exports = Comment