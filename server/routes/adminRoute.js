const express = require('express')
const Blog = require('../models/blogsModel')
const {v4: uuidV4} = require('uuid')
const AuthunticationFunction = require('../middlewareFunctions/authentication')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const router = express.Router()

// Create Admin Account API

router.post('/create-account', async (req, res) => {
    try {
        const {email, password} = await req.body
        const user = await User.findOne({
            $and : [
                {email: email},
                {role: 'Admin'}
            ]
        })
        if(user == undefined){
            const hashedPassword = await bcrypt.hash(password, 10)
            const newUser = new User({
                user_id: uuidV4(),
                email: email,
                password: hashedPassword,
                role: 'Admin'
            })
            await newUser.save()
            res.status(200)
            res.json({msg: 'Admin Account Created'})
        }
        else {
            res.status(400)
            res.json({error_msg: 'This Email Already Used'})
        }
    } catch (err){
        res.json({err_msg: err.message})
    }
})

//Login API

router.post('/login', async (req, res) => {
    try {
        const {email, password} = await req.body
        const user = await User.findOne({
            $and : [
                {email: email},
                {role: 'Admin'}
            ]
        })
        if(user == undefined){
            res.status(404)
            res.json({error_msg: "This email doesn't exists"})
        }
        else {
            //console.log(user)
            const isPassCorrect = await bcrypt.compare(password, user.password)
            if(isPassCorrect){
                const payLoad = {
                    userId: user.user_id,
                    role: user.role
                }
                const jwtToken = jwt.sign(payLoad, process.env.JWT_SECRECT_TOKEN)
                res.status(200)
                res.json({jwt_token: jwtToken})
            }
            else {
                res.status(400)
                res.json({error_msg: "Email and Password doesn't start"})
            }
        }
    } catch (err){
        res.status(400)
        res.json({error_msg: 'Login Error'})
    }
})

// Create Blog API

router.post('/create-blog', AuthunticationFunction, async (req, res) => {
    try{
        const {title, content} = await req.body
        const userId = await req.userId
        const user = await User.findOne({user_id: userId})
        if(user.role === 'Admin'){
            const newBlog = new Blog({ 
                blog_id: uuidV4(),
                title: title,
                content: content
            })
            await newBlog.save()
            res.status(200)
            res.json({msg: 'New Blog Successfully Created'})
        } else {
            res.status(404)
            res.json({error_msg: 'Unauthorized'})
        }
    } catch(err){
        res.status(400)
        res.json({error_msg: 'Cannot Create Blog'})
    }
})

// Delete Blog API

router.delete('/delete-blog', AuthunticationFunction, async (req, res) => {
    try{
        const {blogId} = await req.body
        const userId = await req.userId
        const user = await User.findOne({user_id: userId})
        if(user.role === 'Admin'){
            const result = await Blog.deleteOne({blog_id: blogId})
            if(result.deletedCount == 0){
                res.status(400)
                res.json({error_msg: 'Invalid BlogId'})
            }
            else {
                res.status(200)
                res.json({msg: 'Blog Successfully Deleted'})
            }
        } else {
            res.status(404)
            res.json({error_msg: 'Unauthorized'})
        }
    } catch(err){
        res.status(400)
        res.json({error_msg: 'Cannot Delete Blog'})
    }
})

// Edit Blog API

router.put('/edit-blog', AuthunticationFunction, async (req, res) => {
    try{
        const {blogId, title, content} = await req.body
        const userId = await req.userId
        const user = await User.findOne({user_id: userId})
        if(user.role === 'Admin'){
            const blog = await Blog.findOne({blog_id: blogId})
            if(blog == undefined){
                res.status(400)
                res.json({error_msg: 'Invalid BlogId'})
            } else {
                const result = await Blog.updateOne({blog_id: blogId}, {
                    $set: {
                       title: title || blog.title,
                       content: content || blog.content
                    }
                })
                res.status(200)
                res.json({msg: 'Blog Successfully Updated'})
            }
        } else {
            res.status(404)
            res.json({error_msg: 'Unauthorized'})
        }
    } catch(err){
        res.status(400)
        res.json({error_msg: 'Cannot Update Blog'})
    }
})

// Assign Editor API

router.put('/assign-editor', AuthunticationFunction, async (req, res) => {
    try {
        const {edditorId, blogId} = await req.body
        const userId = await req.userId
        const user = await User.findOne({user_id: userId})
        if(user.role === 'Admin'){
            const blog = await Blog.findOne({blog_id: blogId})
            if(blog == undefined){
                res.status(400)
                res.json({error_msg: 'Invalid BlogId'})
            } else {
                const result = await Blog.updateOne({blog_id: blogId}, {
                    $set: {
                        blog_editor_id: edditorId
                    }
                })
                res.status(200)
                res.json({msg: 'Editor Successfully Assigned'})
            }
        } else {
            res.status(404)
            res.json({error_msg: 'Unauthorized'})
        }
    } catch (err){
        res.status(400)
        res.json({error_msg: 'Cannot Assign Editor'})
    }
})

// Get All blogs API 

router.get('/get-all-blogs', AuthunticationFunction, async (req, res) => {
    try {
        const blogsList = await Blog.find()
        res.status(200)
        res.json({blogs_list: blogsList})
    } catch (err){
        res.status(400)
        res.json({error_msg: 'Cannot Get the Blogs Details'})
    }
})



module.exports = router