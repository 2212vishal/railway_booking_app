const Booking = require('../models/booking');
const Seat = require('../models/seat');
const Train = require('../models/train');
const Station = require('../models/station');
const { Sequelize, Op } = require('sequelize');
const sequelize = require('../config/database');

exports.bookSeat = async (req, res) => {
    const { user_id, train_id, seat_id, source_station_id, destination_station_id, booking_date } = req.body;

    // Start the transaction
    const t = await sequelize.transaction();

    try {
        // Lock the seat row for update to prevent race conditions
        const seat = await Seat.findOne({
            where: { seat_id, train_id },
            lock: t.LOCK.UPDATE,  // Lock the seat for the transaction
            transaction: t
        });

        if (!seat) {
            await t.rollback();
            return res.status(404).json({ message: 'Seat not found' });
        }

        // Check for conflicting bookings where segments overlap
        const conflictingBookings = await Booking.findAll({
            where: {
                train_id,
                seat_id,
                [Op.or]: [
                    {
                        source_station_id: { [Op.lte]: source_station_id },
                        destination_station_id: { [Op.gt]: source_station_id }
                    },
                    {
                        source_station_id: { [Op.lt]: destination_station_id },
                        destination_station_id: { [Op.gte]: destination_station_id }
                    },
                    {
                        source_station_id: { [Op.gte]: source_station_id },
                        destination_station_id: { [Op.lte]: destination_station_id }
                    }
                ]
            },
            transaction: t
        });

        // If there are conflicting bookings, prevent this booking
        if (conflictingBookings.length > 0) {
            await t.rollback();
            return res.status(409).json({ message: 'Seat is not available for the requested segment.' });
        }

        // Create the booking
        const booking = await Booking.create({
            user_id,
            train_id,
            seat_id,
            source_station_id,
            destination_station_id,
            booking_date
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
    const { source_station_id, destination_station_id } = req.query;

    try {
        // Refined query to find available seats that are not booked for the specified route
        const availableSeats = await sequelize.query(
            `
            SELECT 
                s.seat_id,
                s.seat_number,
                t.train_id,
                t.train_name,
                t.train_number
            FROM 
                Seats s
            INNER JOIN 
                Trains t ON s.train_id = t.train_id
            LEFT JOIN 
                Bookings b ON s.seat_id = b.seat_id 
                AND (
                    (b.source_station_id <= :source_station_id AND b.destination_station_id > :source_station_id)
                    OR
                    (b.source_station_id < :destination_station_id AND b.destination_station_id >= :destination_station_id)
                )
            WHERE 
                b.booking_id IS NULL  -- Ensuring there are no bookings that overlap with the requested route segment
            AND 
                s.source_station_id <= :source_station_id 
            AND 
                s.destination_station_id >= :destination_station_id
            `,
            {
                replacements: {
                    source_station_id,
                    destination_station_id,
                },
                type: Sequelize.QueryTypes.SELECT
            }
        );

        if (availableSeats.length === 0) {
            return res.status(404).json({ message: 'No available seats for this route segment.' });
        }

        res.json(availableSeats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching availability', error: error.message });
    }
};



exports.getBookingDetails = async (req, res) => {
    const { booking_id } = req.params;

    try {
        // Fetch booking details with associated train, seat, and station information
        const booking = await Booking.findOne({
            where: { booking_id },
            include: [
                {
                    model: Train,
                    attributes: ['train_name', 'train_number']
                },
                {
                    model: Seat,
                    attributes: ['seat_number']
                },
                {
                    model: Station,
                    as: 'sourceStation',
                    attributes: ['station_name', 'station_code']
                },
                {
                    model: Station,
                    as: 'destinationStation',
                    attributes: ['station_name', 'station_code']
                }
            ]
        });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching booking details', error: error.message });
    }
};
