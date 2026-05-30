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

function Home() {
    const [products, setProducts] = useState([]);
    const [activeCategory, setActiveCategory] = useState('ALL');
    const { fetchCartCount } = useCart();

    useEffect(() => {
        fetchProducts('ALL');
    }, []);

    const fetchProducts = async (category) => {
        try {
            let url = 'http://localhost:9999/products';
            if (category !== 'ALL') {
                url += `?category=${category.toLowerCase()}`;
            }
            const res = await axios.get(url);
            setProducts(res.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleCategoryClick = (category) => {
        setActiveCategory(category);
        fetchProducts(category);
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
        <div className="row">
            {/* Sidebar danh mục */}
            <div className="col-md-3">
                <h5 className="mb-3 d-flex align-items-center gap-2">
                    <span style={{ fontSize: '1.4rem' }}>☰</span> Danh mục sản phẩm
                </h5>
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

            {/* Danh sách sản phẩm */}
            <div className="col-md-9">
                <h5 className="mb-3">🛍️ Sản phẩm ({activeCategory})</h5>
                <div className="row">
                    {products.length === 0 && (
                        <p className="text-muted">Không có sản phẩm nào.</p>
                    )}
                    {products.map((product) => (
                        <div key={product.id} className="col-md-3 mb-4">
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
    );
}

export default Home;
