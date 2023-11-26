const jwt = require('jsonwebtoken');

const auth = (req,res,next) =>{
    try {
         req.user= jwt.verify(req.cookies.chaterwebtoken, process.env.SECREDT_KEY);
        next()
    } catch (error) {  
        res.status(401).send({error:"Unauthorized access"})
    }
}

module.exports = auth; 