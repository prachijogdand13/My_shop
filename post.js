const route = require('express').Router()

const { post } = require('./route')
const verify = require("./verifytoken")

route.get('/', verify,(req , res)=>{
    res.json({
        post:{
            title:"JWT token",
            description:"this is our first token"
        }
    })
})

module.exports = route;