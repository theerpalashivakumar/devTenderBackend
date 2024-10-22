
const adminAuth = (req,res)=>{
   const Token = "xyz"
   const isValid = Token ==="xyz"
   if(isValid){
    console.log("admin checking")
     res.send("autherized admin")
   }else{
    res.status(400).send("unauthorized admin")
   }
   
}

module.exports = {
  adminAuth,
}

