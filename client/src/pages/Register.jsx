import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { register as registerApi } from '../api';
import { useAuth } from '../AuthContext';
import { GiWheat } from 'react-icons/gi';
import { FiUser, FiMail, FiLock, FiMapPin, FiPhone } from 'react-icons/fi';

export default function Register() {
    const [searchParams] = useSearchParams();
    const defaultRole = searchParams.get('role') || 'consumer';
    const [form, setForm] = useState({ name: '', email: '', password: '', role: defaultRole, phone: '', address: '', farm_name: '', farm_location: '', description: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await registerApi(form);
            loginUser(res.data);
            navigate(form.role === 'farmer' ? '/farmer' : '/shop');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
        setLoading(false);
    };

    const u = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 px-4 pt-20 pb-8">
            <div className="w-full max-w-lg">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <GiWheat className="text-white text-3xl" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-800">Create Account</h1>
                    <p className="text-gray-500 mt-2">Join the FarmLink community</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                    {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4 border border-red-100">{error}</div>}

                    {/* Role Selector */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">I am a</label>
                        <div className="grid grid-cols-2 gap-3">
                            {['consumer', 'farmer'].map(role => (
                                <button key={role} type="button" onClick={() => setForm({ ...form, role })}
                                    className={`py-3 rounded-xl font-semibold text-sm transition-all border-2 ${form.role === role ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                                    {role === 'consumer' ? '🛒 Consumer' : '🌾 Farmer'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                            <div className="relative">
                                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="text" value={form.name} onChange={u('name')} required className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all" placeholder="John Doe" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
                            <div className="relative">
                                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="tel" value={form.phone} onChange={u('phone')} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all" placeholder="+91 98765 43210" />
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                        <div className="relative">
                            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="email" value={form.email} onChange={u('email')} required className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all" placeholder="your@email.com" />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                        <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="password" value={form.password} onChange={u('password')} required className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all" placeholder="Min 6 characters" />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Address</label>
                        <div className="relative">
                            <FiMapPin className="absolute left-3 top-3 text-gray-400" />
                            <textarea value={form.address} onChange={u('address')} rows={2} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all resize-none" placeholder="Your address" />
                        </div>
                    </div>

                    {form.role === 'farmer' && (
                        <div className="border-t border-gray-100 pt-4 mt-4 space-y-4">
                            <h3 className="font-semibold text-gray-700 text-sm">🌾 Farm Details</h3>
                            <input type="text" value={form.farm_name} onChange={u('farm_name')} placeholder="Farm Name" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all" />
                            <input type="text" value={form.farm_location} onChange={u('farm_location')} placeholder="Farm Location" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all" />
                            <textarea value={form.description} onChange={u('description')} rows={2} placeholder="Describe your farm..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all resize-none" />
                        </div>
                    )}

                    <button type="submit" disabled={loading}
                        className="w-full btn-primary py-3 rounded-xl font-semibold text-lg disabled:opacity-50 transition-all mt-6">
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>

                    <p className="text-center text-gray-500 text-sm mt-6">
                        Already have an account? <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
