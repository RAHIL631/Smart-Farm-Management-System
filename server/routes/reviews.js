const express = require('express');
const pool = require('../config/db');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Add review
router.post('/', auth, async (req, res) => {
    try {
        const { product_id, rating, comment } = req.body;
        await pool.query('INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)',
            [req.user.id, product_id, rating, comment]);

        const [avg] = await pool.query('SELECT AVG(rating) as avg_rating, COUNT(*) as total FROM reviews WHERE product_id = ?', [product_id]);
        await pool.query('UPDATE products SET rating = ?, total_reviews = ? WHERE id = ?',
            [avg[0].avg_rating, avg[0].total, product_id]);

        res.status(201).json({ message: 'Review added successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// Get product reviews
router.get('/product/:id', async (req, res) => {
    try {
        const [reviews] = await pool.query(
            'SELECT r.*, u.name as user_name, u.avatar as user_avatar FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.product_id = ? ORDER BY r.created_at DESC',
            [req.params.id]
        );
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;
