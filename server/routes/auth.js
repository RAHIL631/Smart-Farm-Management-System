const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { auth } = require('../middleware/auth');
require('dotenv').config();

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role, phone, address, farm_name, farm_location, description } = req.body;
        const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ message: 'Email already registered.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password, role, phone, address) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, hashedPassword, role || 'consumer', phone || null, address || null]
        );

        if (role === 'farmer') {
            await pool.query(
                'INSERT INTO farmers (user_id, farm_name, farm_location, description) VALUES (?, ?, ?, ?)',
                [result.insertId, farm_name || name + "'s Farm", farm_location || '', description || '']
            );
        }

        const token = jwt.sign({ id: result.insertId, role: role || 'consumer' }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: result.insertId, name, email, role: role || 'consumer' } });
    } catch (err) {
        res.status(500).json({ message: 'Server error.', error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(400).json({ message: 'Invalid credentials.' });

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        let farmerData = null;
        if (user.role === 'farmer') {
            const [farmers] = await pool.query('SELECT * FROM farmers WHERE user_id = ?', [user.id]);
            farmerData = farmers[0] || null;
        }

        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, farmer: farmerData } });
    } catch (err) {
        res.status(500).json({ message: 'Server error.', error: err.message });
    }
});

// Get current user
router.get('/me', auth, async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, name, email, role, phone, address, avatar, created_at FROM users WHERE id = ?', [req.user.id]);
        if (users.length === 0) return res.status(404).json({ message: 'User not found.' });

        let farmerData = null;
        if (users[0].role === 'farmer') {
            const [farmers] = await pool.query('SELECT * FROM farmers WHERE user_id = ?', [req.user.id]);
            farmerData = farmers[0] || null;
        }

        res.json({ ...users[0], farmer: farmerData });
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;
