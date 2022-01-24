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
                    nickname:1,
                    posts:{
                        title:1, body:1, _id:1, data:1
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
        await postMod.findOneAndUpdate({_id:'61ed39aeb4f2940e813b45db'}, { $set:{ body:req.body.body } })
        .catch((e)=>{
            res.json({"success":false}); res.end();
        })
        res.json({"success":true})
    }
]


//For authorizing Whether the User is an ADMIN or not...
function authorization(req, res, next){
    console.log(req.user)
    if(req.user.status==='IN') next();
    else res.json({"error":"failed"})
}


module.exports={ adminView, adminUpdate }