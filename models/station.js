const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Station = sequelize.define('Station', {
    station_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    station_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    station_code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
});

module.exports = Station;
