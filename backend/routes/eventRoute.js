import express from "express"
import { eventdetails, eventRegister } from "../controller/eventContollers.js";

const router=express.Router();

router.route("/").post(eventRegister);
router.route("/:eventId").get(eventdetails);
export default router;