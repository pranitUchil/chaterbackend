const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User =  require('../model/userSchem');
const auth = require('../middleware/auth');
var multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './frontend/build/assets/images');
    },
  
    filename: function(req, file, cb) {  
        cb(null, req.user.user._id + '.jpg');
    }
});

const upload = multer({
    storage:storage
    // you might also want to set some limits: https://github.com/expressjs/multer#limits
  });
  

router.post('/api/register',async (req,res)=>{  
    try {
        req.body.password = await bcrypt.hash(req.body.password,10);
        const user = new User(req.body);
        await user.save();
        res.send(user) 
    } catch (error) {
        if(error.code == 11000){
            res.status(500).json({error:Object.keys(error.keyValue)[0] + " already exists."})
        }
        else{
            res.status(500).json({error:error})
        }
    }
})

router.get('/api/user',auth,async (req,res)=>{  
    try {
        const user = await  User.find({username: { $ne: req.user.user.username }});
        res.send(user);
    } catch (error) {
        res.status(500).json({error:error});
    }
});

router.get('/api/user/:id',auth,async (req,res)=>{  
    try {
        const user = await  User.find({_id: req.params.id});
        res.send(user);
    } catch (error) {
        res.status(500).json({error:error});
    }
});

router.get('/api/userdata',auth,async (req,res)=>{  
    try {
        const user = await  User.findOne({_id:req.user.user._id});
        user.password = '';
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/api/searchusername', auth,async (req,res)=>{  
    try {
        let {username} = req.body
        const usernameRegex = new RegExp(username, 'i');
        const fullnameRegex = new RegExp(username, 'i');
        const user = await  User.find({
            $or: [
              { username: usernameRegex },
              { fullname: fullnameRegex }
            ],
            username: { $ne: req.user.user.username }
          });
        // console.log(req.user.user.username);
        res.send(user);
    } catch (error) {
        res.status(500).json({error:error});
    }
});

router.put("/api/updateuser",auth,upload.single('username'),upload.single('fullname') ,async(req,res)=>{
    try { 
        let {username,fullname} = req.body;
        const user = await User.updateOne({_id:req.user.user._id},{username,fullname})
        res.status(200).send({message: 'user has be updated'});
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
    
});

router.post("/api/uploadprofilepic",auth,upload.single('avatar'),async(req,res)=>{
    try { 
        let id = req.user.user._id
        await User.findOneAndUpdate({_id:id},{profilepic:`../assets/images/${id}.jpg`});
        res.send({message:'file has be save '})  
    } catch (error) {
      res.send(error)
    }
})

module.exports = router;