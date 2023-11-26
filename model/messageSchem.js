const mongoose = require('mongoose');

const messagesSchema = new mongoose.Schema({
    to:{
        type:String,
        require:true
    },
    from:{
        type:String,
        require:true
    },
    message:{
        type:String,
        require:true
    },
    time:{
        type:Date,
        default:new Date(),       
    },  
    fullname:{
        type:String,
        require:true
    },  
    profilepic:{
        type:String,
        require:true
    },  
});

const Messages = mongoose.model('Message',messagesSchema);

module.exports = Messages;