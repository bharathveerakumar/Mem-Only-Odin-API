const mongoose=require('mongoose')
const {Schema}=require('mongoose')


const User=new Schema({
    username:String,
    nickname:String,
    password:String,
    logo:Number,
    status:{
        type:String,
        default:"IN"
    },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model('User', User)