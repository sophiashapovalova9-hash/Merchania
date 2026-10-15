#!/bin/bash
# Стартуем SQL Server, дожидаемся готовности и один раз (маркер-файл)
# накатываем все .sql из /docker-entrypoint-initdb.d по алфавиту.

MARKER=/var/opt/mssql/.initialized

/opt/mssql/bin/sqlservr &
SQL_PID=$!

echo "[init] waiting for SQL Server to accept connections..."
READY=0
for i in $(seq 1 60); do
  if /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -C -Q "SELECT 1" >/dev/null 2>&1; then
    READY=1
    echo "[init] SQL Server is ready."
    break
  fi
  sleep 2
done

if [ "$READY" -ne 1 ]; then
  echo "[init] ERROR: SQL Server did not become ready in time."
  exit 1
fi

if [ ! -f "$MARKER" ]; then
  for script in /docker-entrypoint-initdb.d/*.sql; do
    [ -f "$script" ] || continue
    echo "[init] applying $script ..."
    /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -C -i "$script"
    if [ $? -ne 0 ]; then
      echo "[init] ERROR: script $script failed."
      exit 1
    fi
  done
  touch "$MARKER"
  echo "[init] database initialized."
else
  echo "[init] marker found - database already initialized, skipping scripts."
fi

wait "$SQL_PID"
