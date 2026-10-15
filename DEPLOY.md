# Практическое занятие №15 — пошагово для твоего проекта

Всё, что нужно по методичке: Dockerfile + .dockerignore, docker build/run/ps/stop,
репозиторий на GitHub, workflow в `.github/workflows/`, публикация образов в GHCR,
Pull Request и скриншоты для отчёта. Файлы уже лежат в проекте:

| Файл | Зачем |
|---|---|
| `backend/Dockerfile`, `backend/.dockerignore` | контейнеризация API |
| `frontend/Dockerfile`, `frontend/.dockerignore`, `frontend/nginx.conf` | контейнеризация фронта |
| `docker-compose.yml` | БД + API + фронт одной командой |
| `.github/workflows/build.yml` | CI: тесты → сборка образов → GHCR |
| `.gitignore` | чтобы в репозиторий не ушли node_modules и .env |
| `postman/merchania.postman_collection.json` | коллекция запросов (не обязательна, но удобна) |

---

## Шаг 1. Репозиторий и первый push

Выполняй в корне проекта (там, где лежат `backend/` и `frontend/`):

```bash
git init
git branch -M main
git remote add origin https://github.com/<твой-логин>/merchania.git   # репозиторий создай на GitHub заранее, публичный
git add .
git commit -m "feat: frontend, backend, docker и CI"
git push -u origin main
```

После push зайди на GitHub → вкладка **Actions**: там должен появиться запуск `build`.
На `main` выполнятся обе job: `test`, а затем `build-backend` и `build-frontend`.
**Скриншот для отчёта:** зелёный список запусков во вкладке Actions + шаги задачи `test` (как рис. 5.3–5.4 методички).

Образы появятся в **Packages** (иконка справа в шапке профиля → раздел Packages):
`ghcr.io/<твой-логин>/merchania-backend` и `.../merchania-frontend`
с тегами `latest` и `<hash коммита>`. **Скриншот** — как рис. 5.1 методички.

## Шаг 2. Docker: команды из методички

Собери образ бэкенда вручную (это и есть задание про `docker build`):

```bash
docker build -t merchania-backend ./backend

docker run -d --name merchania-api -p 4000:4000 -e MOCK_DB=true merchania-backend
docker ps                     # контейнер в списке, статус Up
curl http://localhost:4000/api/health
docker stop merchania-api     # остановить
docker rm merchania-api       # удалить контейнер (не обязательно)
```

> В `MOCK_DB=true` контейнер работает без базы — удобно показывать API без SQL Server.

То же самое для фронта (если хочется отдельным пунктом в отчёте):

```bash
docker build -t merchania-frontend ./frontend
docker run -d --name merchania-web -p 8080:80 merchania-frontend
```

## Шаг 3. Всё вместе: compose + настоящая база

```bash
docker compose up --build
```

Поднимутся три контейнера:

- `db` — SQL Server 2022, собранный из `db/Dockerfile` (официальный образ + свой entrypoint):
  при **первом** запуске тома он дожидается готовности сервера и прогоняет
  `backend/sql/01_schema.sql` и `02_seed.sql`, после чего ставит маркер и больше не повторяет.
- `backend` — API, в `.env` уже прописаны `MOCK_DB=false` и `DB_SERVER=db`.
- `frontend` — nginx на `http://localhost:8080`, `/api/*` проксирует в backend.

Первый старт SQL Server занимает 30–60 секунд. Проверка:

```bash
curl http://localhost:4000/api/health        # "connected": true, "mode": "mssql"
curl "http://localhost:4000/api/products?limit=2"
```

Остановить: `docker compose down`. Стереть базу и начать заново: `docker compose down -v`.

> SQL Server в контейнере ест ~2 ГБ ОЗУ. Если Docker Desktop ругается на память —
> подними базу без контейнера (SQL Server Express + SSMS, выполни два .sql вручную)
> и запускай только `backend` и `frontend`, а `DB_SERVER` поставь `host.docker.internal`.

