import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    const handleRegister = (e) => {
        e.preventDefault();

        // Validate không để trống
        if (!name.trim() || !email.trim() || !password.trim()) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        // Validate mật khẩu khớp nhau
        if (password !== confirmPassword) {
            alert('Mật khẩu xác nhận không khớp!');
            return;
        }

        // Validate độ dài mật khẩu
        if (password.length < 6) {
            alert('Mật khẩu phải có ít nhất 6 ký tự!');
            return;
        }

        // Lấy danh sách users từ localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Kiểm tra email đã tồn tại chưa
        const existed = users.find(u => u.email === email);
        if (existed) {
            alert('Email này đã được đăng ký!');
            return;
        }

        // Tạo user mới
        const newUser = {
            id: Date.now(), // dùng timestamp làm id unique
            name,
            email,
            password,
            phone,
            address,
            role: 'user' // mặc định là user thường
        };

        // Lưu vào localStorage
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        navigate('/login'); // chuyển về trang đăng nhập
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-6">
                <div className="card shadow-sm">
                    <div className="card-header bg-dark text-white text-center">
                        Đăng ký tài khoản
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleRegister}>
                            <div className="mb-3">
                                <label className="form-label">Họ tên <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Nhập họ tên..."
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Email <span className="text-danger">*</span></label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="Nhập email..."
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Mật khẩu <span className="text-danger">*</span></label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Nhập mật khẩu (ít nhất 6 ký tự)..."
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Xác nhận mật khẩu <span className="text-danger">*</span></label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    placeholder="Nhập lại mật khẩu..."
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Số điện thoại</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    placeholder="Nhập số điện thoại..."
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Địa chỉ</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={address}
                                    onChange={e => setAddress(e.target.value)}
                                    placeholder="Nhập địa chỉ..."
                                />
                            </div>

                            <button type="submit" className="btn btn-success w-100 mb-2">
                                Đăng ký
                            </button>

                            {/* Link chuyển về trang đăng nhập */}
                            <p className="text-center mb-0">
                                Đã có tài khoản?{' '}
                                <span
                                    className="text-primary"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => navigate('/login')}
                                >
                                    Đăng nhập ngay
                                </span>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;