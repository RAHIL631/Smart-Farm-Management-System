import { useState, useEffect } from 'react';
import { getMyProducts, createProduct, updateProduct, deleteProduct, getFarmerOrders, getFarmerAnalytics, updateOrderStatus } from '../api';
import { useAuth } from '../AuthContext';
import { FiPlus, FiEdit3, FiTrash2, FiDollarSign, FiPackage, FiTrendingUp, FiClock, FiX, FiHome, FiBox, FiShoppingBag, FiBarChart2 } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const demoAnalytics = {
    totalSales: 125000, productsSold: 450, pendingOrders: 8,
    monthlyRevenue: [
        { month: '2025-10', revenue: 15000 }, { month: '2025-11', revenue: 22000 },
        { month: '2025-12', revenue: 18000 }, { month: '2026-01', revenue: 28000 },
        { month: '2026-02', revenue: 32000 }, { month: '2026-03', revenue: 10000 },
    ]
};

const demoProducts = [
    { id: 1, name: 'Organic Tomatoes', price: 60, unit: 'kg', category: 'vegetables', stock: 50, is_organic: true, rating: 4.5 },
    { id: 2, name: 'Fresh Spinach', price: 40, unit: 'bundle', category: 'vegetables', stock: 80, is_organic: true, rating: 4.4 },
    { id: 3, name: 'Basmati Rice', price: 120, unit: 'kg', category: 'grains', stock: 200, is_organic: false, rating: 4.6 },
];

const demoOrders = [
    { id: 1, product_name: 'Organic Tomatoes', customer_name: 'Priya Sharma', quantity: 5, price: 60, status: 'pending', order_date: '2026-03-07' },
    { id: 2, product_name: 'Fresh Spinach', customer_name: 'Amit Patel', quantity: 3, price: 40, status: 'confirmed', order_date: '2026-03-06' },
    { id: 3, product_name: 'Basmati Rice', customer_name: 'Deepa Kumar', quantity: 10, price: 120, status: 'delivered', order_date: '2026-03-05' },
];

