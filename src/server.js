import Express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import { join } from "path";
import productsRouter from "./api/products/index.js";
import filesRouter from "./files/index.js";
import reviewsRouter from "./api/reviews/index.js";


const server = Express();
const port = 3001;
const publicFolderPath = join(process.cwd(), "./public")

//**** global middlewares ****/

server.use(Express.static(publicFolderPath))
server.use(cors())
server.use(Express.json())

//**** endpoints *****/

server.use("/products", productsRouter)
server.use("/products", filesRouter)
server.use("/products", reviewsRouter)


//***** error handlers *******/

server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log(`Server is running on port ${port}`)
})