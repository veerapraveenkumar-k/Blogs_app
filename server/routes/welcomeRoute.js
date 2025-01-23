const express = require('express')
const router = express.Router()

router.get('/', async(req, res) => {
    res.json('Welcome to My API')
})

module.exports = router
