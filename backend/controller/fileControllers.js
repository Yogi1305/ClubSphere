
import Gallery from "../model/gallery.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
export const addgallery=async(req,res)=>{
    // console.log(req);
    
    try {
        const {  club,eventId} = req.body;
        // console.log("files",req.file)
        if(req.role !== "ADMIN" && req.role !== club) return res.status(403).json({ success: false, message: "Unauthorized" });
       
        const urls = [];

        for (const file of req.files) {
            const url = await uploadOnCloudinary(file.path);
            if (url) urls.push(url);
            
        }

        const newGallery = await Gallery.create({
             imageUrl: urls,
             EventId: eventId,
             club: club
        })


        res.json({ success: true, message: "Gallery added successfully", gallery: newGallery });
    } catch (error) {
        console.log("error in addgallery",error)
        res.status(500).json({ success: false, error: "Upload failed in adding to galllery" });
    }
}
