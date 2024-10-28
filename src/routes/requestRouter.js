

const express = require('express');
const router = express.Router();
const {userAuth}=require('../middlewares/Auth')

//request connections
router.post("/sendRequestConnection", userAuth, async (req, res) => {
  try {
    // const {token}= req.cookies;
    // console.log(token)
    // const {_id} = token
    // console.log(_id)
    // const user = await User.findById(_id);
    const user = req.user

    if (!user) {
      return res.send("user not found")
    }
    res.send(user.firstName + " send the request connection")
  } catch (err) {
    res.status(500).json({
      message:
        "An internal server error occurred. Please try again later." +
        err.message,
    })
  }
})

module.exports=router;

