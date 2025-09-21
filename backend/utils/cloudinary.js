
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

// helper to extract public_id from Cloudinary URL
export const extractPublicId = (url) => {
  if (!url) return null;
  const cleanUrl = url.split("?")[0];
  const parts = cleanUrl.split("/upload/");
  if (parts.length < 2) return null;

  // remove extension
  let filePath = parts[1].split(".")[0];

  // remove version prefix if present (v123456...)
  if (filePath.includes("/")) {
    const segments = filePath.split("/");
    filePath = segments.slice(1).join("/");
  }

  return filePath;
};


//  delete image from Cloudinary using URL
export const deleteFromCloudinary = async (url) => {
  const publicId = extractPublicId(url);
  if (!publicId) {
    console.error("Invalid Cloudinary URL:", url);
    return null;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId,{invalidate: true});
    console.log("Delete result:", result);
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return null;
  }
};
