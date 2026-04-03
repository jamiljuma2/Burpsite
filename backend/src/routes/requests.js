const express = require('express');
const requestController = require('../controllers/requestController');

const router = express.Router();

router.get('/', requestController.getRequests);
router.post('/', requestController.createRequest);
router.get('/:id', requestController.getRequest);
router.post('/:id/repeat', requestController.repeatRequest);
router.delete('/:id', requestController.deleteRequest);

module.exports = router;
