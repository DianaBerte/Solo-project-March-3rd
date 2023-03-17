import mongoose from "mongoose";

const { Schema, model } = mongoose

const reviewsSchema = new Schema(
    {
        comment: { type: String, required: true },
        rate: { type: Number, required: true, max: 5 }
    },
    { timestamps: true }
)

const productsSchema = new Schema(
    {
        "name": { type: String, required: true },
        "description": { type: String, required: true },
        "brand": { type: String, required: true },
        "imageUrl": { type: String, required: true },
        "price": { type: Number, required: true },
        "category": { type: String },
        "reviews": [reviewsSchema],
    },
    { timestamps: true }
)

// *************************** MODEL CUSTOM METHOD **********************

productsSchema.static("findProductsWithReviews", async function (query) {
    console.log("THIS: ", this)
    const products = await this.find(query.criteria, query.options.fields)
        .limit(query.options.limit)
        .skip(query.options.skip)
        .sort(query.options.sort)
        .populate({ path: "reviews", select: "comment rate" })
    const total = await this.countDocuments(query.criteria)
    return { products, total }
})

export default model("Product", productsSchema)