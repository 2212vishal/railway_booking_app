const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Train = sequelize.define('Train', {
    train_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    train_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    train_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    total_seats: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

module.exports = Train;
