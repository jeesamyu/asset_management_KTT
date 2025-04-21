const {
    Router
} = require('express')
const routes = new Router()

const {
    fetchAssetCategories,
    createAssetCategory,
    updateAssetCategory,
    deleteAssetCategory
} = require('../controllers/assetCategory.controller')

routes.get('/fetch', fetchAssetCategories)
routes.post('/create', createAssetCategory)
routes.post('/update', updateAssetCategory)
routes.post('/delete', deleteAssetCategory)

module.exports = routes