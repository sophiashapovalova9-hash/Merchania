# START.md — одна инструкция на всё

Читай сверху вниз, делай по шагам. Все команды — копируй и вставляй как есть.
Если что-то сломалось — в конце раздел «Если что-то пошло не так».

---

## 0. Карта проекта: что где лежит

```
Merchania/                        ← корень (твоя папка проекта)
├── START.md                      ← ЭТА инструкция
├── docker-compose.yml            ← запускает БД + бэкенд + фронт одной командой
├── .gitignore                    ← что НЕ попадёт в GitHub
├── .github/workflows/build.yml   ← GitHub Actions (практическая №15)
├── DB_TUTORIAL.md                ← ПОДРОБНЫЙ туториал по БД + таблица всех ошибок
├── DEPLOY.md                     ← ПОДРОБНЫЙ туториал к практической №15 + чек-лист отчёта
├── FRONTEND.md                   ← как фронтенду ходить в API (код, прокси, роутер)
├── db/                           ← Docker-образ базы с авто-миграциями
├── postman/
│   └── merchania.postman_collection.json  ← готовая коллекция запросов
├── backend/                      ← ГОТОВЫЙ бэкенд (без ошибок, 29 тестов зелёные)
│   ├── src/                      ← код API
│   ├── sql/01_schema.sql         ← твоя схема + дополнения (выполняется на БД)
│   ├── sql/02_seed.sql           ← тестовые данные (9 товаров и т.д.)
│   ├── .env / .env.example       ← настройки подключения к БД
│   └── tests/                    ← автотесты (npm test)
└── frontend/                     ← РАБОЧИЙ фронтенд (React + Vite + Tailwind)
    └── src/
        ├── App.jsx, main.jsx, index.css
        └── pages/                ← ВСЕ 11 страниц ОБЯЗАТЕЛЬНО в этой папке
```

Главное правило структуры: **`App.jsx`, `main.jsx`, `index.css` лежат в `src/`,
а все страницы (Home, Catalog, Product, Cart, Checkout, Login, Register,
ForgotPassword, Account, Dashboard, Support) — в `src/pages/`.** Из-за нарушения
этого правила у тебя был белый экран.

---

## 1. Что установить на компьютер (один раз)

| Программа | Зачем | Скачать | Проверка в терминале |
|---|---|---|---|
| Node.js **LTS** | запуск фронта и бэкенда | nodejs.org | `node -v` → v20+ |
| Git | отправка кода на GitHub | git-scm.com | `git --version` |
| Docker Desktop | база данных + практическая №15 | docker.com/products/docker-desktop | `docker --version` |
| SSMS | смотреть таблицы базы (необязательно) |learn.microsoft.com → «SSMS download» | открывается |
| Postman | тыкать запросы в API (необязательно, но удобно) | postman.com/downloads | открывается |

Терминал на Windows: **PowerShell** (Пуск → «PowerShell»). Все команды ниже — для него.
После установки Docker Desktop запусти его и дождись, пока в трее появится значок кита.

---

## 2. Положи проект на компьютер

Скопируй из воркспейса в `C:\Users\Софья\Desktop\Merchania` все папки и файлы
из раздела 0 (ты уже умеешь это делать). Проверь:

```powershell
cd C:\Users\Софья\Desktop\Merchania
dir
```

Должны быть видны: `backend`, `frontend`, `db`, `postman`, `.github`,
`docker-compose.yml`, `START.md` и остальные `.md`.

---

## 3. Первый запуск БЕЗ базы (проверить, что всё живо)

Понадобятся **два** окна PowerShell.

Окно 1 — бэкенд:

```powershell
cd C:\Users\Софья\Desktop\Merchania\backend
npm install
npm run dev
```

Жди строку `[api] Merchania API слушает http://0.0.0.0:4000`. Открой в браузере
<http://localhost:4000/api/health> — должен быть JSON с `"success": true`.
Пока написано `"mode": "mock"` — бэкенд работает на встроенных данных, база не нужна.

Окно 2 — фронтенд:

```powershell
cd C:\Users\Софья\Desktop\Merchania\frontend
npm install
npm run dev
```

Открой <http://localhost:5173> — увидишь сайт. Фронт уже ходит в бэкенд
через прокси (`/api/*` → `localhost:4000`, настроено в `vite.config.js`).

