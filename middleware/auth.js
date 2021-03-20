const jwt=require('jsonwebtoken')

////////////////authorization //////////////////////////////
//////////////check header token if exist and valid or no /////////////////
module.exports=function auth(req,res,next)
{    
    const token=req.header('x-token')
    if(!token) return res.status(401).send({error:'Access Denied'})
    try{
        const decoded= jwt.verify(token,process.env.SECRET_KEY)
        req.user=decoded
        next()
    }
   catch{
       res.status(400).send({error:'Invalid Token'})
       
   }

}

