const express = require("express")

const router = express.Router()
const {userAuth}= require('../middlewares/Auth')


//get the user profile
router.get("/profile", userAuth, async (req, res) => {
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





module.exports = router