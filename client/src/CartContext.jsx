import { createContext, useContext, useState } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
    const [items, setItems] = useState(() => {
        try { return JSON.parse(localStorage.getItem('farmlink_cart')) || []; } catch { return []; }
    });

    const save = (newItems) => { setItems(newItems); localStorage.setItem('farmlink_cart', JSON.stringify(newItems)); };

    const addToCart = (product) => {
        const existing = items.find(i => i.id === product.id);
        if (existing) {
            save(items.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
        } else {
            save([...items, { ...product, quantity: 1 }]);
        }
    };

    const removeFromCart = (id) => save(items.filter(i => i.id !== id));
    const updateQuantity = (id, qty) => {
        if (qty <= 0) return removeFromCart(id);
        save(items.map(i => i.id === id ? { ...i, quantity: qty } : i));
    };
    const clearCart = () => save([]);
    const cartTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
            {children}
        </CartContext.Provider>
    );
}
