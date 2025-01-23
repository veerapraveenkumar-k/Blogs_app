const express = require('express')
const bodyParser = require('body-parser')
const db = require('./config/db.js')
const userRouter = require('./routes/userRouter.js')
const otpRouter = require('./routes/otpRoute.js')
const adminRoute = require('./routes/adminRoute.js')
const editorRoute = require('./routes/editorRoute.js')
const welcomeRoute = require('./routes/welcomeRoute.js')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT

//Middleware Functions

app.use(express.json())
app.use(bodyParser.json())

app.use('/api/users', userRouter)
app.use('/api', otpRouter)
app.use('/api/admin', adminRoute)
app.use('/api/editor', editorRoute)
app.use(welcomeRoute)

const initializationFunction = async () => {
    try {
        await db()
        app.listen(PORT, () => {
            console.log("Server is Running In PORT: ", PORT)
        })
    } catch (err){
        console.log("Initialization Error: ", err.message)
    }
}


initializationFunction()