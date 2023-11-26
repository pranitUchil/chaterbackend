const express = require('express');
const router  = express.Router();
const Message = require('../model/messageSchem');
const auth    = require('../middleware/auth');
const User = require('../model/userSchem');
const BASE_URL = process.env.BASE_URL;

router.post(`/api/messages`,auth, async(req,res)=>{
    try {
        let userId = req.user.user._id;
        req.body.from = userId
        let user = await User.findOne({_id:userId})
        req.body.fullname =  user.fullname;
        req.body.profilepic =  user.profilepic;
        const message = new Message(req.body);
        const saveMessage = await message.save();
        res.status(200).send(saveMessage)
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/api/messages/:id',auth, async(req,res)=>{
    try {
        req.body.from = req.user.user._id;
        const messages = await Message.find({$or:[{to: req.params.id,from:req.body.from},{to:req.body.from ,from:req.params.id}]});
        res.status(200).send(messages);
    } catch (error) {
        res.status(500).send(error);  
    }
});

router.delete('/api/messages/:id',auth, async(req,res)=>{
    try {
        console.log('this is is ')
        await Message.deleteOne({_id:req.params.id});
        res.status(200).send({message:"Message deleted"});
    } catch (error) {
        res.status(500).send(error);  
    }
});

module.exports = router;