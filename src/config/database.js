module.exports = {
    dialect: 'postgres',
    host: 'ep-mute-smoke-215286.us-east-2.aws.neon.tech',
    username: 'igormjalves',
    password: 'in9QTNRWDf3I',
    database: 'neondb',
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

// postgres://igormjalves:in9QTNRWDf3I@ep-mute-smoke-215286.us-east-2.aws.neon.tech/neondb?options=project%3Dburger-store-database