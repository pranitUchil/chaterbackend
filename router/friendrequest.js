const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User =  require('../model/userSchem');
const auth = require('../middleware/auth');

router.post("/api/sendfriendrequest",auth,async (req,res)=>{
    try {
        let user = req.user.user;
        // console.log(req.user); 
        user = await User.findOne({_id:user._id});
        // console.log(user);
        if(user){
            let newRequst = await User.findOne({_id:req.body.id});
            newRequst.friendsrequests.push({_id:user._id,fullname:user.fullname,username:user.username});
            await User.updateOne({_id:newRequst._id},{friendsrequests:newRequst.friendsrequests});
            res.status(200).send({message:"Firend request has be send"});
        }
        else{
            res.status(500).send({message:"User not found"})
        }   
    } catch (error) {
        console.log(error)
        res.status(500).send({error:error})
    }

});

router.post("/api/accpectfriendrequest",auth,async (req,res)=>{
    try {
        let user = req.user.user;
        user = await User.findOne({_id:user._id});
        const newFriend = await User.findOne({_id:req.body.id});
        user.friends.push({_id:req.body.id,fullname:newFriend.fullname,profilepic:newFriend.profilepic});
        user.friendsrequests.forEach((element,i) => {
            if(element._id == req.body.id){
               return user.friendsrequests.splice(i, 1);
            }
        });
        await User.updateOne({_id:user._id},{friends:user.friends});
        await User.updateOne({_id:user._id},{friendsrequests:user.friendsrequests});

        
        // console.log(newFriend);
        newFriend.friends.push({_id:user._id.valueOf(),fullname:user.fullname,profilepic:user.profilepic});
        await User.updateOne({_id:newFriend._id},{friends:newFriend.friends});
        res.status(200).send({message:"Firend request has be accpect"});  
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

router.post("/api/rejectfriendrequest",auth,async (req,res)=>{
    try {
        let user = req.user.user;
        user = await User.findOne({_id:user._id});
        user.friendsrequests.forEach((element,i) => {
            if(element._id == req.body.id){
               return user.friendsrequests.splice(i, 1);
            }
        });
        await User.updateOne({_id:user._id},{friendsrequests:user.friendsrequests});
        res.status(200).send({message:"Firend request has be rejected"});  
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

router.post("/api/searchfriendrequest",auth,async (req,res)=>{
    try {
        let user = await User.findOne({_id:req.body.id});  
        // console.log(user.friendsrequests,req.user.user._id)
        let newRequset = true;
        let text = '';
        user.friendsrequests.forEach((element,i) => {
            if(element._id.valueOf() == req.user.user._id){
                newRequset = false;
                text = 'Requset there';  
            }  
        });
        
        if(newRequset){
            text =  'New requset'
        }
        res.status(200).send({message:text}); 
    } catch (error) {
        res.status(500).send(error);     
    }
});

router.post("/api/removefriend",auth,async(req,res)=>{
    try {
        let user      = await User.findOne({_id:req.user.user._id});  
        let otherUser = await User.findOne({_id:req.body.id});  
        user.friends.forEach((e,i)=>{
            if(e._id == req.body.id){
                // console.log(req.body.id)
                user.friends.splice(i,1);
            }
        });
        otherUser.friends.forEach((e,i)=>{
            if(e._id == user._id){
                // console.log(req.body.id)
                otherUser.friends.splice(i,1);
            }
        });
        // console.log(otherUser.friends[0]._id)
        await User.updateOne({_id:user._id},{friends:user.friends});
        await User.updateOne({_id:otherUser._id},{friends:otherUser.friends});
        res.status(200).send({message:"User has be remove from your friend list"})
    } catch (error) {
        res.status(500).send({error})
    }
})



module.exports = router;