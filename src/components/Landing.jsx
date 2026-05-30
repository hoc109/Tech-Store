import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

function Landing() {
    const navigate = useNavigate();

    return (
        <div className="landing-container">
            <div className="landing-content">
                <div className="landing-header">
                    <h1 className="landing-title">Tech Store</h1>
                    <p className="landing-subtitle">Cửa hàng công nghệ uy tín</p>
                </div>

                <div className="landing-cards">
                    {/* User Login Card */}
                    <div className="login-card user-card">
                        <div className="card-icon">👤</div>
                        <h2>Khách Hàng</h2>
                        <p>Mua sắm sản phẩm công nghệ chất lượng</p>
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={() => navigate('/login/user')}
                        >
                            Đăng Nhập
                        </button>
                    </div>

                    {/* Admin Login Card */}
                    <div className="login-card admin-card">
                        <div className="card-icon">⚙️</div>
                        <h2>Quản Trị Viên</h2>
                        <p>Quản lý sản phẩm và đơn hàng</p>
                        <button
                            className="btn btn-danger btn-lg"
                            onClick={() => navigate('/login/admin')}
                        >
                            Đăng Nhập
                        </button>
                    </div>
                </div>

                <div className="landing-footer">
                    <p>© 2026 Tech Store. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}

export default Landing;
