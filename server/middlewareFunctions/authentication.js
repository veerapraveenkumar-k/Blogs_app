const jwt = require('jsonwebtoken')
require('dotenv').config()

const authunticationFunction = async (req, res, next) => {
    const authHeader = await req.headers['authorization']
    let jwtToken;
    if(authHeader !== undefined){
        jwtToken = authHeader.split(' ')[1]
        //console.log(jwtToken)
    }
    if(jwtToken == undefined){
        res.status(404)
        res.json({error_msg: 'Unauthorized'})
    }
    else {
        jwt.verify(jwtToken, process.env.JWT_SECRECT_TOKEN, (err, payLoad) => {
            if(err){
                res.status(400)
                res.json({error_msg: 'Invalid Token'})
            } else {
                req.userId = payLoad.userId
                next()
            }
        })
    }
}

module.exports = authunticationFunction