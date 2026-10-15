import { Router } from 'express';
import { getDb } from '../db/index.js';
import { ah } from '../utils/http.js';
import { currentUser, requireArtist } from '../middleware/current-user.js';

import * as products from '../controllers/products.controller.js';
import * as cart from '../controllers/cart.controller.js';
import * as orders from '../controllers/orders.controller.js';
import * as account from '../controllers/account.controller.js';
import * as artist from '../controllers/artist.controller.js';
import * as support from '../controllers/support.controller.js';

const router = Router();

/* ------------------------------- служебное ------------------------------- */

router.get('/health', ah(async (_req, res) => {
  const db = getDb();
  try {
    await db.ping();
    res.json({ success: true, db: { connected: true, ...db.describe() } });
  } catch (err) {
    res.status(503).json({ success: false, db: { connected: false, ...db.describe(), error: err.message } });
  }
}));

/* -------------------------------- каталог -------------------------------- */
/* Публичные маршруты: логин не нужен, чтобы смотреть товары */

router.get('/products', ah(products.listProducts));
router.get('/products/meta/fandoms', ah(products.fandoms));
router.get('/products/meta/categories', ah(products.categories));
router.get('/products/:id', ah(products.getProduct));

/* ---------------------- всё ниже требует пользователя --------------------- */

router.use(currentUser);

/* корзина */
router.get('/cart', ah(cart.getCart));
router.post('/cart', ah(cart.addToCart));
router.patch('/cart/:productId', ah(cart.updateCartItem));
router.delete('/cart/:productId', ah(cart.removeFromCart));

/* заказы покупателя */
router.post('/orders/checkout', ah(orders.createOrder));
router.get('/orders', ah(orders.myOrders));
router.get('/orders/meta/statuses', ah(orders.statuses));
router.get('/orders/:id', ah(orders.orderDetails));

/* личный кабинет */
router.get('/account/me', ah(account.me));
router.patch('/account/profile', ah(account.patchProfile));
router.get('/account/wishlist', ah(account.wishlist));
router.post('/account/wishlist/:productId', ah(account.toggleWishlistItem));

/* поддержка */
router.post('/support/tickets', ah(support.createSupportTicket));
router.get('/support/tickets', ah(support.myTickets));
router.get('/support/tickets/all', ah(support.allTickets));
router.patch('/support/tickets/:id/resolve', ah(support.resolveSupportTicket));

/* панель художника */
router.use('/artist', requireArtist);
router.get('/artist/analytics', ah(artist.analytics));
router.get('/artist/products', ah(artist.products));
router.post('/artist/products', ah(artist.createProduct));
router.put('/artist/products/:id', ah(artist.updateProduct));
router.patch('/artist/products/:id/stock', ah(artist.changeStock));
router.get('/artist/orders', ah(orders.artistOrders));
router.patch('/artist/orders/:id/status', ah(orders.setOrderStatus));

export default router;
