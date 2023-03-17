import Express from "express";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { getProducts, getReviews, writeReviews } from "../../lib/fs-tools.js";

const reviewsRouter = Express.Router()

reviewsRouter.post("/:productId/reviews", async (req, res, next) => {
    try {
        const products = await getProducts();
        console.log("Products:", products)
        const i = products.findIndex(product => product.id === req.params.productId)
        console.log("Index is:", i)
        if (i !== -1) {
            const newReview = { ...req.body, reviewId: uniqid(), productId: req.params.productId, createdAt: new Date() }
            const reviewsArray = await getReviews();
            reviewsArray.push(newReview)
            await writeReviews(reviewsArray)
            res.status(201).send({ message: "Yay, you just posted a new review!", reviewId: newReview.reviewId })
        } else {
            next(createHttpError(404, `Sadly, product with id ${req.params.productId} and the related review that you're trying to post was not found`))
        }
    } catch (error) {
        next(error)
    }
})

// Getting a list of reviews related to a specific product:
reviewsRouter.get("/:productId/reviews", async (req, res, next) => {
    try {
        const products = await getProducts();
        const i = products.findIndex(product => product.id === req.params.productId)
        if (i !== -1) {
            const reviewsArray = await getReviews();
            const relatedReviews = reviewsArray.filter(review => review.productId === req.params.productId)
            res.send(relatedReviews)
        } else {
            next(createHttpError(404, `Sadly, product with id ${req.params.productId} and the related review was not found`))
        }
    } catch (error) {
        next(error)
    }
})

reviewsRouter.delete("/:productId/reviews/:reviewId", async (req, res, next) => {
    try {
        const products = await getProducts();
        const i = products.findIndex(product => product.id === req.params.productId)
        if (i !== -1) {
            const reviewsArray = await getReviews();
            const x = reviewsArray.findIndex(review => review.reviewId === req.params.reviewId)
            if (x !== -1) {
                const remainingReviews = reviewsArray.filter(review => review.reviewId !== req.params.reviewId)
                console.log("rem reviews:", remainingReviews)
                await writeReviews(remainingReviews)
                res.send({ message: `You successfully deleted review with id ${req.params.reviewId}` })
            } else {
                next(createHttpError(404, `Sadly, review with id ${req.params.reviewId} was not found`))
            }
        } else {
            next(createHttpError(404))
        }
    } catch (error) {
        next(error)
    }
})

export default reviewsRouter