import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CATEGORIES = ['laptop', 'mouse', 'keyboard', 'monitor', 'ram', 'vga', 'mainboard', 'cpu'];

function Admin() {
    const [products, setProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('laptop');
    const [price, setPrice] = useState('');

    useEffect(() => { fetchProducts(); }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:3000/products');
            setProducts(res.data);
        } catch (error) { console.error('Error fetching products:', error); }
    };

    const resetForm = () => {
        setTitle(''); setCategory('laptop'); setPrice(''); setEditId(null); setShowForm(false);
    };

    const handleAdd = () => {
        resetForm(); setShowForm(true);
    };

    const handleEdit = (product) => {
        setEditId(product.id);
        setTitle(product.title);
        setCategory(product.category);
        setPrice(product.price);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
        try {
            await axios.delete(`http://localhost:3000/products/${id}`);
            fetchProducts();
        } catch (error) { console.error('Error deleting product:', error); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !price) { alert('Vui lòng nhập đầy đủ thông tin!'); return; }
        try {
            if (editId) {
                await axios.patch(`http://localhost:3000/products/${editId}`, { title, category, price: Number(price) });
                alert('Cập nhật sản phẩm thành công!');
            } else {
                await axios.post('http://localhost:3000/products', { title, category, price: Number(price), reviews: [] });
                alert('Thêm sản phẩm thành công!');
            }
            resetForm();
            fetchProducts();
        } catch (error) { console.error('Error saving product:', error); }
    };

    return (
        <div>
            <h4 className="mb-3">⚙️ Admin - Quản lý sản phẩm</h4>
            <button className="btn btn-primary mb-3" onClick={handleAdd}>➕ Thêm sản phẩm mới</button>

            {showForm && (
                <div className="card mb-4 shadow-sm">
                    <div className="card-header bg-warning text-dark fw-bold">
                        {editId ? '✏️ Sửa sản phẩm' : '➕ Thêm sản phẩm mới'}
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Tên sản phẩm</label>
                                <input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)} placeholder="Nhập tên sản phẩm..." />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Danh mục</label>
                                <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Giá (đ)</label>
                                <input type="number" className="form-control" value={price} onChange={e => setPrice(e.target.value)} placeholder="Nhập giá..." />
                            </div>
                            <button type="submit" className="btn btn-success me-2">{editId ? 'Cập nhật' : 'Lưu'}</button>
                            <button type="button" className="btn btn-secondary" onClick={resetForm}>Hủy</button>
                        </form>
                    </div>
                </div>
            )}

            <table className="table table-bordered table-striped table-hover">
                <thead className="table-dark">
                    <tr><th>ID</th><th>Tên sản phẩm</th><th>Danh mục</th><th>Giá</th><th>Hành động</th></tr>
                </thead>
                <tbody>
                    {products.map(p => (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.title}</td>
                            <td className="text-uppercase">{p.category}</td>
                            <td>{p.price.toLocaleString()}đ</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(p)}>✏️ Sửa</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>🗑️ Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Admin;
