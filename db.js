const mongoose=require('mongoose')

mongoose.connect('mongodb://localhost:27017/Mem-Only')

mongoose.connection.on('error', (err)=>{
    console.log(err)
})