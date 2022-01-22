const mongoose=require('mongoose')
const {Schema}=require('mongoose')

const Messages=new Schema({
    title:String,
    body:String,
    date:{
        type:Date, 
        default:Date.now
    }
})

module.exports=mongoose.model('Messages', Messages)