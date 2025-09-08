import express from "express"
import { eventdetails, eventRegister, getAllEventsForClub, getClubGallery, getEventAttendees, registerToevent } from "../controller/eventContollers.js";
import { sendtoall, sendtomembers } from "../controller/notificationController.js";
import { isloggedin } from "../middleware/isLoggedin.js";

const router=express.Router();

router.route("/").post(isloggedin,eventRegister);
router.route("/:eventId").get(eventdetails);
router.route("/allevent/:club").get(getAllEventsForClub)
router.route("/notifications/send/all").post(isloggedin,sendtoall);
router.route("/notifications/send/members").post(isloggedin,sendtomembers);
router.route("/registerto/:eventId").post(isloggedin,registerToevent)
router.route("/participants/:eventId").get(isloggedin,getEventAttendees);
router.route("/gallery/:club").get(getClubGallery);
export default router;