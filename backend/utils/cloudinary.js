import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"


cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_KEY, 
    api_secret: process.env.CLOUD_SECRET // Click 'View API Keys' above to copy your API secret
});

export const uploadoncloudinar= async(localpath)=>{

    try { 
        if(!localpath)return null;
        const response= await cloudinary.uploader.upload(localpath,{
          resource_type:"auto"  
        })
        fs.unlinkSync(localpath);
        console.log(response.url);
        return response
    } catch (error) {
        fs.unlinkSync(localpath); 
        return null
    }
}
