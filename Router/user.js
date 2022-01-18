const express=require('express')
const userCon=require('../Controller/userCon')


const app=express()


app.get('/', userCon.homeCon)
app.get('/home', userCon.nlHome)
app.post('/login', userCon.login)
app.post('/register', userCon.register)

module.exports=app