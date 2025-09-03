import express from "express";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { upload } from "../utils/multerupload.js";

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
    const urls = [];

    for (const file of req.files) {
      const url = await uploadOnCloudinary(file.path);
      if (url) urls.push(url);
    }

    res.json({ success: true, urls });
  } catch (error) {
    res.status(500).json({ success: false, error: "Upload failed" });
  }
});


export default router;
