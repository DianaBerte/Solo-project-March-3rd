//**** PRODUCTS CRUD ENDPOINTS******/

// 1. POST --> http://localhost:3001/products/ (+ body)
// 2. GET --> http://localhost:3001/products/ (+ optional query search params)
// 3. GET (single book) --> http://localhost:3001/products/:productsId
// 4. PUT (single book) --> http://localhost:3001/products/:productsId (+ body)
// 5. DELETE (single book) --> http://localhost:3001/products/:productsId

// and to GET REVIEWS for a certain product you have to filter the reviews by product id.

import Express from "express";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { getProducts, writeProducts, getReviews } from "../../lib/fs-tools.js";
//to GET REVIEWS for a certain product you have to filter the reviews by product id

const productsRouter = Express.Router()

productsRouter.post("/", async (req, res, next) => {
    const newProduct = { ...req.body, id: uniqid(), createdAt: new Date(), updatedAt: new Date() }

    const productsArray = await getProducts()
    productsArray.push(newProduct)
    await writeProducts(productsArray)

    res.status(201).send({ message: "Yay, you just created a new product!", id: newProduct.id })
})

productsRouter.get("/", async (req, res, next) => {
    try {
        const products = await getProducts()
        if (req.query && req.query.category) {
            const filteredProducts = products.filter(product => product.category === req.query.category)
            res.send(filteredProducts)
        } else {
            res.send(products)
        }
    } catch (error) {
        next(error)
    }
})

export default productsRouter