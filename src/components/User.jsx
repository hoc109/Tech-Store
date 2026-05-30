import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
// Nếu dự án có dùng react-router-dom thì bạn bỏ dấu // ở dòng dưới đi nhé
// import { Link } from 'react-router-dom';

const User = () => {
  // 1. Lấy toàn bộ Context ra trước
  const context = useContext(AuthContext);

  // SỬA LỖI Ở ĐÂY: Kiểm tra nếu chưa có Provider thì báo lỗi rõ ràng thay vì sập web
  if (!context) {
    return (
      <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
        <h3>LỖI GHI NHẬN:</h3>
        <p>Không tìm thấy AuthContext! Bạn hãy kiểm tra lại xem đã bọc <strong>&lt;AuthProvider&gt;</strong> trong file <strong>App.js</strong> chưa nhé.</p>
      </div>
    );
  }

  // 2. Nếu đã có context thì mới lấy user và logout ra
  const { user, logout } = context;

  // Nếu chưa đăng nhập, không cho xem trang này
  if (!user) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Bạn chưa đăng nhập!</h2>
        <p>Vui lòng đăng nhập để xem thông tin cá nhân và giỏ hàng.</p>
        {/* <Link to="/login">Đi tới trang Đăng nhập</Link> */}
      </div>
    );
  }

  // Giao diện khi ĐÃ đăng nhập
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Bảng điều khiển của User</h1>
      
      {/* Tính năng: Quản lý thông tin cá nhân */}
      <section style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
        <h3>Thông tin cá nhân</h3>
        <p><strong>Tên:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <button>Cập nhật thông tin</button>
      </section>

      {/* Liên kết tới tính năng: Quản lý Giỏ hàng & Thanh toán */}
      <section style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
        <h3>Quản lý mua sắm</h3>
        <ul>
          <li><a href="/cart">Xem giỏ hàng của tôi (Thêm/Sửa hàng)</a></li>
          <li><a href="/orders">Lịch sử đơn hàng (Thanh toán)</a></li>
        </ul>
      </section>

      {/* Tính năng: Logout */}
      <button 
        onClick={logout} 
        style={{ backgroundColor: 'red', color: 'white', padding: '10px', cursor: 'pointer' }}
      >
        Đăng Xuất (Logout)
      </button>
    </div>
  );
};

export default User;