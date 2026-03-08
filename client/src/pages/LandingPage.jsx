import { Link } from 'react-router-dom';
import { FiTruck, FiShield, FiHeart, FiArrowRight, FiStar, FiUsers, FiCheckCircle } from 'react-icons/fi';
import { GiWheat, GiFarmer, GiFruitBowl } from 'react-icons/gi';
import Footer from '../components/Footer';

const featuredProducts = [
    { id: 1, name: 'Fresh Organic Tomatoes', price: 60, unit: 'kg', farmer: 'Ram Kumar', rating: 4.5, image: '/images/tomatoes.png', category: 'vegetables' },
    { id: 2, name: 'Farm-Fresh Mangoes', price: 150, unit: 'kg', farmer: 'Sunita Devi', rating: 4.8, image: '/images/mangoes.png', category: 'fruits' },
    { id: 3, name: 'Premium Basmati Rice', price: 120, unit: 'kg', farmer: 'Ajay Singh', rating: 4.6, image: '/images/rice.png', category: 'grains' },
    { id: 4, name: 'Pure Cow Milk', price: 55, unit: 'L', farmer: 'Lakshmi Farm', rating: 4.9, image: '/images/milk.png', category: 'dairy' },
    { id: 5, name: 'Organic Turmeric', price: 200, unit: 'kg', farmer: 'Spice Valley', rating: 4.7, image: '/images/turmeric.png', category: 'spices' },
    { id: 6, name: 'Fresh Green Spinach', price: 40, unit: 'bundle', farmer: 'Green Acres', rating: 4.4, image: '/images/spinach.png', category: 'organic' },
];

const steps = [
    { icon: <GiFarmer className="text-3xl" />, title: 'Farmers List Products', desc: 'Farmers register and list their fresh produce with pricing and details.' },
    { icon: <GiFruitBowl className="text-3xl" />, title: 'Consumers Browse & Order', desc: 'Consumers explore organic, fresh products and place orders directly.' },
    { icon: <FiTruck className="text-3xl" />, title: 'Farm-to-Door Delivery', desc: 'Products are shipped directly from farms, ensuring freshness and fair pricing.' },
];

const stories = [
    { name: 'Rajesh Patel', location: 'Gujarat', story: 'FarmLink helped me increase my revenue by 40% by eliminating middlemen. Now I sell directly to consumers.', emoji: '👨‍🌾' },
    { name: 'Meena Kumari', location: 'Maharashtra', story: 'I started selling my organic vegetables on FarmLink and now have over 200 regular customers.', emoji: '👩‍🌾' },
    { name: 'Suresh Yadav', location: 'Uttar Pradesh', story: 'My dairy farm products reach consumers within 24 hours. The platform made it so easy!', emoji: '🧑‍🌾' },
];

