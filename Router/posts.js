const postCont=require('../Controller/postCon')

const express=require('express')
const app=express()

app.post('/post', postCont.postMess)

module.exports=app