import React, { useState, useEffect } from 'react';
import axios from '../api';

const CATEGORIES = ['laptop', 'mouse', 'keyboard', 'monitor', 'ram', 'vga', 'mainboard', 'cpu'];

function Admin() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('laptop');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [searchCustomer, setSearchCustomer] = useState('');

    useEffect(() => {
        fetchProducts();
        fetchOrders();
    }, []);

    // ===== FETCH DATA =====
    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:9999/products');
            setProducts(res.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await axios.get('http://localhost:9999/orders');
            setOrders(res.data);
            // Extract unique customers
            const customerMap = new Map();
            res.data.forEach(order => {
                if (!customerMap.has(order.customerName)) {
                    customerMap.set(order.customerName, {
                        name: order.customerName,
                        phone: order.phone,
                        address: order.address,
                        totalSpent: 0,
                        orderCount: 0,
                        lastOrder: order.date
                    });
                }
                const customer = customerMap.get(order.customerName);
                customer.totalSpent += order.totalPrice;
                customer.orderCount += 1;
                customer.lastOrder = order.date;
            });
            setCustomers(Array.from(customerMap.values()));
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    // ===== PRODUCT MANAGEMENT =====
    const resetForm = () => {
        setTitle('');
        setCategory('laptop');
        setPrice('');
        setImage('');
        setEditId(null);
        setShowForm(false);
    };

    const handleAdd = () => {
        resetForm();
        setShowForm(true);
    };

    const handleEdit = (product) => {
        setEditId(product.id);
        setTitle(product.title);
        setCategory(product.category);
        setPrice(product.price);
        setImage(product.image || '');
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
        try {
            await axios.delete(`http://localhost:9999/products/${id}`);
            fetchProducts();
            alert('Xóa sản phẩm thành công!');
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !price) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }
        try {
            if (editId) {
                await axios.patch(`http://localhost:9999/products/${editId}`, {
                    title,
                    category,
                    price: Number(price),
                    image: image || ''
                });
                alert('Cập nhật sản phẩm thành công!');
            } else {
                await axios.post('http://localhost:9999/products', {
                    title,
                    category,
                    price: Number(price),
                    image: image || '',
                    reviews: []
                });
                alert('Thêm sản phẩm thành công!');
            }
            resetForm();
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    const deleteOrder = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa đơn hàng này?')) return;
        try {
            await axios.delete(`http://localhost:9999/orders/${id}`);
            fetchOrders();
            alert('Xóa đơn hàng thành công!');
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    };

    const updateOrderStatus = async (id, newStatus) => {
        try {
            await axios.patch(`http://localhost:9999/orders/${id}`, { status: newStatus });
            fetchOrders();
            alert(`Cập nhật trạng thái thành "${newStatus}" thành công!`);
        } catch (error) {
            console.error('Error updating order status:', error);
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
        return config;
    };

    // ===== CALCULATIONS =====
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.status !== 'cancelled' ? order.totalPrice : 0), 0);
    const totalCustomers = customers.length;
    const pendingOrders = orders.filter(o => o.status === 'pending' || !o.status).length;
    const confirmedOrders = orders.filter(o => o.status === 'confirmed').length;
    const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const filteredOrders = orders.filter(order =>
        order.customerName.toLowerCase().includes(searchCustomer.toLowerCase())
    );

    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchCustomer.toLowerCase())
    );

    return (
        <div className="admin-container">
            <div className="admin-wrapper">
                <h2 className="mb-4">Bảng Điều Khiển Admin</h2>

            {/* NAVIGATION TABS */}
            <div className="mb-4">
                <div className="btn-group" role="group">
                    <button
                        type="button"
                        className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        Tổng Quan
                    </button>
                    <button
                        type="button"
                        className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setActiveTab('products')}
                    >
                        Sản Phẩm
                    </button>
                    <button
                        type="button"
                        className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        Đơn Hàng
                    </button>
                    <button
                        type="button"
                        className={`btn ${activeTab === 'customers' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setActiveTab('customers')}
                    >
                        Khách Hàng
                    </button>
                    <button
                        type="button"
                        className={`btn ${activeTab === 'payments' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setActiveTab('payments')}
                    >
                        Thanh Toán
                    </button>
                </div>
            </div>

            {/* ===== DASHBOARD TAB ===== */}
            {activeTab === 'dashboard' && (
                <div>
                    <h4 className="mb-4">Tổng Quan</h4>
                    <div className="row g-3 mb-4">
                        <div className="col-md-3">
                            <div className="card shadow-sm border-primary">
                                <div className="card-body text-center">
                                    <h5 className="card-title text-primary">Tổng Sản Phẩm</h5>
                                    <h2 className="text-primary fw-bold">{totalProducts}</h2>
                                    <p className="mb-0 small text-muted">sản phẩm đang bán</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card shadow-sm border-success">
                                <div className="card-body text-center">
                                    <h5 className="card-title text-success">Tổng Đơn Hàng</h5>
                                    <h2 className="text-success fw-bold">{totalOrders}</h2>
                                    <p className="mb-0 small text-muted">đơn hàng tổng cộng</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card shadow-sm border-info">
                                <div className="card-body text-center">
                                    <h5 className="card-title text-info">Tổng Khách Hàng</h5>
                                    <h2 className="text-info fw-bold">{totalCustomers}</h2>
                                    <p className="mb-0 small text-muted">khách hàng độc lập</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card shadow-sm border-danger">
                                <div className="card-body text-center">
                                    <h5 className="card-title text-danger">Tổng Doanh Thu</h5>
                                    <h2 className="text-danger fw-bold">{totalRevenue.toLocaleString()}đ</h2>
                                    <p className="mb-0 small text-muted">chỉ các đơn thành công</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status Breakdown */}
                    <div className="row g-3 mb-4">
                        <div className="col-md-6">
                            <h5 className="mb-3">Trạng Thái Đơn Hàng</h5>
                            <div className="row">
                                <div className="col-6 mb-2">
                                    <div className="card bg-light">
                                        <div className="card-body text-center">
                                            <span className="badge bg-warning text-dark mb-2" style={{fontSize: '14px', padding: '8px 16px'}}>Chờ Xác Nhận</span>
                                            <h4 className="mb-0 text-warning">{pendingOrders}</h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6 mb-2">
                                    <div className="card bg-light">
                                        <div className="card-body text-center">
                                            <span className="badge bg-info mb-2" style={{fontSize: '14px', padding: '8px 16px'}}>Đã Xác Nhận</span>
                                            <h4 className="mb-0 text-info">{confirmedOrders}</h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="card bg-light">
                                        <div className="card-body text-center">
                                            <span className="badge bg-success mb-2" style={{fontSize: '14px', padding: '8px 16px'}}>Hoàn Thành</span>
                                            <h4 className="mb-0 text-success">{completedOrders}</h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="card bg-light">
                                        <div className="card-body text-center">
                                            <span className="badge bg-danger mb-2" style={{fontSize: '14px', padding: '8px 16px'}}>Đã Hủy</span>
                                            <h4 className="mb-0 text-danger">{cancelledOrders}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <h5 className="mb-3">Thông Tin Nhanh</h5>
                            <div className="list-group">
                                <div className="list-group-item">
                                    <div className="d-flex w-100 justify-content-between">
                                        <h6>Tỷ Lệ Hủy</h6>
                                        <span className="badge bg-danger">{totalOrders > 0 ? ((cancelledOrders / totalOrders) * 100).toFixed(1) : 0}%</span>
                                    </div>
                                </div>
                                <div className="list-group-item">
                                    <div className="d-flex w-100 justify-content-between">
                                        <h6>Tỷ Lệ Thành Công</h6>
                                        <span className="badge bg-success">{totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) : 0}%</span>
                                    </div>
                                </div>
                                <div className="list-group-item">
                                    <div className="d-flex w-100 justify-content-between">
                                        <h6>Đơn Hàng Chưa Xử Lý</h6>
                                        <span className="badge bg-warning text-dark">{pendingOrders}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="mt-5">
                        <h5 className="mb-3">Đơn Hàng Gần Đây</h5>
                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Ngày</th>
                                        <th>Khách Hàng</th>
                                        <th>Số Lượng</th>
                                        <th>Tổng Tiền</th>
                                        <th>Trạng Thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.slice(-5).reverse().map((order, idx) => {
                                        const statusConfig = getStatusBadge(order.status || 'pending');
                                        return (
                                            <tr key={idx}>
                                                <td>{order.date}</td>
                                                <td>{order.customerName}</td>
                                                <td>{order.items.length} sản phẩm</td>
                                                <td className="text-danger fw-bold">{order.totalPrice.toLocaleString()}đ</td>
                                                <td><span className={`badge ${statusConfig.class}`}>{statusConfig.text}</span></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== PRODUCTS TAB ===== */}
            {activeTab === 'products' && (
                <div>
                    <h4 className="mb-3">Quản Lý Sản Phẩm ({totalProducts})</h4>
                    <button className="btn btn-primary mb-3" onClick={handleAdd}>
                        Thêm Sản Phẩm Mới
                    </button>

                    {showForm && (
                        <div className="card mb-4 shadow-sm">
                            <div className="card-header bg-warning text-dark fw-bold">
                                {editId ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Tên sản phẩm</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={title}
                                            onChange={e => setTitle(e.target.value)}
                                            placeholder="Nhập tên sản phẩm..."
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Danh mục</label>
                                        <select
                                            className="form-select"
                                            value={category}
                                            onChange={e => setCategory(e.target.value)}
                                        >
                                            {CATEGORIES.map(c => (
                                                <option key={c} value={c}>{c.toUpperCase()}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Giá (đ)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={price}
                                            onChange={e => setPrice(e.target.value)}
                                            placeholder="Nhập giá..."
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Link ảnh (URL)</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={image}
                                            onChange={e => setImage(e.target.value)}
                                            placeholder="Nhập link ảnh sản phẩm..."
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-success me-2">
                                        {editId ? 'Cập Nhật' : 'Lưu'}
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
                                        Hủy
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Tên</th>
                                    <th>Danh Mục</th>
                                    <th>Giá</th>
                                    <th>Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product.id}>
                                        <td>{product.id}</td>
                                        <td>{product.title}</td>
                                        <td>{product.category}</td>
                                        <td className="text-danger fw-bold">{product.price.toLocaleString()}đ</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-warning me-2"
                                                onClick={() => handleEdit(product)}
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDelete(product.id)}
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ===== ORDERS TAB ===== */}
            {activeTab === 'orders' && (
                <div>
                    <h4 className="mb-3">Quản Lý Đơn Hàng ({filteredOrders.length})</h4>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Tìm kiếm theo tên khách hàng..."
                            value={searchCustomer}
                            onChange={e => setSearchCustomer(e.target.value)}
                        />
                    </div>

                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Khách Hàng</th>
                                    <th>SĐT</th>
                                    <th>Địa Chỉ</th>
                                    <th>Số Sản Phẩm</th>
                                    <th>Tổng Tiền</th>
                                    <th>Ngày Đặt</th>
                                    <th>Trạng Thái</th>
                                    <th>Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order, idx) => {
                                    const statusConfig = getStatusBadge(order.status || 'pending');
                                    return (
                                        <tr key={idx}>
                                            <td>{order.id}</td>
                                            <td>{order.customerName}</td>
                                            <td>{order.phone}</td>
                                            <td>{order.address}</td>
                                            <td>{order.items.length}</td>
                                            <td className="text-danger fw-bold">{order.totalPrice.toLocaleString()}đ</td>
                                            <td>{order.date}</td>
                                            <td><span className={`badge ${statusConfig.class}`}>{statusConfig.text}</span></td>
                                            <td>
                                                {(order.status === 'pending' || !order.status) && (
                                                    <>
                                                        <button
                                                            className="btn btn-sm btn-success me-1"
                                                            onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                                            title="Xác nhận đơn hàng"
                                                        >
                                                            Xác Nhận
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-warning me-1"
                                                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                                            title="Hủy đơn hàng"
                                                        >
                                                            Hủy
                                                        </button>
                                                    </>
                                                )}
                                                {order.status === 'confirmed' && (
                                                    <button
                                                        className="btn btn-sm btn-info me-1"
                                                        onClick={() => updateOrderStatus(order.id, 'completed')}
                                                        title="Đánh dấu hoàn thành"
                                                    >
                                                        Hoàn Thành
                                                    </button>
                                                )}
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => deleteOrder(order.id)}
                                                    title="Xóa đơn hàng"
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ===== CUSTOMERS TAB ===== */}
            {activeTab === 'customers' && (
                <div>
                    <h4 className="mb-3">Quản Lý Khách Hàng ({filteredCustomers.length})</h4>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Tìm kiếm theo tên khách hàng..."
                            value={searchCustomer}
                            onChange={e => setSearchCustomer(e.target.value)}
                        />
                    </div>

                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>Tên</th>
                                    <th>Số Điện Thoại</th>
                                    <th>Địa Chỉ</th>
                                    <th>Số Đơn Hàng</th>
                                    <th>Tổng Chi Tiêu</th>
                                    <th>Lần Mua Cuối</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.map((customer, idx) => (
                                    <tr key={idx}>
                                        <td><strong>{customer.name}</strong></td>
                                        <td>{customer.phone}</td>
                                        <td>{customer.address}</td>
                                        <td><span className="badge bg-info">{customer.orderCount}</span></td>
                                        <td className="text-danger fw-bold">{customer.totalSpent.toLocaleString()}đ</td>
                                        <td>{customer.lastOrder}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ===== PAYMENTS TAB ===== */}
            {activeTab === 'payments' && (
                <div>
                    <h4 className="mb-3">Lịch Sử Thanh Toán ({filteredOrders.length})</h4>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Tìm kiếm theo tên khách hàng..."
                            value={searchCustomer}
                            onChange={e => setSearchCustomer(e.target.value)}
                        />
                    </div>

                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Khách Hàng</th>
                                    <th>Số Tiền</th>
                                    <th>Phương Thức</th>
                                    <th>Trạng Thái Thanh Toán</th>
                                    <th>Trạng Thái Đơn</th>
                                    <th>Ngày Thanh Toán</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order, idx) => {
                                    const statusConfig = getStatusBadge(order.status || 'pending');
                                    const paymentStatus = order.status !== 'cancelled' ? 'Đã Thanh Toán' : 'Chưa Thanh Toán';
                                    const paymentBadgeClass = order.status !== 'cancelled' ? 'bg-success' : 'bg-danger';
                                    return (
                                        <tr key={idx}>
                                            <td>{order.id}</td>
                                            <td>{order.customerName}</td>
                                            <td className="text-danger fw-bold">{order.totalPrice.toLocaleString()}đ</td>
                                            <td><span className="badge bg-primary">Chuyển Khoản</span></td>
                                            <td><span className={`badge ${paymentBadgeClass}`}>{paymentStatus}</span></td>
                                            <td><span className={`badge ${statusConfig.class}`}>{statusConfig.text}</span></td>
                                            <td>{order.date}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
}

export default Admin;
