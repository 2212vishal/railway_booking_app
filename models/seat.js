const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Seat = sequelize.define('Seat', {
    seat_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    seat_number: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Seat;
