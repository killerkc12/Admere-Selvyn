const mongoose = require('mongoose')

const shopkeeperSchema = new mongoose.Schema({
    shopname:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

mongoose.model("Shopkeeper",shopkeeperSchema)