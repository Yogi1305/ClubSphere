import express from "express"
import { createpoll, getpoll, votetopoll } from "../controller/voterController.js";
const router=express.Router();

router.route("/create").post(createpoll)
router.route("/getpolls").get(getpoll)
router.route("/vote").post(votetopoll)

export default router;