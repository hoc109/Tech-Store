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

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { class: 'bg-warning text-dark', text: 'Chờ Xác Nhận' },
            confirmed: { class: 'bg-info text-white', text: 'Đã Xác Nhận' },
            cancelled: { class: 'bg-danger text-white', text: 'Đã Hủy' },
            completed: { class: 'bg-success text-white', text: 'Hoàn Thành' }
        };
        const config = statusConfig[status] || statusConfig.pending;
        return <span className={`badge ${config.class}`}>{config.text}</span>;
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;
        try {
            await axios.patch(`http://localhost:9999/orders/${orderId}`, { status: 'cancelled' });
            fetchOrders();
            alert('Đã hủy đơn hàng thành công!');
        } catch (error) {
            console.error('Error cancelling order:', error);
        }
    };

    return (
        <div>
            <h4 className="mb-3">Lịch Sử Đơn Hàng</h4>

            {orders.length === 0 ? (
                <div className="alert alert-info">Chưa có đơn hàng nào.</div>
            ) : (
                orders.map((order) => (
                    <div key={order.id} className="card mb-4 shadow-sm">
                        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                            <span>Đơn hàng #{order.id}</span>
                            <div>
                                {getStatusBadge(order.status || 'pending')}
                                <small className="ms-3">{order.date}</small>
                            </div>
                        </div>
                        <div className="card-body">
                            {/* Thông tin khách hàng */}
                            <div className="row mb-3">
                                <div className="col-md-4">
                                    <p className="mb-1"><strong>Khách hàng:</strong> {order.customerName}</p>
                                </div>
                                <div className="col-md-4">
                                    <p className="mb-1"><strong>SĐT:</strong> {order.phone}</p>
                                </div>
                                <div className="col-md-4">
                                    <p className="mb-1"><strong>Địa chỉ:</strong> {order.address}</p>
                                </div>
                            </div>

                            {/* Danh sách sản phẩm */}
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
                                            <td className="fw-bold">{(item.price * item.quantity).toLocaleString()}đ</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Tổng tiền và nút hành động */}
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Tổng cộng: <span className="text-danger fw-bold">{order.totalPrice.toLocaleString()}đ</span></h5>
                                {(order.status === 'pending' || !order.status) && (
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleCancelOrder(order.id)}
                                    >
                                        Hủy Đơn Hàng
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default OrderHistory;
