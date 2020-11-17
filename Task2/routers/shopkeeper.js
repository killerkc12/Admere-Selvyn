const router = require("./user");
const { route } = require("./user");
const mongoose = require('mongoose')
const Shopkeeper = mongoose.model("Shopkeeper")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { JWT_KEY } = require("../config/keys");

router.post('/vendor/login',(req,res)=>{
    const {mobile,password} = req.body
    if(!mobile || !password){
        return res.status(422).json({error:"All Fields are Mandatory!"})
    }

    Shopkeeper.findOne({mobile:mobile})
    .then(CurrentShopkeeper=>{
        if(!CurrentShopkeeper){
            return res.status(422).json({error:"Mobile Number or Password is Invalid!"})
        }

        bcrypt.compare(password,CurrentShopkeeper.password)
        .then(passMatch=>{
            if(!passMatch){
                return res.status(422).json({error:"Mobile Number or Password is Invalid!"})
            }

            const token = jwt.sign({_id:CurrentShopkeeper._id},JWT_KEY)
            const {_id,shopname,mobile,email,address} = CurrentShopkeeper
            res.json({token,shopkeeper:{_id,shopname,mobile,email,address}})
        })
    })
})

router.post('/vendor/register',(req,res)=>{
    const {shopname,mobile,email,address,password} = req.body
    if(!shopname || !mobile || !email || !address || !password){
        return res.status(422).json({error:"All Fields are Mandatory!"})
    }
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
        return res.status(422).json({error:"Email Invalid"})
    }

    Shopkeeper.findOne({mobile:mobile})
    .then(CurrentShopkeeper=>{
        if(CurrentShopkeeper){
            return res.status(422).json({error:"Shopkeeper is Already Exist"})
        }

        bcrypt.hash(password,12)
        .then(hashedPassword=>{

            const shopkeeper = new Shopkeeper({shopname,mobile,email,address,password:hashedPassword})

            shopkeeper.save()
            .then(shopkeeper=>{
                res.json(shopkeeper)
            })
            .catch(err=>{
                console.log(err)
            })
        })
        .catch(err=>{
            console.log(err)
        })
    })
    .catch(err=>{
        console.log(err)
    })
})


module.exports = router