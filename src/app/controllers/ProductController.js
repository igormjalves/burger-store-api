import * as Yup from 'yup'
import Product from '../models/Product'
import Category from '../models/Category'
import User from '../models/User'

import {uploadFile} from '../../s3'

class ProductController {
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            price: Yup.number().required(),
            category_id: Yup.number(),
            offer: Yup.boolean()
        })

        try {
            schema.validateSync(req.body, {abortEarly: false})
        } catch(err) {
            return res.status(400).json({ errors: err.errors })
        }

        const { admin: isAdmin } = await User.findByPk(req.userId)

        if(!isAdmin) { return res.status(401).json({error: 'You do not have sufficient privileges to perform this action.'}) }

        const file = req.file
        const result = await uploadFile(file)
        console.log(result)
        const path = result.Key

        const {name, price, category_id, offer} = req.body

        const product = await Product.create({
            name,
            price,
            category_id,
            path,
            offer
        })

        return res.status(201).json(product)
    }

    async index(req, res) {
        const products = await Product.findAll({
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name']
                }
            ]
        })

        return res.json(products)
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string(),
            price: Yup.number(),
            category_id: Yup.number(),
            offer: Yup.boolean()
        })

        try {
            schema.validateSync(req.body, {abortEarly: false})
        } catch(err) {
            return res.status(400).json({ errors: err.errors })
        }

        const { admin: isAdmin } = await User.findByPk(req.userId)

        if(!isAdmin) { return res.status(401).json({error: 'You do not have sufficient privileges to perform this action.'}) }

        const { id } = req.params

        const productExists = await Product.findByPk(id)

        if(!productExists) {return res.status(401).json({ error: "Product does not exist in the Database."})}

        let path
        if(req.file) {path = req.file.filename} 
        
        const {name, price, category_id, offer} = req.body

        await Product.update({
            name,
            price,
            category_id,
            path,
            offer
        }, {where: {id}})

        return res.status(201).json({ message: "Product updated sucessfully." })
    }
}

export default new ProductController()