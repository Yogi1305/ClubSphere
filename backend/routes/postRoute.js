import express from "express";
import { addQuestion, createContest, getallcontest, getallcontestofuser, getContestById,  makePublic,  removeQuestionFromContest, updatequestion} from "../controller/contestControllers.js";
import { isloggedin } from "../middleware/isLoggedin.js";
import {isAdmin} from "../middleware/isAdmin.js"
import { saveAnswer } from "../controller/quizController.js";
import { getQuizResult } from "../controller/winner.js";
// import { get } from "mongoose";


const router=express.Router();


router.route("/createcontest").post(isloggedin,isAdmin,createContest);
router.route("/addQuestion").post(isloggedin,isAdmin,addQuestion)

router.route("/getcontest").get(isloggedin,getallcontestofuser);
router.route("/getallcontest").get(isloggedin,getallcontest);
router.route("/getContestById/:id").get(getContestById);
router.route("/:id").get(isloggedin,getContestById);
router.route("/:contestId/:questionId").delete(isloggedin,removeQuestionFromContest);
router.route("/update/:contestId/:questionId").put(isloggedin,updatequestion);
router.route("/answer").post(isloggedin,saveAnswer)
router.route("/results").post(getQuizResult)
router.route("/makepublic").post(makePublic)
export default router