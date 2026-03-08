import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useCart } from '../CartContext';
import { FiShoppingCart, FiMenu, FiX, FiUser, FiLogOut, FiGrid } from 'react-icons/fi';
import { GiWheat } from 'react-icons/gi';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const handleLogout = () => { logout(); navigate('/'); setProfileOpen(false); };

    const getDashboardLink = () => {
        if (!user) return '/login';
        if (user.role === 'admin') return '/admin';
        if (user.role === 'farmer') return '/farmer';
        return '/orders';
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-primary-500/30 transition-all duration-300">
                            <GiWheat className="text-white text-xl" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">
                            FarmLink
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/shop" className="text-gray-600 hover:text-primary-700 font-medium transition-colors duration-200">Marketplace</Link>
                        <Link to="/about" className="text-gray-600 hover:text-primary-700 font-medium transition-colors duration-200">About</Link>

                        {user && (
                            <Link to="/shop" className="relative group">
                                <FiShoppingCart className="text-xl text-gray-600 group-hover:text-primary-700 transition-colors" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        )}

                        {user ? (
                            <div className="relative">
                                <button onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2 bg-primary-50 hover:bg-primary-100 text-primary-800 px-4 py-2 rounded-full transition-all duration-200">
                                    <FiUser className="text-sm" />
                                    <span className="font-medium text-sm">{user.name?.split(' ')[0]}</span>
                                </button>
                                {profileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 animate-fade-in-up">
                                        <Link to={getDashboardLink()} className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-primary-50 transition-colors" onClick={() => setProfileOpen(false)}>
                                            <FiGrid className="text-primary-600" /> Dashboard
                                        </Link>
                                        <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-primary-50 transition-colors" onClick={() => setProfileOpen(false)}>
                                            <FiUser className="text-primary-600" /> Profile
                                        </Link>
                                        <hr className="my-1 mx-3 border-gray-100" />
                                        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 w-full transition-colors">
                                            <FiLogOut /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-primary-700 hover:text-primary-800 font-medium transition-colors">Login</Link>
                                <Link to="/register" className="btn-primary px-5 py-2 rounded-full text-sm font-semibold">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile */}
                    <button className="md:hidden text-gray-600" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="md:hidden bg-white border-t shadow-xl animate-fade-in-up">
                    <div className="px-4 py-4 space-y-3">
                        <Link to="/shop" className="block text-gray-700 font-medium py-2" onClick={() => setMenuOpen(false)}>Marketplace</Link>
                        <Link to="/about" className="block text-gray-700 font-medium py-2" onClick={() => setMenuOpen(false)}>About</Link>
                        {user ? (
                            <>
                                <Link to={getDashboardLink()} className="block text-gray-700 font-medium py-2" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="block text-red-600 font-medium py-2 w-full text-left">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block text-primary-700 font-medium py-2" onClick={() => setMenuOpen(false)}>Login</Link>
                                <Link to="/register" className="block btn-primary text-center px-5 py-2 rounded-full font-semibold" onClick={() => setMenuOpen(false)}>Get Started</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
