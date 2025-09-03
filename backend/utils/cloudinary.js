// import { v2 as cloudinary } from 'cloudinary';
// import fs from "fs"


// cloudinary.config({ 
//     cloud_name: process.env.CLOUD_NAME, 
//     api_key: process.env.CLOUD_KEY, 
//     api_secret: process.env.CLOUD_SECRET
// });

// export const uploadOnCloudinary= async(localpath)=>{

//     try { 
//         if(!localpath)return "local path is not found";
//         const response= await cloudinary.uploader.upload(localpath,{
//           resource_type:"auto"  
//         })
//         fs.unlinkSync(localpath);
//         console.log(response.url);
//         return response
//     } catch (error) {
//         fs.unlinkSync(localpath); 
//         return null
//     }
// }

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

export const uploadOnCloudinary = async (fileBuffer) => {
  try {
    return await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: "auto" }, (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        })
        .end(fileBuffer);
    });
  } catch (error) {
    console.error("Cloudinary error:", error);
    return null;
  }
};
