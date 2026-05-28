import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from './CartProvider';

function Detail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [reviewName, setReviewName] = useState('');
    const [reviewComment, setReviewComment] = useState('');
    const [reviewRating, setReviewRating] = useState(5);
    const { fetchCartCount } = useCart();

    useEffect(() => {
        fetchProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/products/${id}`);
            setProduct(res.data);
        } catch (error) {
            console.error('Error fetching product detail:', error);
        }
    };

    const handleAddToCart = async () => {
        try {
            await axios.post('http://localhost:3000/carts', {
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

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!reviewName.trim() || !reviewComment.trim()) {
            alert('Vui lòng nhập đầy đủ tên và bình luận!');
            return;
        }
        try {
            const newReview = {
                name: reviewName,
                comment: reviewComment,
                rating: Number(reviewRating),
                date: new Date().toLocaleDateString()
            };
            const updatedReviews = [...(product.reviews || []), newReview];
            await axios.patch(`http://localhost:3000/products/${id}`, {
                reviews: updatedReviews
            });
            setProduct({ ...product, reviews: updatedReviews });
            setReviewName('');
            setReviewComment('');
            setReviewRating(5);
            alert('Đã thêm đánh giá thành công!');
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    if (!product) {
        return <p className="text-center mt-5">Đang tải sản phẩm...</p>;
    }

    return (
        <div>
            {/* Product Info */}
            <div className="card mb-4 shadow">
                <div className="card-body">
                    <div className="row">
                        {/* Cột trái: Hình ảnh */}
                        <div className="col-md-5">
                            <img
                                src={product.image}
                                className="img-fluid rounded"
                                alt={product.title}
                            />
                        </div>

                        {/* Cột phải: Thông tin sản phẩm */}
                        <div className="col-md-7">
                            <h2>{product.title}</h2>
                            <p>
                                <strong>Danh mục:</strong>{' '}
                                <span className="text-uppercase badge bg-secondary">
                                    {product.category}
                                </span>
                            </p>

                            {/* Thông số kỹ thuật - Laptop */}
                            {product.category === 'laptop' && product.specs && (
                                <div className="bg-light p-3 rounded mb-3">
                                    <h6 className="fw-bold mb-2">📋 Thông số kỹ thuật</h6>
                                    <p className="mb-1"><i className="bi bi-cpu me-2"></i><strong>CPU:</strong> {product.specs.cpu}</p>
                                    <p className="mb-1"><i className="bi bi-gpu-card me-2"></i><strong>GPU:</strong> {product.specs.gpu}</p>
                                    <p className="mb-1"><i className="bi bi-memory me-2"></i><strong>RAM:</strong> {product.specs.ram}</p>
                                    <p className="mb-1"><i className="bi bi-device-hdd me-2"></i><strong>Lưu trữ:</strong> {product.specs.storage}</p>
                                    <p className="mb-1"><i className="bi bi-display me-2"></i><strong>Màn hình:</strong> {product.specs.screen}</p>
                                </div>
                            )}

                            {/* Thông số kỹ thuật - Monitor */}
                            {product.category === 'monitor' && product.specs && (
                                <div className="bg-light p-3 rounded mb-3">
                                    <h6 className="fw-bold mb-2">📋 Thông số kỹ thuật</h6>
                                    <p className="mb-1"><i className="bi bi-aspect-ratio me-2"></i><strong>Độ phân giải:</strong> {product.specs.resolution}</p>
                                    <p className="mb-1"><i className="bi bi-speedometer2 me-2"></i><strong>Tần số quét:</strong> {product.specs.refresh_rate}</p>
                                    <p className="mb-1"><i className="bi bi-display me-2"></i><strong>Tấm nền:</strong> {product.specs.panel}</p>
                                    <p className="mb-1"><i className="bi bi-lightning me-2"></i><strong>Thời gian phản hồi:</strong> {product.specs.response_time}</p>
                                </div>
                            )}

                            {/* Giá tiền & nút Add To Cart - luôn hiển thị */}
                            <p className="card-text text-danger fs-4 fw-bold">
                                {product.price.toLocaleString()}đ
                            </p>
                            <button className="btn btn-success" onClick={handleAddToCart}>
                                🛒 Add To Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Review Form */}
            <div className="card mb-4 shadow-sm">
                <div className="card-header bg-primary text-white">
                    ✍️ Thêm đánh giá
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmitReview}>
                        <div className="mb-3">
                            <label className="form-label">Tên của bạn</label>
                            <input
                                type="text"
                                className="form-control"
                                value={reviewName}
                                onChange={(e) => setReviewName(e.target.value)}
                                placeholder="Nhập tên..."
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Bình luận</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                placeholder="Nhập bình luận..."
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Số sao</label>
                            <select
                                className="form-select"
                                value={reviewRating}
                                onChange={(e) => setReviewRating(e.target.value)}
                            >
                                <option value={1}>⭐ 1 sao</option>
                                <option value={2}>⭐⭐ 2 sao</option>
                                <option value={3}>⭐⭐⭐ 3 sao</option>
                                <option value={4}>⭐⭐⭐⭐ 4 sao</option>
                                <option value={5}>⭐⭐⭐⭐⭐ 5 sao</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Gửi đánh giá
                        </button>
                    </form>
                </div>
            </div>

            {/* Reviews List */}
            <div className="card shadow-sm">
                <div className="card-header bg-info text-white">
                    📝 Danh sách đánh giá ({product.reviews ? product.reviews.length : 0})
                </div>
                <div className="card-body">
                    {(!product.reviews || product.reviews.length === 0) ? (
                        <p className="text-muted">Chưa có đánh giá nào.</p>
                    ) : (
                        <ul className="list-group">
                            {product.reviews.map((review, index) => (
                                <li key={index} className="list-group-item">
                                    <div className="d-flex justify-content-between">
                                        <strong>{review.name}</strong>
                                        <small className="text-muted">{review.date}</small>
                                    </div>
                                    <div className="text-warning mb-1">
                                        {'⭐'.repeat(review.rating)}
                                    </div>
                                    <p className="mb-0">{review.comment}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Detail;
