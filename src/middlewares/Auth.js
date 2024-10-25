const jwt = require("jsonwebtoken")
const User = require('../modles/user')

const userAuth = async(req, res,next) => {
  try{
 const { token } = req.cookies

  if (!token) {
    return res.send("Invalid token")
  }
  const decomeMsg = await jwt.verify(token,"yoyo@123")
  const {_id} = decomeMsg 

  const user = await User.findById(_id)
  if(!user){
    res.send("invalid user please login")
  }
  // res.send(user)
  req.user = user;
  next()
  }catch(err){
      res.status(500).json({
        message:
          "An internal server error occurred. Please try again later." +
          err.message,
      })
  }
 
}

module.exports = {
  userAuth,
}
