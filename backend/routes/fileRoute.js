import express from "express";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { upload } from "../utils/multerupload.js";
import { addgallery } from "../controller/fileControllers.js";
import { isloggedin } from "../middleware/isLoggedin.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

router.post("/single", upload.single("image"), async (req, res) => {
    // console.log(req.file)
  try {
    const url = await uploadOnCloudinary(req.file.path);
    console.log("url", url);
    res.json({ success: true, url });
  } catch (error) {
    res.status(500).json({ success: false, error: "Upload failed" });
  }
});

router.post("/multiple", upload.array("images", 5), async (req, res) => {
  try {
    const { title, description ,file} = req.body;
    // add logic to event and galllery schema
    const urls = [];

    for (const file of req.files) {
      const url = await uploadOnCloudinary(file.path);
      // if (url) urls.push(url);
      console.log(file)
    }

    res.json({ success: true, urls });
  } catch (error) {
    res.status(500).json({ success: false, error: "Upload failed" });
  }
});

router.route("/addgallery").post(isloggedin,isAdmin,upload.array("images", 12),addgallery);

export default router;
