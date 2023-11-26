const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchem = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique: true 
    },
    username:{
        type:String,
        required:true,
        unique: true 
    },
    fullname:{
        type:String,
        required:true,
    },
    profilepic:{
        type:String,
        default:"../assets/images/avatar-1.png"
    },
    friends:{
        type:Array,
    },
    friendsrequests:{
        type:Array,
    },
    password:{
        type:String,
        required:true,
        unique: true 
    }
});

const User = mongoose.model('USER',userSchem);

module.exports = User;