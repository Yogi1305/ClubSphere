import React, { useState } from "react";
import Navbar from "../Navbar";
import { Baseurl } from "../../main";
import axios from "axios";

const Club = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile)); // local preview
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", file); // 👈 must match multer.single("image")

      const response = await axios.post(`${Baseurl}/upload/single`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      setUploadedUrl(response.data.url);
      console.log("Upload success:", response.data);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <h1>Club</h1>

      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} name="image" />
        <button type="submit">Upload</button>
      </form>

      {preview && (
        <div>
          <h3>Preview:</h3>
          <img src={preview} alt="preview" width="200" />
        </div>
      )}

      {uploadedUrl && (
        <div>
          <h3>Uploaded to Cloudinary:</h3>
          <a href={uploadedUrl} target="_blank" rel="noreferrer">
            {uploadedUrl}
          </a>
          <br />
          <img src={uploadedUrl} alt="uploaded" width="200" />
        </div>
      )}
    </div>
  );
};

export default Club;
