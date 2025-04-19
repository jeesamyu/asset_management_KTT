module.exports = {
    connectionDetails: {
        username: process.env.ASSET_DB_USERNAME,
        password: process.env.ASSET_DB_PASSWORD,
        database: process.env.ASSET_DB_DATABSE,
        host: process.env.ASSET_DB_HOST,
        dialect: process.env.ASSET_DB_DIALECT
    }
}