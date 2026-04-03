const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.get('/overview', adminController.getOverview);
router.get('/activity', adminController.getActivity);
router.get('/users', adminController.getUsers);
router.patch('/users/:id/role', adminController.updateUserRole);

module.exports = router;