## Шаг 4. Как устроен workflow (для отчёта, своими словами)

`.github/workflows/build.yml`:

- **Триггеры**: `on: push` и `on: pull_request` — любой push и любой PR запускают тесты.
- **job `test`**: `actions/checkout@v4` → `actions/setup-node@v4` (Node 20 + кэш npm) →
  `npm ci` → `npm test` в папке `backend`. Тестам SQL Server не нужен (работают в MOCK_DB),
  поэтому CI не зависит от базы. Упал тест — весь pipeline красный, образы не собираются.
- **job `build-backend` / `build-frontend`**: `needs: test` и условие
  `if: github.event_name == 'push' && github.ref == 'refs/heads/main'` —
  сборка и публикация только с `main` и только после зелёных тестов.
  `docker/login-action@v3` логинится в GHCR парой `github.actor` / `GITHUB_TOKEN`
  (секрет создаёт сам GitHub, ничего хранить не надо), `docker/build-push-action@v5`
  собирает и пушит образ с тегами `:latest` и `:${{ github.sha }}`.

**Скриншоты для отчёта:** проваленный запуск тоже пригодится — методичка требует показать
анализ логов (рис. 5.5). Ломай осмысленно: поменяй что-нибудь в тесте, запушь в PR —
увидишь красный `test` и по логам, на каком шаге упало.

## Шаг 5. Pull Request (задание №23 методички)

Процесс, который нужно описать в отчёте со скриншотами:

1. От `main` создаётся ветка задачи и в неё коммитятся изменения:

   ```bash
   git checkout main
   git pull
   git checkout -b feature/checkout-ui
   # ...правки...
   git add . && git commit -m "feat: корзина на реальных данных"
   git push -u origin feature/checkout-ui
   ```

2. На GitHub после push появится жёлтая плашка «Compare & pull request» — или вручную:
   вкладка **Pull requests → New pull request**, base `main` ← compare `feature/checkout-ui`.
3. В PR видны изменённые файлы (вкладка Files changed), туда можно оставлять комментарии
   к конкретным строкам — это code review. Внизу видно и статус Actions: workflow прогонит
   `test` для этого PR.
4. Когда проверка зелёная и замечаний нет — кнопка **Merge pull request → Confirm merge**.
   Ветка после_merge удаляется (галочка delete branch).
5. Скриншоты в отчёт: список PR, страница PR с дифом, зелёный статус проверки, кнопка Merge.

Зачем это вообще нужно: `main` всегда остаётся в состоянии «тесты зелёные»,
а сырой код живёт в ветках и попадает в основную линию только после проверки.

## Шаг 6. Secrets (раздел методички про секреты)

Сейчас проекту секреты не нужны: для GHCR хватает встроенного `GITHUB_TOKEN`,
а пароль от базы живёт только в `docker-compose.yml` локально (в репозиторий
можно выкладывать дев-пароль, это учебная база; боевой — только в Secrets).

Если преподаватель хочет увидеть Secrets в действии:
**Settings → Secrets and variables → Actions → New repository secret**,
например `DB_PASSWORD`, и используй в workflow как `${{ secrets.DB_PASSWORD }}`.
**Скриншот** раздела — как рис. 5.8–5.9 методички. Значение после сохранения
не показывается — только обновляется, это и опиши.

## Чек-лист отчёта

- [ ] ссылка на публичный репозиторий;
- [ ] скрин структуры репозитория (видны Dockerfile, .dockerignore, .github/workflows);
- [ ] вывод `docker build` / `docker run` / `docker ps` / `docker stop`;
- [ ] скрин вкладки Actions с зелёным прогоном и шагами задачи `test`;
- [ ] скрин страницы образа в Packages (теги latest и sha);
- [ ] скрин красного прогона + пара предложений, что посмотрела в логах;
- [ ] скриншоты PR: создание, диф, merge;
- [ ] скрин раздела Secrets (если делала шаг 6).
