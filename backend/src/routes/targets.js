const express = require('express');
const targetController = require('../controllers/targetController');

const router = express.Router();

router.post('/crawl', targetController.crawlTarget);
router.get('/', targetController.getTargets);
router.get('/:id', targetController.getTarget);
router.delete('/:id', targetController.deleteTarget);

module.exports = router;
