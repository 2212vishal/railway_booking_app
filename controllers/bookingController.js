const Booking = require('../models/booking');
const Seat = require('../models/seat');
const Train = require('../models/train');
const { Sequelize, Op } = require('sequelize');
const sequelize = require('../config/database');

exports.bookSeat = async (req, res) => {
    // console.log(req.body);
    const { userId, trainId, seatsBooked } = req.body;

    // Start the transaction
    const t = await sequelize.transaction();

    try {
        // Lock the seat row for update to prevent race conditions
        const train = await Train.findOne({
            where: { train_id: trainId },
            lock: t.LOCK.UPDATE,  // Lock the train to prevent concurrent seat bookings
            transaction: t
        });
        // console.log(train);
        if (!train) {
            await t.rollback();
            return res.status(404).json({ message: 'Train not found' });
        }

        // Check if enough seats are available
        if (train.total_seats < seatsBooked) {
            await t.rollback();
            return res.status(409).json({ message: 'Not enough seats available' });
        }

        // Reduce available seats
        train.total_seats -= seatsBooked;
        console.log(train.total_seats);
        await train.save({ transaction: t });

        // Create the booking
        const booking = await Booking.create({
            user_id:userId,
            train_id:trainId,
            seatsBooked:seatsBooked,
            bookingDate: new Date(),
        }, { transaction: t });
        

        // Commit the transaction if everything is successful
        await t.commit();
        res.status(201).json(booking);
    } catch (error) {
        // Rollback the transaction in case of any failure
        await t.rollback();
        res.status(500).json({ message: 'Error booking seat', error: error.message });
    }
};

exports.checkAvailability = async (req, res) => {
    console.log(req.query);
    const { train_id } = req.query;
    
    try {
        // Check train seat availability
        const train = await Train.findOne({
            where: { train_id: train_id },
            attributes: ['train_name', 'train_number', 'total_seats']
        });

        if (!train) {
            return res.status(404).json({ message: 'Train not found' });
        }

        res.json({ availableSeats: train.total_seats, train });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching availability', error: error.message });
    }
};

exports.getBookingDetails = async (req, res) => {
    const { userId } = req.query; // Get userId from query parameters
    
    try {
        // Fetch booking details for the specified user
        const bookings = await Booking.findAll({
            where: { user_id: userId }, // Fetch all bookings for the user
            include: [
                {
                    model: Train,
                    attributes: ['train_name', 'train_number']
                }
            ]
        });

        if (bookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found for the specified user' });
        }

        res.json({
            bookings,
            confirmed: bookings.length > 0 // Indicate that bookings are available
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching booking details', error: error.message });
    }
};

exports.getAllBookings = async (req, res) => {

    try {
        const bookings = await Booking.findAll({
            include: [
                {
                    model: Train,
                    attributes: ['train_name', 'train_number']
                }
            ]
        });

        if (bookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found' });
        }

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
};