import { Router } from "express"
import multer from 'multer'
import multerConfig from './config/multer'

import UserController from "./app/controllers/UserController"
import SessionController from "./app/controllers/SessionController"
import ProductController from "./app/controllers/ProductController"
import authToken from "./app/middlewares/auth"
import CategoryController from "./app/controllers/CategoryController"
import OrderController from "./app/controllers/OrderController"
import { getFile } from "./s3"

const upload = multer(multerConfig)

const routes = new Router()

routes.post("/users", UserController.store)

routes.post("/sessions", SessionController.store)

/* */
routes.use(authToken)

routes.post("/products", upload.single('file'), ProductController.store)
routes.get('/products', ProductController.index)
routes.put('/products/:id', upload.single('file'), ProductController.update)
routes.get('/product-file/:key', async (req,res) => {
    const key = req.params.key
    const readFile = getFile(key)
    readFile.pipe(res)
})

routes.post("/categories", upload.single('file'), CategoryController.store)
routes.get('/categories', CategoryController.index)
routes.put('/categories/:id', upload.single('file'), CategoryController.update)

routes.post('/orders', OrderController.store)
routes.get('/orders', OrderController.index)
routes.put('/orders/:id', OrderController.update)

export default routes
