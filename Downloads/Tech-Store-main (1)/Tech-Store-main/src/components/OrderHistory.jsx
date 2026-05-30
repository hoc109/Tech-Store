import React, { useState, useEffect } from 'react';
import axios from '../api';

function OrderHistory() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await axios.get('http://localhost:9999/orders');
            setOrders(res.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    return (
        <div>
            <h4 className="mb-3">📜 Lịch sử đơn hàng</h4>

            {orders.length === 0 ? (
                <div className="alert alert-info">Chưa có đơn hàng nào.</div>
            ) : (
                orders.map((order) => (
                    <div key={order.id} className="card mb-4 shadow-sm">
                        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                            <span>🧾 Đơn hàng #{order.id}</span>
                            <small>{order.date}</small>
                        </div>

                        <div className="card-body">
                            <div className="row mb-3">
                                <div className="col-md-4">
                                    <p className="mb-1">
                                        <strong>Khách hàng:</strong> {order.customerName}
                                    </p>
                                </div>

                                <div className="col-md-4">
                                    <p className="mb-1">
                                        <strong>SĐT:</strong> {order.phone}
                                    </p>
                                </div>

                                <div className="col-md-4">
                                    <p className="mb-1">
                                        <strong>Địa chỉ:</strong> {order.address}
                                    </p>
                                </div>
                            </div>

                            <p>
                                <strong>Thanh toán:</strong> {order.payment || 'Thanh toán khi nhận hàng'}
                            </p>

                            <p>
                                <strong>Trạng thái:</strong>{' '}
                                <span className="badge bg-success">
                                    {order.status || 'Đã đặt hàng'}
                                </span>
                            </p>

                            <table className="table table-bordered table-hover mb-3">
                                <thead className="table-secondary">
                                    <tr>
                                        <th>STT</th>
                                        <th>Tên sản phẩm</th>
                                        <th>Giá</th>
                                        <th>Số lượng</th>
                                        <th>Thành tiền</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {order.items.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.title}</td>
                                            <td>{item.price.toLocaleString()}đ</td>
                                            <td>{item.quantity}</td>
                                            <td className="fw-bold">
                                                {(item.price * item.quantity).toLocaleString()}đ
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="text-end">
                                <h5>
                                    💰 Tổng cộng:{' '}
                                    <span className="text-danger">
                                        {order.totalPrice.toLocaleString()}đ
                                    </span>
                                </h5>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default OrderHistory;