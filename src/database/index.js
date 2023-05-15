import Sequelize from 'sequelize'
import mongoose from 'mongoose'

import User from '../app/models/User'
import configDatabase from '../config/database'
import Product from '../app/models/Product'
import Category from '../app/models/Category'
import * as dotenv from 'dotenv'

dotenv.config()

const models = [User, Product, Category]

class Database {
    constructor() {
        this.init()
        this.mongo()
    }

    init() {
        this.connection = new Sequelize(configDatabase)
        try {
            this.connection.authenticate();
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
        models.map((model) => model.init(this.connection)).map(model => model.associate && model.associate(this.connection.models))
    }

    mongo() {
        this.mongoConnection = mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => "MongoDB Atlas Connected").catch((error) => console.log(error))
    }
}

export default new Database()