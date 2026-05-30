import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api';
import { useCart } from './CartProvider';

const CATEGORIES = [
    { key: 'ALL', label: 'ALL', icon: '📋' },
    { key: 'LAPTOP', label: 'LAPTOP', icon: '💻' },
    { key: 'MOUSE', label: 'MOUSE', icon: '🖱️' },
    { key: 'KEYBOARD', label: 'KEYBOARD', icon: '⌨️' },
    { key: 'MONITOR', label: 'MONITOR', icon: '🖥️' },
    { key: 'RAM', label: 'RAM', icon: '🧩' },
    { key: 'VGA', label: 'VGA', icon: '🎮' },
    { key: 'MAINBOARD', label: 'MAINBOARD', icon: '🧮' },
    { key: 'CPU', label: 'CPU', icon: '⚡' },
];

function ProductList() {
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [activeCategory, setActiveCategory] = useState('ALL');
    const [showCategories, setShowCategories] = useState(false);
    const { fetchCartCount } = useCart();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:9999/products');
            setAllProducts(res.data);
            setProducts(res.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        let filtered = [...allProducts];

        // Filter by category
        if (activeCategory !== 'ALL') {
            filtered = filtered.filter(
                (p) => p.category && p.category.toLowerCase() === activeCategory.toLowerCase()
            );
        }

        // Search by title
        if (searchTerm.trim() !== '') {
            filtered = filtered.filter((p) =>
                p.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort by price
        if (sortOrder === 'price-asc') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortOrder === 'price-desc') {
            filtered.sort((a, b) => b.price - a.price);
        }
        // Sort by name
        else if (sortOrder === 'name-asc') {
            filtered.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortOrder === 'name-desc') {
            filtered.sort((a, b) => b.title.localeCompare(a.title));
        }

        setProducts(filtered);
    }, [searchTerm, sortOrder, activeCategory, allProducts]);

    const handleCategoryClick = (category) => {
        setActiveCategory(category);
    };

    const handleAddToCart = async (product) => {
        try {
            await axios.post('http://localhost:9999/carts', {
                productId: product.id,
                title: product.title,
                price: product.price,
                quantity: 1
            });
            fetchCartCount();
            alert(`Đã thêm "${product.title}" vào giỏ hàng!`);
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    return (
        <div>
            <h4 className="mb-3 text-center"> List of Products </h4>

            <div className="row">
                {/* Sidebar danh mục */}
                <div className={showCategories ? 'col-md-3' : ''} style={{ width: showCategories ? undefined : 'auto' }}>
                    <button
                        className="btn btn-outline-dark d-flex align-items-center justify-content-center"
                        style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '10px',
                            fontSize: '1.4rem',
                            padding: 0,
                        }}
                        title="Danh mục sản phẩm"
                        onClick={() => setShowCategories(!showCategories)}
                    >
                        ☰
                    </button>
                    {showCategories && (
                        <div className="mt-3">
                            <h6 className="mb-2">Danh mục sản phẩm</h6>
                            <div className="list-group">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.key}
                                        className={`list-group-item list-group-item-action d-flex align-items-center gap-2 ${activeCategory === cat.key ? 'active' : ''}`}
                                        onClick={() => handleCategoryClick(cat.key)}
                                    >
                                        <span>{cat.icon}</span> {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Main content */}
                <div className={showCategories ? 'col-md-9' : 'col'}>
                    {/* Toolbar: Search + Sort */}
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="🔍 Search by title..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <select
                                className="form-select"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                            >
                                <option value="">-- Sort --</option>
                                <option value="name-asc">Tên A → Z</option>
                                <option value="name-desc">Tên Z → A</option>
                                <option value="price-asc">Giá thấp → cao ↑</option>
                                <option value="price-desc">Giá cao → thấp ↓</option>
                            </select>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="row">
                        {products.length === 0 && (
                            <p className="text-muted">Không tìm thấy sản phẩm nào.</p>
                        )}
                        {products.map((product) => (
                            <div key={product.id} className={`mb-4 ${showCategories ? 'col-md-4' : 'col-md-3'}`}>
                                <div className="card h-100 shadow-sm">
                                    {product.image && product.image.trim() !== '' && !product.image.includes('placehold.co') ? (
                                        <img src={product.image} className="card-img-top" alt={product.title} style={{ height: '200px', objectFit: 'cover' }} />
                                    ) : (
                                        <div
                                            className="d-flex align-items-center justify-content-center"
                                            style={{ height: '200px', backgroundColor: '#e0e0e0' }}
                                        >
                                            <i className="bi bi-cart3 display-4 text-secondary"></i>
                                        </div>
                                    )}
                                    <div className="card-body d-flex flex-column text-center">
                                        <h6 className="card-title">{product.title}</h6>
                                        <p className="card-text text-danger fw-bold">
                                            {product.price.toLocaleString()}đ
                                        </p>
                                        <div className="mt-auto d-flex justify-content-center gap-2">
                                            <Link
                                                to={`/detail/${product.id}`}
                                                className="btn btn-primary btn-sm"
                                            >
                                                Xem chi tiết
                                            </Link>
                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={() => handleAddToCart(product)}
                                            >
                                                Thêm vào giỏ hàng
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductList;
