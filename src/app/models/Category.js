import Sequelize, { Model } from "sequelize";

const url = process.env.URL || 'http://localhost:3001'
const port = process.env.PORT || 3001

class Category extends Model {
    static init(sequelize) {
        super.init({
            name: Sequelize.STRING,
            path: Sequelize.STRING,
            url: {
                type: Sequelize.VIRTUAL,
                get(){
                    return `${url}:${port}/category-file/${this.path}`
                }
            }
        }, {
            sequelize
        })
        return this
    }
}

export default Category