export default function LandingPage() {
    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/hero_farm.png')] bg-cover bg-center" />
                <div className="absolute inset-0 hero-gradient" />
                <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 text-sm px-4 py-2 rounded-full mb-6 animate-fade-in-up border border-white/20">
                        <GiWheat /> Trusted by 10,000+ Farmers
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                        Empowering Farmers,<br />
                        <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                            Connecting Consumers
                        </span>
                    </h1>
                    <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        Buy fresh, organic produce directly from local farmers. No middlemen, fair prices, and guaranteed freshness from farm to your table.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.45s' }}>
                        <Link to="/register?role=farmer" className="group bg-white text-primary-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-primary-50 transition-all duration-300 shadow-2xl hover:shadow-white/20 flex items-center justify-center gap-2">
                            Join as Farmer <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/shop" className="btn-secondary px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2">
                            Shop Fresh Products <GiFruitBowl />
                        </Link>
                    </div>
                    <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/70 text-sm animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                        <div className="flex items-center gap-2"><FiCheckCircle className="text-green-300" /> 100% Fresh</div>
                        <div className="flex items-center gap-2"><FiCheckCircle className="text-green-300" /> Direct from Farms</div>
                        <div className="flex items-center gap-2"><FiCheckCircle className="text-green-300" /> Fair Prices</div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#FAFDF7] to-transparent" />
            </section>

            {/* Stats */}
            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { num: '10,000+', label: 'Active Farmers', icon: '👨‍🌾' },
                        { num: '50,000+', label: 'Happy Customers', icon: '😊' },
                        { num: '100+', label: 'Product Categories', icon: '🥬' },
                        { num: '₹5Cr+', label: 'Farmer Earnings', icon: '💰' },
                    ].map((stat, i) => (
                        <div key={i} className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary-50 to-white border border-primary-100 card-hover">
                            <div className="text-3xl mb-2">{stat.icon}</div>
                            <div className="text-2xl md:text-3xl font-extrabold text-primary-800">{stat.num}</div>
                            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-20 bg-[#FAFDF7]">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Fresh From Farms</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mt-2">Featured Products</h2>
                        <p className="text-gray-500 mt-3 max-w-xl mx-auto">Discover the freshest produce handpicked from verified local farmers</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredProducts.map((p, i) => (
                            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm card-hover border border-gray-100 group" style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className="aspect-[4/3] bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center overflow-hidden">
                                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="p-5">
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 uppercase">{p.category}</span>
                                    <h3 className="font-semibold text-gray-800 mt-2 mb-1">{p.name}</h3>
                                    <p className="text-xs text-gray-500 mb-2">by {p.farmer}</p>
                                    <div className="flex items-center gap-1 mb-3">
                                        {[...Array(5)].map((_, j) => (
                                            <FiStar key={j} className={`text-xs ${j < Math.round(p.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                        ))}
                                        <span className="text-xs text-gray-400 ml-1">{p.rating}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xl font-bold text-primary-700">₹{p.price}<span className="text-xs text-gray-400 font-normal">/{p.unit}</span></span>
                                        <Link to="/shop" className="btn-primary text-xs px-4 py-2 rounded-xl font-semibold">Shop Now</Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-10">
                        <Link to="/shop" className="inline-flex items-center gap-2 btn-primary px-8 py-3 rounded-full font-semibold text-lg">
                            View All Products <FiArrowRight />
                        </Link>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-white">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Simple Process</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mt-2 mb-12">How FarmLink Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {steps.map((step, i) => (
                            <div key={i} className="relative p-8 rounded-2xl bg-gradient-to-br from-primary-50 to-white border border-primary-100 card-hover">
                                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center text-white mx-auto mb-5 shadow-lg shadow-primary-500/20">
                                    {step.icon}
                                </div>
                                <div className="absolute top-4 right-4 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm">{i + 1}</div>
                                <h3 className="font-bold text-gray-800 text-lg mb-2">{step.title}</h3>
                                <p className="text-gray-500 text-sm">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Farmer Stories */}
            <section className="py-20 bg-gradient-to-br from-primary-800 to-primary-900 text-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <span className="text-primary-200 font-semibold text-sm uppercase tracking-wider">Real Stories</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold mt-2">Farmer Success Stories</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {stories.map((s, i) => (
                            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 card-hover">
                                <div className="text-5xl mb-4">{s.emoji}</div>
                                <p className="text-white/80 text-sm italic mb-4">"{s.story}"</p>
                                <div className="border-t border-white/20 pt-3">
                                    <div className="font-semibold">{s.name}</div>
                                    <div className="text-primary-200 text-sm">{s.location}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-20 bg-[#FAFDF7]">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mt-2">Benefits of Buying Direct</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: <FiHeart />, title: 'Farm Fresh', desc: 'Products come straight from the farm, ensuring maximum freshness and nutrition.' },
                            { icon: <FiShield />, title: 'Quality Assured', desc: 'All products pass quality checks. Only the best reaches your doorstep.' },
                            { icon: <FiUsers />, title: 'Support Farmers', desc: 'Your purchase directly supports local farmers and their families.' },
                            { icon: <FiTruck />, title: 'Fast Delivery', desc: 'Quick farm-to-door delivery so you get the freshest produce possible.' },
                        ].map((b, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm card-hover text-center">
                                <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 text-2xl mx-auto mb-4">
                                    {b.icon}
                                </div>
                                <h3 className="font-bold text-gray-800 mb-2">{b.title}</h3>
                                <p className="text-gray-500 text-sm">{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700 text-white text-center">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Ready to Get Started?</h2>
                    <p className="text-white/80 mb-8 text-lg">Join thousands of farmers and consumers already on FarmLink. Start selling or shopping today!</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register?role=farmer" className="bg-white text-primary-700 px-8 py-3 rounded-full font-bold text-lg hover:bg-primary-50 transition-all shadow-xl">
                            Register as Farmer
                        </Link>
                        <Link to="/register" className="btn-secondary px-8 py-3 rounded-full font-bold text-lg">
                            Sign Up as Consumer
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
