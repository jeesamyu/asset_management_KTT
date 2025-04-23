const {
    Router
} = require('express')
const routes = new Router()
const {
    fetchAssets,
    createAsset,
    fetchAssetMasterDropdowns,
    updateAssets,
    deleteAssets
} = require('../controllers/assets.controller')

routes.get('/fetch', fetchAssets)
routes.post('/create', createAsset)
routes.post('/update', updateAssets)
routes.post('/delete', deleteAssets)
routes.get('/categoriesAndStatus', fetchAssetMasterDropdowns)

module.exports = routes