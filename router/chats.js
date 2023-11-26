const express = require('express')  
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../model/userSchem');
const BASE_URL = process.env.BASE_URL;

router.get(BASE_URL+"/api/chats",auth,async(req,res)=>{
    try {
        let user = await User.findOne({_id:req.user.user._id});
        res.send(user.friends)
        // console.log(req.user.user.friends.length , chats.length)
    } catch (error) {
        res.status(500).send(error)
    }
});

module.exports = router