> **Если фронт выдал `Failed to resolve import "./pages/Home"`** — страницы лежат
> не в `src/pages/`, а прямо в `src/`. Лечится переносом:
>
> ```powershell
> cd C:\Users\Софья\Desktop\Merchania\frontend
> mkdir src\pages -Force
> Move-Item src\Home.jsx, src\Catalog.jsx, src\Product.jsx, src\Cart.jsx, src\Checkout.jsx, src\Login.jsx, src\Register.jsx, src\ForgotPassword.jsx, src\Account.jsx, src\Dashboard.jsx, src\Support.jsx -Destination src\pages\
> ```
>
> (`App.jsx`, `main.jsx`, `index.css` остаются в `src/`.) Затем снова `npm run dev`.

Останавливается любой сервер клавишами **Ctrl+C** в его окне.

---

## 4. Подключаем настоящую базу SQL Server

### Способ А — Docker (рекомендую, один шаг)

Закрой окно бэкенда (Ctrl+C) — он теперь будет жить в Docker. В корне проекта:

```powershell
cd C:\Users\Софья\Desktop\Merchania
docker compose up --build
```

Править `.env` не нужно: compose сам передаёт контейнеру `MOCK_DB=false`
и адрес базы. Жди 1–2 минуты. В логах базы будет `[init] database initialized.` — значит таблицы
и тестовые данные создались сами. Потом открой:

- <http://localhost:4000/api/health> → `"mode": "mssql", "connected": true` ✅ база подключена;
- <http://localhost:8080> → сайт, теперь он работает с настоящей базой.

Полезные команды:

```powershell
docker compose down        # остановить всё (данные базы сохранятся)
docker compose up          # запустить снова (быстро, без --build)
docker compose logs db     # логи базы, если что-то не так
docker compose down -v     # ПОЛНЫЙ сброс базы (удалит твои тестовые заказы)
```

Посмотреть таблицы руками: SSMS → Server name `localhost,1433` (с запятой!) →
SQL Server Authentication → логин `sa`, пароль `DevPassw0rd!` → база `ArtistMerchDB`.

### Способ Б — без Docker (если Docker совсем не идёт)

Коротко: поставь SQL Server Express + SSMS → включи mixed mode → задай пароль `sa` →
открой порт 1433 в Configuration Manager → выполни в SSMS `backend/sql/01_schema.sql`
и `02_seed.sql` (F5) → в `backend/.env` поставь `MOCK_DB=false` и свои логин/пароль →
`npm run dev` в backend. **Подробнейший разбор каждого клика и таблица ошибок —
в `DB_TUTORIAL.md`**, читай его, если выбрала этот путь.

После любого способа проверка одна: `/api/health` показывает `mssql` + `connected: true`.

---

## 5. Postman: туториал

### Установка и импорт

1. Скачай с postman.com/downloads, установи, запусти (можно без аккаунта — «Skip»).
2. Кнопка **Import** (слева сверху) → **File** → выбери
   `C:\Users\Софья\Desktop\Merchania\postman\merchania.postman_collection.json`.
3. Слева в Collections появится **Merchania API** с папками: «Публичные»,
   «Корзина (покупатель)», «Заказы», «Кабинет», «Панель художника», «Поддержка».

### Как этим пользоваться

- Кликни запрос → справа откроется вкладка → кнопка **Send** → внизу ответ.
- Переменная `{{base}}` = `http://localhost:4000` (настраивается во вкладке
  Variables коллекции; по умолчанию уже так).
- Роль задаётся заголовком `X-User-Id`: `1` — покупатель Иван, `2` — художник
  Studio_Pan. В запросах он уже проставлен.

### Мини-сценарий «проверю всё руками» (по одному Send на шаг)

| Шаг | Запрос в коллекции | Ожидаешь |
|---|---|---|
| 1 | Публичные → Health | `"success": true` |
| 2 | Публичные → Каталог (страница 1) | массив из 9 товаров + `meta.pages` |
| 3 | Публичные → Карточка товара | товар с отзывами и `avg_rating` |
| 4 | Корзина → Корзина | 2 позиции, `total: 1350` |
| 5 | Корзина → Добавить товар | `"line_total"` и новый итог |
| 6 | Заказы → Оформить заказ | `"order_id"`, статус «Новый» |
| 7 | Заказы → История заказов | там появился новый заказ |
| 8 | Панель художника → Аналитика (X-User-Id: 2) | цифры и топ товаров |
| 9 | Панель художника → Сменить статус заказа | `"status_name": "Сборка"` |

