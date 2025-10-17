import path from "path";
import fs from "fs";
import multer from "multer";

export const createStorage = (foldername) => {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        const uploadPath = path.join(process.cwd(), "uploads", foldername );
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
      },
      filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const fileName = `${req.user._id} ${foldername==='avatar' ? '' : `${Math.round(Math.random() * 1e9)}`} ${ext}`;
        cb(null, fileName);
      },
    });
    return storage;
};