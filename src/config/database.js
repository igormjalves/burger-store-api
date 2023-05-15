import * as dotenv from 'dotenv'
dotenv.config()

module.exports = {
    dialect: 'postgres',
    host: process.env.POSTGRES_HOST,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false,
        }
    },
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true
    }
}