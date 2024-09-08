const Train = require('../models/train');
const Station = require('../models/station');
const Seat = require('../models/seat');
const { ADMIN_KEY } = require('../config/auth');
const sequelize = require('../config/database');

exports.addTrain = async (req, res) => {
    const { adminKey, train_name, train_number, total_seats, stations } = req.body;

    if (adminKey !== ADMIN_KEY) {
        return res.status(403).json({ message: 'Invalid admin key' });
    }

    const t = await sequelize.transaction();

    try {
        // Create the Train
        const train = await Train.create({ train_name, train_number, total_seats }, { transaction: t });

        // Create the Stations associated with the Train
        const createdStations = [];
        for (let i = 0; i < stations.length; i++) {
            const station = await Station.create({
                station_name: stations[i].station_name,
                station_code: stations[i].station_code,
                train_id: train.train_id,
                order: i + 1,  // Order in the route
            }, { transaction: t });
            createdStations.push(station);
        }

        // Create the Seats for each segment of the route
        for (let i = 1; i <= total_seats; i++) {
            for (let j = 0; j < createdStations.length - 1; j++) {
                await Seat.create({
                    seat_number: `S${i}`,  // Assign a seat number like S1, S2, etc.
                    train_id: train.train_id,
                    source_station_id: createdStations[j].station_id, // Link to source station
                    destination_station_id: createdStations[j + 1].station_id, // Link to next station in the route
                }, { transaction: t });
            }
        }

        await t.commit();
        res.status(201).json(train);
    } catch (error) {
        await t.rollback();
        res.status(500).json({ message: 'Error adding train', error: error.message });
    }
};
