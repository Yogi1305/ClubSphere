import mongoose from "mongoose"
import { QuestionModel } from "./Question.js";
import { User } from "./User.js";

const ContestModel = mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: "",
        trim: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        default: function() {
            // Default end date is 1 day after start date
            const date = new Date(this.startDate);
            date.setDate(date.getDate() + 1);
            return date;
        }
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    QuestionSet: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QuestionModel'
    }]
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

export const Contest = mongoose.model("Contest", ContestModel);