Если ответ `409` с текстом «недостаточно остатка» — это **правильное** поведение
бэкенда, а не ошибка: попробовала купить больше, чем есть на складе.

Скриншоты пары запросов с ответами отлично заходят в отчёты по практике.

---

## 6. Docker + GitHub Actions (практическая №15, стр. 64–66)

Всё нужное уже в проекте. Порядок работы:

### 6.1. Отправь код на GitHub

Создай на GitHub **публичный** репозиторий (кнопка New repository, имя например
`merchania`, галочка Public, без README). Затем в корне проекта:

```powershell
cd C:\Users\Софья\Desktop\Merchania
git init
git branch -M main
git add .
git commit -m "feat: frontend, backend, docker, CI"
git remote add origin https://github.com/ТВОЙ_ЛОГИН/merchania.git
git push -u origin main
```

### 6.2. Что произойдёт само (GitHub Actions)

Файл `.github/workflows/build.yml` настроен так, как требует методичка:

- на каждый `push` и `pull_request` запускается job **test**: ставит Node 20,
  делает `npm ci` и `npm test` в `backend` (SQL Server для тестов не нужен);
- только при push в `main` и только после зелёных тестов (`needs: test` + `if:`)
  запускаются **build-backend** и **build-frontend**: логин в GHCR через
  `GITHUB_TOKEN` и публикация образов `docker/build-push-action@v5`
  с тегами `:latest` и `:${{ github.sha }}`.

Смотри: вкладка **Actions** на GitHub — список запусков и логи по шагам
(скрин в отчёт!). Вкладка **Packages** у профиля — собранные образы (скрин в отчёт!).

Проверь Docker вручную (это тоже требуют в задании):

```powershell
docker build -t merchania-backend ./backend
docker run -d --name api -p 4000:4000 -e MOCK_DB=true merchania-backend
docker ps
curl http://localhost:4000/api/health
docker stop api
```

### 6.3. Pull Request (тоже пункт методички)

```powershell
git checkout -b feature/postman-docs     # новая ветка от main
# ...что-то меняешь...
git add . ; git commit -m "docs: postman"
git push -u origin feature/postman-docs
```

На GitHub появится плашка «Compare & pull request» → создай PR → во вкладке
Files changed виден диф → когда Actions станут зелёными, **Merge pull request**.
Скриншоты: список PR, страница PR, merge — в отчёт.

### 6.4. Отчёт

Полный чек-лист отчёта со всеми нужными скриншотами — в конце `DEPLOY.md`.

---

## 7. Шпаргалка: все команды по порядку (с нуля до работающего сайта с БД)

```powershell
# один раз
node -v ; git --version ; docker --version     # проверки установок

# запуск с базой
cd C:\Users\Софья\Desktop\Merchania
docker compose up --build
# сайт: http://localhost:8080   API: http://localhost:4000/api/health

# разработка (два окна)
cd backend ;  npm install ; npm run dev        # окно 1, API на 4000
cd frontend ; npm install ; npm run dev        # окно 2, сайт на 5173

# тесты бэкенда
cd backend ; npm test                          # 29 тестов, все зелёные
```

---

## 8. Если что-то пошло не так (топ-6)

| Симптом | Что делать |
|---|---|
| Фронт: `Failed to resolve import "./pages/Home"` | страницы не в `src/pages/` — команда переноса в разделе 3 |
| `/api/health` показывает `mode: mock` | так и задумано без базы; с базой — раздел 4 |
| `Failed to connect to localhost:1433` | Docker не запущен / база не стартовала: `docker compose ps`, `docker compose logs db` |
| `Login failed for user 'sa'` | способ Б: не включён mixed mode или неверный пароль (см. DB_TUTORIAL.md) |
| `Cannot open database "ArtistMerchDB"` | миграции не выполнены: способ А — `docker compose down -v` и заново; способ Б — выполни оба .sql в SSMS |
| `npm run dev` пишет «npm не является командой» | не установлен Node.js (раздел 1), после установки перезакрой PowerShell |

Полная таблица ошибок по базе — в `DB_TUTORIAL.md`, детали практической №15 — в `DEPLOY.md`.
