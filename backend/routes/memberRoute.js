import express from "express";
import { isloggedin } from "../middleware/isLoggedin.js";
import { approvalToClub, getAllMembers, getPostHolders, joinToClub, rejectToClub, removeFromClub, toUpgrade } from "../controller/memberController.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { feedback } from "../openAi/openAiConfig.js";


const router=express.Router();


router.route("/join/:club").post(isloggedin,isAdmin,joinToClub)
router.route("/allmembers/:club").get(isloggedin,isAdmin,getAllMembers);
router.route("/approve/:memberId").post(isloggedin,isAdmin,approvalToClub);
router.route("/reject/:memberId").post(isloggedin,isAdmin,rejectToClub);
router.route("/upgrade").post(isloggedin,isAdmin,toUpgrade);
router.route("/postholders/:club").get(getPostHolders);
router.route("/feedback").post(isloggedin,feedback)
router.route("/remove/:memberId").post(isloggedin,isAdmin,removeFromClub)
export default router;