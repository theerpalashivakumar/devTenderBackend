const express = require("express")
const { userAuth } = require("../middlewares/Auth")
const ConnectionRequest = require("../modles/connectionRequest")
const router = express.Router()


const user_safe_data = "firstName lastName skills gender"
//checking the pending request from the users
router.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    loginUser = req.user

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loginUser._id,
      status: "interested",
    }).populate("fromUserId", user_safe_data)
    res.json({ message: "connection is received", data: connectionRequest })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.get("/user/connections", userAuth, async (req, res) => {
  try {
    logginUser = req.user

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: logginUser._id, status: "accepted" },
        { fromUserId: logginUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", user_safe_data)
      .populate("toUserId", user_safe_data)

    const data = connectionRequest.map((each) => {
      if(each.fromUserId._id.toString() ===logginUser._id.toString()){
        return each.toUserId
      }
      
       return  each.fromUserId
    })

    res.json({
      message: "user Connection List ",
      data,
    })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

module.exports = router
