
import mongoose from "mongoose";
import Event from "../model/event.js";
import EventUser from  "../model/eventanduser.js"
import Gallery from "../model/gallery.js";
// import eventanduser from "../model/eventanduser.js";



export const eventRegister = async (req, res) => {
  const { title, description, start, end, location, imageurl, formjson } = req.body;

  if (!title || !description || !start || !end || !location || !formjson) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if event already exists at same location and overlapping time
    const existingEvent = await Event.findOne({
      location,
      $and: [
        {
          start: { $lte: new Date(end) },
          end: { $gte: new Date(start) },
        },
      ],
    });

    if (existingEvent) {
      return res.status(409).json({
        message: "Slot already booked at this location for the given time",
        conflictEvent: existingEvent,
      });
    }

    // Create new event
    const newEvent = new Event({
      title,
      description,
      start,
      end,
      location,
      imageurl: imageurl || "https://placehold.co/600x400/000000/FFF",
      formjson,
      club:req.role
    });

    await newEvent.save();
    res.status(201).json({ message: "Event registered successfully", event: newEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering event", error });
  }
};



export const eventdetails = async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ event });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching event details", error });
  }
};

// register to certain event
export const registerToevent = async (req, res) => {
  const { eventId } = req.params;
  const userId = req.id;
  const data =req.body
  console.log(data,typeof data);
  try {
    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user already registered
    const existing = await EventUser.findOne({ EventId: eventId, UserId: userId });
    if (existing) {
      return res.status(409).json({ message: "You already registered for this event" });
    }

    // Register user to event
    await EventUser.create({
      UserId: userId,
      EventId: eventId,
      club: event.club,
      formdata:data
    });

    return res.status(201).json({
      message: `You successfully registered to ${event.title}`,
      success: true
    });

  } catch (error) {
    console.error("Error in register user to event:", error);
    return res.status(500).json({ success: false, message: "Server failure" });
  }
};

// to get all registered users for an event
export const getEventAttendees = async (req, res) => {
  const { eventId } = req.params;
  // console.log("hi ")

  try {
    const event = await EventUser.find({EventId:eventId,club:"HOBBY"}).populate({
      path:"UserId",
      select:"contact fullName email"
    });
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    // console.log(event)
    res.status(200).json({ event, success: true });
  } catch (error) {
    console.log("error in fetching event attendees", error);
    return res.status(500).json({ success: false, message: "server failure" });
  }
};

// get all event of created for specific club
export const getAllEventsForClub = async (req, res) => {
  const { club } = req.params;

  try {
    const events = await Event.find({club});
    res.status(200).json({ events });
  } catch (error) {
    console.log("error in fetching events for club", error);
    return res.status(500).json({ success: false, message: "server failure" });
  }
};

// get club gallery
export const getClubGallery = async (req, res) => {
  const { club } = req.params;

  try {
   const gallery = await Gallery.find({ club }).populate({
  path: "EventId",
  select: "title location start end"
});



res.json({ success: true, gallery });

   
  } catch (error) {
    console.log("error in fetching club gallery", error);
    return res.status(500).json({ success: false, message: "server failure" });
  }
};