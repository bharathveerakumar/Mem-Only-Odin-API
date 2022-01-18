const passport=require('passport')
const localPass=require('passport-local').Strategy
const jwtStart=require('passport-jwt').Strategy
const users=require('./model/user');


passport.use(new localPass(async (username, password, done)=>{ 

    let user=[];
    await users.find({username:username}, { _id:0, date:0, _v:0 }).then((data)=>{
        if(data.length){
            if(data[0].username==username&&data[0].password==password) user=data;
        }
    })
    if(user.length) return done(null, user)
    else return done(null, false)
}))


passport.use(new jwtStart({
        jwtFromRequest:tokene,
        secretOrKey:'SECRET_KEY'
    }, async (payload, done)=>{
        return done(null, payload);
    }
))


function tokene(req, res){
    return req.headers.authorization;
}