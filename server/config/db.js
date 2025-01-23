const mongoose = require('mongoose')
require('dotenv').config()


const dbConnection = async () => {
    try {
        const uri = process.env.MONGO_CONNECTION_STRING
        await mongoose.connect(uri)
        console.log('DB Connected Successfully')
    } catch (err){
        console.log('DB Connection Error: ', err.message)
    }
}

module.exports = dbConnection