const passport=require('passport')
const userMod=require('../model/user')
const postMod=require('../model/messages')
const url=require('url')


const adminView=[
    passport.authenticate('withUser', { session:false, failureRedirect:'/home' }),
    
    authorization,

    async (req, res)=>{
        await userMod.aggregate([
            {
                $lookup:{
                    from: 'messages',
                    localField:'_id',
                    foreignField:'user_id',
                    as:'posts'
                }
            },
            {
                $project:{
                    // _id:0,
                    nickname:1,
                    posts:{
                        _id:1, title:1, body:1, date:1
                    }
                }
            }
        ]).then((result)=>{
            res.json({ "result":result, "user":req.user })
        })
    }
]


const adminUpdate=[
    passport.authenticate('withoutUser', { session:false, failureRedirect:'/home' }),
    async (req, res)=>{
        await postMod.findOneAndUpdate({_id:req.body._id}, { $set:{ title:req.body.title, body:req.body.body } })
        .catch((e)=>{
            res.json({"success":false}); res.end();
        })
        res.json({"success":true})
    }
]

const adminDelete=[
    passport.authenticate('withoutUser', { session:false, failureRedirect:'/home' }),
    async (req, res)=>{
        await postMod.deleteOne({_id:req.body._id})
        .catch((e)=>res.status(404))
        res.json({"success":true})
    }
]

//For authorizing Whether the User is an ADMIN or not...
function authorization(req, res, next){
    if(req.user.status==='IN') next();
    else res.json({"error":"failed"})
}


module.exports={ adminView, adminUpdate, adminDelete }