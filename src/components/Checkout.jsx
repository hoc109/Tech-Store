import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';
import { useCart } from './CartProvider';

function Checkout() {
    const [cartItems, setCartItems] = useState([]);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const { fetchCartCount } = useCart();
    const navigate = useNavigate();

    useEffect(() => { fetchCart(); }, []);

    const fetchCart = async () => {
        try {
            const res = await axios.get('http://localhost:9999/carts');
            setCartItems(res.data);
        } catch (error) { console.error('Error fetching cart:', error); }
    };

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleConfirmOrder = async (e) => {
        e.preventDefault();
        if (!name.trim() || !phone.trim() || !address.trim()) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }
        try {
            const order = {
                customerName: name,
                phone: phone,
                address: address,
                items: cartItems,
                totalPrice: totalPrice,
                date: new Date().toLocaleString(),
                status: 'pending'
            };
            await axios.post('http://localhost:9999/orders', order);
            for (const item of cartItems) {
                await axios.delete(`http://localhost:9999/carts/${item.id}`);
            }
            fetchCartCount();
            alert('🎉 Đặt hàng thành công!');
            navigate('/');
        } catch (error) { console.error('Error confirming order:', error); }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-8">
                <h4 className="mb-3">📝 Checkout</h4>
                <div className="card shadow-sm mb-3">
                    <div className="card-header bg-dark text-white">Thông tin đơn hàng</div>
                    <div className="card-body">
                        <p><strong>Số sản phẩm:</strong> {cartItems.length}</p>
                        <p><strong>Tổng tiền:</strong> <span className="text-danger fw-bold">{totalPrice.toLocaleString()}đ</span></p>
                    </div>
                </div>
                <div className="card shadow-sm">
                    <div className="card-header bg-primary text-white">Thông tin giao hàng</div>
                    <div className="card-body">
                        <form onSubmit={handleConfirmOrder}>
                            <div className="mb-3">
                                <label className="form-label">Tên</label>
                                <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} placeholder="Nhập tên..." />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Số điện thoại</label>
                                <input type="text" className="form-control" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Nhập số điện thoại..." />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Địa chỉ</label>
                                <textarea className="form-control" rows="2" value={address} onChange={e => setAddress(e.target.value)} placeholder="Nhập địa chỉ..."></textarea>
                            </div>
                            <button type="submit" className="btn btn-success w-100"> Xác nhận đặt hàng </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
