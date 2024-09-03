const express = require('express');
const router = express.Router();
const { checkAvailability, bookSeat, getBookingDetails } = require('../controllers/bookingController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/availability', checkAvailability);
router.post('/book', authenticateToken, bookSeat);
router.get('/booking/:booking_id', authenticateToken, getBookingDetails);

module.exports = router;
