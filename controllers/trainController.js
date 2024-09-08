const Train = require('../models/train');
const Station = require('../models/station');
const Seat = require('../models/seat');
const { ADMIN_KEY } = require('../config/auth');
const sequelize = require('../config/database');

exports.addTrain = async (req, res) => {
    const { adminKey, train_name, train_number, total_seats, stations } = req.body;

    // Check if the provided admin key is valid
    if (adminKey !== ADMIN_KEY) {
        return res.status(403).json({ message: 'Invalid admin key' });
    }

    // Start a transaction to ensure atomicity
    const t = await sequelize.transaction();

    try {
        // Create the Train using the provided model
        const train = await Train.create(
            { train_name, train_number, total_seats },
            { transaction: t }
        );

        // Create Stations associated with the train
        const createdStations = [];
        for (let i = 0; i < stations.length; i++) {
            const station = await Station.create({
                station_name: stations[i].station_name,
                station_code: stations[i].station_code,
                train_id: train.train_id,  // Link the station to the created train
                order: i + 1,  // Order in the train route
            }, { transaction: t });
            createdStations.push(station);
        }

        // Create Seats only once for the train, not for each segment
        for (let i = 1; i <= total_seats; i++) {
            await Seat.create({
                seat_number: `S${i}`,  // Seat number format, e.g., S1, S2, etc.
                train_id: train.train_id,  // Link the seat to the created train
            }, { transaction: t });
        }

        // Commit the transaction if everything is successful
        await t.commit();

        // Respond with the created train data
        res.status(201).json(train);
    } catch (error) {
        // Rollback the transaction in case of an error
        await t.rollback();
        res.status(500).json({ message: 'Error adding train', error: error.message });
    }
};
