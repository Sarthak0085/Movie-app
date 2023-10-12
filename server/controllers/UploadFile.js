import express from 'express';
import multer from 'multer';
import path from "path";
import { v4 as uuidv4 } from "uuid-v4";
import storage from '../config/firebaseStorage.js';

const uploadRouter = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
});

uploadRouter.post("/", upload.single("file"), async (req, res) => {
    try {
        //get file fom request
        const file = req.file;
        // create new filename
        if (file) {
            const fileName = `${uuidv4()}${path.extname(file.originalname)}`;

            const blob = storage.file(fileName);
            const blobStream = blob.createWriteStream({
                resumable: false,
                metadata: {
                    contentType: file.mimetype,
                }
            });

            // if error
            blobStream.on("error", (error) => {
                res.status(400).json({ message: error.message });
            });

            //if success
            blobStream.on("finish", () => {
                // get the public url
                const publicUrl = "";
                // return filename and public url to the client
                res.status(200).json(publicUrl);
            });
            blobStream.end(file.buffer);
        }
        else {
            res.status(400).json({ message: "Please upload a file" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default uploadRouter;