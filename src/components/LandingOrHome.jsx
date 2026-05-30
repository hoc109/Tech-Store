import React, { useState, useEffect } from 'react';
import Landing from './Landing';
import AppContent from './AppContent';

/**
 * Component chọn trang hiển thị dựa trên trạng thái đăng nhập
 * - Đã đăng nhập → Hiển thị AppContent (Home page)
 * - Chưa đăng nhập → Hiển thị Landing
 */
function LandingOrHome() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('currentUser'));

    useEffect(() => {
        // Kiểm tra currentUser khi component mount
        const checkAuth = () => {
            setIsLoggedIn(!!localStorage.getItem('currentUser'));
        };

        // Listen sự kiện userLoggedIn từ Login component
        window.addEventListener('userLoggedIn', checkAuth);
        
        // Listen sự kiện userLoggedOut từ Menu logout
        window.addEventListener('userLoggedOut', checkAuth);
        
        // Listen storage change (từ tab khác hoặc logout)
        window.addEventListener('storage', checkAuth);

        return () => {
            window.removeEventListener('userLoggedIn', checkAuth);
            window.removeEventListener('userLoggedOut', checkAuth);
            window.removeEventListener('storage', checkAuth);
        };
    }, []);

    // Nếu đã đăng nhập thì hiển thị AppContent (Home), không thì Landing
    return isLoggedIn ? <AppContent /> : <Landing />;
}

export default LandingOrHome;
