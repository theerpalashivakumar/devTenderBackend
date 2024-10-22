
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String
    },
    password:{
        type:String,min:8,max:16
    },
    age:{
        type:Number
    },
    gender:{
        type:String
    }
})

// const User = mongoose.model("User",userSchema)
module.exports = mongoose.model("User", userSchema)