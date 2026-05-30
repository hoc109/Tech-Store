import React, { useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useCart } from './CartProvider';

function Menu() {
    const { cartCount } = useCart();
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        setUser(currentUser);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        setUser(null);
        alert('Đăng xuất thành công!');
        navigate('/login');
        window.location.reload();
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
            <Link className="navbar-brand fw-bold" to="/">🖥️ Tech Store</Link>

            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
            >
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav me-auto">
                    <li className="nav-item">
                        <NavLink
                            className={({ isActive }) =>
                                'nav-link' + (isActive ? ' text-warning' : '')
                            }
                            to="/"
                            end
                        >
                            HOME
                        </NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink
                            className={({ isActive }) =>
                                'nav-link' + (isActive ? ' text-warning' : '')
                            }
                            to="/products"
                        >
                            TECH PRODUCTS
                        </NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink
                            className={({ isActive }) =>
                                'nav-link' + (isActive ? ' text-warning' : '')
                            }
                            to="/orders"
                        >
                            ORDERS
                        </NavLink>
                    </li>
                </ul>

                <div className="d-flex align-items-center gap-2">
                    <Link to="/cart" className="btn btn-outline-light position-relative">
                        🛒
                        <span className="badge bg-danger ms-1">{cartCount}</span>
                    </Link>

                    {user ? (
                        <>
                            <Link to="/profile" className="btn btn-outline-warning">
                                👤 {user.name}
                            </Link>
                            <button className="btn btn-danger" onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="btn btn-warning">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Menu;