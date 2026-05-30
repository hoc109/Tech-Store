import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        id: '',
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        role: ''
    });

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (!currentUser) {
            alert('Bạn cần đăng nhập trước!');
            navigate('/login');
            return;
        }

        setUser(currentUser);
    }, [navigate]);

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();

        const users = JSON.parse(localStorage.getItem('users')) || [];

        const updatedUsers = users.map(item =>
            item.id === user.id ? user : item
        );

        localStorage.setItem('users', JSON.stringify(updatedUsers));
        localStorage.setItem('currentUser', JSON.stringify(user));

        alert('Cập nhật thông tin cá nhân thành công!');
        window.location.reload();
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-6">
                <div className="card shadow-sm">
                    <div className="card-header bg-dark text-white text-center">
                        Quản lý thông tin cá nhân
                    </div>

                    <div className="card-body">
                        <form onSubmit={handleUpdate}>
                            <div className="mb-3">
                                <label className="form-label">Họ tên</label>
                                <input
                                    name="name"
                                    className="form-control"
                                    value={user.name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    name="email"
                                    className="form-control"
                                    value={user.email}
                                    disabled
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Số điện thoại</label>
                                <input
                                    name="phone"
                                    className="form-control"
                                    value={user.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Địa chỉ</label>
                                <textarea
                                    name="address"
                                    className="form-control"
                                    rows="2"
                                    value={user.address}
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                            <button type="submit" className="btn btn-success w-100">
                                Lưu thông tin
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
