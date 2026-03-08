import { useState, useEffect } from 'react';
import { getOrders } from '../api';
import { FiPackage, FiClock, FiCheck, FiTruck } from 'react-icons/fi';
import Footer from '../components/Footer';

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
};

const statusIcons = {
    pending: <FiClock />, confirmed: <FiCheck />, processing: <FiPackage />,
    shipped: <FiTruck />, delivered: <FiCheck />, cancelled: '✗',
};

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try { const res = await getOrders(); setOrders(res.data); }
            catch {
                setOrders([
                    { id: 1001, total_amount: 350, status: 'delivered', products: 'Organic Tomatoes, Fresh Spinach', created_at: '2026-03-05', shipping_address: '123 Main St, Mumbai' },
                    { id: 1002, total_amount: 520, status: 'shipped', products: 'Basmati Rice, Pure Milk', created_at: '2026-03-06', shipping_address: '456 Oak Ave, Delhi' },
                    { id: 1003, total_amount: 180, status: 'pending', products: 'Fresh Strawberries', created_at: '2026-03-07', shipping_address: '789 Green Lane, Bangalore' },
                ]);
            }
            setLoading(false);
        };
        fetchOrders();
    }, []);

    return (
        <div className="min-h-screen bg-[#FAFDF7] pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-8">My Orders</h1>
                {loading ? (
                    <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-white rounded-2xl animate-pulse" />)}</div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <FiPackage className="text-5xl mx-auto mb-3 opacity-30" />
                        <p>No orders yet</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map(order => (
                            <div key={order.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 card-hover">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                                    <div>
                                        <span className="text-xs text-gray-400">Order #{order.id}</span>
                                        <h3 className="font-semibold text-gray-800">{order.products}</h3>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 capitalize ${statusColors[order.status]}`}>
                                        {statusIcons[order.status]} {order.status}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                    <span>₹{order.total_amount}</span>
                                    <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                    <span className="text-xs">{order.shipping_address}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
