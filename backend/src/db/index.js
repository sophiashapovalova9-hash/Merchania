import { env } from '../config/env.js';
import { createMockDb } from './mock.js';

/**
 * Единая точка доступа к данным.
 *
 * Реализации две, интерфейс один: { query(text, inputs), transaction(fn), ping(), describe() }.
 * Репозитории не знают, куда идёт запрос — в SQL Server или в мок.
 * Переключается переменной MOCK_DB в .env.
 *
 * Формат параметра: { type: 'Int', value: 5 } (см. src/db/params.js)
 */
let instance = null;

export function getDb() {
  if (!instance) instance = env.mockDb ? createMockDb() : createMssqlDb();
  return instance;
}

export async function connectDb() {
  const db = getDb();
  await db.ping();
  return db;
}

/* ------------------------------ SQL Server ------------------------------ */

let sql = null;
async function loadMssql() {
  if (!sql) sql = (await import('mssql')).default;
  return sql;
}

function mssqlType(spec) {
  const t = sql[spec.type];
  if (!t) throw new Error(`Неизвестный тип mssql: ${spec.type}`);
  return spec.size ? t(spec.size) : t;
}

const applyInputs = (request, inputs = {}) => {
  for (const [name, spec] of Object.entries(inputs)) {
    request.input(name, mssqlType(spec), spec.value);
  }
  return request;
};

function createMssqlDb() {
  let poolPromise = null;

  const pool = () => {
    if (!poolPromise) {
      const config = {
        server: env.db.server,
        user: env.db.user,
        password: env.db.password,
        database: env.db.database,
        options: { ...env.db.options },
        pool: env.db.pool,
        requestTimeout: env.db.requestTimeout,
        connectionTimeout: env.db.connectionTimeout,
      };

      if (env.db.instance) {
        // Именованный инстанс (SQLEXPRESS): порт узнаёт SQL Browser, поэтому не задаём его
        config.options.instanceName = env.db.instance;
      } else {
        config.port = env.db.port;
      }

      poolPromise = loadMssql()
        .then((mssql) => new mssql.ConnectionPool(config).connect())
        .catch((err) => {
          poolPromise = null; // следующая попытка подключится заново
          throw err;
        });
    }
    return poolPromise;
  };

  return {
    /** @param {string} text SQL @param {Record<string,{type:string,value:any,size?:number}>} inputs */
    async query(text, inputs = {}) {
      await loadMssql();
      const result = await applyInputs((await pool()).request(), inputs).query(text);
      return { rows: result.recordset, total: result.rowsAffected?.[0] ?? result.recordset.length };
    },

    /**
     * Транзакция: fn получает handle с query()/commit()/rollback().
     * Откат выполняется автоматически, если fn бросил исключение.
     */
    async transaction(fn) {
      await loadMssql();
      const tx = new sql.Transaction(await pool());
      await tx.begin();

      const handle = {
        async query(text, inputs = {}) {
          const result = await applyInputs(new sql.Request(tx), inputs).query(text);
          return { rows: result.recordset, total: result.rowsAffected?.[0] ?? result.recordset.length };
        },
        commit: () => tx.commit(),
        rollback: () => tx.rollback(),
      };

      try {
        const value = await fn(handle);
        await tx.commit();
        return value;
      } catch (err) {
        try {
          await tx.rollback();
        } catch {
          /* откат мог не удаться при разрыве соединения — не затираем исходную ошибку */
        }
        throw err;
      }
    },

    async ping() {
      const { rows } = await this.query('SELECT 1 AS ok');
      return rows[0]?.ok === 1;
    },

    describe() {
      return {
        mode: 'mssql',
        server: env.db.server,
        port: env.db.port,
        database: env.db.database,
        user: env.db.user,
      };
    },
  };
}
