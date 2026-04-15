import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  // Who submitted
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  
  // Which event
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
  eventName: {
    type: String,
    required: true,
    trim: true,
  },

  // Which club
  club: {
    type: String,
    trim: true,
  },

  // Year of study
  year: {
    type: String,
    enum: ["1st Year", "2nd Year", "3rd Year", "4th Year", "Postgraduate", "Alumni"],
    required: true,
  },

  // Star rating (1-5)
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },

  // Feedback category
  category: {
    type: String,
    enum: [
      "Organization & Planning",
      "Content & Activities",
      "Venue & Facilities",
      "Team & Volunteers",
      "Communication",
      "Overall Experience",
    ],
    required: true,
  },

  // Text suggestions
  suggestions: {
    type: String,
    trim: true,
    maxlength: 1000,
  },

  // Likelihood to join (0-10)
  likelihood: {
    type: Number,
    min: 0,
    max: 10,
    default: 0,
  },

}, { timestamps: true });

// Prevent duplicate: same user can't give feedback twice for same event
feedbackSchema.index({ userId: 1, eventId: 1 }, { unique: true });

// For querying
feedbackSchema.index({ club: 1 });
feedbackSchema.index({ eventName: 1 });
feedbackSchema.index({ rating: 1 });

export default mongoose.model("Feedback", feedbackSchema);