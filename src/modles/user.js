const mongoose = require("mongoose")
const validator = require("validator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid")
        }
      },
    },
    password: {
      type: String,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("password is not Strong")
        }
      },
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("gender is not valid")
        }
      },
    },
    skills: {
      type: [String],
    },
    photoUrl: {
      type: String,
      default:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      isURL: true,
    },
  },
  {
    timestamps: true,
  }
)

userSchema.methods.getJWT = async function () {
  const user = this
  const token = await jwt.sign({ _id: user._id }, "yoyo@123", 
      {expiresIn: "1d"},
  )
  return token
}

userSchema.methods.comparePassword = async function (userEnterPassword) {
  const user = this
  const passwordHash = user.password

  const isPasswordValid = await bcrypt.compare(userEnterPassword, passwordHash)
  return isPasswordValid
}

// const User = mongoose.model("User",userSchema)
module.exports = mongoose.model("User", userSchema)
