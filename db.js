const mongoose=require('mongoose')
require('dotenv').config()

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.uq0wg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)

mongoose.connection.on('error', (err)=>{
    console.log(err)
})