const express = require('express');
const intruderController = require('../controllers/intruderController');

const router = express.Router();

router.post('/start', intruderController.startAttack);
router.get('/attack/:attackId', intruderController.getAttackResults);
router.get('/payloads', intruderController.getPayloads);

module.exports = router;
