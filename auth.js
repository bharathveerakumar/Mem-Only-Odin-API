const passport=require('passport')
const localPass=require('passport-local').Strategy
const jwtStart=require('passport-jwt').Strategy
const users=require('./model/user');

require('dotenv').config()

passport.use(new localPass(async (username, password, done)=>{ 
    let user=[];
    await users.find({username:username}, { date:0, _v:0 }).then((data)=>{
        if(data.length){
            if(data[0].username==username&&data[0].password==password) user=data;
        }
    })
    if(user.length) return done(null, user)
    else return done(null, false)
}))


passport.use('withoutUser', new jwtStart({
        jwtFromRequest:tokene,
        secretOrKey:`${process.env.TOKEN_SECRET}`
    }, async (payload, done)=>{
        return done(null, payload);
    }
))

passport.use('withUser', new jwtStart({
    jwtFromRequest:tokene,
    secretOrKey:`${process.env.TOKEN_SECRET}`
}, async (payload, done)=>{
    let user;
    await users.findOne({_id:payload.user}).then((result)=>{
        user=result;
    })
    return done(null, user)
}))


function tokene(req, res){
    return req.headers.authorization;
}