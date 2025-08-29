import express from "express";
import { sendOtp, verifyOtp } from "../controller/optController.js";

const router=express.Router();


router.route("/otpverify").post(verifyOtp);
router.route("/otpsend").post(sendOtp);
export default router;