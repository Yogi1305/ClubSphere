import mongoose from "mongoose";


const EventModel = mongoose.Schema({
  title: String,
  description: String,
  start: Date,
  end: Date,
  location: String,
  imageurl: String, // url  of image which come cloudinary
  formjson: {},
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // Array of user IDs
},{timestamps: true});

export default mongoose.model("Event", EventModel);
