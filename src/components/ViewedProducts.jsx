import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartProvider';
import axios from '../api';

function ViewedProducts() {
    const [viewedProducts, setViewedProducts] = useState([]);
    const { fetchCartCount } = useCart();

    useEffect(() => {
        loadViewedProducts();
    }, []);

    const loadViewedProducts = () => {
        try {
            const viewed = JSON.parse(localStorage.getItem('viewedProducts') || '[]');
            setViewedProducts(viewed);
        } catch (e) {
            setViewedProducts([]);
        }
    };

    const handleClearHistory = () => {
        if (window.confirm('Bạn có chắc muốn xóa lịch sử xem sản phẩm?')) {
            localStorage.setItem('viewedProducts', JSON.stringify([]));
            setViewedProducts([]);
        }
    };

    const handleRemoveOne = (id) => {
        const updated = viewedProducts.filter(p => p.id !== id);
        localStorage.setItem('viewedProducts', JSON.stringify(updated));
        setViewedProducts(updated);
    };

    const handleAddToCart = async (product) => {
        try {
            await axios.post('http://localhost:9999/carts', {
                productId: product.id,
                title: product.title,
                price: product.price,
                quantity: 1,
            });
            fetchCartCount();
            alert(`Đã thêm "${product.title}" vào giỏ hàng!`);
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const formatDate = (isoString) => {
        try {
            const date = new Date(isoString);
            return date.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return '';
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="mb-1" style={{ fontWeight: 700 }}>
                        Sản phẩm bạn đã xem
                    </h4>
                    <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                        {viewedProducts.length > 0
                            ? `Bạn đã xem ${viewedProducts.length} sản phẩm gần đây`
                            : 'Chưa có sản phẩm nào được xem'}
                    </p>
                </div>
                <div className="d-flex gap-2">
                    <Link to="/products" className="btn btn-outline-primary btn-sm">
                        🛒 Tiếp tục mua sắm
                    </Link>
                    {viewedProducts.length > 0 && (
                        <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={handleClearHistory}
                        >
                            🗑️ Xóa lịch sử
                        </button>
                    )}
                </div>
            </div>

            {/* Empty state */}
            {viewedProducts.length === 0 && (
                <div
                    className="text-center py-5"
                    style={{
                        background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
                        borderRadius: '16px',
                    }}
                >
                    <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔍</div>
                    <h5 style={{ fontWeight: 600, color: '#555' }}>
                        Bạn chưa xem sản phẩm nào
                    </h5>
                    <p className="text-muted mb-4">
                        Hãy khám phá các sản phẩm công nghệ tuyệt vời của chúng tôi!
                    </p>
                    <Link to="/products" className="btn btn-primary">
                        🛒 Xem sản phẩm ngay
                    </Link>
                </div>
            )}

            {/* Products grid */}
            <div className="row">
                {viewedProducts.map((product) => (
                    <div key={product.id} className="col-md-3 mb-4">
                        <div
                            className="card h-100 shadow-sm border-0"
                            style={{
                                borderRadius: '12px',
                                overflow: 'hidden',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                            }}
                        >
                            {/* Remove button */}
                            <button
                                className="btn btn-sm position-absolute"
                                style={{
                                    top: '8px',
                                    right: '8px',
                                    zIndex: 2,
                                    background: 'rgba(255,255,255,0.9)',
                                    borderRadius: '50%',
                                    width: '30px',
                                    height: '30px',
                                    padding: 0,
                                    fontSize: '0.8rem',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                }}
                                onClick={() => handleRemoveOne(product.id)}
                                title="Xóa khỏi danh sách"
                            >
                                ✕
                            </button>

                            {/* Image */}
                            {product.image && product.image.trim() !== '' && !product.image.includes('placehold.co') ? (
                                <img
                                    src={product.image}
                                    className="card-img-top"
                                    alt={product.title}
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                            ) : (
                                <div
                                    className="d-flex align-items-center justify-content-center"
                                    style={{
                                        height: '200px',
                                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                    }}
                                >
                                    <span style={{ fontSize: '3rem', opacity: 0.7 }}>
                                        {product.category === 'laptop' ? '💻' :
                                            product.category === 'mouse' ? '🖱️' :
                                                product.category === 'keyboard' ? '⌨️' :
                                                    product.category === 'monitor' ? '🖥️' : '🛒'}
                                    </span>
                                </div>
                            )}

                            {/* Content */}
                            <div className="card-body d-flex flex-column text-center">
                                <span
                                    className="badge mb-2"
                                    style={{
                                        alignSelf: 'center',
                                        background: '#e8f4f8',
                                        color: '#2980b9',
                                        fontSize: '0.7rem',
                                        fontWeight: 500,
                                    }}
                                >
                                    {product.category?.toUpperCase()}
                                </span>
                                <h6 className="card-title" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                                    {product.title}
                                </h6>
                                <p className="card-text text-danger fw-bold">
                                    {product.price?.toLocaleString()}đ
                                </p>
                                {product.viewedAt && (
                                    <small className="text-muted mb-2" style={{ fontSize: '0.75rem' }}>
                                        🕐 Đã xem: {formatDate(product.viewedAt)}
                                    </small>
                                )}
                                <div className="mt-auto d-flex justify-content-center gap-2">
                                    <Link
                                        to={`/detail/${product.id}`}
                                        className="btn btn-primary btn-sm"
                                    >
                                        Xem lại
                                    </Link>
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() => handleAddToCart(product)}
                                    >
                                        🛒 Thêm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ViewedProducts;
