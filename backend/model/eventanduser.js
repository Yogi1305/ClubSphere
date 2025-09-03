import mongoose from "mongoose";

const event = mongoose.Schema({
    UserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref :'User',
    },
    EventId:{
            type:mongoose.Schema.Types.ObjectId,
            ref :"Event",
    },
    club:{
        type:String,
        required:true
    }

})

export default mongoose.model("EventUser", event);