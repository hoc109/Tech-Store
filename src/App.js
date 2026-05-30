import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { CartProvider } from './components/CartProvider';
import Menu from './components/Menu';
import Home from './components/Home';
import ProductList from './components/ProductList';
import Detail from './components/Detail';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Admin from './components/Admin';
import OrderHistory from './components/OrderHistory';
import './App.css';

function FloatingButtons() {
    const navigate = useNavigate();

    return (
        <>
            {/* FAB Admin - Top Right */}
            <button
                onClick={() => navigate('/admin')}
                className="fab fab-admin"
                title="Quản lý Admin"
            >
                ⚙️
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
    return (
        <>
            <Menu />
            <div className="container-fluid mt-3 px-4">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/detail/:id" element={<Detail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/orders" element={<OrderHistory />} />
                </Routes>
            </div>
            <FloatingButtons />
        </>
    );
}

function App() {
    return (
        <CartProvider>
            <HashRouter>
                <AppContent />
            </HashRouter>
        </CartProvider>
    );
}

export default App;