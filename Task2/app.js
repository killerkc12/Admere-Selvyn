const express = require('express')
const app = express()
const mongoose = require('mongoose')
const { MONGOURI } = require('./config/keys')
const PORT = 5000

mongoose.connect(MONGOURI,{
})

mongoose.connection.on("connected",()=>{
    console.log("MongoDB Started!")
})

require('./models/user')
require('./models/shopkeeper')
require('./models/item')

app.use(express.json())

app.use(require('./routers/user'))
app.use(require('./routers/shopkeeper'))
app.use(require('./routers/item'))

app.listen(PORT,()=>{
    console.log("Server is Running On ",PORT)
})