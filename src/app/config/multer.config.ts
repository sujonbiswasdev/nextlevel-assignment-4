import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: async (req, file) => {
    const originalName = file.originalname;
    const extension = originalName.split(".").pop()?.toLocaleLowerCase();
    const fileNameWithoutExtension = originalName
      .split(".")
      .slice(0, -1)
      .join(".")
      .toLowerCase()
      .replace(/\s+/g, "-")
      // eslint-disable-next-line no-useless-escape
      .replace(/[^a-z0-9\-]/g, "");

    const uniqueName =
      Math.random().toString(36).substring(2) +
      "-" +
      Date.now() +
      "-" +
      fileNameWithoutExtension;

    const folder = extension === "pdf" ? "pdfs" : "images";
    return {
      folder: `planora/${folder}`,
      public_id:uniqueName,
      resource_type: "auto",
      format: extension === "pdf" ? "pdf" : "webp", // ইমেজ হলে অটোমেটিক webp হবে (ফাইল সাইজ কমায়)
      transformation: extension !== "pdf" ? [{ quality: "auto", fetch_format: "auto" }] : undefined,
    };    
  },





});

export const multerUpload = multer({storage,limits: {
  fileSize: 1024 * 1024,
},});