const express = require('express');
const router = express.Router();
const { checkAvailability, bookSeat, getBookingDetails,getAllBookings } = require('../controllers/bookingController');
const { authenticateToken,authorizeRole } = require('../middleware/authMiddleware');

router.get('/availability', checkAvailability);
router.post('/book', authenticateToken, bookSeat);
router.get('/bookingdetails', authenticateToken, getBookingDetails);
router.get('/admin/bookingdetails',authenticateToken,authorizeRole("admin"),getAllBookings)
module.exports = router;
