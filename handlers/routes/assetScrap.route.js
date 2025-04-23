const express = require('express');
const router = express.Router()
const {
    assetsToScrapList,
    moveAssetsToScrapList,
} = require('../controllers/assetScrap.controller');

router.get('/assetsList', assetsToScrapList)
router.post('/scrapAsset', moveAssetsToScrapList)

module.exports = router