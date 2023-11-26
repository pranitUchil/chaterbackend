const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path')
const BASE_URL = process.env.BASE_URL;

var multer = require('multer');
// ...
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 5000
dotenv.config({path:'./config.env'})
require('./db/connect')

app.use(cookieParser());
app.use(express.json())
// app.use(upload.array()); 

app.use(require('./router/user'));
app.use(require('./router/login'));
app.use(require('./router/friendrequest'));
app.use(require('./router/chats'));
app.use(require('./router/messages'));
app.get('/',(req,res)=>{
    res.send("Hello world");
});

// -------- Deployment ------
// const __dirname1 = path.resolve();
// if(process.env.NODE_ENV == 'production'){
//     app.use(express.static(path.join(__dirname1,"frontend","build")))
//     app.get('*',(req,res) =>{
//         res.sendFile(path.resolve(__dirname1,"frontend","build","index.html"))
//     });
// }
// else{
   
// }
// -------- Deployment ------

const server = app.listen(PORT,()=>{
    console.log(`site is live on http://localhost:5000`)
});

const io = require('socket.io')(server,{
    pingTimeout:60000,
    cors:{
        origin:"http://localhost:3001"
    }
}); 

io.on('connection', socket => {
    // socket.emit('request', /* … */); // emit an event to the socket
    // io.emit('broadcast', /* … */); // emit an event to all connected sockets
    // socket.on('reply', () => { /* … */ }); // listen to the event
    socket.once("setup",(userID)=>{
        socket.join(userID);  
        console.log(userID)
        socket.emit("connected")
    });

    socket.on("join chat",(room)=>{
        socket.join(room);
        // console.log("user joined room :"+room)
    });
  
    socket.on("new message",(message)=>{
        socket.in(message.to).emit("message recieved",message)
    });  

    socket.on("friend request send",(id)=>{  
        // console.log(id)
        socket.in(id).emit('firend request recieved')
    });

    socket.on("friend request accpect",(userData,id)=>{
        console.log(userData,id)
        socket.in(id).emit("firend request accpected",userData,id)
    });

    socket.on("remove friend",(id)=>{
        console.log(id)
        socket.in(id).emit("firend has be remove",id)
    })
});


