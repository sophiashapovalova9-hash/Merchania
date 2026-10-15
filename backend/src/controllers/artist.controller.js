import {
  getArtist,
  getAnalytics,
  getTopProducts,
  listArtistProducts,
  createArtistProduct,
  updateArtistProduct,
  setStock,
} from './artists.repo.js';
import { ok, list } from '../utils/http.js';
import { requireInt, requireMoney, requireString, optionalString } from '../utils/validate.js';

/** GET /api/artist/analytics — цифры и топ товаров для вкладки "Аналитика" */
export async function analytics(req, res) {
  const artistId = req.user.artist_id;
  const [summary, top, artist] = await Promise.all([
    getAnalytics(artistId),
    getTopProducts(artistId, 5),
    getArtist(artistId),
  ]);

  return ok(res, {
    artist: { artist_id: artist.artist_id, shop_name: artist.shop_name, rating: artist.rating },
    income_total: Number(summary.income_total),
    orders_total: summary.orders_total,
    avg_check: Number(summary.avg_check),
    units_sold: summary.units_sold,
    stock_total: summary.stock_total,
    top_products: top.map((t) => ({ ...t, revenue: Number(t.revenue) })),
  });
}

/** GET /api/artist/products — таблица "Мои товары" */
export async function products(req, res) {
  return list(res, await listArtistProducts(req.user.artist_id));
}

/** POST /api/artist/products — кнопка "Добавить товар" */
export async function createProduct(req, res) {
  const data = {
    categoryId: requireInt(req.body?.categoryId, 'categoryId'),
    fandomId: requireInt(req.body?.fandomId, 'fandomId'),
    title: requireString(req.body?.title, 'title', { max: 200 }),
    description: optionalString(req.body?.description, 'description', { max: 4000 }),
    price: requireMoney(req.body?.price, 'price'),
    stock: requireInt(req.body?.stock ?? 0, 'stock', { min: 0, max: 100000 }),
  };

  return ok(res, await createArtistProduct(req.user.artist_id, data), 201);
}

/** PUT /api/artist/products/:id — иконка-карандаш в таблице */
export async function updateProduct(req, res) {
  const productId = requireInt(req.params.id, 'id');
  const data = {
    categoryId: requireInt(req.body?.categoryId, 'categoryId'),
    fandomId: requireInt(req.body?.fandomId, 'fandomId'),
    title: requireString(req.body?.title, 'title', { max: 200 }),
    description: optionalString(req.body?.description, 'description', { max: 4000 }),
    price: requireMoney(req.body?.price, 'price'),
    stock: requireInt(req.body?.stock ?? 0, 'stock', { min: 0, max: 100000 }),
  };

  return ok(res, await updateArtistProduct(req.user.artist_id, productId, data));
}

/** PATCH /api/artist/products/:id/stock { stock } — быстрая правка остатка */
export async function changeStock(req, res) {
  const productId = requireInt(req.params.id, 'id');
  const stock = requireInt(req.body?.stock, 'stock', { min: 0, max: 100000 });
  return ok(res, await setStock(req.user.artist_id, productId, stock));
}
