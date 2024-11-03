const express = require("express")
const router = express.Router()
const { userAuth } = require("../middlewares/Auth")
const ConncetionRequest = require("../modles/connectionRequest")
const User = require("../modles/user")
// const connectionRequest = require("../modles/connectionRequest")

//request connections
router.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id
    const toUserId = req.params.toUserId
    const status = req.params.status

    if (!fromUserId) {
      return res.send("user not found")
    }

    // if(fromUserId===toUserId){
    //   return res.status(400).json({message:"connt send request your self"})
    // }

    const statusAllowed = ["ignored", "interested"]

    if (!statusAllowed.includes(status)) {
      return res
        .status(400)
        .json({ message: "it's a bad status request " + status })
    }

    // checking the exsting user

    const toUser = await User.findById(toUserId)

    if (!toUser) {
      return res.status(400).json({ message: "invalid to user ..." })
    }

    const existingUserConnection = await ConncetionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    })

    if (existingUserConnection) {
      return res.status(400).json({ message: "connection already exsiting" })
    }

    const connectionRequest = new ConncetionRequest({
      fromUserId,
      toUserId,
      status,
    })

    const savedData = await connectionRequest.save()
    res.json({
      // message: "Conncetion request send Successfully..",
      message: req.user.firstName + "  is  " + status + "  " + toUser.firstName,
      data: savedData,
    })
  } catch (err) {
    res.status(500).json({
      message:
        "An internal server error occurred. Please try again later." +
        err.message,
    })
  }
})

router.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      loggedinUser = req.user
      const { status, requestId } = req.params

      const statusAllowed = ["accepted", "rejected"]

      if (!statusAllowed.includes(status)) {
        return res
          .status(400)
          .json({ message: "bad request of status " + status })
      }

      const connectionRequest = await ConncetionRequest.findOne({
        _id: requestId,
        toUserId: loggedinUser._id,
        status: "interested",
      })
      if (!connectionRequest) {
        return res.status(400).json({ message: "user request not found" })
      }

      connectionRequest.status = status

      const data = await connectionRequest.save()
      res
        .status(200)
        .json({ message: `connection request   ${status }`, data })
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  }
)

module.exports = router
