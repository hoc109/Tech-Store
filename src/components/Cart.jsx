import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from './CartProvider';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const { fetchCartCount } = useCart();

    useEffect(() => { fetchCart(); }, []);

    const fetchCart = async () => {
        try {
            const res = await axios.get('http://localhost:9999/carts');
            setCartItems(res.data);
        } catch (error) { console.error('Error fetching cart:', error); }
    };

    const handleQuantityChange = async (item, newQty) => {
        const qty = Number(newQty);
        if (qty < 1) return;
        try {
            await axios.patch(`http://localhost:9999/carts/${item.id}`, { quantity: qty });
            setCartItems(prev => prev.map(ci => ci.id === item.id ? { ...ci, quantity: qty } : ci));
            fetchCartCount();
        } catch (error) { console.error('Error updating quantity:', error); }
    };

    const handleDelete = async (itemId) => {
        try {
            await axios.delete(`http://localhost:9999/carts/${itemId}`);
            setCartItems(prev => prev.filter(ci => ci.id !== itemId));
            fetchCartCount();
        } catch (error) { console.error('Error deleting cart item:', error); }
    };

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div>
            <h4 className="mb-3">🛒 Giỏ hàng</h4>
            {cartItems.length === 0 ? (
                <div className="alert alert-info">Giỏ hàng trống. <Link to="/">Tiếp tục mua sắm</Link></div>
            ) : (
                <>
                    <table className="table table-bordered table-hover">
                        <thead className="table-dark">
                            <tr><th>#</th><th>Tên sản phẩm</th><th>Giá</th><th>Số lượng</th><th>Tổng tiền</th><th>Hành động</th></tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>{item.title}</td>
                                    <td>{item.price.toLocaleString()}đ</td>
                                    <td style={{ width: '120px' }}>
                                        <input type="number" className="form-control form-control-sm" min="1" value={item.quantity} onChange={e => handleQuantityChange(item, e.target.value)} />
                                    </td>
                                    <td className="fw-bold text-danger">{(item.price * item.quantity).toLocaleString()}đ</td>
                                    <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>🗑️ Xóa</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <h5>💰 Tổng đơn hàng: <span className="text-danger">{totalPrice.toLocaleString()}đ</span></h5>
                        <Link to="/checkout" className="btn btn-success btn-lg">Đặt hàng</Link>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;
