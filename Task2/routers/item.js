const express = require('express')
const Auth = require('../middleware/AuthShopkeeper')
const router = express.Router()
const mongoose = require('mongoose')
const Item = mongoose.model("Item")

router.post('/item/add',Auth,(req,res)=>{
    const {title,description,price} = req.body
    if(!title || !description || !price){
        return res.status(422).json({error:"All Fields are Mandatory!"})
    }

    req.shopkeeper.password = undefined
    const item = new Item({title,description,price,createdBy:req.shopkeeper})
    item.save()
    .then(item=>{
        res.json(item)
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/item/list',(req,res)=>{
    Item.find()
    .then(items=>{
        res.json(items)
    })
    .catch(err=>{
        console.log(err)
    })
})

module.exports = router