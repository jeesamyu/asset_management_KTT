const { Sequelize } = require('sequelize') 
const dbConfigs = require('../../config/config').connectionDetails

const myDatabase = new Sequelize(
    dbConfigs.database,
    dbConfigs.username,
    dbConfigs.password,
    {
        host: dbConfigs.host,
        dialect: dbConfigs.dialect
    }
)

module.exports = {myDatabase}