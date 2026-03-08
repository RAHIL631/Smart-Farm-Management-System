import { FiStar, FiShoppingCart } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useCart } from '../CartContext';
import { useAuth } from '../AuthContext';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const { user } = useAuth();

    const categoryColors = {
        vegetables: 'bg-green-100 text-green-700',
        fruits: 'bg-orange-100 text-orange-700',
        grains: 'bg-amber-100 text-amber-700',
        dairy: 'bg-blue-100 text-blue-700',
        spices: 'bg-red-100 text-red-700',
        organic: 'bg-emerald-100 text-emerald-700',
        other: 'bg-gray-100 text-gray-700',
    };

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm card-hover border border-gray-100 group">
            <Link to={`/product/${product.id}`} className="block relative overflow-hidden">
                <div className="aspect-[4/3] bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
                    {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                        <div className="text-6xl">🥬</div>
                    )}
                </div>
                {product.is_organic && (
                    <span className="absolute top-3 left-3 bg-green-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg">
                        🌿 Organic
                    </span>
                )}
                {product.stock < 10 && product.stock > 0 && (
                    <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg">
                        Low Stock
                    </span>
                )}
            </Link>
            <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${categoryColors[product.category] || categoryColors.other}`}>
                        {product.category}
                    </span>
                </div>
                <Link to={`/product/${product.id}`}>
                    <h3 className="font-semibold text-gray-800 mb-1 hover:text-primary-700 transition-colors line-clamp-1">{product.name}</h3>
                </Link>
                <p className="text-xs text-gray-500 mb-2">by {product.farmer_name || product.farm_name || 'Local Farmer'}</p>

                <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className={`text-xs ${i < Math.round(product.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                    ))}
                    <span className="text-xs text-gray-400 ml-1">({product.total_reviews || 0})</span>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-lg font-bold text-primary-700">₹{product.price}</span>
                        <span className="text-xs text-gray-400 ml-1">/{product.unit || 'kg'}</span>
                    </div>
                    {user && user.role === 'consumer' && (
                        <button onClick={(e) => { e.preventDefault(); addToCart(product); }}
                            className="btn-primary p-2.5 rounded-xl group/btn" title="Add to Cart">
                            <FiShoppingCart className="text-sm group-hover/btn:scale-110 transition-transform" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
