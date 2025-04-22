const express = require('express');
const router = express.Router();

const {
  assignAssetToEmployee,
  issuedAssetHistoryFetch,
  updateProviedAsset,
  deleteAssignedAsset
} = require('../controllers/assetIssue.controller');

router.get('/fetch', issuedAssetHistoryFetch);
router.post('/assetIssue', assignAssetToEmployee);
router.post('/update', updateProviedAsset)
router.post('/delete', deleteAssignedAsset)

module.exports = router;