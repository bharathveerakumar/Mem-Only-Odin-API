const passport=require("passport")
const jwt=require('jsonwebtoken')
const { body, validationResult }=require('express-validator')


const userMod=require('../model/user')
const postMod=require('../model/messages')


//getting content for home page according to the user roles...
let homeCon=[
    passport.authenticate('jwt', {session:false, failureRedirect:'/home'}),
    
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
                $project:{ _id:0, user_info:{ _id:0, username:0, password:0, logo:0, status:0 } }
            },
            {
                $sort:{ date:1 }
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

    (req, res)=>{
        const errors=validationResult(req);

        if(!errors.isEmpty()){
            return res.json({error:errors.array()})
        }

        userMod.insertMany([
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
        const token=jwt.sign({ user:req.user }, 'SECRET_KEY')
        res.json({ "token": token })
    }
]


//For Membership Update
let member=[
    passport.authenticate('jwt', { session:false, failureRedirect:'/home' }),

    async (req, res)=>{
        if(req.body.member=='member'){
            await userMod.updateOne({username:req.user.user[0].username}, { $set:{ status:"MEMBER" } })
            await userMod.find({username:req.user.user[0].username}, { __v:0, date:0 }, (err, cb)=>{
                const token=jwt.sign({user:cb}, 'SECRET_KEY'); 
                res.headers('Set-Cookie', `token=${token}`)
                res.cookie('tokenn', token, { maxAge:900000, httpOnly:false })
                res.json({"error":"success", "user":cb})
            })
        }
        else res.json({"error":"failed", "user":req.user})  
    }
]


module.exports = { homeCon, register, login, nlHome, member }