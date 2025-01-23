const mongoose = require('mongoose')


const blogsSchema = new mongoose.Schema({
    blog_id: {type: String, required: true},
    title: {type: String, required: true},
    content: {type: String, required: true},
    blog_editor_id: {type: String}
})

const Blog = new mongoose.model('Blog', blogsSchema, 'blogs')


module.exports = Blog