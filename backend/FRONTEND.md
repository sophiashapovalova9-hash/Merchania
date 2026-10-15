# Как подключить фронт к API

Бэкенд поднимается на `http://localhost:4000`, фронт (Vite) — на `http://localhost:5173`.
Два варианта: проксировать через Vite (проще, нет проблем с CORS) или ходить напрямую.

---

## 1. Прокси в Vite

`vite.config.js`:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      // всё, что начинается с /api, уходит на бэкенд
      '/api': { target: 'http://localhost:4000', changeOrigin: true },
    },
  },
});
```

Тогда во фронте пишешь просто `fetch('/api/products')` — без адреса и без CORS.

---

## 2. Один модуль для запросов

`src/api.js`:

```js
const BASE = '/api';

// Пока нет JWT: говорим бэкенду, кто мы. Потом этот заголовок уйдёт.
const DEMO_USER_ID = 1; // 1 = покупатель Иван, 2 = художник Studio_Pan

async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      'content-type': 'application/json',
      'x-user-id': String(DEMO_USER_ID),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? `HTTP ${res.status}`);
  // возвращаем весь ответ: для списков в json.meta лежит пагинация
  return json;
}

const unwrap = (p) => p.then((json) => json.data);

export const api = {
  // каталог. products() вернёт { data: [...], meta: { total, page, limit, pages } }
  products: (params = {}) =>
    request('/products?' + new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''),
    )),
  fandoms: () => unwrap(request('/products/meta/fandoms')),
  categories: () => unwrap(request('/products/meta/categories')),
  product: (id) => unwrap(request(`/products/${id}`)),

  // корзина
  cart: () => unwrap(request('/cart')),
  addToCart: (productId, quantity = 1) =>
    unwrap(request('/cart', { method: 'POST', body: { productId, quantity } })),
  setQuantity: (productId, quantity) =>
    unwrap(request(`/cart/${productId}`, { method: 'PATCH', body: { quantity } })),
  removeFromCart: (productId) => unwrap(request(`/cart/${productId}`, { method: 'DELETE' })),

  // заказы
  checkout: (shippingAddress, paymentMethod = 'card') =>
    unwrap(request('/orders/checkout', { method: 'POST', body: { shippingAddress, paymentMethod } })),
  myOrders: () => unwrap(request('/orders')),
  order: (id) => unwrap(request(`/orders/${id}`)),

  // кабинет
  me: () => unwrap(request('/account/me')),
  updateProfile: (data) => unwrap(request('/account/profile', { method: 'PATCH', body: data })),
  wishlist: () => unwrap(request('/account/wishlist')),
  toggleWishlist: (productId) => unwrap(request(`/account/wishlist/${productId}`, { method: 'POST' })),

  // поддержка
  createTicket: (subject, message) =>
    unwrap(request('/support/tickets', { method: 'POST', body: { subject, message } })),

  // панель художника
  artistAnalytics: () => unwrap(request('/artist/analytics')),
  artistProducts: () => unwrap(request('/artist/products')),
  artistCreateProduct: (data) => unwrap(request('/artist/products', { method: 'POST', body: data })),
  artistUpdateProduct: (id, data) => unwrap(request(`/artist/products/${id}`, { method: 'PUT', body: data })),
  artistOrders: () => unwrap(request('/artist/orders')),
  artistSetOrderStatus: (id, status, trackingNumber) =>
    unwrap(request(`/artist/orders/${id}/status`, { method: 'PATCH', body: { status, trackingNumber } })),
};
```

---

## 3. Пример: каталог вместо заглушек

Было в `Catalog.jsx` — `{[1,2,3,4,5,6,7,8,9].map(id => ...)}` и захардкоженные фильтры.
Стало:

```jsx
import { useEffect, useState } from 'react';
import { api } from '../api';

const Catalog = ({ setPage }) => {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ total: 0, pages: 1 });
  const [fandoms, setFandoms] = useState([]);
  const [filters, setFilters] = useState({ page: 1, limit: 9, sort: 'newest' });
  const [loading, setLoading] = useState(true);

  // справочники загружаем один раз
  useEffect(() => {
    api.fandoms().then(setFandoms).catch(console.error);
  }, []);

  // товары — при каждом изменении фильтров
  useEffect(() => {
    setLoading(true);
    api.products(filters)
      .then((res) => { setProducts(res.data); setMeta(res.meta); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filters]);

  // ...в разметке:
  // {products.map(p => <ProductCard key={p.product_id} product={p} ... />)}
  // Всего найдено: {meta.total} товаров, страниц: {meta.pages}
};
```

Карточка товара вместо `setPage('product')` должна вести на
`setPage('product', { id: p.product_id })`, а `Product.jsx` — грузить `api.product(id)`.

---

## 4. Пример: корзина

`Cart.jsx` сейчас рендерит два захардкоженных товара и сумму `1 850 ₽`. Реальные данные:

```jsx
const [cart, setCart] = useState(null);

useEffect(() => { api.cart().then(setCart); }, []);

const changeQty = async (productId, quantity) => {
  setCart(await api.setQuantity(productId, quantity)); // бэкенд вернёт пересчитанную корзину
};

// в разметке:
// {cart.items.map(item => ...)}
// Итог: {cart.total} ₽, доставка: {cart.shipping} ₽
// Плашка: «Добавьте товаров ещё на {cart.to_free_shipping} ₽»
```

Ошибку «недостаточно остатка» бэкенд вернёт как `409` — `api.js` бросит `Error` с текстом,
его можно показать в тосте.

---

## 5. Роутинг: `useState` → React Router

Сейчас страницы переключаются через `setPage('catalog')`. Как только появятся реальные id
(`product/7`), это станет неудобно — ссылка на товар не будет работать напрямую.
Минимальный переход:

```bash
npm i react-router-dom
```

```jsx
// App.jsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/catalog" element={<Catalog />} />
    <Route path="/product/:id" element={<Product />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/checkout" element={<Checkout />} />
    <Route path="/account" element={<Account />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/support" element={<Support />} />
  </Routes>
</BrowserRouter>
```

Внутри компонентов `setPage('catalog')` заменяется на `useNavigate()('/catalog')`,
а id товара берётся через `useParams()`.

---

## 6. Порядок работы

1. Поднять бэкенд в мок-режиме: `MOCK_DB=true npm run dev` — фронт заработает сразу.
2. Сделать `src/api.js` и переписать `Catalog.jsx` — самый показательный экран.
3. Корзина → чекаут → история заказов (замкнутый сценарий покупки).
4. Поднять SQL Server, выполнить `sql/01_schema.sql` + `sql/02_seed.sql`,
   выставить `MOCK_DB=false` и проверить те же экраны.
5. Только после этого — JWT и настоящая регистрация.
