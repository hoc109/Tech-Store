import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Login.css';

function Login() {
    const navigate = useNavigate();
    const { type } = useParams(); // 'admin' hoặc 'user'

    const [email, setEmail] = useState('user@gmail.com');
    const [password, setPassword] = useState('123456');
    const [isLoading, setIsLoading] = useState(false);

    const defaultUsers = [
        {
            id: 1,
            name: 'Người dùng',
            email: 'user@gmail.com',
            password: '123456',
            phone: '0987654321',
            address: 'Hà Nội',
            role: 'user'
        },
        {
            id: 2,
            name: 'Admin',
            email: 'admin@gmail.com',
            password: '123456',
            phone: '0123456789',
            address: 'Hà Nội',
            role: 'admin'
        }
    ];

    // Set default email dựa trên loại login
    useEffect(() => {
        if (type === 'admin') {
            setEmail('admin@gmail.com');
        } else {
            setEmail('user@gmail.com');
        }
    }, [type]);

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);

        let users = JSON.parse(localStorage.getItem('users'));

        if (!users || users.length === 0) {
            users = defaultUsers;
            localStorage.setItem('users', JSON.stringify(users));
        }

        const foundUser = users.find(
            user => user.email === email && user.password === password
        );

        if (!foundUser) {
            alert('Sai email hoặc mật khẩu!');
            setIsLoading(false);
            return;
        }

        // Kiểm tra quyền hạn
        if (type === 'admin' && foundUser.role !== 'admin') {
            alert('Chỉ Admin mới có thể đăng nhập tại đây!');
            setIsLoading(false);
            return;
        }

        if (type === 'user' && foundUser.role === 'admin') {
            alert('Admin không thể đăng nhập từ trang khách hàng!');
            setIsLoading(false);
            return;
        }

        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        alert('Đăng nhập thành công!');
        
        // Trigger custom event để Menu biết user đã đăng nhập
        window.dispatchEvent(new Event('userLoggedIn'));
        
        // Điều hướng dựa trên role
        if (foundUser.role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/');
        }

        setIsLoading(false);
    };

    const getTitle = () => {
        return type === 'admin' ? 'Đăng Nhập Admin' : 'Đăng Nhập Khách Hàng';
    };

    const getSubtitle = () => {
        return type === 'admin' 
            ? 'Quản lý sản phẩm và đơn hàng' 
            : 'Mua sắm sản phẩm công nghệ';
    };

    const getBgClass = () => {
        return type === 'admin' ? 'bg-danger' : 'bg-primary';
    };

    const getButtonClass = () => {
        return type === 'admin' ? 'btn-danger' : 'btn-primary';
    };

    return (
        <div className="login-container">
            <div className="login-form-wrapper">
                <div className="card shadow-lg login-card">
                    <div className={`card-header ${getBgClass()} text-white text-center py-4`}>
                        <h2 className="mb-0">{getTitle()}</h2>
                        <small className="d-block mt-2">{getSubtitle()}</small>
                    </div>

                    <div className="card-body p-5">
                        <form onSubmit={handleLogin}>
                            <div className="mb-4">
                                <label className="form-label fw-bold">Email</label>
                                <input
                                    type="email"
                                    className="form-control form-control-lg"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="Nhập email"
                                    disabled={isLoading}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold">Mật khẩu</label>
                                <input
                                    type="password"
                                    className="form-control form-control-lg"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Nhập mật khẩu"
                                    disabled={isLoading}
                                    required
                                />
                            </div>

                            <button 
                                type="submit" 
                                className={`btn ${getButtonClass()} btn-lg w-100 fw-bold`}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                            </button>
                        </form>

                        <div className="text-center mt-4">
                            <button
                                type="button"
                                className="btn btn-link btn-sm"
                                onClick={() => navigate('/')}
                            >
                                ← Quay lại trang chính
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;