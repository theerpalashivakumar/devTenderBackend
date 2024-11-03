const mongoose = require('mongoose')


const connectionRequestSchema = new mongoose.Schema({

    fromUserId :{
        type:mongoose.Schema.Types.ObjectId, required:true,
       
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId, required:true,
        
    },
    status:{
        type:String,
        enum:{
            values:["ignored","interested","accepeted","rejected"],
            message:`{VALUE} is incorect status`
        }
    }
},
{timestamps:true}
);

// these is db level validation of pre.its work every time you save data before it checks
connectionRequestSchema.pre("save",function(next){
    const connectionRequest = this;

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("you conn't send your self...")
    }
    next()
})

//its compound index 

connectionRequestSchema.index({formUserId:1,toUserId:1})


module.exports = mongoose.model("ConnectionRequest",connectionRequestSchema)