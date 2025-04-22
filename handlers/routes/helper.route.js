const express = require('express');
const router = express.Router();

const {
    getEmployeeList,
    getAssetList
} = require('../controllers/helper.controller')

router.get('/getEmployeeList', getEmployeeList);
router.get('/getAssetList', getAssetList);

module.exports = router;