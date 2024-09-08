const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, ADMIN_KEY } = require('../config/auth');

exports.register = async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ where: { username } });

        if (existingUser) {
            return res.status(409).json({ message: `User with the username "${username}" already exists.` });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ username, password: hashedPassword, role });

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

exports.login = async (req, res) => {
    const { username, password, adminKey } = req.body;

    try {
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (user.role === 'admin' && adminKey !== ADMIN_KEY) {
            return res.status(403).json({ message: 'Invalid admin key' });
        }

        const token = jwt.sign({ user_id: user.user_id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};
