const express = require("express")
const app = express()
const connectDB = require("./config/database")

const cookieParser = require('cookie-parser')

const authRouter = require('./routes/authRouter')
const profileRouter = require("./routes/profileRouter")
const requestRouter = require("./routes/requestRouter")


const PORT = 5001
app.use(express.json())
app.use(cookieParser())


app.use('/',authRouter);
app.use("/", profileRouter)
app.use("/", requestRouter)


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
