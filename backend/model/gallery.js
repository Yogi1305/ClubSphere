import mongoose  from "mongoose";

const gallerySchema = new mongoose.Schema({
    imageUrl: [{
        type: String,
        required: true
    }],
    EventId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Event"
    },
    club: {
        enum: ["PFAC", "HOBBY", "LIT", "MEF", "PTSC", "DRAMATIC","IISF"],
        required: true
    }
});

export default mongoose.model("Gallery", gallerySchema);
