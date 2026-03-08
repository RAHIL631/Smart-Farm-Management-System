const express = require('express');
const pool = require('../config/db');
const { auth, isFarmer } = require('../middleware/auth');

const router = express.Router();

// Get all products with search/filter/pagination
router.get('/', async (req, res) => {
    try {
        const { search, category, min_price, max_price, organic, sort, page = 1, limit = 12 } = req.query;
        let query = `SELECT p.*, f.farm_name, f.farm_location, u.name as farmer_name 
                 FROM products p 
                 JOIN farmers f ON p.farmer_id = f.id 
                 JOIN users u ON f.user_id = u.id 
                 WHERE p.is_approved = TRUE AND p.stock > 0`;
        const params = [];

        if (search) { query += ' AND (p.name LIKE ? OR p.description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
        if (category) { query += ' AND p.category = ?'; params.push(category); }
        if (min_price) { query += ' AND p.price >= ?'; params.push(min_price); }
        if (max_price) { query += ' AND p.price <= ?'; params.push(max_price); }
        if (organic === 'true') { query += ' AND p.is_organic = TRUE'; }

        if (sort === 'price_asc') query += ' ORDER BY p.price ASC';
        else if (sort === 'price_desc') query += ' ORDER BY p.price DESC';
        else if (sort === 'rating') query += ' ORDER BY p.rating DESC';
        else query += ' ORDER BY p.created_at DESC';

        const offset = (page - 1) * limit;
        query += ' LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);

        const [products] = await pool.query(query, params);
        const [countResult] = await pool.query('SELECT COUNT(*) as total FROM products WHERE is_approved = TRUE AND stock > 0');

        res.json({ products, total: countResult[0].total, page: parseInt(page), totalPages: Math.ceil(countResult[0].total / limit) });
    } catch (err) {
        res.status(500).json({ message: 'Server error.', error: err.message });
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const [products] = await pool.query(
            `SELECT p.*, f.farm_name, f.farm_location, f.description as farm_desc, u.name as farmer_name, u.avatar as farmer_avatar
       FROM products p JOIN farmers f ON p.farmer_id = f.id JOIN users u ON f.user_id = u.id WHERE p.id = ?`, [req.params.id]
        );
        if (products.length === 0) return res.status(404).json({ message: 'Product not found.' });

        const [reviews] = await pool.query(
            'SELECT r.*, u.name as user_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.product_id = ? ORDER BY r.created_at DESC LIMIT 10',
            [req.params.id]
        );
        res.json({ ...products[0], reviews });
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// Create product (farmer only)
router.post('/', auth, isFarmer, async (req, res) => {
    try {
        const { name, description, price, unit, category, stock, image, is_organic } = req.body;
        const [farmer] = await pool.query('SELECT id FROM farmers WHERE user_id = ?', [req.user.id]);
        if (farmer.length === 0) return res.status(400).json({ message: 'Farmer profile not found.' });

        const [result] = await pool.query(
            'INSERT INTO products (farmer_id, name, description, price, unit, category, stock, image, is_organic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [farmer[0].id, name, description, price, unit || 'kg', category || 'other', stock || 0, image || null, is_organic || false]
        );
        res.status(201).json({ id: result.insertId, message: 'Product created successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error.', error: err.message });
    }
});

// Update product
router.put('/:id', auth, isFarmer, async (req, res) => {
    try {
        const { name, description, price, unit, category, stock, image, is_organic } = req.body;
        const [farmer] = await pool.query('SELECT id FROM farmers WHERE user_id = ?', [req.user.id]);
        await pool.query(
            'UPDATE products SET name=?, description=?, price=?, unit=?, category=?, stock=?, image=?, is_organic=? WHERE id=? AND farmer_id=?',
            [name, description, price, unit, category, stock, image, is_organic, req.params.id, farmer[0].id]
        );
        res.json({ message: 'Product updated successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// Delete product
router.delete('/:id', auth, async (req, res) => {
    try {
        if (req.user.role === 'admin') {
            await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
        } else {
            const [farmer] = await pool.query('SELECT id FROM farmers WHERE user_id = ?', [req.user.id]);
            await pool.query('DELETE FROM products WHERE id = ? AND farmer_id = ?', [req.params.id, farmer[0].id]);
        }
        res.json({ message: 'Product deleted successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// Get farmer's own products
router.get('/farmer/my', auth, isFarmer, async (req, res) => {
    try {
        const [farmer] = await pool.query('SELECT id FROM farmers WHERE user_id = ?', [req.user.id]);
        const [products] = await pool.query('SELECT * FROM products WHERE farmer_id = ? ORDER BY created_at DESC', [farmer[0].id]);
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;
