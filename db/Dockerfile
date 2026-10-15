# SQL Server + автоматический накат миграций при ПЕРВОМ запуске.
# Официальный образ mssql такого не умеет (в отличие от MySQL/Postgres),
# поэтому добавляем свой entrypoint: ждём готовности сервера и прогоняем
# .sql-файлы по алфавиту, после чего ставим маркер, чтобы не повторять.
#
# Собирается из корня репозитория (см. docker-compose.yml):
#   docker compose up --build

FROM mcr.microsoft.com/mssql/server:2022-latest

USER root
COPY db/entrypoint.sh /entrypoint.sh
COPY backend/sql/01_schema.sql /docker-entrypoint-initdb.d/01_schema.sql
COPY backend/sql/02_seed.sql /docker-entrypoint-initdb.d/02_seed.sql
RUN chmod +x /entrypoint.sh

USER mssql
ENTRYPOINT ["/entrypoint.sh"]
