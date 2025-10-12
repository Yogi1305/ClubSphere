import mongoose from "mongoose";
import { MEMBER_ROLES, ROLES } from "../utils/constant.js";

const clubMemberSchema = new mongoose.Schema({
  Club: {
    type: String,
    enum: ROLES,
    required: true,
  },
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  Role: {
    type: String,
    enum: MEMBER_ROLES,
    default: "Member",
  },
  Status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  }
}, { timestamps: true });

// Ensure user can't join the same club twice
// clubMemberSchema.index({ Club: 1, UserId: 1 }, { unique: true });

export default mongoose.model("ClubMember", clubMemberSchema);
