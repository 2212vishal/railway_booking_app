const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

module.exports = Booking;
