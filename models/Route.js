const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Train = require('./train');
const Station = require('./station');

const Route = sequelize.define('Route', {
    route_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    train_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    start_station_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    end_station_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    departure_time: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    arrival_time: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});

Route.belongsTo(Train, { foreignKey: 'train_id' });
Route.belongsTo(Station, { as: 'startStation', foreignKey: 'start_station_id' });
Route.belongsTo(Station, { as: 'endStation', foreignKey: 'end_station_id' });

module.exports = Route;
