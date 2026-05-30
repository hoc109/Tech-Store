import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Bảo vệ AppContent - chỉ cho phép user đã đăng nhập truy cập
 * Nếu chưa đăng nhập, quay về Landing
 */
function UserProtectedRoute({ children }) {
    const currentUser = localStorage.getItem('currentUser');

    // Nếu không có user (chưa đăng nhập), quay lại landing
    if (!currentUser) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default UserProtectedRoute;
