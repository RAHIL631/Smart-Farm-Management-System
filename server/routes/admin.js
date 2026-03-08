const express = require('express');
const pool = require('../config/db');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all users
router.get('/users', auth, isAdmin, async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, name, email, role, phone, created_at FROM users ORDER BY created_at DESC');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// Delete user
router.delete('/users/:id', auth, isAdmin, async (req, res) => {
    try {
        await pool.query('DELETE FROM users WHERE id = ? AND role != "admin"', [req.params.id]);
        res.json({ message: 'User deleted.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// Get all products for moderation
router.get('/products', auth, isAdmin, async (req, res) => {
    try {
        const [products] = await pool.query(
            'SELECT p.*, f.farm_name, u.name as farmer_name FROM products p JOIN farmers f ON p.farmer_id = f.id JOIN users u ON f.user_id = u.id ORDER BY p.created_at DESC'
        );
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// Approve/reject product
router.put('/products/:id/approve', auth, isAdmin, async (req, res) => {
    try {
        const { is_approved } = req.body;
        await pool.query('UPDATE products SET is_approved = ? WHERE id = ?', [is_approved, req.params.id]);
        res.json({ message: `Product ${is_approved ? 'approved' : 'rejected'}.` });
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// Get all orders
router.get('/orders', auth, isAdmin, async (req, res) => {
    try {
        const [orders] = await pool.query(
            `SELECT o.*, u.name as customer_name, u.email as customer_email
       FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC`
        );
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// Platform analytics
router.get('/analytics', auth, isAdmin, async (req, res) => {
    try {
        const [totalUsers] = await pool.query('SELECT COUNT(*) as total FROM users');
        const [totalFarmers] = await pool.query("SELECT COUNT(*) as total FROM users WHERE role = 'farmer'");
        const [totalOrders] = await pool.query('SELECT COUNT(*) as total FROM orders');
        const [totalRevenue] = await pool.query("SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE status != 'cancelled'");
        const [recentOrders] = await pool.query(
            `SELECT o.*, u.name as customer_name FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC LIMIT 10`
        );
        const [monthlyOrders] = await pool.query(
            `SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as orders, SUM(total_amount) as revenue
       FROM orders WHERE status != 'cancelled' GROUP BY month ORDER BY month DESC LIMIT 12`
        );

        res.json({ totalUsers: totalUsers[0].total, totalFarmers: totalFarmers[0].total, totalOrders: totalOrders[0].total, totalRevenue: totalRevenue[0].total, recentOrders, monthlyOrders });
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// Verify farmer
router.put('/farmers/:id/verify', auth, isAdmin, async (req, res) => {
    try {
        await pool.query('UPDATE farmers SET is_verified = TRUE WHERE id = ?', [req.params.id]);
        res.json({ message: 'Farmer verified.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;
