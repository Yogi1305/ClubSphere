import Gallery from "../model/gallery.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const addgallery = async (req, res) => {
  try {
    const { club, eventId } = req.body;

    if (req.role !== "ADMIN" && req.role !== club) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const urls = [];

    
    for (const file of req.files) {
      const url = await uploadOnCloudinary(file.path);
      if (url) urls.push(url);
    }

    
    let gallery = await Gallery.findOne({ EventId: eventId, club: club });

    if (gallery) {
      
      gallery.imageUrl.push(...urls);
      await gallery.save();
      return res.json({
        success: true,
        message: "Gallery updated successfully",
        gallery,
      });
    } else {
    
      const newGallery = await Gallery.create({
        imageUrl: urls,
        EventId: eventId,
        club: club,
      });

      return res.json({
        success: true,
        message: "Gallery created successfully",
        gallery: newGallery,
      });
    }
  } catch (error) {
    console.error("error in addgallery", error);
    res
      .status(500)
      .json({ success: false, error: "Upload failed in adding to gallery" });
  }
};
