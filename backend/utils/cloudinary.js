
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});



export const uploadOnCloudinary = async (filePath) => {
  if (!filePath) return null;

  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: "auto" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(fs.readFileSync(filePath));
    });

    //Always delete local file after upload
    fs.unlinkSync(filePath);

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary error:", error);

   
    try {
      fs.unlinkSync(filePath);
    } catch (unlinkErr) {
      console.error("Failed to delete local file:", unlinkErr);
    }

    return null;
  }
};

