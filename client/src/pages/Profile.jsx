import { useAuth } from '../AuthContext';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar } from 'react-icons/fi';
import Footer from '../components/Footer';

export default function Profile() {
    const { user } = useAuth();

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center pt-20">
            <p className="text-gray-500">Please login to view your profile.</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FAFDF7] pt-24 pb-12">
            <div className="max-w-2xl mx-auto px-4">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary-600 to-primary-700 h-32 relative">
                        <div className="absolute -bottom-12 left-8">
                            <div className="w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center text-4xl border-4 border-white">
                                {user.role === 'farmer' ? '👨‍🌾' : user.role === 'admin' ? '🛡️' : '👤'}
                            </div>
                        </div>
                    </div>

                    <div className="pt-16 px-8 pb-8">
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl font-extrabold text-gray-800">{user.name}</h1>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${user.role === 'farmer' ? 'bg-green-100 text-green-700' : user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                {user.role}
                            </span>
                        </div>

                        <div className="space-y-4 mt-6">
                            {[
                                { icon: <FiMail />, label: 'Email', value: user.email },
                                { icon: <FiPhone />, label: 'Phone', value: user.phone || 'Not provided' },
                                { icon: <FiMapPin />, label: 'Address', value: user.address || 'Not provided' },
                                { icon: <FiCalendar />, label: 'Member Since', value: user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">{item.icon}</div>
                                    <div>
                                        <div className="text-xs text-gray-400">{item.label}</div>
                                        <div className="font-medium text-gray-800">{item.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {user.farmer && (
                            <div className="mt-6 p-5 bg-primary-50 rounded-2xl border border-primary-100">
                                <h3 className="font-bold text-primary-800 mb-3">🌾 Farm Details</h3>
                                <div className="space-y-2 text-sm">
                                    <p><span className="text-gray-500">Farm Name:</span> <span className="font-medium text-gray-800">{user.farmer.farm_name}</span></p>
                                    <p><span className="text-gray-500">Location:</span> <span className="font-medium text-gray-800">{user.farmer.farm_location || 'N/A'}</span></p>
                                    <p><span className="text-gray-500">Description:</span> <span className="font-medium text-gray-800">{user.farmer.description || 'N/A'}</span></p>
                                    <p><span className="text-gray-500">Verified:</span> <span className="font-medium">{user.farmer.is_verified ? '✅ Yes' : '⏳ Pending'}</span></p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
