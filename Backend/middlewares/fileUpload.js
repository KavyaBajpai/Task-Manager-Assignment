import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (path.extname(file.originalname) !== ".pdf") {
    return cb(new Error("Only PDF files allowed!"), false);
  }
  cb(null, true);
};

export const uploadFiles = multer({
  storage,
  fileFilter,
  limits: { files: 3 },
}).array("attachments", 3); // <--- field name in form
