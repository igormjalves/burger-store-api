import * as Yup from 'yup'
import Category from '../models/Category'
import User from '../models/User'

import {uploadFile} from '../../s3'

class CategoryController {
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required()
        })

        try {
            schema.validateSync(req.body, {abortEarly: false})
        } catch(err) {
            return res.status(400).json({ errors: err.errors })
        }

        const { admin: isAdmin } = await User.findByPk(req.userId)

        if(!isAdmin) { return res.status(401).json({error: 'You do not have sufficient privileges to perform this action.'}) }

        const {name} = req.body

        const categoryExists = await Category.findOne({
            where: { name }
        })

        if(categoryExists) {
            return res.status(400).json({ error: 'Category already exists.'})
        }

        const file = req.file
        const result = await uploadFile(file)
        const path = result.Key

        const { id } = await Category.create({ name, path })

        return res.status(201).json({ id , name })
    }

    async index(req, res) {
        const categories = await Category.findAll()

        return res.json(categories)
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required()
        })

        try {
            schema.validateSync(req.body, {abortEarly: false})
        } catch(err) {
            return res.status(400).json({ errors: err.errors })
        }

        const { admin: isAdmin } = await User.findByPk(req.userId)

        if(!isAdmin) { return res.status(401).json({error: 'You do not have sufficient privileges to perform this action.'}) }

        const {name} = req.body
        const {id} = req.params

        const categoryExists = await Category.findByPk(id)

        if(!categoryExists) {
            return res.status(400).json({ error: 'Category does not exist.'})
        }

        let path
        if(req.file) {path = req.file.filename} 

        await Category.update({ name, path }, {where: {id}})

        return res.status(201).json({ message: "Category updated sucessfully." })
    }
}

export default new CategoryController()