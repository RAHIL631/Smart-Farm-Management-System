const express = require('express');
const pool = require('../config/db');
const { auth, isFarmer } = require('../middleware/auth');

const router = express.Router();

// Create order
router.post('/', auth, async (req, res) => {
    try {
        const { items, shipping_address, payment_method } = req.body;
        let totalAmount = 0;
        for (const item of items) {
            const [product] = await pool.query('SELECT price, stock FROM products WHERE id = ?', [item.product_id]);
            if (product.length === 0) return res.status(400).json({ message: `Product ${item.product_id} not found.` });
            if (product[0].stock < item.quantity) return res.status(400).json({ message: `Insufficient stock for product ${item.product_id}.` });
            totalAmount += product[0].price * item.quantity;
        }

        const [order] = await pool.query(
            'INSERT INTO orders (user_id, total_amount, shipping_address, payment_method) VALUES (?, ?, ?, ?)',
            [req.user.id, totalAmount, shipping_address, payment_method || 'cod']
        );

        for (const item of items) {
            const [product] = await pool.query('SELECT farmer_id FROM products WHERE id = ?', [item.product_id]);
            await pool.query(
                'INSERT INTO order_items (order_id, product_id, farmer_id, quantity, price) VALUES (?, ?, ?, ?, (SELECT price FROM products WHERE id = ?))',
                [order.insertId, item.product_id, product[0].farmer_id, item.quantity, item.product_id]
            );
            await pool.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id]);
        }

        await pool.query('INSERT INTO payments (order_id, amount, method) VALUES (?, ?, ?)',
            [order.insertId, totalAmount, payment_method || 'cod']);

        res.status(201).json({ id: order.insertId, total_amount: totalAmount, message: 'Order placed successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error.', error: err.message });
    }
});

// Get user's orders
router.get('/', auth, async (req, res) => {
    try {
        const [orders] = await pool.query(
            `SELECT o.*, GROUP_CONCAT(p.name SEPARATOR ', ') as products
       FROM orders o LEFT JOIN order_items oi ON o.id = oi.order_id 
       LEFT JOIN products p ON oi.product_id = p.id 
       WHERE o.user_id = ? GROUP BY o.id ORDER BY o.created_at DESC`, [req.user.id]
        );
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// Get farmer's incoming orders
router.get('/farmer', auth, isFarmer, async (req, res) => {
    try {
        const [farmer] = await pool.query('SELECT id FROM farmers WHERE user_id = ?', [req.user.id]);
        const [orders] = await pool.query(
            `SELECT oi.*, o.status, o.shipping_address, o.created_at as order_date, p.name as product_name, p.image as product_image, u.name as customer_name
       FROM order_items oi JOIN orders o ON oi.order_id = o.id JOIN products p ON oi.product_id = p.id JOIN users u ON o.user_id = u.id
       WHERE oi.farmer_id = ? ORDER BY o.created_at DESC`, [farmer[0].id]
        );
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// Update order status
router.put('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
        if (status === 'delivered') {
            await pool.query("UPDATE payments SET status = 'completed' WHERE order_id = ?", [req.params.id]);
        }
        res.json({ message: 'Order status updated.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// Get farmer analytics
router.get('/farmer/analytics', auth, isFarmer, async (req, res) => {
    try {
        const [farmer] = await pool.query('SELECT id FROM farmers WHERE user_id = ?', [req.user.id]);
        const fid = farmer[0].id;

        const [totalSales] = await pool.query('SELECT COALESCE(SUM(oi.price * oi.quantity), 0) as total FROM order_items oi JOIN orders o ON oi.order_id = o.id WHERE oi.farmer_id = ? AND o.status != "cancelled"', [fid]);
        const [productsSold] = await pool.query('SELECT COALESCE(SUM(oi.quantity), 0) as total FROM order_items oi JOIN orders o ON oi.order_id = o.id WHERE oi.farmer_id = ? AND o.status != "cancelled"', [fid]);
        const [pendingOrders] = await pool.query('SELECT COUNT(DISTINCT oi.order_id) as total FROM order_items oi JOIN orders o ON oi.order_id = o.id WHERE oi.farmer_id = ? AND o.status = "pending"', [fid]);
        const [monthlyRevenue] = await pool.query(
            `SELECT DATE_FORMAT(o.created_at, '%Y-%m') as month, SUM(oi.price * oi.quantity) as revenue
       FROM order_items oi JOIN orders o ON oi.order_id = o.id WHERE oi.farmer_id = ? AND o.status != 'cancelled'
       GROUP BY month ORDER BY month DESC LIMIT 12`, [fid]
        );

        res.json({ totalSales: totalSales[0].total, productsSold: productsSold[0].total, pendingOrders: pendingOrders[0].total, monthlyRevenue });
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;
