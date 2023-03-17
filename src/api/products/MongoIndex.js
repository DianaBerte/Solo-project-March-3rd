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

export default productsRouter