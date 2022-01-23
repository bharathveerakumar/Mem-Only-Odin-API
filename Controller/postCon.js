const passport=require('passport')
const msgMod=require('../model/messages')

const postMess=[
    passport.authenticate('jwt', {session:false, failureRedirect:'/home'}),
    async (req, res)=>{
        await msgMod.insertMany([{
            title:req.body.title,
            body:req.body.body,
            user_id:req.user.user[0]._id
        }])
        res.json({"error":"success"})
    }
]

module.exports={ postMess }