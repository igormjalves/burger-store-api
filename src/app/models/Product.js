import Sequelize, { Model } from "sequelize";

// const url = process.env.URL || 'http://localhost:3001'
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
                    return `/product-file/${this.path}`
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