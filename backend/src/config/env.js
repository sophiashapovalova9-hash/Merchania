import 'dotenv/config';

const bool = (v, def = false) => (v === undefined ? def : String(v).toLowerCase() === 'true');

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
  demoUserId: Number(process.env.DEMO_USER_ID ?? 1),

  // MOCK_DB=true -> сервер отвечает данными из src/db/mock-data.js,
  // SQL Server при этом вообще не нужен. Удобно для разработки фронта.
  mockDb: bool(process.env.MOCK_DB),

  db: {
    server: process.env.DB_SERVER ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 1433),
    // Именованный инстанс (например, SQLEXPRESS при локальной установке на Windows).
    // Если задан — порт игнорируется, подключение идёт через SQL Browser.
    instance: process.env.DB_INSTANCE ?? '',
    user: process.env.DB_USER ?? 'sa',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_DATABASE ?? 'ArtistMerchDB',
    options: {
      encrypt: bool(process.env.DB_ENCRYPT, true),
      trustServerCertificate: bool(process.env.DB_TRUST_SERVER_CERTIFICATE, true),
      enableArithAbort: true,
    },
    pool: { max: 10, min: 0, idleTimeoutMillis: 30_000 },
    requestTimeout: 20_000,
    connectionTimeout: 15_000,
  },
};
