const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Train = require('./train');
const Station = require('./station');

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
    train_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    is_booked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

Seat.belongsTo(Train, { foreignKey: 'train_id' });

module.exports = Seat;
