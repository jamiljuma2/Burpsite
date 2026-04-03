const express = require('express');
const scanController = require('../controllers/scanController');

const router = express.Router();

router.post('/start', scanController.startScan);
router.get('/', scanController.getScans);
router.get('/:id', scanController.getScan);
router.delete('/:id', scanController.deleteScan);

module.exports = router;
