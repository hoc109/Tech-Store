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
    const location = useLocation();
    const isAdmin = location.pathname === '/admin';

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
            {!isAdmin && <FloatingButtons />}
        </>
    );
}

export default AppContent;
