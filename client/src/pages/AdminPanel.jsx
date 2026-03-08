import { useState, useEffect } from 'react';
import { getAdminUsers, deleteUser, getAdminProducts, approveProduct, getAdminOrders, getAdminAnalytics, updateOrderStatus } from '../api';
import { useAuth } from '../AuthContext';
import { FiUsers, FiShoppingBag, FiDollarSign, FiTrendingUp, FiTrash2, FiCheck, FiX as FiXIcon, FiHome, FiBox, FiShoppingCart, FiBarChart2, FiMenu } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const demoData = {
    analytics: {
        totalUsers: 1250, totalFarmers: 320, totalOrders: 4500, totalRevenue: 2500000,
        monthlyOrders: [
            { month: '2025-10', orders: 320, revenue: 180000 }, { month: '2025-11', orders: 450, revenue: 260000 },
            { month: '2025-12', orders: 380, revenue: 220000 }, { month: '2026-01', orders: 520, revenue: 350000 },
            { month: '2026-02', orders: 610, revenue: 420000 }, { month: '2026-03', orders: 280, revenue: 190000 },
        ],
        recentOrders: []
    },
    users: [
        { id: 1, name: 'Priya Sharma', email: 'priya@email.com', role: 'consumer', created_at: '2026-01-15' },
        { id: 2, name: 'Ram Kumar', email: 'ram@email.com', role: 'farmer', created_at: '2026-01-10' },
        { id: 3, name: 'Amit Patel', email: 'amit@email.com', role: 'consumer', created_at: '2026-02-01' },
        { id: 4, name: 'Sunita Devi', email: 'sunita@email.com', role: 'farmer', created_at: '2026-02-15' },
        { id: 5, name: 'Deepa Kumar', email: 'deepa@email.com', role: 'consumer', created_at: '2026-03-01' },
    ],
    products: [
        { id: 1, name: 'Organic Tomatoes', farmer_name: 'Ram Kumar', price: 60, category: 'vegetables', is_approved: true },
        { id: 2, name: 'Fresh Mangoes', farmer_name: 'Sunita Devi', price: 150, category: 'fruits', is_approved: true },
        { id: 3, name: 'Herbal Tea', farmer_name: 'Green Valley', price: 250, category: 'other', is_approved: false },
    ],
    orders: [
        { id: 1001, customer_name: 'Priya Sharma', total_amount: 350, status: 'delivered', created_at: '2026-03-05' },
        { id: 1002, customer_name: 'Amit Patel', total_amount: 520, status: 'shipped', created_at: '2026-03-06' },
        { id: 1003, customer_name: 'Deepa Kumar', total_amount: 180, status: 'pending', created_at: '2026-03-07' },
    ]
};

const COLORS = ['#4CAF50', '#FF9800', '#2196F3', '#E91E63'];

