import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api';
import { useCart } from './CartProvider';

const INFO_LINKS = [
    { key: 'exclusive', label: 'Tech Product Store', color: '#e74c3c', route: '/products' },
    { key: 'viewed', label: 'Sản phẩm bạn đã xem', color: '#2ecc71', route: '/viewed-products' },
    { key: 'flash-sale', label: 'Flash Sale', color: '#f39c12', route: null },
    { key: 'nationwide', label: 'Mua hàng Toàn Quốc', color: '#3498db', route: null },
    { key: 'business', label: 'Ưu Đãi Doanh Nghiệp', color: '#e67e22', route: null },
    { key: 'return', label: 'Đổi trả miễn phí', color: '#27ae60', route: null },
    { key: 'freeship', label: 'Miễn phí vận chuyển', color: '#9b59b6', route: null },
];

// Nội dung cho các mục không có route riêng
const INFO_CONTENT = {
    'flash-sale': {
        icon: '⚡',
        title: 'Flash Sale - Giảm Sốc Mỗi Ngày',
        gradient: 'linear-gradient(135deg, #f39c12, #e74c3c)',
        description: 'Chương trình Flash Sale diễn ra hàng ngày từ 12:00 - 14:00 và 20:00 - 22:00 với mức giảm giá lên đến 70% cho các sản phẩm công nghệ hot nhất.',
        features: [
            { icon: '🔥', text: 'Giảm giá sốc đến 70% mỗi ngày' },
            { icon: '⏰', text: 'Flash Sale 12h - 14h & 20h - 22h' },
            { icon: '🎯', text: 'Số lượng có hạn, ai nhanh người đó được' },
            { icon: '🏷️', text: 'Voucher giảm thêm 5% khi mua từ 2 sản phẩm' },
        ],
        deals: [
            { name: 'Laptop Gaming ASUS TUF', original: '25.990.000đ', sale: '18.490.000đ', discount: '-29%' },
            { name: 'Chuột Logitech G502 X', original: '2.490.000đ', sale: '1.290.000đ', discount: '-48%' },
            { name: 'Bàn phím Corsair K70', original: '3.990.000đ', sale: '2.190.000đ', discount: '-45%' },
            { name: 'Màn hình LG 27" 4K', original: '8.990.000đ', sale: '5.990.000đ', discount: '-33%' },
        ],
    },
    'nationwide': {
        icon: '🌍',
        title: 'Mua hàng Toàn Quốc',
        gradient: 'linear-gradient(135deg, #3498db, #2c3e50)',
        description: 'Tech Product Store phục vụ khách hàng trên toàn bộ 63 tỉnh thành với hệ thống giao hàng nhanh chóng và đáng tin cậy.',
        features: [
            { icon: '🚚', text: 'Giao hàng tận nơi 63 tỉnh thành' },
            { icon: '📦', text: 'Đóng gói cẩn thận, bảo đảm an toàn' },
            { icon: '⏱️', text: 'Nội thành: 2-4h | Ngoại thành: 1-3 ngày' },
            { icon: '📍', text: 'Theo dõi đơn hàng real-time' },
        ],
        stats: [
            { value: '63', label: 'Tỉnh thành' },
            { value: '500K+', label: 'Đơn hàng/tháng' },
            { value: '99.5%', label: 'Giao thành công' },
            { value: '4.9⭐', label: 'Đánh giá' },
        ],
    },
    'business': {
        icon: '🏢',
        title: 'Ưu Đãi Doanh Nghiệp',
        gradient: 'linear-gradient(135deg, #e67e22, #d35400)',
        description: 'Chương trình đặc biệt dành cho doanh nghiệp, trường học, tổ chức mua số lượng lớn với chính sách giá ưu đãi và hỗ trợ kỹ thuật chuyên nghiệp.',
        features: [
            { icon: '💰', text: 'Chiết khấu từ 10-30% cho đơn hàng doanh nghiệp' },
            { icon: '📋', text: 'Hỗ trợ xuất hóa đơn VAT đầy đủ' },
            { icon: '🔧', text: 'Đội ngũ kỹ thuật hỗ trợ cài đặt tại chỗ' },
            { icon: '🤝', text: 'Tư vấn giải pháp công nghệ phù hợp' },
            { icon: '💳', text: 'Hỗ trợ thanh toán trả chậm, trả góp 0%' },
            { icon: '📞', text: 'Hotline doanh nghiệp: 1800-TECH-BIZ' },
        ],
    },
    'return': {
        icon: '🔄',
        title: 'Đổi trả miễn phí',
        gradient: 'linear-gradient(135deg, #27ae60, #2ecc71)',
        description: 'Cam kết đổi trả miễn phí trong 30 ngày đối với tất cả sản phẩm. Hoàn tiền 100% nếu sản phẩm lỗi do nhà sản xuất.',
        features: [
            { icon: '✅', text: 'Đổi trả miễn phí trong 30 ngày' },
            { icon: '💯', text: 'Hoàn tiền 100% nếu sản phẩm lỗi' },
            { icon: '🔁', text: '1 đổi 1 trong 15 ngày đầu tiên' },
            { icon: '📦', text: 'Nhận hàng đổi trả tại nhà miễn phí' },
            { icon: '🛡️', text: 'Bảo hành chính hãng từ 12-36 tháng' },
        ],
        steps: [
            { step: 1, title: 'Liên hệ', desc: 'Gọi hotline hoặc chat trực tuyến' },
            { step: 2, title: 'Xác nhận', desc: 'Nhân viên xác nhận yêu cầu đổi trả' },
            { step: 3, title: 'Thu hồi', desc: 'Shipper đến tận nơi nhận hàng' },
            { step: 4, title: 'Hoàn tất', desc: 'Nhận sản phẩm mới hoặc hoàn tiền' },
        ],
    },
    'freeship': {
        icon: '🚀',
        title: 'Miễn phí vận chuyển',
        gradient: 'linear-gradient(135deg, #9b59b6, #8e44ad)',
        description: 'Miễn phí vận chuyển cho tất cả đơn hàng từ 500.000đ trở lên. Áp dụng toàn quốc, không giới hạn số lần mua.',
        features: [
            { icon: '🆓', text: 'Miễn phí ship cho đơn từ 500.000đ' },
            { icon: '🏍️', text: 'Giao hàng nhanh 2h nội thành HN & HCM' },
            { icon: '📦', text: 'Đóng gói chống sốc chuyên nghiệp' },
            { icon: '🔔', text: 'Thông báo trạng thái giao hàng SMS & App' },
            { icon: '💎', text: 'Thành viên VIP: Free ship mọi đơn hàng' },
        ],
        tiers: [
            { tier: 'Tiêu chuẩn', time: '3-5 ngày', price: 'Miễn phí (đơn ≥ 500K)', color: '#27ae60' },
            { tier: 'Nhanh', time: '1-2 ngày', price: '15.000đ', color: '#f39c12' },
            { tier: 'Hỏa tốc', time: '2-4 giờ', price: '30.000đ', color: '#e74c3c' },
            { tier: 'VIP Express', time: '1-2 giờ', price: 'Miễn phí (VIP)', color: '#9b59b6' },
        ],
    },
};



