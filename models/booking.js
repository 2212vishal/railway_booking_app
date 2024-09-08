const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Train = require('./train');

const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, // This links to the User model
            key: 'user_id',
        },
        onDelete: 'CASCADE',
    },
    train_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Train, // This links to the Train model
            key: 'train_id',
        },
        onDelete: 'CASCADE',
    },
    seatsBooked: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1, // Default to 1 seat booked unless specified
    },
    bookingDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // Automatically set booking date to the current timestamp
    },
}, {
    tableName: 'bookings', // Name of the table in MySQL
    timestamps: false, // Disables the createdAt and updatedAt timestamps
});

Booking.belongsTo(User, { foreignKey: 'user_id' });
Booking.belongsTo(Train, { foreignKey: 'train_id' });

module.exports = Booking;
