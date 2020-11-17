const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const itemSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    createdBy:{
        type:ObjectId,
        ref:"Shopkeeper"
    }
})

mongoose.model("Item",itemSchema)