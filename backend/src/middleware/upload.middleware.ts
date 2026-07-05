import {Request} from "express";
import multer, {FileFilterCallback} from "multer";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25mb

export const upload = multer({
  storage: multer.memoryStorage(),

  limits: {fileSize: MAX_FILE_SIZE},
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    const isImage = file.mimetype.startsWith("image/");
    const isVideo = file.mimetype.startsWith("video/");

    if (!isImage && !isVideo) {
      cb(new Error("Only image and video uploads are allowed"));
      return;
    }

    cb(null, true);
  },
});
