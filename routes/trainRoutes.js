const express = require('express');
const router = express.Router();
const { addTrain } = require('../controllers/trainController');
const { API_KEY } = require('../config/auth');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.post('/add', authenticateToken, authorizeRole('admin'), (req, res, next) => {
    if (req.headers['api-key'] !== API_KEY) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    next();
}, addTrain);

module.exports = router;

