import { HashRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './components/CartProvider';
import Menu from './components/Menu';
import Home from './components/Home';
import ProductList from './components/ProductList';
import Detail from './components/Detail';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Admin from './components/Admin';
import OrderHistory from './components/OrderHistory';
import ViewedProducts from './components/ViewedProducts';

function App() {
    return (
        <CartProvider>
            <HashRouter>
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
                        <Route path="/viewed-products" element={<ViewedProducts />} />
                    </Routes>
                </div>
            </HashRouter>
        </CartProvider>
    );
}

export default App;