// Component hiển thị nội dung chi tiết cho mỗi mục sidebar
function InfoContentPanel({ infoKey }) {
    const content = INFO_CONTENT[infoKey];
    if (!content) return null;

    return (
        <div
            style={{
                animation: 'fadeIn 0.3s ease-in',
            }}
        >
            {/* Header banner */}
            <div
                style={{
                    background: content.gradient,
                    borderRadius: '16px',
                    padding: '32px 40px',
                    marginBottom: '24px',
                    color: '#fff',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h3 style={{ fontWeight: 700, marginBottom: '10px' }}>
                        {content.icon} {content.title}
                    </h3>
                    <p style={{ fontSize: '1rem', opacity: 0.9, marginBottom: 0 }}>
                        {content.description}
                    </p>
                </div>
                <div
                    style={{
                        position: 'absolute',
                        right: '-10px',
                        top: '-10px',
                        fontSize: '8rem',
                        opacity: 0.1,
                    }}
                >
                    {content.icon}
                </div>
            </div>

            {/* Features list */}
            <div className="row mb-4">
                {content.features.map((f, i) => (
                    <div key={i} className="col-md-6 mb-3">
                        <div
                            className="d-flex align-items-start gap-3 p-3"
                            style={{
                                background: '#f8f9fa',
                                borderRadius: '12px',
                                transition: 'transform 0.2s ease',
                                cursor: 'default',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateX(4px)';
                                e.currentTarget.style.background = '#e8f4f8';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateX(0)';
                                e.currentTarget.style.background = '#f8f9fa';
                            }}
                        >
                            <span style={{ fontSize: '1.5rem' }}>{f.icon}</span>
                            <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{f.text}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Flash Sale deals */}
            {content.deals && (
                <div>
                    <h5 className="mb-3" style={{ fontWeight: 600 }}>🏷️ Deal hot hôm nay</h5>
                    <div className="row">
                        {content.deals.map((deal, i) => (
                            <div key={i} className="col-md-3 mb-3">
                                <div
                                    className="card border-0 shadow-sm h-100"
                                    style={{ borderRadius: '12px', overflow: 'hidden' }}
                                >
                                    <div
                                        style={{
                                            background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
                                            color: '#fff',
                                            padding: '6px 12px',
                                            fontSize: '0.8rem',
                                            fontWeight: 700,
                                            textAlign: 'center',
                                        }}
                                    >
                                        {deal.discount}
                                    </div>
                                    <div className="card-body text-center">
                                        <h6 style={{ fontWeight: 600, fontSize: '0.85rem' }}>{deal.name}</h6>
                                        <p className="text-muted mb-1" style={{ textDecoration: 'line-through', fontSize: '0.8rem' }}>
                                            {deal.original}
                                        </p>
                                        <p className="text-danger fw-bold mb-0" style={{ fontSize: '1.05rem' }}>
                                            {deal.sale}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Nationwide stats */}
            {content.stats && (
                <div className="row mb-4">
                    {content.stats.map((stat, i) => (
                        <div key={i} className="col-md-3 mb-3">
                            <div
                                className="text-center p-4"
                                style={{
                                    background: '#fff',
                                    borderRadius: '12px',
                                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                                }}
                            >
                                <h3 style={{ fontWeight: 800, color: '#3498db', marginBottom: '4px' }}>
                                    {stat.value}
                                </h3>
                                <small className="text-muted">{stat.label}</small>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Return steps */}
            {content.steps && (
                <div>
                    <h5 className="mb-3" style={{ fontWeight: 600 }}>📋 Quy trình đổi trả</h5>
                    <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                        {content.steps.map((s, i) => (
                            <div
                                key={i}
                                className="text-center flex-fill"
                                style={{ minWidth: '140px' }}
                            >
                                <div
                                    style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        background: content.gradient,
                                        color: '#fff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 700,
                                        fontSize: '1.2rem',
                                        margin: '0 auto 10px',
                                    }}
                                >
                                    {s.step}
                                </div>
                                <h6 style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.title}</h6>
                                <small className="text-muted">{s.desc}</small>
                                {i < content.steps.length - 1 && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            right: '-20px',
                                            top: '24px',
                                            color: '#ccc',
                                            fontSize: '1.2rem',
                                        }}
                                    >
                                        →
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Shipping tiers */}
            {content.tiers && (
                <div>
                    <h5 className="mb-3" style={{ fontWeight: 600 }}>📦 Bảng phí vận chuyển</h5>
                    <div className="table-responsive">
                        <table className="table table-hover" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                            <thead style={{ background: '#f8f9fa' }}>
                                <tr>
                                    <th>Gói dịch vụ</th>
                                    <th>Thời gian</th>
                                    <th>Phí</th>
                                </tr>
                            </thead>
                            <tbody>
                                {content.tiers.map((t, i) => (
                                    <tr key={i}>
                                        <td>
                                            <span
                                                style={{
                                                    display: 'inline-block',
                                                    width: '10px',
                                                    height: '10px',
                                                    borderRadius: '50%',
                                                    background: t.color,
                                                    marginRight: '8px',
                                                }}
                                            ></span>
                                            <strong>{t.tier}</strong>
                                        </td>
                                        <td>{t.time}</td>
                                        <td style={{ color: t.color, fontWeight: 600 }}>{t.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

function Home() {
    const [showInfo, setShowInfo] = useState(false);
    const [activeInfo, setActiveInfo] = useState('');
    const [bestSellers, setBestSellers] = useState([]);
    const navigate = useNavigate();
    const { fetchCartCount } = useCart();

    useEffect(() => {
        fetchBestSellers();
    }, []);

    const fetchBestSellers = async () => {
        try {
            const res = await axios.get('http://localhost:9999/products');
            const all = res.data || [];

            const laptopsWithImage = all.filter(
                (p) => p.category === 'laptop' && p.image && !p.image.includes('placehold.co')
            );
            const others = all.filter(
                (p) => !(p.category === 'laptop' && p.image && !p.image.includes('placehold.co'))
            );
            const selected = [...laptopsWithImage.slice(0, 5), ...others].slice(0, 5);
            setBestSellers(selected);
        } catch (error) {
            console.error('Error fetching best sellers:', error);
        }
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

    const handleInfoClick = (info) => {
        if (info.route) {
            navigate(info.route);
        } else {
            setActiveInfo(activeInfo === info.key ? '' : info.key);
        }
    };

    return (
        <div>
            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}
            </style>
            <div className="row">
                {/* Sidebar thông tin */}
                <div className={showInfo ? 'col-md-3' : ''} style={{ width: showInfo ? undefined : 'auto' }}>
                    <button
                        className="btn btn-outline-dark d-flex align-items-center justify-content-center"
                        style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '10px',
                            fontSize: '1.4rem',
                            padding: 0,
                        }}
                        title="Thông tin cửa hàng"
                        onClick={() => setShowInfo(!showInfo)}
                    >
                        ☰
                    </button>
                    {showInfo && (
                        <div className="mt-3">
                            <h6 className="mb-2" style={{ fontWeight: 600 }}>📌 Thông tin & Dịch vụ</h6>
                            <div className="list-group">
                                {INFO_LINKS.map((info) => (
                                    <button
                                        key={info.key}
                                        className={`list-group-item list-group-item-action d-flex align-items-center gap-2 ${activeInfo === info.key ? 'active' : ''}`}
                                        onClick={() => handleInfoClick(info)}
                                        style={{
                                            borderLeft: activeInfo === info.key ? `4px solid ${info.color}` : '4px solid transparent',
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        {info.route && info.key === 'exclusive' && (
                                            <span style={{ fontSize: '0.75rem' }}>
                                                🏪
                                            </span>
                                        )}
                                        <span style={{ fontSize: '0.9rem' }}>{info.label}</span>
                                        {info.route && (
                                            <span style={{ marginLeft: 'auto', fontSize: '0.8rem', opacity: 0.6 }}>→</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Khu vực nội dung chính */}
                <div className={showInfo ? 'col-md-9' : 'col'}>
                    {/* Hiển thị nội dung chi tiết nếu có mục sidebar được chọn */}
                    {activeInfo && INFO_CONTENT[activeInfo] ? (
                        <div>
                            <button
                                className="btn btn-outline-secondary btn-sm mb-3"
                                onClick={() => setActiveInfo('')}
                            >
                                ← Quay lại trang chủ
                            </button>
                            <InfoContentPanel infoKey={activeInfo} />
                        </div>
                    ) : (
                        <>
                            {/* Banner chính */}
                            <div
                                style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    borderRadius: '16px',
                                    padding: '40px',
                                    marginBottom: '24px',
                                    color: '#fff',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}
                            >
                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    <h2 style={{ fontWeight: 700, marginBottom: '10px' }}>
                                        🎉 SIÊU SALE THÁNG 6
                                    </h2>
                                    <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '20px' }}>
                                        Giảm giá lên đến 30% cho tất cả sản phẩm Laptop, PC Gaming và phụ kiện công nghệ
                                    </p>
                                    <Link
                                        to="/products"
                                        className="btn btn-light btn-lg"
                                        style={{ fontWeight: 600, borderRadius: '10px' }}
                                    >
                                        🛒 Mua sắm ngay
                                    </Link>
                                </div>
                                <div style={{
                                    position: 'absolute',
                                    right: '-20px',
                                    top: '-20px',
                                    fontSize: '12rem',
                                    opacity: 0.1,
                                }}>
                                    💻
                                </div>
                            </div>

                            <h5 className="mb-3" style={{ fontWeight: 600 }}>
                                🔥 Sản phẩm bán chạy nhất
                            </h5>

                            {/* Grid sản phẩm bán chạy */}
                            {bestSellers.length === 0 ? (
                                <p className="text-muted">Đang tải sản phẩm...</p>
                            ) : (
                                <div className="row">
                                    {bestSellers.map((product, index) => (
                                        <div key={product.id} className={`mb-4 ${showInfo ? 'col-md-4' : 'col-md-3'}`}
                                            style={{ animation: `fadeIn 0.3s ease ${index * 0.1}s both` }}
                                        >
                                            <div
                                                className="card h-100 border-0 shadow-sm"
                                                style={{
                                                    borderRadius: '12px',
                                                    overflow: 'hidden',
                                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(-6px)';
                                                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.18)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                                                }}
                                            >
                                                {/* Badge bán chạy */}
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '10px',
                                                    left: '10px',
                                                    zIndex: 2,
                                                    background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
                                                    color: '#fff',
                                                    padding: '4px 10px',
                                                    borderRadius: '20px',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 700,
                                                    boxShadow: '0 2px 8px rgba(238,90,36,0.4)',
                                                }}>
                                                    🔥 TOP {index + 1}
                                                </div>

                                                {/* Product image */}
                                                {product.image && !product.image.includes('placehold.co') ? (
                                                    <img
                                                        src={product.image}
                                                        alt={product.title}
                                                        style={{
                                                            height: '200px',
                                                            width: '100%',
                                                            objectFit: 'cover',
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        style={{
                                                            height: '200px',
                                                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}
                                                    >
                                                        <span style={{ fontSize: '3.5rem', opacity: 0.7 }}>
                                                            {product.category === 'laptop' ? '💻' :
                                                                product.category === 'mouse' ? '🖱️' :
                                                                    product.category === 'keyboard' ? '⌨️' :
                                                                        product.category === 'monitor' ? '🖥️' :
                                                                            product.category === 'ram' ? '🧩' :
                                                                                product.category === 'vga' ? '🎮' :
                                                                                    product.category === 'cpu' ? '⚡' : '🛒'}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Product info */}
                                                <div className="card-body d-flex flex-column" style={{ padding: '14px 16px' }}>
                                                    <span
                                                        className="badge mb-2"
                                                        style={{
                                                            alignSelf: 'flex-start',
                                                            background: '#e8f4f8',
                                                            color: '#2980b9',
                                                            fontSize: '0.7rem',
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        {product.category?.toUpperCase()}
                                                    </span>
                                                    <h6 style={{
                                                        fontWeight: 600,
                                                        fontSize: '0.9rem',
                                                        color: '#333',
                                                        marginBottom: '8px',
                                                        lineHeight: 1.4,
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                    }}>
                                                        {product.title}
                                                    </h6>
                                                    <p className="text-danger fw-bold mb-3" style={{ fontSize: '1.05rem' }}>
                                                        {product.price?.toLocaleString()}đ
                                                    </p>
                                                    <div className="mt-auto d-flex gap-2">
                                                        <Link
                                                            to={`/detail/${product.id}`}
                                                            className="btn btn-primary btn-sm flex-fill"
                                                            style={{ borderRadius: '8px', fontSize: '0.8rem' }}
                                                        >
                                                            Xem chi tiết
                                                        </Link>
                                                        <button
                                                            className="btn btn-success btn-sm"
                                                            style={{ borderRadius: '8px', fontSize: '0.8rem' }}
                                                            onClick={() => handleAddToCart(product)}
                                                        >
                                                            🛒
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Nút xem tất cả */}
                                    <div className="col-12 text-center mt-2 mb-4">
                                        <Link
                                            to="/products"
                                            className="btn btn-outline-primary btn-lg"
                                            style={{
                                                borderRadius: '12px',
                                                fontWeight: 600,
                                                padding: '10px 40px',
                                            }}
                                        >
                                            Xem tất cả sản phẩm →
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
