import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const CartContext = createContext();

export function useCart() {
    return useContext(CartContext);
}

export function CartProvider({ children }) {
    const [cartCount, setCartCount] = useState(0);

    const fetchCartCount = useCallback(async () => {
        try {
            const res = await axios.get('http://localhost:3000/carts');
            const total = res.data.reduce((sum, item) => sum + item.quantity, 0);
            setCartCount(total);
        } catch (error) {
            console.error('Error fetching cart count:', error);
        }
    }, []);

    useEffect(() => {
        fetchCartCount();
    }, [fetchCartCount]);

    const value = {
        cartCount,
        setCartCount,
        fetchCartCount
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}
