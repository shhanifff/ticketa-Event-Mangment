

import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "./cloudinary.js"; 

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ticketa_user_images",
    public_id: (req, file) => "user_" + Date.now(),
  },
});

const uploadProfile = multer({ storage });

export default uploadProfile;
