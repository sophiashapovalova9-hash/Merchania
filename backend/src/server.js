import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDb } from './db/index.js';

async function main() {
  // Подключение не блокирует старт: если SQL Server ещё не поднят,
  // сервер всё равно поднимется, а /api/health честно вернёт 503.
  try {
    const db = await connectDb();
    console.log(`[db] подключение установлено: ${JSON.stringify(db.describe())}`);
  } catch (err) {
    console.error(`[db] не удалось подключиться к SQL Server: ${err.message}`);
    console.error('[db] сервер продолжит работу, но запросы к данным будут падать. Проверь .env');
  }

  const app = createApp();
  app.listen(env.port, '0.0.0.0', () => {
    console.log(`[api] Merchania API слушает http://0.0.0.0:${env.port} (режим: ${env.mockDb ? 'MOCK' : 'SQL Server'})`);
  });
}

main();
