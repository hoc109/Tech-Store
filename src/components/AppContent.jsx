import { useState, useEffect } from 'react';
import { useLocation, Routes, Route, useNavigate } from 'react-router-dom';
import Menu from './Menu';
import Home from './Home';
import ProductList from './ProductList';
import Detail from './Detail';
import ViewedProducts from './ViewedProducts';
import Cart from './Cart';
import Checkout from './Checkout';
import Admin from './Admin';
import OrderHistory from './OrderHistory';
import ProtectedRoute from './ProtectedRoute';

function FloatingButtons({ isDarkMode, toggleTheme }) {
    const navigate = useNavigate();

    return (
        <>
            {/* FAB Settings - Top Right (Theme Toggle) */}
            <button
                onClick={toggleTheme}
                className="fab fab-admin"
                title={isDarkMode ? "Chế độ sáng" : "Chế độ tối"}
                style={{
                    background: isDarkMode 
                        ? 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)'
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
            >
                {isDarkMode ? '☀️' : '🌙'}
            </button>

            {/* FAB Orders - Bottom Right */}
            <button
                onClick={() => navigate('/orders')}
                className="fab fab-orders"
                title="Lịch sử đơn hàng"
            >
                📋
            </button>
        </>
    );
}

function AppContent() {
    const location = useLocation();
    const isAdmin = location.pathname === '/admin';
    const [isDarkMode, setIsDarkMode] = useState(
        localStorage.getItem('theme') === 'dark'
    );

    const toggleTheme = () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);
        localStorage.setItem('theme', newTheme ? 'dark' : 'light');
        
        // Apply theme to document
        if (newTheme) {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
        }
    };

    useEffect(() => {
        // Apply theme on mount
        const savedTheme = localStorage.getItem('theme') === 'dark';
        setIsDarkMode(savedTheme);
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
        }
    }, []);

    return (
        <>
            <Menu />
            <div className="container-fluid mt-3 px-4">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/detail/:id" element={<Detail />} />
                    <Route path="/viewed-products" element={<ViewedProducts />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route 
                        path="/admin" 
                        element={
                            <ProtectedRoute>
                                <Admin />
                            </ProtectedRoute>
                        } 
                    />
                    <Route path="/orders" element={<OrderHistory />} />
                </Routes>
            </div>
            {!isAdmin && <FloatingButtons isDarkMode={isDarkMode} toggleTheme={toggleTheme} />}
        </>
    );
}

export default AppContent;
