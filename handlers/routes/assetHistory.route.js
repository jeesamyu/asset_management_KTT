const express = require('express');
const router = express.Router();
const {
    fetchAssetHistory
} = require('../controllers/assetHistory.controller')

router.get('/fetch', fetchAssetHistory)

module.exports = router;