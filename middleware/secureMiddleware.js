const jwt =require('jsonwebtoken')

let secureMiddleware = (req,res,next)=>{
//    let data = jwt.verify(token, 'shhhhh')

let token = req.headers.authorization

   jwt.verify(token, process.env.ACCESSE_TOKEN_SWCRET, function(err, decoded) {

    if(error){
        res.send({
            massage: "unauthorized "
        })
    }else{
        next()
    }
});
}

module.exports= secureMiddleware