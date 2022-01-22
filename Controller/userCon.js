const passport=require("passport")
const jwt=require('jsonwebtoken')
const { body, validationResult }=require('express-validator')


const userMod=require('../model/user')
const postMod=require('../model/messages')


let homeCon=[
    passport.authenticate('jwt', {session:false, failureRedirect:'/home'}),
    
    async (req, res)=>{
        await postMod.aggregate([
            {
                $lookup:{
                    from:"users",
                    localField:"_id",
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

let nlHome= async (req, res)=>{
    await postMod.find({}, { user_id:0, _id:0 }).then((result)=>{
        res.json({"result":result, "user":"not"})
    })
}

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


let login=[
    passport.authenticate('local', {session:false}), 

    (req, res)=>{
        res.json({ "token":jwt.sign({ user:req.user }, 'SECRET_KEY') })
    }
]

module.exports = { homeCon, register, login, nlHome }