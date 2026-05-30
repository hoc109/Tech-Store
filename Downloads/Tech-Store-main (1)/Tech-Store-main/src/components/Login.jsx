import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('user@gmail.com');
    const [password, setPassword] = useState('123456');

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

    const handleLogin = (e) => {
        e.preventDefault();

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
            return;
        }

        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        alert('Đăng nhập thành công!');
        navigate('/');
        window.location.reload();
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-5">
                <div className="card shadow-sm">
                    <div className="card-header bg-dark text-white text-center">
                        Đăng nhập
                    </div>

                    <div className="card-body">
                        <form onSubmit={handleLogin}>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="Nhập email"
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Mật khẩu</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Nhập mật khẩu"
                                />
                            </div>

                            <button type="submit" className="btn btn-primary w-100">
                                Đăng nhập
                            </button>
                        </form>

                       
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;