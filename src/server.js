const express = require("express")
const app = express()
const connectDB = require("./config/database")
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/authRouter")
const profileRouter = require("./routes/profileRouter")
const requestRouter = require("./routes/requestRouter")
const user = require("./routes/user")
const cors = require("cors")

app.use(express.json());


const PORT = 5001

app.use(cookieParser())
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
)
app.use(express.json())

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", user)

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
