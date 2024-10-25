const express = require("express")
const app = express()
const connectDB = require("./config/database")
const { adminAuth } = require("./middlewares/Auth")
const { singUpValidation } = require("./utils/validations")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cookieParser = require('cookie-parser')

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

    console.log(passwordHashed)

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

    const matchedPassword = await bcrypt.compare(password, user.password)
    if (matchedPassword) {
       const token = await jwt.sign({_id:user._id},"yoyo@123")
       console.log(token)
       res.cookie("token",token)

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

app.get('/profile', async(req,res)=>{
  try{
    const cookies = req.cookies;
   const {token} = cookies;
    //validation of the token 
    console.log("token is "+token)
    if(!token){
      return res.send("token is not valid")
    }
    //send argument like token and secruit key
    const decodeMsg = await jwt.verify(token,"yoyo@123")
    const {_id} = decodeMsg 
    console.log(_id)
    const user = await User.findById(_id);
   console.log(user)
   res.send(user)




  }catch(err){
    res.status(500).json({
      message:
        "An internal server error occurred. Please try again later." +
        err.message,
    })
  
  }
})








//get all users of the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({})
    res.send(users)
    if (users.length === 0) {
      res.send("user are not found ...")
    }
  } catch (err) {
    res.status(400).send("Something went wrong...", err.message)
  }
})

//get one user based on the condition

// app.put("/users", async (req, res) => {
//    const data = req.body;

//   const firstName = req.body.firstName
//   const userId = req.body._id
//   try {
//     const allowed_update = ["firstName", "lastName", "age", "gender"]
//     const update_allowed = Object.keys(data).every((key) => {
//       allowed_update.includes(key)
//     })

//     if (!update_allowed) {
//       res.send("we cont updated the data ")
//     }
//     const users = await User.findOneAndUpdate(userId, firstName, {
//       runValidators:true
//     })
//     res.send(users)
//     if (users.length === 0) {
//       res.send("user are not found ...")
//     }
//   } catch (err) {
//     res.status(400).send("Something went wrong...", err.message)
//   }
// })

app.put("/users", async (req, res) => {
  const data = req.body
  const userId = req.body._id

  try {
    // Allowed fields for update
    const allowed_update = ["firstName", "lastName", "age", "gender", "_id"]

    // Validate update keys
    const update_allowed = Object.keys(data).every((key) =>
      allowed_update.includes(key)
    )

    if (!update_allowed) {
      return res.status(400).send("Invalid updates! Fields are not allowed.")
    }

    // Perform update
    const user = await User.findOneAndUpdate(
      { _id: userId }, // Filter
      { $set: data }, // Update with data from the request body
      {
        new: true, // Return the updated document
        runValidators: true, // Ensure validation runs on update
      }
    )

    // Check if user is found
    if (!user) {
      return res.status(404).send("User not found.")
    }

    // Send updated user
    res.send(user)
    // console.log(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Something went wrong...")
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
