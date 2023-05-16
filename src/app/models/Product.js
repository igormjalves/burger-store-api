import Sequelize, { Model } from "sequelize";
import * as dotenv from 'dotenv'

dotenv.config()


const url = process.env.STORAGE_URL || 'http://localhost'
// const port = process.env.PORT || 3001

class Product extends Model {
    static init(sequelize) {
        super.init({
            name: Sequelize.STRING,
            price: Sequelize.INTEGER,
            path: Sequelize.STRING,
            offer: Sequelize.BOOLEAN,
            url: {
                type: Sequelize.VIRTUAL,
                get(){
                    return `${url}/${this.path}`
                }
            }
        }, {
            sequelize
        })
        return this
    }

    static associate(models) {
        this.belongsTo(models.Category, {
            foreignKey: 'category_id', as: 'category'
        })
    }
}

export default Product