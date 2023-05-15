import * as Yup from 'yup'
import Product from '../models/Product'
import Category from '../models/Category'
import Order from '../schemas/Order'
import User from '../models/User'

class OrderController {
    async store(req, res) {
        
        const schema = Yup.object().shape({
            products: Yup.array().required().of(
                Yup.object().shape({
                    id: Yup.number().required(),
                    quantity: Yup.number().required()
                })
            )
        })

        try {
            schema.validateSync(req.body, {abortEarly: false})
        } catch(err) {
            return res.status(400).json({ errors: err.errors })
        }

        const productsId = req.body.products.map(product => product.id)

        const orderProducts = await Product.findAll({
            where: {
                id: productsId
            },
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['name']
                }
            ]
        })

        const persistOrderProduct = orderProducts.map(orderProduct => {
            const productIndex = req.body.products.findIndex(
                product => product.id === orderProduct.id
            )

            const dbOrderProduct = {
                id: orderProduct.id,
                name: orderProduct.name,
                price: orderProduct.price,
                category: orderProduct.category.name,
                url: orderProduct.url,
                quantity: req.body.products[productIndex].quantity
            }

            return dbOrderProduct
        })
        
        const order = {
            user: {
                id: req.userId,
                name: req.userName
            },
            products: persistOrderProduct,
            status: 'Order placed'
        }

        const orderResponse = await Order.create(order)
        
        return res.status(201).json(orderResponse)
    }

    async index(req,res) {
        const orders = await Order.find()

        return res.json(orders)
    }

    async update(req,res){
        const schema = Yup.object().shape({
            status: Yup.string().required()
        })

        try {
            schema.validateSync(req.body, {abortEarly: false})
        } catch(err) {
            return res.status(400).json({ errors: err.errors })
        }

        const { admin: isAdmin } = await User.findByPk(req.userId)

        if(!isAdmin) { return res.status(401).json({error: 'You do not have sufficient privileges to perform this action.'}) }
        
        const {id} = req.params
        const {status} = req.body

        try {
            Order.updateOne({_id: id }, {status})
        } catch (error) {
            return res.status(400).json({ error: error.message })
        }

        return res.json({ message: "Order status updated successfully."})
    }

}

export default new OrderController()
