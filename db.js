const mongoose=require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/Mem-Only')

mongoose.connection.on('error', (err)=>{
    console.log(err)
})