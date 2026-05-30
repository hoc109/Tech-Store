import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api';
import { useCart } from './CartProvider';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [category, setCategory] = useState('all');
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

        if (category !== 'all') {
            filtered = filtered.filter((p) => p.category === category);
        }

        if (searchTerm.trim() !== '') {
            filtered = filtered.filter((p) =>
                p.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (sortOrder === 'asc') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortOrder === 'desc') {
            filtered.sort((a, b) => b.price - a.price);
        }

        setProducts(filtered);
    }, [searchTerm, sortOrder, category, allProducts]);

    const categories = ['all', ...new Set(allProducts.map(p => p.category))];

    const handleAddToCart = async (product) => {
        try {
            const cartRes = await axios.get('http://localhost:9999/carts');
            const carts = cartRes.data;

            const existedItem = carts.find(item => item.productId === product.id);

            if (existedItem) {
                await axios.patch(`http://localhost:9999/carts/${existedItem.id}`, {
                    quantity: existedItem.quantity + 1
                });
            } else {
                await axios.post('http://localhost:9999/carts', {
                    productId: product.id,
                    title: product.title,
                    price: product.price,
                    image: product.image || '',
                    quantity: 1
                });
            }

            fetchCartCount();
            alert(`Đã thêm "${product.title}" vào giỏ hàng!`);
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    return (
        <div>
            <h4 className="mb-3 text-center">List of Products</h4>

            <div className="row mb-4">
                <div className="col-md-4 mb-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="🔍 Search by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="col-md-4 mb-2">
                    <select
                        className="form-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {categories.map(c => (
                            <option key={c} value={c}>
                                {c === 'all' ? '-- All Categories --' : c.toUpperCase()}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-md-4 mb-2">
                    <select
                        className="form-select"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="">-- Sort By Price --</option>
                        <option value="asc">Low to High ↑</option>
                        <option value="desc">High to Low ↓</option>
                    </select>
                </div>
            </div>

            <div className="row">
                {products.length === 0 && (
                    <p className="text-muted">Không tìm thấy sản phẩm nào.</p>
                )}

                {products.map((product) => (
                    <div key={product.id} className="col-md-3 mb-4">
                        <div className="card h-100 shadow-sm">
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
                                    style={{ height: '200px', backgroundColor: '#e0e0e0' }}
                                >
                                    <i className="bi bi-cart3 display-4 text-secondary"></i>
                                </div>
                            )}

                            <div className="card-body d-flex flex-column text-center">
                                <h6 className="card-title">{product.title}</h6>

                                <p className="mb-1">
                                    <span className="badge bg-secondary">
                                        {product.category}
                                    </span>
                                </p>

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
    );
}

export default ProductList;