export default function FarmerDashboard() {
    const { user } = useAuth();
    const [tab, setTab] = useState('dashboard');
    const [products, setProducts] = useState(demoProducts);
    const [orders, setOrders] = useState(demoOrders);
    const [analytics, setAnalytics] = useState(demoAnalytics);
    const [showModal, setShowModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [productForm, setProductForm] = useState({ name: '', description: '', price: '', unit: 'kg', category: 'vegetables', stock: '', is_organic: false });
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [pRes, oRes, aRes] = await Promise.all([getMyProducts(), getFarmerOrders(), getFarmerAnalytics()]);
                setProducts(pRes.data);
                setOrders(oRes.data);
                setAnalytics(aRes.data);
            } catch { }
        };
        loadData();
    }, []);

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        try {
            if (editProduct) {
                await updateProduct(editProduct.id, productForm);
                setProducts(products.map(p => p.id === editProduct.id ? { ...p, ...productForm } : p));
            } else {
                const res = await createProduct(productForm);
                setProducts([{ ...productForm, id: res?.data?.id || Date.now() }, ...products]);
            }
        } catch {
            if (editProduct) setProducts(products.map(p => p.id === editProduct.id ? { ...p, ...productForm } : p));
            else setProducts([{ ...productForm, id: Date.now(), rating: 0 }, ...products]);
        }
        setShowModal(false);
        setEditProduct(null);
        setProductForm({ name: '', description: '', price: '', unit: 'kg', category: 'vegetables', stock: '', is_organic: false });
    };

    const handleDelete = async (id) => {
        try { await deleteProduct(id); } catch { }
        setProducts(products.filter(p => p.id !== id));
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try { await updateOrderStatus(orderId, newStatus); } catch { }
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    };

    const openEdit = (p) => {
        setEditProduct(p);
        setProductForm({ name: p.name, description: p.description || '', price: p.price, unit: p.unit, category: p.category, stock: p.stock, is_organic: p.is_organic });
        setShowModal(true);
    };

    const menuItems = [
        { id: 'dashboard', icon: <FiHome />, label: 'Dashboard' },
        { id: 'products', icon: <FiBox />, label: 'My Products' },
        { id: 'orders', icon: <FiShoppingBag />, label: 'Orders' },
        { id: 'analytics', icon: <FiBarChart2 />, label: 'Analytics' },
    ];

    const stats = [
        { label: 'Total Sales', value: `₹${(analytics.totalSales || 0).toLocaleString()}`, icon: <FiDollarSign />, color: 'from-green-500 to-emerald-600' },
        { label: 'Products Sold', value: analytics.productsSold || 0, icon: <FiPackage />, color: 'from-blue-500 to-indigo-600' },
        { label: 'Pending Orders', value: analytics.pendingOrders || 0, icon: <FiClock />, color: 'from-amber-500 to-orange-600' },
        { label: 'Active Products', value: products.length, icon: <FiTrendingUp />, color: 'from-purple-500 to-pink-600' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-16">
            {/* Mobile sidebar toggle */}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden fixed top-[72px] left-4 z-40 bg-white shadow-lg rounded-xl p-2">
                <FiBox />
            </button>

            {/* Sidebar */}
            <aside className={`fixed top-[64px] left-0 h-[calc(100vh-64px)] w-64 bg-white shadow-lg border-r border-gray-100 z-30 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="p-5 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-xl">👨‍🌾</div>
                        <div>
                            <div className="font-semibold text-gray-800 text-sm">{user?.name || 'Farmer'}</div>
                            <div className="text-xs text-primary-600">Farmer Account</div>
                        </div>
                    </div>
                </div>
                <nav className="p-3 space-y-1">
                    {menuItems.map(item => (
                        <button key={item.id} onClick={() => { setTab(item.id); setSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${tab === item.id ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                            {item.icon} {item.label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main content */}
            <main className="lg:ml-64 p-6">
                {/* Dashboard Tab */}
                {tab === 'dashboard' && (
                    <div className="animate-fade-in-up">
                        <h1 className="text-2xl font-extrabold text-gray-800 mb-6">Welcome back, {user?.name?.split(' ')[0] || 'Farmer'} 🌾</h1>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            {stats.map((s, i) => (
                                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 card-hover">
                                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white text-lg mb-3`}>{s.icon}</div>
                                    <div className="text-2xl font-extrabold text-gray-800">{s.value}</div>
                                    <div className="text-sm text-gray-500">{s.label}</div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-4">Monthly Revenue</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={analytics.monthlyRevenue || []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="revenue" stroke="#4CAF50" fill="#4CAF50" fillOpacity={0.15} strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Products Tab */}
                {tab === 'products' && (
                    <div className="animate-fade-in-up">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-extrabold text-gray-800">My Products</h1>
                            <button onClick={() => { setEditProduct(null); setProductForm({ name: '', description: '', price: '', unit: 'kg', category: 'vegetables', stock: '', is_organic: false }); setShowModal(true); }}
                                className="btn-primary px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2">
                                <FiPlus /> Add Product
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {products.map(p => (
                                <div key={p.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 card-hover">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-bold text-gray-800">{p.name}</h3>
                                            <span className="text-xs text-gray-500 capitalize">{p.category}</span>
                                        </div>
                                        <div className="flex gap-1">
                                            <button onClick={() => openEdit(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><FiEdit3 className="text-sm" /></button>
                                            <button onClick={() => handleDelete(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><FiTrash2 className="text-sm" /></button>
                                        </div>
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <div className="text-xl font-bold text-primary-700">₹{p.price}<span className="text-sm text-gray-400 font-normal">/{p.unit}</span></div>
                                            <div className="text-xs text-gray-500 mt-1">Stock: {p.stock} {p.is_organic && '• 🌿 Organic'}</div>
                                        </div>
                                        <div className={`text-xs font-bold px-2 py-1 rounded-full ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {p.stock > 0 ? 'Active' : 'Out of Stock'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Orders Tab */}
                {tab === 'orders' && (
                    <div className="animate-fade-in-up">
                        <h1 className="text-2xl font-extrabold text-gray-800 mb-6">Incoming Orders</h1>
                        <div className="space-y-3">
                            {orders.map(o => (
                                <div key={o.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 card-hover">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{o.product_name}</h3>
                                            <p className="text-sm text-gray-500">Customer: {o.customer_name} • Qty: {o.quantity} • ₹{o.price * o.quantity}</p>
                                            <p className="text-xs text-gray-400 mt-1">{new Date(o.order_date).toLocaleDateString()}</p>
                                        </div>
                                        <select value={o.status} onChange={(e) => handleStatusChange(o.id, e.target.value)}
                                            className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium focus:border-primary-500 outline-none capitalize">
                                            {['pending', 'confirmed', 'processing', 'shipped', 'delivered'].map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Analytics Tab */}
                {tab === 'analytics' && (
                    <div className="animate-fade-in-up">
                        <h1 className="text-2xl font-extrabold text-gray-800 mb-6">Sales Analytics</h1>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            {stats.map((s, i) => (
                                <div key={i} className="stat-card rounded-2xl p-5 shadow-sm">
                                    <div className="text-sm text-gray-500">{s.label}</div>
                                    <div className="text-3xl font-extrabold text-gray-800 mt-1">{s.value}</div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-4">Revenue Trend</h3>
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={analytics.monthlyRevenue || []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Bar dataKey="revenue" fill="#4CAF50" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </main>

            {/* Product Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl animate-fade-in-up">
                        <div className="sticky top-0 bg-white p-5 border-b flex items-center justify-between rounded-t-3xl">
                            <h2 className="text-xl font-bold text-gray-800">{editProduct ? 'Edit Product' : 'Add Product'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><FiX className="text-xl" /></button>
                        </div>
                        <form onSubmit={handleSaveProduct} className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name</label>
                                <input type="text" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" placeholder="e.g. Fresh Organic Tomatoes" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                                <textarea value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} rows={2}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none resize-none" placeholder="Describe your product..." />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₹)</label>
                                    <input type="number" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" placeholder="60" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Unit</label>
                                    <select value={productForm.unit} onChange={e => setProductForm({ ...productForm, unit: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none">
                                        {['kg', 'g', 'L', 'mL', 'piece', 'dozen', 'bundle'].map(u => <option key={u} value={u}>{u}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                                    <select value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none">
                                        {['vegetables', 'fruits', 'grains', 'dairy', 'spices', 'organic', 'other'].map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Stock</label>
                                    <input type="number" value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: e.target.value })} required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" placeholder="50" />
                                </div>
                            </div>
                            <label className="flex items-center gap-3 p-3 bg-green-50 rounded-xl cursor-pointer">
                                <input type="checkbox" checked={productForm.is_organic} onChange={e => setProductForm({ ...productForm, is_organic: e.target.checked })} className="accent-primary-600 w-4 h-4" />
                                <span className="text-sm font-medium text-gray-700">🌿 This is an organic product</span>
                            </label>
                            <button type="submit" className="w-full btn-primary py-3 rounded-xl font-semibold text-lg">
                                {editProduct ? 'Update Product' : 'Add Product'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
