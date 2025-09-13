import express from "express"
import { Admin, checkcompletecontest, checklogging, completecontest, login, logout, register, resetpassword, userdata, userinfo } from "../controller/userController.js";
import { isloggedin } from "../middleware/isLoggedin.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { test } from "../openAi/openAiConfig.js";
import { updatetime } from "../controller/contestControllers.js";

const router=express.Router();
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(isloggedin,logout);
router.route("/checklogged").get(isloggedin,checklogging);
router.route("/isadmin").get(isloggedin,isAdmin,Admin);
router.route("/complete").post(completecontest)
router.route("/checkcomplete").post(checkcompletecontest)
router.route("/generate").post(test)
router.route("/getuser/:userId").get(userdata)
router.route("/contest/my-contests").get(isloggedin,userinfo); 
router.route("/resetpassword").post(resetpassword)
router.route("/changetime").post(isloggedin,isAdmin,updatetime)


export default router;