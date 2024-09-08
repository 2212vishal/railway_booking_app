const express = require('express');
const router = express.Router();
const { addTrain } = require('../controllers/trainController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.post('/add', authenticateToken, authorizeRole('admin'), addTrain);

module.exports = router;
