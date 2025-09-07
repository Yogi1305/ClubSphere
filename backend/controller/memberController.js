import ClubMember from "../model/clubmember.js";
import PushNotification from "../model/pushnotification.js";
import { MEMBER_ROLES } from "../utils/constant.js";
import { sendNotification } from "../utils/pushnotication.js";
// to join a club
export const joinToClub = async (req, res) => {
  try {
    const { club } = req.params;
    const userId = req.id;

    // Check if already a member
    const existing = await ClubMember.findOne({ user: userId, club });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You are already a member of this club",
      });
    }

    // Create membership request
    await ClubMember.create({
      Club: club,
      UserId: userId,
    });

    return res.status(201).json({
      success: true,
      message: "Your request is sent to admin",
    });
  } catch (error) {
    console.log("error in club join route", error);
    return res.status(500).json({
      success: false,
      message: "Server failure",
    });
  }
};

// to get approval from club
export const approvalToClub = async (req, res) => {
  try {
    const { memberId } = req.params;
    

    // Find the membership request
    const membership = await ClubMember.findOne({ _id: memberId });

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Membership request not found",
      });
    }

    // Approve the membership
    membership.Status = "Accepted";
    await membership.save();
    const message = JSON.stringify({
      title: `Membership Accepted by ${membership.Club}`,
      body: `Your membership request to join ${membership.Club} has been accepted.`,
    });
    try {
      const subscriptions = await PushNotification.find({}, "subscription");

      sendNotification(subscriptions, message);
    } catch (fcmError) {
      console.error("Error sending web push notification:", fcmError);
    }
    return res.status(200).json({
      success: true,
      message: "Membership approved",
    });
  } catch (error) {
    console.log("error in approveToClub route", error);
    return res.status(500).json({
      success: false,
      message: "Server failure",
    });
  }
};
// to reject 
export const rejectToClub = async (req, res) => {
  try {
    const { memberId } = req.params;

    // Find the membership request
    const membership = await ClubMember.findOne({ _id: memberId });

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Membership request not found",
      });
    }

    // Reject the membership
    membership.Status = "Rejected";
    await membership.save();
    const message = JSON.stringify({
      title: `Membership Rejected by ${membership.Club}`,
      body: `Your membership request to join ${membership.Club} has been rejected.`,
    });
    try {
      const subscriptions = await PushNotification.find({}, "subscription");

      sendNotification(subscriptions, message);
    } catch (fcmError) {
      console.error("Error sending web push notification:", fcmError);
    }
    return res.status(200).json({
      success: true,
      message: "Membership rejected",
    });
  } catch (error) {
    console.log("error in rejectToClub route", error);
    return res.status(500).json({
      success: false,
      message: "Server failure",
    });
  }
};

// get all members of a club
export const getAllMembers = async (req, res) => {
  try {
    const { club } = req.params;

    // Find all members of the club
    const members = await ClubMember.find({ Club: club }).populate({
        path: "UserId",
        select: "fullName email contact Batch"
    });

    return res.status(200).json({
      success: true,
      data: members,
    });
  } catch (error) {
    console.log("error in getAllMembers route", error);
    return res.status(500).json({
      success: false,
      message: "Server failure",
    });
  }
};

// to get upgrade

export const toUpgrade=async(req,res)=>{
    try {
        const {memberId,Role,club}=req.body;
        // console.log("Updating member role:", memberId, Role,club);
        const member= await ClubMember.findOne({_id:memberId,Club:club});
        if(!member)
          return res.status(404).json({
            success: false,
            message: "Member not found",
          });
        member.Role = Role;
        await member.save();
        return res.status(200).json({
          success: true,
          message: "Member role updated",
        });
    } catch (error) {
        console.log("error in toUpgrade route", error);
        return res.status(500).json({
          success: false,
          message: "Server failure",
        });
    }
}

// get only post holders
export const getPostHolders = async (req, res) => {
  try {
    const { club } = req.params;

   

   
    let postHolders = await ClubMember.find({
      Club: club,
      Role: { $ne: "Member" },   // Exclude normal members
      Status: "Accepted"         // Only accepted ones
    }).populate({
      path: "UserId",
      select: "fullName email contact Batch"
    });

    // Apply custom sorting
    postHolders = postHolders.sort(
      (a, b) => MEMBER_ROLES.indexOf(a.Role) - MEMBER_ROLES.indexOf(b.Role)
    );

    return res.status(200).json({
      success: true,
      data: postHolders,
    });
  } catch (error) {
    console.log("error in getPostHolders route", error);
    return res.status(500).json({
      success: false,
      message: "Server failure",
    });
  }
};
