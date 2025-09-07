import mongoose  from "mongoose";
// this schema is to store gallery images and eventid ,club
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
        type:String,
        enum: ["PFAC", "HOBBY", "LIT", "MEF", "PTSC", "DRAMATIC","IISF","ADMIN"],
        required: true
    }
});

export default mongoose.model("Gallery", gallerySchema);
