const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_KEY } = require('../config/keys')

router.post('/user/login',(req,res)=>{
    const {username,password} = req.body
    if(!username || !password){
        return res.status(422).json({error:"All Fields are Mandatory!"})
    }
    User.findOne({username:username})
    .then((CurrentUser)=>{
        if(!CurrentUser){
            return res.status(422).json({error:"Username or Password is Invalid!"})
        }

        bcrypt.compare(password,CurrentUser.password)
        .then(PassMatch=>{
            if(!PassMatch){
                return res.status(422).json({error:'Username or Password in Invalid!'})
            }
            const token = jwt.sign({_id:CurrentUser._id},JWT_KEY)
            const {_id,username,mobile,email,address} = CurrentUser
            res.json({token,user:{_id,username,mobile,email,address}})
        })
    })
})

router.post('/user/register',(req,res)=>{
    const {username,mobile,email,address,password} = req.body
    if(!username || !mobile || !email || !address || !password){
        return res.status(422).json({error:'All Fields are Mandatory!'})
    }
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
        return res.status(422).json({error:"Email Invalid"})
    }

    User.findOne({username:username})
    .then((UserExist)=>{
        if(UserExist){
            return res.status(422).json({error:"User is Already Exist!"})
        }else{

            bcrypt.hash(password,12)
            .then(hashedPassword=>{

                const user = new User({username,mobile,email,address,password:hashedPassword})
                user.save()
                .then(user=>{
                    res.json(user)
                })
                .catch(err=>{
                    console.log(err)
                })
            })
            .catch(err=>{
                console.log(err)
            })
        }
    })
    .catch(err=>{
        console.log(err)
    })
})

module.exports = router