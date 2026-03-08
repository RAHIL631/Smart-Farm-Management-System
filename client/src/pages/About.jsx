import { Link } from 'react-router-dom';
import { FiTarget, FiHeart, FiGlobe, FiArrowRight } from 'react-icons/fi';
import Footer from '../components/Footer';

export default function About() {
    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white pt-24 pb-20 px-4 text-center">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">About FarmLink</h1>
                    <p className="text-lg text-white/80">Bridging the gap between farmers and consumers. Building a sustainable food ecosystem through technology.</p>
                </div>
            </section>

            {/* Mission */}
            <section className="py-16 px-4">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: <FiTarget />, title: 'Our Mission', desc: 'To eliminate middlemen and connect farmers directly with consumers, ensuring fair prices and fresh produce for everyone.' },
                        { icon: <FiHeart />, title: 'Our Values', desc: 'Transparency, sustainability, and community. We believe in empowering local farmers and building trust with every transaction.' },
                        { icon: <FiGlobe />, title: 'Our Vision', desc: 'A world where every farmer earns a fair price and every consumer has access to fresh, organic food — straight from the farm.' },
                    ].map((item, i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 card-hover text-center">
                            <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 text-2xl mx-auto mb-4">{item.icon}</div>
                            <h3 className="font-bold text-gray-800 text-lg mb-2">{item.title}</h3>
                            <p className="text-gray-500 text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Stats */}
            <section className="bg-primary-50 py-12 px-4">
                <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    {[
                        { num: '10K+', label: 'Farmers' }, { num: '50K+', label: 'Consumers' },
                        { num: '500K+', label: 'Products Sold' }, { num: '₹5Cr+', label: 'Revenue Generated' },
                    ].map((s, i) => (
                        <div key={i}>
                            <div className="text-3xl font-extrabold text-primary-800">{s.num}</div>
                            <div className="text-sm text-gray-500">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-4 text-center">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-4">Join the FarmLink Movement</h2>
                <p className="text-gray-500 mb-8 max-w-xl mx-auto">Whether you're a farmer looking to sell your produce or a consumer seeking fresh, organic food — we're here for you.</p>
                <Link to="/register" className="inline-flex items-center gap-2 btn-primary px-8 py-3 rounded-full font-bold text-lg">
                    Get Started <FiArrowRight />
                </Link>
            </section>

            <Footer />
        </div>
    );
}
