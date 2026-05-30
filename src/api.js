import initialData from './database.json';

// Đồng bộ dữ liệu từ database.json vào LocalStorage
// - Luôn cập nhật lại sản phẩm gốc từ database.json (để phản ánh thay đổi ảnh, giá, specs...)
// - Giữ lại các sản phẩm mà admin đã thêm mới qua giao diện (ID không có trong database.json)
const syncProducts = () => {
  const dbProducts = initialData.products || [];
  const dbProductIds = new Set(dbProducts.map(p => p.id));

  const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
  const adminAddedProducts = existingProducts.filter(p => !dbProductIds.has(p.id));

  const mergedProducts = [...dbProducts, ...adminAddedProducts];
  localStorage.setItem('products', JSON.stringify(mergedProducts));
};

syncProducts();

if (!localStorage.getItem('carts')) {
  localStorage.setItem('carts', JSON.stringify([]));
}
if (!localStorage.getItem('orders')) {
  localStorage.setItem('orders', JSON.stringify([]));
}

const getKeyFromUrl = (url) => {
  if (url.includes('/carts')) return 'carts';
  if (url.includes('/orders')) return 'orders';
  return 'products';
};

// Giả lập Axios sử dụng LocalStorage để lưu trữ dữ liệu
const mockAxios = {
  get: async (url) => {
    const key = getKeyFromUrl(url);
    let data = JSON.parse(localStorage.getItem(key));

    const matchId = url.match(/\/(\d+)/);
    if (matchId && !url.includes('category') && !url.includes('title_like')) {
      const id = parseInt(matchId[1]);
      const item = data.find(x => x.id === id);
      return { data: item };
    }

    if (url.includes('category=')) {
      const category = url.split('category=')[1].split('&')[0];
      data = data.filter(x => x.category.toLowerCase() === category.toLowerCase());
    }

    if (url.includes('title_like=')) {
      const search = decodeURIComponent(url.split('title_like=')[1].split('&')[0]);
      data = data.filter(x => x.title.toLowerCase().includes(search.toLowerCase()));
    }

    if (url.includes('_sort=price')) {
      const order = url.includes('_order=desc') ? 'desc' : 'asc';
      data.sort((a, b) => order === 'asc' ? a.price - b.price : b.price - a.price);
    }

    return { data };
  },

  post: async (url, payload) => {
    const key = getKeyFromUrl(url);
    let data = JSON.parse(localStorage.getItem(key));

    let nextId = 1;
    if (data.length > 0) {
      const numericIds = data.map(item => parseInt(item.id)).filter(id => !isNaN(id));
      nextId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
    }

    const newItem = { ...payload, id: nextId };
    data.push(newItem);

    localStorage.setItem(key, JSON.stringify(data));
    return { data: newItem };
  },

  patch: async (url, payload) => {
    const key = getKeyFromUrl(url);
    let data = JSON.parse(localStorage.getItem(key));
    const matchId = url.match(/\/(\d+)/);

    if (matchId) {
      const id = parseInt(matchId[1]);
      data = data.map(item => item.id === id ? { ...item, ...payload } : item);
      localStorage.setItem(key, JSON.stringify(data));
    }
    return { data: payload };
  },

  delete: async (url) => {
    const key = getKeyFromUrl(url);
    let data = JSON.parse(localStorage.getItem(key));
    const matchId = url.match(/\/(\d+)/);

    if (matchId) {
      const id = parseInt(matchId[1]);
      data = data.filter(item => item.id !== id);
      localStorage.setItem(key, JSON.stringify(data));
    }
    return { data: {} };
  }
};

export default mockAxios;