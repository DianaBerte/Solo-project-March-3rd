import multer from "multer";
import Express from "express";
import { getProducts, saveProductsImgs, writeProducts } from "../lib/fs-tools.js";
import { extname } from "path";
import createHttpError from "http-errors";

const filesRouter = Express.Router()

filesRouter.post("/:productId/upload", multer().single("imageUrl"), async (req, res, next) => {
    try {
        console.log("File:", req.file);
        const originalFileExtension = extname(req.file.originalname);
        const imgName = req.params.productId + originalFileExtension;
        await saveProductsImgs(imgName, req.file.buffer)

        const productsArray = await getProducts();
        const index = productsArray.findIndex(product => product.id === req.params.productId)
        if (index !== -1) {
            const oldProduct = productsArray[index]
            const updatedProduct = { ...oldProduct, "imageUrl": `http://localhost:3001/img/products/${imgName}`, updatedAt: new Date() }
            productsArray[index] = updatedProduct
            await writeProducts(productsArray)
            res.send(updatedProduct)
        } else {
            next(createHttpError(404, `Product with id ${req.params.productId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

export default filesRouter