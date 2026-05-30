import React from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from './CartProvider';

function Menu() {
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const isAdmin = location.pathname === '/admin';

    const handleLogout = () => {
        if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
            localStorage.removeItem('currentUser');
            window.dispatchEvent(new Event('userLoggedOut'));
            navigate('/');
        }
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
                {!isAdmin && (
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
                )}

                <div className="d-flex gap-2 align-items-center ms-auto">
                    {!isAdmin && (
                        <Link to="/cart" className="btn btn-outline-light position-relative">
                            🛒
                            <span className="badge bg-danger ms-1">{cartCount}</span>
                        </Link>
                    )}
                    
                    {currentUser && (
                        <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={handleLogout}
                            title="Đăng xuất"
                        >
                            🚪 Đăng Xuất
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Menu;
