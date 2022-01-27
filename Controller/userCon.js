const passport=require("passport")
const jwt=require('jsonwebtoken')
const { body, validationResult }=require('express-validator')

require('dotenv').config()
const userMod=require('../model/user')
const postMod=require('../model/messages')


//getting content for home page according to the user roles...
let homeCon=[
    passport.authenticate('withUser', {session:false, failureRedirect:'/home'}),
    
    async (req, res)=>{
        await postMod.aggregate([
            {
                $lookup:{
                    from:"users",
                    localField:"user_id",
                    foreignField:"_id",
                    as:"user_info"
                }
            },
            {
                $project:{ _id:0, user_info:{ _id:0, username:0, password:0, status:0 } }
            },
            {
                $sort:{ date:-1 }
            }
        ]).then((result)=>{
            res.json({ "result":result, "user":req.user })
        })
    }
]


//When user is not logged in...
let nlHome= async (req, res)=>{
    await postMod.find({}, { user_id:0, _id:0 }).then((result)=>{
        res.json({"result":result, "user":"not"})
    })
}


//For registration...
let register=[
    async (req, res, next)=>{
        await userMod.find({username:req.body.username}).then((result)=>{
            if(result.length) res.json({"error":[{"msg":'Username Already Exists!!!'}]})
            else next();
        })
    },

    body('password').isLength({min:8}).withMessage('Password length should be minimum 8'), 

    body('cpassword').custom((value, {req, res})=>{
        
        if(req.body.password!=value) return false;
        else return true;

    }).withMessage('Password should Match'),

    async (req, res)=>{
        const errors=validationResult(req);

        if(!errors.isEmpty()){
            return res.json({error:errors.array()})
        }

        await userMod.insertMany([
            {
                username:req.body.username,
                password:req.body.password,
                nickname:req.body.nickname,
                logo:req.body.logo,
            }
        ]);
        res.json({"error":"success"})
    }
]


//For login and sending JWT token
let login=[
    passport.authenticate('local', {session:false}), 

    (req, res)=>{
        const token=jwt.sign({ user:req.user[0]._id }, `${process.env.TOKEN_SECRET}`)
        res.json({ "token": token })
    }
]


//For Membership Update
let member=[
    passport.authenticate('withUser', { session:false, failureRedirect:'/home' }),
    
    memberShipCheck,

    async (req, res)=>{
        if(req.body.member=='MEMBER'){
            await userMod.findOneAndUpdate({_id:req.user._id}, { $set:{ status:"MEMBER" } })
            .then((res1)=>{
                res1.status="MEMBER";
                res.json({"error":true, "user":res1})
            })
        }
        else res.json({"error":false, "user":req.user})  
    }
]


let admin=[
    passport.authenticate('withUser', { session:false, failureRedirect:'/home' }),
    
    adminShipCheck,

    async (req, res)=>{
        if(req.body.admin=='ADMIN'){
            await userMod.findOneAndUpdate({_id:req.user._id}, { $set:{ status:"ADMIN" } })
            .then((res1)=>{
                res1.status="ADMIN";
                res.json({"error":true, "user":res1})
            })
        }
        else res.json({"error":false, "user":req.user})
    }
]


function adminShipCheck(req, res, next){
    if(req.user.status=='ADMIN'){
        res.json({"error":"You're already an admin"}).end();
    }
    else next();
}

function memberShipCheck(req, res, next){
    if(req.user.status=='MEMBER'){
        res.json({"error":"You're already an Member"}).end();
    }
    else next();
}


module.exports = { homeCon, register, login, nlHome, member, admin }