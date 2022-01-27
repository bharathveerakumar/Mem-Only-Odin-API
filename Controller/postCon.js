const passport=require('passport')
const msgMod=require('../model/messages')

const postMess=[
    passport.authenticate('withoutUser', {session:false, failureRedirect:'/home'}),
    async (req, res)=>{
        await msgMod.insertMany([{
            title:req.body.title,
            body:req.body.body,
            user_id:req.user.user
        }]).then((re)=>console.log(re))
        res.json({"error":"success"})
    }
]

module.exports={ postMess }