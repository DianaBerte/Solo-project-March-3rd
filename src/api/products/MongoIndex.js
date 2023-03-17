import express from "express";
import createHttpError from "http-errors";
import q2m from "query-to-mongo";
import ProductsModel from "./model.js";

const productsRouter = express.Router();

productsRouter.post("/", async (req, res, next) => {
    try {
        const newProduct = new ProductsModel(req.body)
        const { _id } = await newProduct.save()
        res.status(201).send({ _id })
    } catch (error) {
        next(error)
    }
})

productsRouter.get("/:productId", async (req, res, next) => {
    try {
        const product = await ProductsModel.findById(req.params.productId)
        //   .populate({ path: "authors", select: "firstName lastName" })
        if (product) {
            res.send(product)
        } else {
            next(createHttpError(404, `Product with id ${req.params.productId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

productsRouter.put("/:productId", async (req, res, next) => {
    try {
        const updatedProduct = await ProductsModel.findByIdAndUpdate(
            req.params.productId, // WHO
            req.body, // HOW
            { new: true, runValidators: true }
        )
        if (updatedProduct) {
            res.send(updatedProduct)
        } else {
            next(createHttpError(404, `Product with id ${req.params.productId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

export default productsRouter