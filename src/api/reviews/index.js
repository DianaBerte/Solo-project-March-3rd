import Express from "express";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { getReviews, writeReviews } from "../../lib/fs-tools.js";

//to get reviews for a certain product you have to filter the reviews by product id

const reviewsRouter = Express.Router()

reviewsRouter.post("/", async (req, res, next) => {
    try {
        const newReview = { ...req.body, id: uniqid(), createdAt: new Date(), updatedAt: new Date() }

        const reviewsArray = await getReviews()
        reviewsArray.push(newReview)
        await writeReviews(reviewsArray)

        res.status(201).send({ message: "Yay, you just posted a new review!", id: newReview.id })
    } catch (error) {
        next(error)
    }
})

reviewsRouter.get("/", async (req, res, next) => {
    try {
        const reviews = await getReviews();
        res.send(reviews)
    } catch (error) {
        next(error)
    }
})

reviewsRouter.get("/:productId/reviews", async (req, res, next) => {
    try {
        const reviewsArray = await getReviews()
        reviewsArray = reviewsArray.filter(review => review.productId === req.params.productId)
        res.send(reviewsArray)
    } catch (error) {
        next(error)
    }
})

export default reviewsRouter