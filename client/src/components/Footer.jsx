import { Link } from 'react-router-dom';
import { GiWheat } from 'react-icons/gi';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                                <GiWheat className="text-white text-xl" />
                            </div>
                            <span className="text-xl font-bold text-white">FarmLink</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4">
                            Empowering farmers, connecting consumers. Fresh produce directly from the farm to your table — no middlemen.
                        </p>
                        <div className="flex gap-3">
                            {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-9 h-9 bg-gray-700 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:-translate-y-1">
                                    <Icon className="text-sm" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
                        <ul className="space-y-2.5">
                            {[['/', 'Home'], ['/shop', 'Marketplace'], ['/about', 'About Us'], ['/register', 'Join as Farmer']].map(([to, label]) => (
                                <li key={to}><Link to={to} className="text-gray-400 hover:text-primary-400 transition-colors text-sm">{label}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Categories</h4>
                        <ul className="space-y-2.5">
                            {['Fresh Vegetables', 'Organic Fruits', 'Grains & Pulses', 'Dairy Products', 'Spices'].map(cat => (
                                <li key={cat}><Link to="/shop" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">{cat}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-sm"><FiMapPin className="text-primary-400 mt-0.5 shrink-0" /> 123 Green Valley Road, Agricultural District, India</li>
                            <li className="flex items-center gap-3 text-sm"><FiMail className="text-primary-400 shrink-0" /> contact@farmlink.com</li>
                            <li className="flex items-center gap-3 text-sm"><FiPhone className="text-primary-400 shrink-0" /> +91 98765 43210</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="border-t border-gray-700/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-2">
                    <p className="text-gray-500 text-xs">&copy; 2026 FarmLink. All rights reserved.</p>
                    <div className="flex gap-4 text-xs text-gray-500">
                        <a href="#" className="hover:text-primary-400 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-primary-400 transition-colors">Terms</a>
                        <a href="#" className="hover:text-primary-400 transition-colors">Support</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
