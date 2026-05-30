import initialData from './database.json';

// Đồng bộ dữ liệu sản phẩm từ database.json vào localStorage
// Giữ lại sản phẩm admin đã thêm mới
const syncProducts = () => {
  const dbProducts = initialData.products || [];
  const dbProductIds = new Set(dbProducts.map((p) => Number(p.id)));

  const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
  const adminAddedProducts = existingProducts.filter(
    (p) => !dbProductIds.has(Number(p.id))
  );

  const mergedProducts = [...dbProducts, ...adminAddedProducts];
  localStorage.setItem('products', JSON.stringify(mergedProducts));
};

// Tạo dữ liệu mặc định
syncProducts();

if (!localStorage.getItem('carts')) {
  localStorage.setItem('carts', JSON.stringify([]));
}

if (!localStorage.getItem('orders')) {
  localStorage.setItem('orders', JSON.stringify([]));
}

if (!localStorage.getItem('users')) {
  localStorage.setItem(
    'users',
    JSON.stringify([
      {
        id: 1,
        name: 'Người dùng',
        email: 'user@gmail.com',
        password: '123456',
        phone: '0987654321',
        address: 'Hà Nội',
        role: 'user',
      },
      {
        id: 2,
        name: 'Admin',
        email: 'admin@gmail.com',
        password: '123456',
        phone: '0123456789',
        address: 'Hà Nội',
        role: 'admin',
      },
    ])
  );
}

// Xác định localStorage key dựa trên URL
const getKeyFromUrl = (url) => {
  if (url.includes('/carts')) return 'carts';
  if (url.includes('/orders')) return 'orders';
  if (url.includes('/users')) return 'users';
  return 'products';
};

// Lấy ID từ URL, ví dụ: /products/3
const getIdFromUrl = (url) => {
  const match = url.match(/\/(\d+)(\?|$)/);
  return match ? Number(match[1]) : null;
};

// Giả lập axios bằng localStorage
const mockAxios = {
  get: async (url) => {
    const key = getKeyFromUrl(url);
    let data = JSON.parse(localStorage.getItem(key) || '[]');

    const id = getIdFromUrl(url);

    if (id !== null) {
      const item = data.find((x) => Number(x.id) === id);
      return { data: item };
    }

    if (url.includes('category=')) {
      const category = decodeURIComponent(url.split('category=')[1].split('&')[0]);
      data = data.filter(
        (x) => x.category && x.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (url.includes('title_like=')) {
      const search = decodeURIComponent(url.split('title_like=')[1].split('&')[0]);
      data = data.filter(
        (x) => x.title && x.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (url.includes('_sort=price')) {
      const order = url.includes('_order=desc') ? 'desc' : 'asc';
      data.sort((a, b) =>
        order === 'asc'
          ? Number(a.price) - Number(b.price)
          : Number(b.price) - Number(a.price)
      );
    }

    return { data };
  },

  post: async (url, payload) => {
    const key = getKeyFromUrl(url);
    const data = JSON.parse(localStorage.getItem(key) || '[]');

    let nextId = 1;

    if (data.length > 0) {
      const numericIds = data
        .map((item) => Number(item.id))
        .filter((id) => !Number.isNaN(id));

      nextId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
    }

    const newItem = {
      ...payload,
      id: nextId,
    };

    data.push(newItem);
    localStorage.setItem(key, JSON.stringify(data));

    return { data: newItem };
  },

  patch: async (url, payload) => {
    const key = getKeyFromUrl(url);
    let data = JSON.parse(localStorage.getItem(key) || '[]');

    const id = getIdFromUrl(url);

    if (id !== null) {
      data = data.map((item) =>
        Number(item.id) === id ? { ...item, ...payload } : item
      );

      localStorage.setItem(key, JSON.stringify(data));

      const updatedItem = data.find((item) => Number(item.id) === id);
      return { data: updatedItem };
    }

    return { data: payload };
  },

  put: async (url, payload) => {
    const key = getKeyFromUrl(url);
    let data = JSON.parse(localStorage.getItem(key) || '[]');

    const id = getIdFromUrl(url);

    if (id !== null) {
      data = data.map((item) =>
        Number(item.id) === id ? { ...payload, id } : item
      );

      localStorage.setItem(key, JSON.stringify(data));

      const updatedItem = data.find((item) => Number(item.id) === id);
      return { data: updatedItem };
    }

    return { data: payload };
  },

  delete: async (url) => {
    const key = getKeyFromUrl(url);
    let data = JSON.parse(localStorage.getItem(key) || '[]');

    const id = getIdFromUrl(url);

    if (id !== null) {
      data = data.filter((item) => Number(item.id) !== id);
      localStorage.setItem(key, JSON.stringify(data));
    }

    return { data: {} };
  },
};

export default mockAxios;