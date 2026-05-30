# Tech Store - Hệ Thống Xác Thực & Giao Diện Chính

## 📋 Tổng Quan

Hệ thống này cung cấp:
- **Trang giao diện chính (Landing Page)** - Cho phép chọn loại đăng nhập
- **Đăng nhập Admin** - Quản lý sản phẩm, đơn hàng, khách hàng
- **Đăng nhập User** - Mua sắm sản phẩm, xem lịch sử đơn hàng

## 🎯 Các Trang & Tính Năng

### 1. Landing Page (Trang Chính)
**Đường dẫn:** `/#/`

Hiển thị 2 tùy chọn:
- **Khách Hàng** 👤 - Đăng nhập tại `/#/login/user`
- **Quản Trị Viên** ⚙️ - Đăng nhập tại `/#/login/admin`

**Thiết kế:**
- Giao diện đẹp với gradient background
- Hai card lớn với icon, mô tả, và nút đăng nhập
- Responsive trên mobile

### 2. Trang Đăng Nhập
**URL:** `/#/login/user` hoặc `/#/login/admin`

**Tính năng:**
- Email và mật khẩu tùy chỉnh theo loại tài khoản
- Kiểm tra quyền hạn (Admin không được đăng nhập từ form User)
- Hiển thị tài khoản demo
- Nút quay lại trang chính
- Loading state khi đang xử lý

### 3. Điều Hướng Sau Đăng Nhập

#### Admin ⚙️
```
📧 Email: admin@gmail.com
🔐 Mật khẩu: 123456
↓
Trỏ thẳng đến: /#/admin
```

**Admin có quyền:**
- Quản lý sản phẩm (thêm, sửa, xóa)
- Xem danh sách đơn hàng
- Xem danh sách khách hàng
- Thống kê bán hàng

#### User 👤
```
📧 Email: user@gmail.com
🔐 Mật khẩu: 123456
↓
Trỏ thẳng đến: /#/
```

**User có quyền:**
- Xem sản phẩm
- Tìm kiếm & lọc sản phẩm
- Thêm sản phẩm vào giỏ hàng
- Mua hàng
- Xem lịch sử đơn hàng

## 🔐 Bảo Vệ Routes

### ProtectedRoute Component
Bảo vệ trang Admin:
```javascript
<Route 
    path="/admin" 
    element={
        <ProtectedRoute>
            <Admin />
        </ProtectedRoute>
    } 
/>
```

**Quy tắc:**
- Nếu không đăng nhập → Quay về Landing
- Nếu role ≠ admin → Quay về Landing
- Nếu role = admin → Cho phép truy cập

## 💾 Lưu Trữ Dữ Liệu

### localStorage
```javascript
// Danh sách tất cả user (khởi tạo lần đầu)
localStorage.getItem('users')

// User hiện tại đang đăng nhập
localStorage.getItem('currentUser')
```

### Dữ Liệu User
```javascript
{
    id: 1,
    name: 'Người dùng',
    email: 'user@gmail.com',
    password: '123456',
    phone: '0987654321',
    address: 'Hà Nội',
    role: 'user' // hoặc 'admin'
}
```

## 🗂️ Các File Tạo Mới

```
src/components/
├── Landing.jsx          # Trang giao diện chính
├── Landing.css          # Style landing page
├── Login.jsx            # Trang đăng nhập (cập nhật)
├── Login.css            # Style login page
└── ProtectedRoute.jsx   # Bảo vệ route admin

src/
└── App.js              # Cập nhật routing
```

## 🚀 Cách Sử Dụng

### 1. Khởi động ứng dụng
```bash
npm start
```

### 2. Truy cập trang chính
```
http://localhost:3000/#/
```

### 3. Chọn loại đăng nhập
- Click "Đăng Nhập" trên card Khách Hàng → `/#/login/user`
- Click "Đăng Nhập" trên card Quản Trị Viên → `/#/login/admin`

### 4. Nhập thông tin demo
- **Admin:** admin@gmail.com / 123456
- **User:** user@gmail.com / 123456

### 5. Sau đăng nhập thành công
- **Admin:** Vào trang quản lý
- **User:** Vào trang mua sắm

## 🔄 Quy Trình Xác Thực

```
┌─────────────────────┐
│  Landing Page (/)   │
└──────────┬──────────┘
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
┌─────────┐  ┌──────────┐
│  User   │  │  Admin   │
│ Login   │  │  Login   │
└────┬────┘  └────┬─────┘
     │            │
     │            │
     ▼            ▼
┌─────────┐  ┌──────────┐
│ Home    │  │ Admin    │
│ Page    │  │ Panel    │
└─────────┘  └──────────┘
```

## 🛡️ Kiểm Soát Quyền Hạn

### Admin Login
✅ Cho phép: admin@gmail.com với role = 'admin'
❌ Từ chối: user@gmail.com
❌ Từ chối: Admin dùng form User login

### User Login
✅ Cho phép: user@gmail.com với role = 'user'
❌ Từ chối: admin@gmail.com
❌ Từ chối: Admin dùng form User login

## 📱 Responsive Design

- ✅ Desktop (>1200px)
- ✅ Tablet (768px - 1200px)
- ✅ Mobile (<768px)

## 🎨 Màu Sắc Chủ Đề

- **User**: Xanh dương (#667eea)
- **Admin**: Đỏ (#ff6b6b)
- **Background**: Gradient từ #667eea → #764ba2
- **Text**: Xám (#333, #666)

## 🔔 Event Listeners

Sau khi đăng nhập thành công:
```javascript
window.dispatchEvent(new Event('userLoggedIn'));
```

Menu có thể lắng nghe event này để cập nhật giao diện.

## 📝 Ghi Chú

1. **Cột "currentUser"** được lưu để biết user nào đang online
2. **ProtectedRoute** chặn truy cập trái phép vào trang admin
3. **localStorage** sẽ reset nếu xóa dữ liệu trình duyệt
4. Để đăng xuất, xóa "currentUser" khỏi localStorage
5. Có thể mở rộng thêm vai trò (moderator, seller, etc.)

---

**Phiên bản:** 1.0  
**Cập nhật:** May 30, 2026
