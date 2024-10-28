const express = require("express")

const router = express.Router()

const User = require('../modles/user')
const {singUpValidation}=require('../utils/validations')
// const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")



//signup
router.post("/signup", async (req, res) => {
  try {
    singUpValidation(req)

    const { firstName, lastName, emailId, password } = req.body
    const passwordHashed = await bcrypt.hash(password, 10)

    // console.log(passwordHashed)

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHashed,
    })
    await user.save()
    res.send("User Added Succefully..")
  } catch (err) {
    res.status(500).json({
      message:
        "An internal server error occurred. Please try again later." +
        err.message,
    })
  }
})

//login
router.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body

    //get user from the database based on the emailId
    const user = await User.findOne({ emailId })
    if (!user) {
      return res.status(400).send("Email Id is Not registerd")
    }

    // const matchedPassword = await bcrypt.compare(password, user.password)
    const matchedPassword = await user.comparePassword(password)
    if (matchedPassword) {
      // const token = await jwt.sign({ _id: user._id }, "yoyo@123", {
      //   expiresIn: "1d",
      // })
      const token = await user.getJWT()
      //cookie expire in one day { expires: new Date(Date.now() + 8 * 3600000) }
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      })

      res.send("user Login Successfully")
    } else {
      return res.status(400).send("Incorrect password.")
    }
  } catch (err) {
    res.status(500).json({
      message:
        "An internal server error occurred. Please try again later." +
        err.message,
    })
  }
})


module.exports = router;