const express = require('express');
const router = express.Router();

const {
    getEmployeeList,
    getAssetList,
    getAvailableAssets
} = require('../controllers/helper.controller')

router.get('/getEmployeeList', getEmployeeList);
router.get('/getAssetList', getAssetList);
router.get('/availableAssets', getAvailableAssets);

module.exports = router;