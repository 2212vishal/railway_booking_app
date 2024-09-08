const express = require('express');
const cors = require('cors');
const app = express();
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const trainRoutes = require('./routes/trainRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

app.use(cors());
app.use(express.json());

// Add a GET route for "/"
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/trains', trainRoutes);
app.use('/api/v1/bookings', bookingRoutes);

const PORT = process.env.PORT || 4000;

sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
