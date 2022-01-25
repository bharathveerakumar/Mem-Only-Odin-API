const express=require('express')
const userCon=require('../Controller/userCon')
const adminCon=require('../Controller/adminCon')


const app=express()


app.get('/', userCon.homeCon)
app.get('/home', userCon.nlHome)
app.post('/login', userCon.login)
app.post('/register', userCon.register)
app.post('/member', userCon.member)
app.get('/admin', adminCon.adminView)
app.post('/update', adminCon.adminUpdate)
app.post('/delete', adminCon.adminDelete)

module.exports=app