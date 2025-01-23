const express = require('express')
const nodemailer = require("nodemailer");
const Verification  = require('../models/verificationModel');
const { route } = require('./userRouter');
require("dotenv").config();

const router = express.Router()

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
})

router.post("/send-verification-email", async (req, res) => {
    const { email } = await req.body;
    if (!email) return res.status(400).send("Email is required");
    console.log(email)
    // Create a OTP
    const otp = Math.ceil(Math.random() * 8000 + 1000)
    console.log(otp)
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Email Verification",
        text: `Your OTP Is ${otp}`
    }
    
    transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
        res.status(500)
        res.json({error_msg: error.message})
    } else {
        const newOtp = new Verification({
            email: email,
            otp: otp
        })
            await newOtp.save()
            res.status(200).send("OTP sent successfully");
        }
    });
})
    
router.post("/verify-email", async (req, res) => {
    const {email, otp} = await req.body
    if (!otp) return res.status(400).send("OTP is missing");
    try {
        const isOtpCorrect = await Verification.findOne({
            $and: [
                {email: email},
                {otp: otp}
            ]
        })
        if(isOtpCorrect == undefined){
            res.status(200)
            res.json({error_msg: "Invalid OTP"})
        }
        else {
            await Verification.deleteOne({email: email})
            res.status(200)
            res.json({msg: 'OTP Verified'})
        }
    }catch (err) {
        res.status(400)
        res.json({error_msg: "Can't Verify OTP"})
    }
})

module.exports = router
    