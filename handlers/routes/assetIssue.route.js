const express = require('express');
const router = express.Router();

const {
  assignAssetToEmployee,
  issuedAssetHistoryFetch,
  updateProviedAsset,
  deleteAssignedAsset,
  issuedAssetReturnedByEmployee
} = require('../controllers/assetIssue.controller');

router.get('/fetch', issuedAssetHistoryFetch);
router.post('/assetIssue', assignAssetToEmployee);
router.post('/update', updateProviedAsset)
router.post('/delete', deleteAssignedAsset)
router.post('/return', issuedAssetReturnedByEmployee)

module.exports = router;