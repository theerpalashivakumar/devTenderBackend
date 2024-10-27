const express = require("express")
const app = express()
const connectDB = require("./config/database")
const { adminAuth } = require("./middlewares/Auth")
const { singUpValidation } = require("./utils/validations")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cookieParser = require('cookie-parser')
const {userAuth}=require('./middlewares/Auth')

const User = require("./modles/user")
const PORT = 5001
app.use(express.json())
app.use(cookieParser())

//post method using user signup with validations
app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
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

//profile 

app.get('/profile',userAuth, async(req,res)=>{
  try{
    const user = req.user;
   res.send(user)
  }catch(err){
    res.status(500).json({
      message:
        "An internal server error occurred. Please try again later." +
        err.message,
    })
  
  }
})


app.post('/sendRequestConnection',userAuth,async(req,res)=>{
  try{
    // const {token}= req.cookies;
    // console.log(token)
    // const {_id} = token
    // console.log(_id)
    // const user = await User.findById(_id);
    const user = req.user;

    if(!user){
      return res.send("user not found")
    }
    res.send(user.firstName +" send the request connection")
  }
  catch(err){
    res.status(500).json({
      message:
        "An internal server error occurred. Please try again later." +
        err.message,
    })
  }
})







connectDB()
  .then(() => {
    console.log("DataBase Conncetion Successfully...😍😍😍😍😍")
    app.listen(PORT, () => {
      console.log(`Server is Running at ${PORT}`)
    })
  })
  .catch((err) => {
    console.log("DataBase is not Connected", err)
  })
