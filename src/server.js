const express = require('express')
const app = express();
const connectDB = require('./config/database');
const {adminAuth} = require('./middlewares/Auth');

const User = require('./modles/user')
const PORT = 5001
app.use(express.json())

// app.use("/admin/user",adminAuth,(req,res)=>{
//     res.send("user check")
// })
//post method using userdetails
app.post('/signup',async(req,res)=>{
 
    const data = req.body;
    console.log(data)
    try{
         const user = new User(data)
         await user.save()
         res.send("User Added Succefully..")
    }
    catch(err){
      res.status(400).send("Something went wrong...",err.message)
    }
   
})
//get all users of the database
app.get("/feed",async(req,res)=>{
    try {
        const users = await User.find({})
        res.send(users)
        if(users.length===0){
            res.send("user are not found ...")
        }

    } catch (err) {
      res.status(400).send("Something went wrong...", err.message)
    }
})

//get one user based on the condition

app.put("/users", async (req, res) => {
    const firstName = req.body.firstName;
    const userId = req.body._id;
    console.log(firstName)
  try {
    const users = await User.findOneAndUpdate({ userId,firstName })
    res.send(users)
    if (users.length === 0) {
      res.send("user are not found ...")
    }
  } catch (err) {
    res.status(400).send("Something went wrong...", err.message)
  }
})

connectDB().then(()=>{
    console.log("DataBase Conncetion Successfully...😍😍😍😍😍")
    app.listen(PORT,()=>{
        console.log(`Server is Running at ${PORT}`)
    })

}).catch((err)=>{
    console.log("DataBase is not Connected",err)
})
