import { env } from '../config/env.js';
import { findUserById } from '../controllers/users.repo.js';

/**
 * ВРЕМЕННАЯ заглушка авторизации.
 *
 * Сейчас "текущий пользователь" берётся из заголовка X-User-Id,
 * а если его нет — из DEMO_USER_ID в .env. Так фронт уже можно
 * подключать к реальным данным без логина.
 *
 * Когда добавишь JWT: замени тело функции на проверку токена
 * (req.headers.authorization -> jwt.verify -> req.user) — контроллеры
 * и репозитории менять не придётся, они читают только req.user.
 */
export async function currentUser(req, res, next) {
  try {
    const userId = Number(req.header('x-user-id') ?? env.demoUserId);
    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(401).json({ success: false, error: 'Некорректный X-User-Id' });
    }

    const user = await findUserById(userId);
    if (!user) return res.status(401).json({ success: false, error: 'Пользователь не найден' });

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

/** Пропускает только покупателя (роль buyer) */
export function requireBuyer(req, res, next) {
  if (req.user?.role_name !== 'buyer') {
    return res.status(403).json({ success: false, error: 'Доступно только покупателям' });
  }
  next();
}

/** Пропускает только художника (роль artist) */
export function requireArtist(req, res, next) {
  if (req.user?.role_name !== 'artist') return res.status(403).json({ success: false, error: 'Доступно только художникам' });
  if (!req.user.artist_id) return res.status(403).json({ success: false, error: 'У аккаунта нет профиля художника' });
  next();
}
