import express from "express";
import createHttpError from "http-errors";
import q2m from "query-to-mongo";
import ProductsModel from "./model.js";
import ReviewsModel from "./model.js";

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
        const updatedProduct = await ProductsModel.findByIdAndUpdate(req.params.productId, req.body, { new: true, runValidators: true })
        if (updatedProduct) {
            res.send(updatedProduct)
        } else {
            next(createHttpError(404, `Product with id ${req.params.productId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

productsRouter.delete("/:productId", async (req, res, next) => {
    try {
        const deletedProduct = await ProductsModel.findByIdAndDelete(req.params.productId)
        if (deletedProduct) {
            res.status(204).send()
        } else {
            next(createHttpError(404, `Product with id ${req.params.productId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

// ********************************************** EMBEDDED CRUD **************************************************

productsRouter.post("/:productId/reviews", async (req, res, next) => {
    try {
        const product = await ProductsModel.findById(req.params.productId)
        if (product) {
            const newReview = await req.body;
            product.reviews.push(newReview);
            await product.save();
            res.status(201).send(newReview)
        } else {
            next(createHttpError(`Product with id ${req.params.productId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

productsRouter.get("/:productId/reviews", async (req, res, next) => {
    try {
        const products = await ProductsModel.findById(req.params.productId)
        if (products) {
            res.send(products.reviews)
        } else {
            next(createHttpError(404, `Review with id ${req.params.reviewId} not found :(`))
        }
    } catch (error) {
        next(error)
    }
})

productsRouter.get("/:productId/reviews/:reviewId", async (req, res, next) => {
    try {
        const product = await ProductsModel.findById(req.params.productId)
        if (product) {
            const foundReview = product.reviews.find(review => review._id.toString() === req.params.reviewId)
            if (foundReview) {
                res.send(foundReview)
            } else {
                next(createHttpError(404, `Review with id ${req.params.reviewId} not found :(`))
            }
        } else {
            next(createHttpError(404, `Product with id ${req.params.productId} not found :(`))
        }
    } catch (error) {
        next(error)
    }
})

export default productsRouter