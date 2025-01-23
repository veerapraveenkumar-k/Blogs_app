const express = require('express')
const Blog = require('../models/blogsModel')
const {v4: uuidV4} = require('uuid')
const AuthunticationFunction = require('../middlewareFunctions/authentication')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const router = express.Router()

// Create Editor Account API

router.post('/create-account', async (req, res) => {
    try {
        const {email, password} = await req.body
        const user = await User.findOne({
            $and : [
                {email: email},
                {role: 'Editor'}
            ]
        })
        if(user == undefined){
            const hashedPassword = await bcrypt.hash(password, 10)
            const newUser = new User({
                user_id: uuidV4(),
                email: email,
                password: hashedPassword,
                role: 'Editor'
            })
            await newUser.save()
            res.status(200)
            res.json({msg: 'Editor Account Created'})
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
                {role: 'Editor'}
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

router.get('/editable-blogs', AuthunticationFunction, async(req, res) => {
    try {
        const userId = await req.userId
        const blogList = await Blog.find({blog_editor_id: userId})
        //console.log(blogList)
        if(blogList.length === 0){
            res.status(200)
            res.json({msg: 'There is No Blogs Assigned to you'})
        } else {
            res.status(200)
            res.json({blogS_list: blogList})
        }
    } catch (err){
        res.status(400)
        res.json({error_msg: "Didn't get the blogs"})
    }
})

module.exports = router