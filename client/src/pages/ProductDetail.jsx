import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct, addReview } from '../api';
import { useCart } from '../CartContext';
import { useAuth } from '../AuthContext';
import { FiStar, FiShoppingCart, FiMinus, FiPlus, FiMapPin, FiShield, FiTruck } from 'react-icons/fi';
import Footer from '../components/Footer';

export default function ProductDetail() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
    const [tab, setTab] = useState('description');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await getProduct(id);
                setProduct(res.data);
            } catch {
                setProduct({
                    id, name: 'Fresh Organic Tomatoes', price: 60, unit: 'kg', category: 'vegetables',
                    description: 'Hand-picked fresh organic tomatoes from our farm. Grown without pesticides, rich in flavor and nutrition. Perfect for salads, curries, and sauces.',
                    farmer_name: 'Ram Kumar', farm_name: 'Green Valley Farm', farm_location: 'Gujarat, India',
                    farm_desc: 'A family-run organic farm of 25 acres, growing vegetables for over 20 years.',
                    rating: 4.5, total_reviews: 24, stock: 50, is_organic: true,
                    reviews: [
                        { id: 1, user_name: 'Priya Sharma', rating: 5, comment: 'Very fresh and tasty! Will buy again.', created_at: '2026-03-01' },
                        { id: 2, user_name: 'Amit Patel', rating: 4, comment: 'Good quality tomatoes. Delivery was quick.', created_at: '2026-02-28' },
                    ]
                });
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        for (let i = 0; i < qty; i++) addToCart(product);
    };

    const submitReview = async (e) => {
        e.preventDefault();
        try {
            await addReview({ product_id: id, ...reviewForm });
            setReviewForm({ rating: 5, comment: '' });
        } catch { }
    };

    if (!product) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-pulse text-center">
                <div className="w-16 h-16 bg-primary-200 rounded-full mx-auto mb-4" />
                <div className="h-4 bg-gray-200 rounded w-32 mx-auto" />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FAFDF7] pt-24 pb-12">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-sm text-gray-500 mb-6">
                    <Link to="/shop" className="hover:text-primary-600">Marketplace</Link> / <span className="text-gray-800">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
                    {/* Image */}
                    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                        <div className="aspect-square bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
                            {product.image ? (
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-9xl">🥬</span>
                            )}
                        </div>
                    </div>

                    {/* Details */}
                    <div>
                        <div className="flex gap-2 mb-3">
                            {product.is_organic && <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">🌿 Organic</span>}
                            <span className="bg-primary-100 text-primary-700 text-xs font-bold px-3 py-1 rounded-full capitalize">{product.category}</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">{product.name}</h1>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <FiStar key={i} className={`${i < Math.round(product.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                ))}
                            </div>
                            <span className="text-gray-500 text-sm">({product.total_reviews} reviews)</span>
                        </div>
                        <div className="text-4xl font-extrabold text-primary-700 mb-1">₹{product.price}<span className="text-lg text-gray-400 font-normal">/{product.unit || 'kg'}</span></div>
                        <p className="text-sm text-green-600 font-medium mb-6">{product.stock > 0 ? `✓ In Stock (${product.stock} available)` : '✗ Out of Stock'}</p>

                        {/* Farmer Info */}
                        <div className="bg-primary-50 rounded-2xl p-4 mb-6 flex items-start gap-4">
                            <div className="w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center text-xl shrink-0">👨‍🌾</div>
                            <div>
                                <div className="font-semibold text-gray-800">{product.farmer_name}</div>
                                <div className="text-sm text-gray-500">{product.farm_name}</div>
                                <div className="text-xs text-gray-400 flex items-center gap-1 mt-1"><FiMapPin className="text-primary-500" />{product.farm_location}</div>
                            </div>
                        </div>

                        {/* Quantity + Add to Cart */}
                        {user && user.role === 'consumer' && (
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-3 hover:bg-gray-100"><FiMinus /></button>
                                    <span className="px-4 py-3 font-semibold border-x border-gray-200 min-w-[50px] text-center">{qty}</span>
                                    <button onClick={() => setQty(qty + 1)} className="px-4 py-3 hover:bg-gray-100"><FiPlus /></button>
                                </div>
                                <button onClick={handleAddToCart} className="flex-1 btn-primary py-3 rounded-xl font-semibold text-lg flex items-center justify-center gap-2">
                                    <FiShoppingCart /> Add to Cart
                                </button>
                            </div>
                        )}

                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { icon: <FiTruck />, text: 'Free delivery' },
                                { icon: <FiShield />, text: 'Quality assured' },
                                { icon: '🌱', text: 'Farm fresh' },
                            ].map((b, i) => (
                                <div key={i} className="text-center p-3 bg-gray-50 rounded-xl text-xs text-gray-500">
                                    <div className="text-lg mb-1 flex justify-center">{b.icon}</div>{b.text}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex border-b">
                        {['description', 'reviews'].map(t => (
                            <button key={t} onClick={() => setTab(t)}
                                className={`px-6 py-4 font-semibold text-sm capitalize transition-all ${tab === t ? 'text-primary-700 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}>{t}</button>
                        ))}
                    </div>
                    <div className="p-6">
                        {tab === 'description' ? (
                            <p className="text-gray-600 leading-relaxed">{product.description || 'Premium quality agricultural product sourced directly from verified farms. Our farmers follow sustainable practices to bring you the freshest produce.'}</p>
                        ) : (
                            <div className="space-y-4">
                                {(product.reviews || []).map(r => (
                                    <div key={r.id} className="bg-gray-50 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="font-semibold text-gray-800">{r.user_name}</div>
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <FiStar key={i} className={`text-xs ${i < r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600">{r.comment}</p>
                                    </div>
                                ))}
                                {user && user.role === 'consumer' && (
                                    <form onSubmit={submitReview} className="border-t pt-4 mt-4">
                                        <h4 className="font-semibold text-gray-800 mb-3">Write a Review</h4>
                                        <div className="flex gap-1 mb-3">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <button key={s} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: s })}>
                                                    <FiStar className={`text-xl ${s <= reviewForm.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                                </button>
                                            ))}
                                        </div>
                                        <textarea value={reviewForm.comment} onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                            className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none resize-none" rows={3} placeholder="Share your experience..." />
                                        <button type="submit" className="btn-primary px-6 py-2 rounded-xl font-semibold mt-2 text-sm">Submit Review</button>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
