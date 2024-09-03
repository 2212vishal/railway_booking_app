const Train = require('../models/train');
const { ADMIN_KEY } = require('../config/auth');

exports.addTrain = async (req, res) => {
    const { adminKey, train_name, train_number, total_seats } = req.body;

    if (adminKey !== ADMIN_KEY) {
        return res.status(403).json({ message: 'Invalid admin key' });
    }

    try {
        const train = await Train.create({ train_name, train_number, total_seats });
        res.status(201).json(train);
    } catch (error) {
        res.status(500).json({ message: 'Error adding train', error: error.message });
    }
};