export default function AdminPanel() {
    const { user } = useAuth();
    const [tab, setTab] = useState('dashboard');
    const [analytics, setAnalytics] = useState(demoData.analytics);
    const [users, setUsers] = useState(demoData.users);
    const [products, setProducts] = useState(demoData.products);
    const [orders, setOrders] = useState(demoData.orders);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [aRes, uRes, pRes, oRes] = await Promise.all([getAdminAnalytics(), getAdminUsers(), getAdminProducts(), getAdminOrders()]);
                setAnalytics(aRes.data);
                setUsers(uRes.data);
                setProducts(pRes.data);
                setOrders(oRes.data);
            } catch { }
        };
        loadData();
    }, []);

    const handleDeleteUser = async (id) => {
        try { await deleteUser(id); } catch { }
        setUsers(users.filter(u => u.id !== id));
    };

    const handleApproveProduct = async (id, approved) => {
        try { await approveProduct(id, approved); } catch { }
        setProducts(products.map(p => p.id === id ? { ...p, is_approved: approved } : p));
    };

    const menuItems = [
        { id: 'dashboard', icon: <FiHome />, label: 'Dashboard' },
        { id: 'users', icon: <FiUsers />, label: 'Users' },
        { id: 'products', icon: <FiBox />, label: 'Products' },
        { id: 'orders', icon: <FiShoppingCart />, label: 'Orders' },
        { id: 'analytics', icon: <FiBarChart2 />, label: 'Analytics' },
    ];

    const stats = [
        { label: 'Total Users', value: analytics.totalUsers?.toLocaleString(), icon: <FiUsers />, color: 'from-blue-500 to-indigo-600' },
        { label: 'Active Farmers', value: analytics.totalFarmers?.toLocaleString(), icon: <FiTrendingUp />, color: 'from-green-500 to-emerald-600' },
        { label: 'Total Orders', value: analytics.totalOrders?.toLocaleString(), icon: <FiShoppingBag />, color: 'from-purple-500 to-pink-600' },
        { label: 'Total Revenue', value: `₹${(analytics.totalRevenue / 100000).toFixed(1)}L`, icon: <FiDollarSign />, color: 'from-amber-500 to-orange-600' },
    ];

    const pieData = [
        { name: 'Consumers', value: (analytics.totalUsers || 0) - (analytics.totalFarmers || 0) },
        { name: 'Farmers', value: analytics.totalFarmers || 0 },
    ];

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700',
        shipped: 'bg-indigo-100 text-indigo-700', delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700',
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-16">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden fixed top-20 left-4 z-40 bg-white shadow-lg rounded-xl p-2">
                <FiMenu />
            </button>

            {/* Sidebar */}
            <aside className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg border-r border-gray-100 z-30 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="p-5 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-xl">🛡️</div>
                        <div>
                            <div className="font-semibold text-gray-800 text-sm">{user?.name || 'Admin'}</div>
                            <div className="text-xs text-indigo-600">Administrator</div>
                        </div>
                    </div>
                </div>
                <nav className="p-3 space-y-1">
                    {menuItems.map(item => (
                        <button key={item.id} onClick={() => { setTab(item.id); setSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${tab === item.id ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                            {item.icon} {item.label}
                        </button>
                    ))}
                </nav>
            </aside>

            <main className="lg:ml-64 p-6">
                {/* Dashboard */}
                {tab === 'dashboard' && (
                    <div className="animate-fade-in-up">
                        <h1 className="text-2xl font-extrabold text-gray-800 mb-6">Admin Dashboard 🛡️</h1>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            {stats.map((s, i) => (
                                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 card-hover">
                                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white text-lg mb-3`}>{s.icon}</div>
                                    <div className="text-2xl font-extrabold text-gray-800">{s.value}</div>
                                    <div className="text-sm text-gray-500">{s.label}</div>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-4">Orders & Revenue</h3>
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={analytics.monthlyOrders || []}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                        <YAxis tick={{ fontSize: 11 }} />
                                        <Tooltip />
                                        <Bar dataKey="orders" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="revenue" fill="#FF9800" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-4">User Distribution</h3>
                                <ResponsiveContainer width="100%" height={280}>
                                    <PieChart>
                                        <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} label dataKey="value" labelLine={false}>
                                            {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {/* Users */}
                {tab === 'users' && (
                    <div className="animate-fade-in-up">
                        <h1 className="text-2xl font-extrabold text-gray-800 mb-6">Manage Users</h1>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50 text-left">
                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {users.map(u => (
                                            <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-5 py-4 font-medium text-gray-800">{u.name}</td>
                                                <td className="px-5 py-4 text-gray-500 text-sm">{u.email}</td>
                                                <td className="px-5 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${u.role === 'farmer' ? 'bg-green-100 text-green-700' : u.role === 'admin' ? 'bg-purple-100960 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{u.role}</span>
                                                </td>
                                                <td className="px-5 py-4 text-gray-500 text-sm">{new Date(u.created_at).toLocaleDateString()}</td>
                                                <td className="px-5 py-4">
                                                    {u.role !== 'admin' && (
                                                        <button onClick={() => handleDeleteUser(u.id)} className="text-red-500 hover:text-red-700 p-1"><FiTrash2 /></button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Products */}
                {tab === 'products' && (
                    <div className="animate-fade-in-up">
                        <h1 className="text-2xl font-extrabold text-gray-800 mb-6">Product Moderation</h1>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {products.map(p => (
                                <div key={p.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 card-hover">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {p.is_approved ? '✓ Approved' : '⏳ Pending'}
                                        </span>
                                        <span className="text-xs text-gray-400 capitalize">{p.category}</span>
                                    </div>
                                    <h3 className="font-bold text-gray-800">{p.name}</h3>
                                    <p className="text-sm text-gray-500 mb-3">by {p.farmer_name} • ₹{p.price}</p>
                                    <div className="flex gap-2">
                                        {!p.is_approved && (
                                            <button onClick={() => handleApproveProduct(p.id, true)} className="flex-1 bg-green-50 text-green-700 py-2 rounded-lg text-sm font-semibold hover:bg-green-100 transition-colors flex items-center justify-center gap-1">
                                                <FiCheck /> Approve
                                            </button>
                                        )}
                                        <button onClick={() => handleApproveProduct(p.id, false)} className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-1">
                                            <FiXIcon /> Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Orders */}
                {tab === 'orders' && (
                    <div className="animate-fade-in-up">
                        <h1 className="text-2xl font-extrabold text-gray-800 mb-6">Transaction Monitoring</h1>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50 text-left">
                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Order ID</th>
                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {orders.map(o => (
                                            <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-5 py-4 font-medium text-gray-800">#{o.id}</td>
                                                <td className="px-5 py-4 text-gray-600">{o.customer_name}</td>
                                                <td className="px-5 py-4 font-semibold text-primary-700">₹{o.total_amount}</td>
                                                <td className="px-5 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${statusColors[o.status] || 'bg-gray-100 text-gray-700'}`}>{o.status}</span>
                                                </td>
                                                <td className="px-5 py-4 text-gray-500 text-sm">{new Date(o.created_at).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Analytics */}
                {tab === 'analytics' && (
                    <div className="animate-fade-in-up">
                        <h1 className="text-2xl font-extrabold text-gray-800 mb-6">Platform Analytics</h1>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            {stats.map((s, i) => (
                                <div key={i} className="stat-card rounded-2xl p-5 shadow-sm">
                                    <div className="text-sm text-gray-500">{s.label}</div>
                                    <div className="text-3xl font-extrabold text-gray-800 mt-1">{s.value}</div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-4">Monthly Performance</h3>
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={analytics.monthlyOrders || []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 11 }} />
                                    <Tooltip />
                                    <Bar dataKey="orders" fill="#4CAF50" name="Orders" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
