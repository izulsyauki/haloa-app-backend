import { Request, Response, NextFunction } from 'express';
import multer from "multer";

const storage = multer.memoryStorage();


export const upload = multer({
  storage: storage,
});

export const uploadMiddleware = {
  upload: (fieldName: string, maxCount: number) => {
    return (req: Request, res: Response, next: NextFunction) => {
      upload.array(fieldName, maxCount)(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({ message: err.message });
        } else if (err) {
          return res.status(500).json({ message: 'Terjadi kesalahan saat mengunggah file.' });
        }
        next();
      });
    };
  }
};
