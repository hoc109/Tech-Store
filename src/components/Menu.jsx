import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useCart } from './CartProvider';

function Menu() {
    const { cartCount } = useCart();

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
                            to="/admin"
                        >
                            ADMIN
                        </NavLink>
                    </li>
                </ul>
                <Link to="/cart" className="btn btn-outline-light position-relative">
                    🛒
                    <span className="badge bg-danger ms-1">{cartCount}</span>
                </Link>
            </div>
        </nav>
    );
}

export default Menu;
