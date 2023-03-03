import multer from "multer";
import Express from "express";
import { saveProductsImgs } from "../lib/fs-tools.js";
import { extname } from "path";

const filesRouter = Express.Router()

filesRouter.post("/upload", multer().single("imageUrl"), async (req, res, next) => {
    try {
        console.log("File:", req.file);
        const originalFileExtension = extname(req.file.originalname);
        const imgName = req.params.id + originalFileExtension;
        await saveProductsImgs(imgName, req.file.buffer)
        res.send({ message: "Yay, image uploaded!" })
    } catch (error) {
        next(error)
    }
})

export default filesRouter