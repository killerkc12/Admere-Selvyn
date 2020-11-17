const jwt = require('jsonwebtoken')
const { JWT_KEY } = require('../config/keys')
const mongoose = require('mongoose')
const Shopkeeper = mongoose.model("Shopkeeper")

module.exports=(req,res,next)=>{
    const {authorization} = req.headers
    if(!authorization){
        return res.status(422).json({error:"you must logged in first!"})
    }

    const token = authorization.replace("Auth ","")
    jwt.verify(token,JWT_KEY,(err,payload)=>{
        if(err){
            return res.status(422).json({error:"you must logged in first!"})
        }

        const {_id} = payload
        Shopkeeper.findById(_id)
        .then(Shopkeeper=>{
            req.shopkeeper = Shopkeeper
            next()
        })
        .catch(err=>{
            console.log(err)
        })
    })   
}