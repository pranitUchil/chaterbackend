const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User =  require('../model/userSchem');

router.post('/api/login',async(req,res)=>{
    try {
        let {username ,password} = req.body;
        const user = await User.findOne({username});
        if(!user){
           return res.status(401).send({error:"Invalid login!"})
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(passwordMatch){
            let token = await jwt.sign({user},process.env.SECREDT_KEY);
            res.cookie('chaterwebtoken',token,{
                expires:new Date(Date.now() + 25892000000),
                httpOnly:true
            });         
            res.status(200).send({message:'you hed be login'})
        }
        else{
            res.status(401).send({error:"Invalid login!"})
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
});

router.get('/api/logout',async (req, res) => {
    res.cookie('chaterwebtoken', 'none', {
        expires: new Date(Date.now()),
        httpOnly: true,
    })
    res
        .status(200)
        .json({ success: true, message: 'User logged out successfully' })
})

module.exports = router;