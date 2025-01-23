const express = require('express')
const User = require('../models/userModel')
const Comment = require('../models/commentsModel')
const {v4: uuidV4} = require('uuid')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const AuthunticationFunction = require('../middlewareFunctions/authentication')

const router = express.Router()

// Create User Account API

router.post('/create-account', async (req, res) => {
    try {
        const {email, password} = await req.body
        const user = await User.findOne({
            $and : [
                {email: email},
                {role: 'User'}
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
            res.json({msg: 'User Account Created'})
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
                {role: 'User'}
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

// Post new Comment API

router.post('/new-comment', AuthunticationFunction, async (req, res) => {
    try {
        const userId = await req.userId
        const {blogId, content} = await req.body
        const newComment = new Comment({
            comment_id: uuidV4(),
            user_id: userId,
            blog_id: blogId,
            content: content,
            created_at: new Date()
        })
        await newComment.save()
        res.status(200)
        res.json({msg: 'Comment Posted Successfully'})
    } catch (err){
        res.status(400)
        res.json({error_msg: "Didn't Post the COMMENT"})
    }
})

// Delete Comment API

router.delete('/delete-comment', AuthunticationFunction, async (req, res) => {
    try {
        const {commentId} = await req.body
        const userId = await req.userId
        const commentDetails = await Comment.findOne({comment_id: commentId})
        console.log(commentDetails)
        if(commentDetails.user_id !== userId || commentDetails == undefined){ 
            res.status(404)
            res.json({error_msg: 'Unauthorized'})
        } else {
            await Comment.deleteOne({comment_id: commentId})
            res.status(200)
            res.json({msg: 'Comment Succesfully Deleted'})
        }
    } catch (err){
        res.status(400)
        res.json({error_msg: "Didn't delete the comment"})
    }
})



module.exports = router