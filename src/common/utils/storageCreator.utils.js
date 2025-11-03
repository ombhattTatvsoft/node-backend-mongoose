import path from "path";
import fs from "fs";
import multer from "multer";

export const createStorage = (foldername) => {
    const storage =multer.diskStorage({
      destination: function (req, file, cb) {
        const uploadPath = path.join(process.cwd(), "uploads", foldername );
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
      },
      filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        let fileName;
        if(foldername==='avatars'){
          fileName = `${req.user._id}${ext}`;
        }
        else if(foldername==='taskAttachments'){
          fileName = `${req.user._id}-${Math.round(Math.random() * 1e9)}${ext}`;
        }
        else if(foldername==='commentImages'){
          fileName = `${req.user._id}-${file.originalname}`;
        }
        cb(null, fileName);
      },
    });
    return storage;
};