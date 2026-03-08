import { useState, useEffect } from 'react';
import { getProducts } from '../api';
import ProductCard from '../components/ProductCard';
import { useCart } from '../CartContext';
import { useAuth } from '../AuthContext';
import { Link } from 'react-router-dom';
import { FiSearch, FiFilter, FiShoppingCart, FiX, FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import Footer from '../components/Footer';

const categories = ['all', 'vegetables', 'fruits', 'grains', 'dairy', 'spices', 'organic'];

export default function Shop() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');
    const [sort, setSort] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [showCart, setShowCart] = useState(false);
    const { items, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart } = useCart();
    const { user } = useAuth();

    useEffect(() => {
        fetchProducts();
    }, [category, sort]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = {};
            if (search) params.search = search;
            if (category !== 'all') params.category = category;
            if (sort) params.sort = sort;
            const res = await getProducts(params);
            setProducts(res.data.products || []);
        } catch (err) {
            // Use demo data if API fails
            setProducts([
                { id: 1, name: 'Fresh Organic Tomatoes', price: 60, unit: 'kg', category: 'vegetables', farmer_name: 'Ram Kumar', rating: 4.5, total_reviews: 24, stock: 50, is_organic: true, image: '/images/tomatoes.png' },
                { id: 2, name: 'Farm-Fresh Alphonso Mangoes', price: 150, unit: 'kg', category: 'fruits', farmer_name: 'Sunita Devi', rating: 4.8, total_reviews: 38, stock: 30, is_organic: false, image: '/images/mangoes.png' },
                { id: 3, name: 'Premium Basmati Rice', price: 120, unit: 'kg', category: 'grains', farmer_name: 'Ajay Singh', rating: 4.6, total_reviews: 52, stock: 200, is_organic: false, image: '/images/rice.png' },
                { id: 4, name: 'Pure A2 Cow Milk', price: 55, unit: 'L', category: 'dairy', farmer_name: 'Lakshmi Farm', rating: 4.9, total_reviews: 89, stock: 100, is_organic: true, image: '/images/milk.png' },
                { id: 5, name: 'Organic Turmeric Powder', price: 200, unit: 'kg', category: 'spices', farmer_name: 'Spice Valley Farm', rating: 4.7, total_reviews: 31, stock: 45, is_organic: true, image: '/images/turmeric.png' },
                { id: 6, name: 'Fresh Green Spinach', price: 40, unit: 'bundle', category: 'vegetables', farmer_name: 'Green Acres', rating: 4.4, total_reviews: 18, stock: 80, is_organic: true, image: '/images/spinach.png' },
                { id: 7, name: 'Red Onions', price: 35, unit: 'kg', category: 'vegetables', farmer_name: 'Kisan Fresh', rating: 4.2, total_reviews: 42, stock: 150, is_organic: false, image: '/images/onions.png' },
                { id: 8, name: 'Fresh Strawberries', price: 180, unit: 'kg', category: 'fruits', farmer_name: 'Berry Farm', rating: 4.6, total_reviews: 27, stock: 8, is_organic: true, image: '/images/strawberries.png' },
                { id: 9, name: 'Whole Wheat Flour', price: 45, unit: 'kg', category: 'grains', farmer_name: 'Golden Fields', rating: 4.3, total_reviews: 65, stock: 300, is_organic: false, image: '/images/wheat_flour.png' },
                { id: 10, name: 'Farm Fresh Paneer', price: 280, unit: 'kg', category: 'dairy', farmer_name: 'Dairy Delights', rating: 4.8, total_reviews: 44, stock: 25, is_organic: true, image: '/images/paneer.png' },
                { id: 11, name: 'Kerala Red Chilli', price: 350, unit: 'kg', category: 'spices', farmer_name: 'Spice Route', rating: 4.5, total_reviews: 19, stock: 60, is_organic: false, image: '/images/red_chilli.png' },
                { id: 12, name: 'Organic Potatoes', price: 30, unit: 'kg', category: 'vegetables', farmer_name: 'Earth Harvest', rating: 4.1, total_reviews: 73, stock: 120, is_organic: true, image: '/images/potatoes.png' },
            ]);
        }
        setLoading(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProducts();
    };

    const filteredProducts = products.filter(p => {
        if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    return (
        <div className="min-h-screen bg-[#FAFDF7]">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-700 to-primary-600 text-white pt-24 pb-10 px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Fresh Marketplace</h1>
                    <p className="text-white/80">Browse fresh produce directly from verified local farmers</p>

                    <form onSubmit={handleSearch} className="mt-6 flex gap-3 max-w-2xl">
                        <div className="flex-1 relative">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl text-gray-800 focus:ring-2 focus:ring-primary-300 outline-none" placeholder="Search products..." />
                        </div>
                        <button type="submit" className="bg-white text-primary-700 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-colors">Search</button>
                        <button type="button" onClick={() => setShowFilters(!showFilters)} className="bg-white/20 px-4 py-3 rounded-xl hover:bg-white/30 transition-colors md:hidden">
                            <FiFilter />
                        </button>
                    </form>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <div className={`md:w-64 shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sticky top-20">
                            <h3 className="font-bold text-gray-800 mb-4">Filters</h3>

                            <div className="mb-5">
                                <h4 className="text-sm font-semibold text-gray-600 mb-2">Category</h4>
                                <div className="space-y-1.5">
                                    {categories.map(cat => (
                                        <button key={cat} onClick={() => setCategory(cat)}
                                            className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all capitalize ${category === cat ? 'bg-primary-100 text-primary-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                                            {cat === 'all' ? '🏪 All Products' : `${cat === 'vegetables' ? '🥬' : cat === 'fruits' ? '🍎' : cat === 'grains' ? '🌾' : cat === 'dairy' ? '🥛' : cat === 'spices' ? '🌶️' : '🌿'} ${cat}`}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold text-gray-600 mb-2">Sort By</h4>
                                <select value={sort} onChange={e => setSort(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary-500 outline-none">
                                    <option value="">Latest</option>
                                    <option value="price_asc">Price: Low to High</option>
                                    <option value="price_desc">Price: High to Low</option>
                                    <option value="rating">Highest Rated</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-gray-500 text-sm">{filteredProducts.length} products found</p>
                            {user && (
                                <button onClick={() => setShowCart(true)} className="relative btn-primary px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
                                    <FiShoppingCart /> Cart
                                    {cartCount > 0 && <span className="bg-white text-primary-700 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
                                </button>
                            )}
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                                        <div className="aspect-[4/3] bg-gray-200" />
                                        <div className="p-4 space-y-3">
                                            <div className="h-3 bg-gray-200 rounded w-1/3" />
                                            <div className="h-4 bg-gray-200 rounded w-2/3" />
                                            <div className="h-3 bg-gray-200 rounded w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Cart Drawer */}
            {showCart && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowCart(false)} />
                    <div className="relative w-full max-w-md bg-white shadow-2xl animate-slide-in overflow-y-auto">
                        <div className="sticky top-0 bg-white p-5 border-b flex items-center justify-between z-10">
                            <h2 className="text-xl font-bold text-gray-800">Shopping Cart ({cartCount})</h2>
                            <button onClick={() => setShowCart(false)} className="text-gray-400 hover:text-gray-600"><FiX className="text-xl" /></button>
                        </div>
                        {items.length === 0 ? (
                            <div className="p-10 text-center text-gray-400">
                                <FiShoppingCart className="text-5xl mx-auto mb-3 opacity-30" />
                                <p>Your cart is empty</p>
                            </div>
                        ) : (
                            <>
                                <div className="p-5 space-y-4">
                                    {items.map(item => (
                                        <div key={item.id} className="flex gap-4 bg-gray-50 rounded-xl p-3">
                                            <div className="w-16 h-16 bg-primary-100 rounded-xl overflow-hidden shrink-0">
                                                {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">🥬</div>}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-800 text-sm truncate">{item.name}</h4>
                                                <p className="text-primary-700 font-bold text-sm">₹{item.price}/{item.unit || 'kg'}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100">
                                                        <FiMinus className="text-xs" />
                                                    </button>
                                                    <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100">
                                                        <FiPlus className="text-xs" />
                                                    </button>
                                                    <button onClick={() => removeFromCart(item.id)} className="ml-auto text-red-400 hover:text-red-600">
                                                        <FiTrash2 className="text-sm" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="text-right text-sm font-bold text-gray-800">₹{(item.price * item.quantity).toFixed(0)}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="sticky bottom-0 bg-white border-t p-5 space-y-3">
                                    <div className="flex justify-between text-lg font-bold text-gray-800">
                                        <span>Total</span><span className="text-primary-700">₹{cartTotal.toFixed(0)}</span>
                                    </div>
                                    <Link to="/checkout" onClick={() => setShowCart(false)} className="block btn-primary text-center py-3 rounded-xl font-semibold text-lg">
                                        Proceed to Checkout
                                    </Link>
                                    <button onClick={clearCart} className="block w-full text-center text-sm text-gray-500 hover:text-red-500 transition-colors">Clear Cart</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
