import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import  cloudinary from '../utils/cloudinary.js'

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ticketa_event_images",
    public_id: (req, file) => "user_" + Date.now(), 
  },
});


const uploadEventImage = multer({ storage });

export default uploadEventImage;
