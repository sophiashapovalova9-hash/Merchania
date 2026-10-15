import { ValidationError } from '../utils/validate.js';

/** 404 для несуществующих маршрутов */
export function notFound(req, res) {
  res.status(404).json({ success: false, error: `Маршрут не найден: ${req.method} ${req.originalUrl}` });
}

/**
 * Единый обработчик ошибок.
 * - ValidationError / ошибки со свойством status -> клиентский ответ как есть
 * - ошибки mssql -> 500 с кодом SQL в логе, без деталей наружу
 */
export function errorHandler(err, req, res, _next) {
  if (err instanceof ValidationError || err.status) {
    return res.status(err.status).json({ success: false, error: err.message });
  }

  // Типичные коды SQL Server, которые полезно отличать от настоящих падений
  const sqlMessages = {
    2627: 'Нарушение уникальности: такая запись уже есть',
    2601: 'Нарушение уникальности: такая запись уже есть',
    547: 'Операция запрещена: запись связана с другими данными',
    515: 'Не заполнено обязательное поле',
    8152: 'Слишком длинное значение для поля',
  };

  const status = err.status ?? (sqlMessages[err.number] ? 409 : 500);
  const message = sqlMessages[err.number] ?? (status === 500 ? 'Внутренняя ошибка сервера' : err.message);

  console.error(`[error] ${req.method} ${req.originalUrl}`, {
    name: err.name,
    number: err.number,
    message: err.message,
  });

  return res.status(status).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && status === 500 ? { debug: err.message } : {}),
  });
}
