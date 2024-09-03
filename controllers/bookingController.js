const Booking = require('../models/booking');
const Seat = require('../models/seat');
const Train = require('../models/train');
const { Sequelize, Op } = require('sequelize');
const sequelize = require('../config/database');

exports.checkAvailability = async (req, res) => {
    const { source_station_id, destination_station_id } = req.query;
    try {
        const trains = await Train.findAll({
            include: [{
                model: Seat,
                where: {
                    [Op.not]: [
                        sequelize.literal(`(
                            SELECT COUNT(*) 
                            FROM Bookings 
                            WHERE Bookings.train_id = Train.train_id
                              AND Bookings.seat_id = Seat.seat_id
                              AND Bookings.source_station_id <= ${source_station_id}
                              AND Bookings.destination_station_id >= ${destination_station_id}
                        )`)
                    ]
                }
            }]
        });
        res.json(trains);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching availability', error: error.message });
    }
};


exports.bookSeat = async (req, res) => {
    const { user_id, train_id, seat_id, source_station_id, destination_station_id, booking_date } = req.body;
 
    const t = await sequelize.transaction();
    
    try {
        
        const seat = await Seat.findOne({
            where: { seat_id },
            lock: t.LOCK.UPDATE,  
            transaction: t
        });

        if (!seat) {
            await t.rollback();
            return res.status(404).json({ message: 'Seat not found' });
        }

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

        if (conflictingBookings.length > 0) {
            await t.rollback();
            return res.status(409).json({ message: 'Seat is not available for the requested segment.' });
        }

        const booking = await Booking.create({
            user_id,
            train_id,
            seat_id,
            source_station_id,
            destination_station_id,
            booking_date
        }, { transaction: t });

       
        await t.commit();
        res.status(201).json(booking);
    } catch (error) {
        
        await t.rollback();
        res.status(500).json({ message: 'Error booking seat', error: error.message });
    }
};

exports.getBookingDetails = async (req, res) => {
    const { booking_id } = req.params;
    try {
        const booking = await Booking.findOne({ where: { booking_id } });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching booking details', error: error.message });
    }
};
