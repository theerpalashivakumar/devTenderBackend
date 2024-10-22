const mongoose = require('mongoose');

const connectDB = async()=>{
    await mongoose.connect(
      "mongodb+srv://shivakumartheerpal:Shiv%40818780@cluster0.cbpcv.mongodb.net/devTenderDB?retryWrites=true&w=majority"
    )
}

module.exports=connectDB;