import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Bảo vệ các route Admin
 * Chỉ cho phép các user có role = 'admin' truy cập
 */
function ProtectedRoute({ children }) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Nếu không có user hoặc user không phải admin, quay lại landing
    if (!currentUser || currentUser.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;
