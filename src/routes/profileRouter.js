const express = require("express")

const router = express.Router()
const {userAuth}= require('../middlewares/Auth')
const {updateValidation}= require('../utils/validations')


//get the user profile
router.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user
    res.send(user)
  } catch (err) {
    res.status(500).json({
      message:
        "An internal server error occurred. Please try again later." +
        err.message,
    })
  }
})


router.patch('/profile/update',userAuth,async(req,res)=>{
    try{
        if(!updateValidation(req)){
            return res.send("update is request is failed..")
        }

        loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => (loggedInUser[key]=req.body[key]));
        
        await loggedInUser.save()

        res.json({message:`${loggedInUser.firstName} profile is updated Successfully...`,data:loggedInUser})


    }catch(err){
        res.status(500).json({
          message:
            "An internal server error occurred. Please try again later." +
            err.message,
        }) 
    }
})





module.exports = router