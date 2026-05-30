import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';
import { useCart } from './CartProvider';

function Checkout() {
    const [cartItems, setCartItems] = useState([]);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [payment, setPayment] = useState('Thanh toán khi nhận hàng');
    const { fetchCartCount } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (!currentUser) {
            alert('Bạn cần đăng nhập trước khi thanh toán!');
            navigate('/login');
            return;
        }

        setName(currentUser.name || '');
        setPhone(currentUser.phone || '');
        setAddress(currentUser.address || '');

        fetchCart();
    }, [navigate]);

    const fetchCart = async () => {
        try {
            const res = await axios.get('http://localhost:9999/carts');
            setCartItems(res.data);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const handleConfirmOrder = async (e) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            alert('Giỏ hàng đang trống, không thể đặt hàng!');
            return;
        }

        if (!name.trim() || !phone.trim() || !address.trim()) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        try {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));

            const order = {
                userId: currentUser?.id || null,
                customerName: name,
                phone: phone,
                address: address,
                payment: payment,
                items: cartItems,
                totalPrice: totalPrice,
                status: 'Đã đặt hàng',
                date: new Date().toLocaleString()
            };

            await axios.post('http://localhost:9999/orders', order);

            for (const item of cartItems) {
                await axios.delete(`http://localhost:9999/carts/${item.id}`);
            }

            fetchCartCount();
            alert('🎉 Đặt hàng thành công!');
            navigate('/orders');
        } catch (error) {
            console.error('Error confirming order:', error);
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-8">
                <h4 className="mb-3">📝 Checkout</h4>

                <div className="card shadow-sm mb-3">
                    <div className="card-header bg-dark text-white">
                        Thông tin đơn hàng
                    </div>

                    <div className="card-body">
                        <p><strong>Số sản phẩm:</strong> {cartItems.length}</p>

                        <table className="table table-bordered">
                            <thead className="table-secondary">
                                <tr>
                                    <th>Tên sản phẩm</th>
                                    <th>Giá</th>
                                    <th>Số lượng</th>
                                    <th>Thành tiền</th>
                                </tr>
                            </thead>

                            <tbody>
                                {cartItems.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.title}</td>
                                        <td>{item.price.toLocaleString()}đ</td>
                                        <td>{item.quantity}</td>
                                        <td>{(item.price * item.quantity).toLocaleString()}đ</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <p>
                            <strong>Tổng tiền:</strong>{' '}
                            <span className="text-danger fw-bold">
                                {totalPrice.toLocaleString()}đ
                            </span>
                        </p>
                    </div>
                </div>

                <div className="card shadow-sm">
                    <div className="card-header bg-primary text-white">
                        Thông tin giao hàng
                    </div>

                    <div className="card-body">
                        <form onSubmit={handleConfirmOrder}>
                            <div className="mb-3">
                                <label className="form-label">Tên</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Nhập tên..."
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Số điện thoại</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    placeholder="Nhập số điện thoại..."
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Địa chỉ</label>
                                <textarea
                                    className="form-control"
                                    rows="2"
                                    value={address}
                                    onChange={e => setAddress(e.target.value)}
                                    placeholder="Nhập địa chỉ..."
                                ></textarea>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Phương thức thanh toán</label>
                                <select
                                    className="form-select"
                                    value={payment}
                                    onChange={e => setPayment(e.target.value)}
                                >
                                    <option>Thanh toán khi nhận hàng</option>
                                    <option>Chuyển khoản ngân hàng</option>
                                    <option>Ví điện tử</option>
                                </select>
                            </div>

                            <button type="submit" className="btn btn-success w-100">
                                Xác nhận đặt hàng
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;