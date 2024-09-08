const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Train = require('./train');
const Seat = require('./seat');
const Station = require('./station');

const Booking = sequelize.define('Booking', {
    booking_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    train_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    seat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    source_station_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    destination_station_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    booking_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('confirmed', 'cancelled'),
        defaultValue: 'confirmed',
    },
});

Booking.belongsTo(User, { foreignKey: 'user_id' });
Booking.belongsTo(Train, { foreignKey: 'train_id' });
Booking.belongsTo(Seat, { foreignKey: 'seat_id' });
Booking.belongsTo(Station, { as: 'sourceStation', foreignKey: 'source_station_id' });
Booking.belongsTo(Station, { as: 'destinationStation', foreignKey: 'destination_station_id' });

module.exports = Booking;
