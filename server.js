//Libraries
const express=require('express')
const multer=require('multer')
const session=require('express-session')
const passport=require('passport')
const cors=require('cors')
const bodyParser=require('body-parser')
const app=express();


//Own Module
require('./auth');
require('./db')
const userRoute=require('./Router/user')
const postRoute=require('./Router/posts')


// Porting
app.listen(5000, ()=>{
    console.log('Listening');
})


//Middlewares
app.use(session({
    secret:'bharath',
    saveUninitialized:true,
    resave:true,
    cookie:{
        maxAge:20000
    }
}))
app.use(passport.initialize());
app.use(multer().single('images'))
app.use(cors({
    origin:'http://127.0.0.1:5500'
}))
app.use(bodyParser.json())


//Routing
app.use(postRoute)
app.use(userRoute)