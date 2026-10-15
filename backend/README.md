# Merchania API — минимальный бэкенд

Express + `mssql` для SQL Server (`ArtistMerchDB`). Покрывает все страницы текущего React-фронта:
каталог, карточку товара, корзину, чекаут, историю заказов, профиль, избранное, поддержку и панель художника.

Авторизации пока нет (по договорённости). Вместо неё — заголовок `X-User-Id`
и заглушка в `src/middleware/current-user.js`, которую потом меняешь на JWT,
не трогая контроллеры и репозитории.

---

## 1. Структура проекта

```
backend/
├── package.json
├── .env.example          ← скопируй в .env и заполни
├── sql/
│   ├── 01_schema.sql     ← твоя схема + Cart + UNIQUE(Wishlist) + индексы
│   └── 02_seed.sql       ← тестовые данные (9 товаров, 2 художника, корзина)
├── src/
│   ├── server.js         ← точка входа: подключение к БД + listen
│   ├── app.js            ← создание Express-приложения (middleware, /api, ошибки)
│   ├── config/
│   │   └── env.js        ← все переменные окружения в одном месте
│   ├── db/
│   │   ├── index.js      ← адаптер SQL Server: query() / transaction() / ping()
│   │   ├── params.js     ← хелпер q.int() / q.text() / q.money() / q.bool()
│   │   ├── mock.js       ← мок-БД с тем же интерфейсом (режим MOCK_DB=true)
│   │   └── mock-data.js  ← тестовые данные для мока
│   ├── middleware/
│   │   ├── current-user.js   ← ВРЕМЕННАЯ заглушка авторизации (X-User-Id)
│   │   └── error-handler.js  ← 404 + единый формат ошибок
│   ├── controllers/          ← здесь и SQL (репозитории), и логика ответов
│   │   ├── products.repo.js      + products.controller.js
│   │   ├── cart.repo.js          + cart.controller.js
│   │   ├── orders.repo.js        + orders.controller.js
│   │   ├── users.repo.js         + account.controller.js
│   │   ├── artists.repo.js       + artist.controller.js
│   │   └── support.repo.js       + support.controller.js
│   ├── routes/
│   │   └── index.js      ← таблица маршрутов /api/*
│   └── utils/
│       ├── http.js       ← ah(), ok(), list(), paginated()
│       └── validate.js   ← requireInt / requireString / requireMoney / requireEnum
└── tests/
    ├── smoke.test.js         ← 23 сквозных теста через HTTP
    └── mock-routing.test.js  ← 6 регрессионных тестов на мок-слой
```

**Почему `*.repo.js` и `*.controller.js` лежат рядом.**
`*.repo.js` — только SQL и преобразование строк в объекты. `*.controller.js` — только
HTTP: разобрать query/body, проверить, вызвать репозиторий, вернуть JSON.
Для учебного проекта такого деления достаточно; если вырастет — просто разнесёшь по папкам
`repositories/` и `controllers/`, импорты поправятся в одну строку.

---

## 2. Запуск

```bash
cd backend
cp .env.example .env      # заполнить доступы к SQL Server
npm install

# вариант А — без SQL Server (данные из src/db/mock-data.js)
MOCK_DB=true npm run dev

# вариант Б — с SQL Server
# 1) выполнить sql/01_schema.sql, затем sql/02_seed.sql (SSMS или sqlcmd)
# 2) в .env выставить MOCK_DB=false и правильные доступы
npm run dev
```

Проверка: <http://localhost:4000/api/health>

```jsonc
// MOCK_DB=true
{ "success": true, "db": { "connected": true, "mode": "mock", "products": 9 } }

// MOCK_DB=false и SQL Server недоступен — сервер жив, но честно отвечает 503
{ "success": false, "db": { "connected": false, "mode": "mssql", "error": "Failed to connect..." } }
```

Тесты (SQL Server не нужен):

```bash
npm test
```

---

## 3. Что изменилось в БД

Твоя схема осталась как есть. Добавлено ровно три вещи (`sql/01_schema.sql`, секция «ДОПОЛНЕНИЯ»):

| Изменение | Зачем |
|---|---|
| `CREATE TABLE Cart` | Корзина на сервере. Сейчас на фронте она захардкожена — без таблицы нельзя ни добавить товар, ни оформить заказ. |
| `UNIQUE (UserID, ProductID)` в `Wishlist` | Кнопка-сердечко работает как toggle: одно нажатие добавляет, второе убирает. Без уникальности избранное задвоится. |
| Индексы `IX_Product_Catalog`, `IX_Product_Artist`, `IX_Orders_Buyer`, `IX_OrderItem_Order` | Каталог фильтруется по `(FandomID, CategoryID)` и сортируется по цене — без индекса это полный скан таблицы. |

`Review`, `Tag`, `ProductTag`, `ProductMedia` уже были — API их читает (отзывы и фото товара),
запись в них появится позже.

---

## 4. Маршруты

Ответ всегда в одном виде: `{ "success": true, "data": ... }`, для списков добавляется `"meta"`.
Ошибка: `{ "success": false, "error": "сообщение" }`.

### Публичные (логин не нужен)

| Метод | Путь | Что отдаёт | Где используется на фронте |
|---|---|---|---|
| GET | `/api/health` | статус подключения к БД | — |
| GET | `/api/products` | страница каталога | `Catalog.jsx` |
| GET | `/api/products/meta/fandoms` | фандомы + счётчик товаров | фильтры слева в `Catalog.jsx` |
| GET | `/api/products/meta/categories` | категории + счётчик | фильтры слева в `Catalog.jsx` |
| GET | `/api/products/:id` | товар + фото + отзывы + рейтинг | `Product.jsx` |

**Параметры `/api/products`** (все необязательные):

| Параметр | Пример | Смысл |
|---|---|---|
| `search` | `?search=стенд` | по названию, описанию, магазину, фандому |
| `fandomId` | `?fandomId=1` | чекбокс «Фандом» |
| `categoryId` | `?categoryId=3` | чекбокс «Тип мерча» |
| `artistId` | `?artistId=1` | товары одного художника |
| `priceMin` / `priceMax` | `?priceMin=200&priceMax=800` | блок «Цена, ₽» |
| `inStockOnly` | `?inStockOnly=true` | только то, что есть в наличии |
| `sort` | `newest` \| `price_asc` \| `price_desc` \| `popular` | селект сортировки |
| `page`, `limit` | `?page=2&limit=9` | пагинация (в `meta.pages` — всего страниц) |

### Требуют пользователя (заголовок `X-User-Id`)

| Метод | Путь | Тело запроса | Фронт |
|---|---|---|---|
| GET | `/api/cart` | — | `Cart.jsx` |
| POST | `/api/cart` | `{ productId, quantity? }` | кнопка «В корзину» |
| PATCH | `/api/cart/:productId` | `{ quantity }` | `+` / `−` в корзине |
| DELETE | `/api/cart/:productId` | — | иконка корзины-удалить |
| POST | `/api/orders/checkout` | `{ shippingAddress, paymentMethod }` | `Checkout.jsx` |
| GET | `/api/orders` | — | `Account.jsx` → Заказы |
| GET | `/api/orders/:id` | — | детали заказа |
| GET | `/api/orders/meta/statuses` | — | справочник статусов |
| GET | `/api/account/me` | — | шапка личного кабинета |
| PATCH | `/api/account/profile` | `{ firstName, lastName, patronymic?, phone? }` | `ProfileSettings` |
| GET | `/api/account/wishlist` | — | избранное |
| POST | `/api/account/wishlist/:productId` | — | сердечко (toggle) |
| POST | `/api/support/tickets` | `{ subject, message }` | `Support.jsx` |
| GET | `/api/support/tickets` | — | свои заявки |

### Панель художника (роль `artist`)

| Метод | Путь | Тело | Вкладка |
|---|---|---|---|
| GET | `/api/artist/analytics` | — | Аналитика (цифры + топ товаров) |
| GET | `/api/artist/products` | — | Мои товары |
| POST | `/api/artist/products` | `{ categoryId, fandomId, title, description?, price, stock }` | «Добавить товар» |
| PUT | `/api/artist/products/:id` | то же | иконка-карандаш |
| PATCH | `/api/artist/products/:id/stock` | `{ stock }` | быстрая правка остатка |
| GET | `/api/artist/orders` | — | Заказы / Логистика |
| PATCH | `/api/artist/orders/:id/status` | `{ status, trackingNumber? }` | смена статуса + трек Boxberry |

Доступные `status`: `Новый`, `Сборка`, `Отправлен`, `Доставлен`, `Завершён`, `Отменён`.

---

## 5. Как устроены данные

### Корзина и итог

`GET /api/cart` сразу считает то, что рисует `Cart.jsx`:

```jsonc
{
  "success": true,
  "data": {
    "items": [{ "product_id": 1, "title": "Акриловый стенд \"Странник\"", "price": 750, "quantity": 1, "line_total": 750, "stock": 12, "image_url": "..." }],
    "items_count": 2,
    "subtotal": 1000,
    "shipping": 350,
    "total": 1350,
    "free_shipping_from": 2000,
    "to_free_shipping": 1000   // ← «Добавьте товаров ещё на N ₽»
  }
}
```

Порог бесплатной доставки — константа `FREE_SHIPPING_FROM` в `cart.controller.js`.

### Чекаут — единственная транзакция

`POST /api/orders/checkout` в `orders.repo.js` делает всё в одной транзакции:

1. берёт позиции корзины с `WITH (UPDLOCK)` — блокировка от гонки двух одновременных покупок;
2. проверяет остатки; если не хватает — откат и `409`;
3. `INSERT INTO Orders ... OUTPUT inserted.OrderID` — получаем id нового заказа;
4. одним батчем: позиции заказа → списание `StockQuantity` → очистка корзины.

Цена фиксируется в `OrderItem.UnitPrice`, как и задумано в твоей схеме.

### Режим MOCK_DB

`src/db/mock.js` реализует тот же интерфейс, что и SQL Server-адаптер
(`query`, `transaction`, `ping`, `describe`), поэтому репозитории написаны один раз.
Нужен он для одного: разрабатывать фронт и гонять тесты без поднятого SQL Server.

Мок распознаёт запрос по сигнатурным фрагментам SQL. Это хрупко — поэтому
`tests/mock-routing.test.js` проверяет именно спорные случаи (например, что
`UPDATE Orders` не принимается за `SELECT` того же заказа).

---

## 6. Проверено / не проверено

**Проверено здесь** — `npm test`: 29 тестов, все проходят. Сквозные тесты поднимают
реальный Express-сервер и ходят в него по HTTP: каталог с фильтрами и пагинацией,
карточка товара, корзина (добавление, лимит по остатку, валидация), чекаут со списанием
остатка и очисткой корзины, история заказов, профиль, избранное, поддержка, роли
(покупателя не пускает в `/api/artist/*`), CRUD товаров художника, смена статуса заказа.

**Не проверено** — работа против настоящего SQL Server: в песочнице его нет.
SQL написан под T-SQL (`TOP`/`OFFSET FETCH`, `MERGE`, `OUTPUT`, `OUTER APPLY`, `SYSUTCDATETIME`),
но первый прогон на живой БД может потребовать правок. Порядок проверки:

```bash
sqlcmd -S localhost -i sql/01_schema.sql
sqlcmd -S localhost -d ArtistMerchDB -i sql/02_seed.sql
MOCK_DB=false npm run dev
curl localhost:4000/api/health      # ждём "connected": true
curl "localhost:4000/api/products?limit=2"
```

---

## 7. Что добавлять дальше

| Шаг | Что сделать | Где |
|---|---|---|
| **1. JWT** | `POST /api/auth/register`, `POST /api/auth/login` → токен. Хеш пароля — `bcrypt`. Затем в `current-user.js` заменить чтение `X-User-Id` на `jwt.verify` | `src/middleware/current-user.js` — уже подготовлен под замену |
| **2. Отзывы** | `POST /api/products/:id/reviews` + проверка, что покупатель заказывал товар | `products.repo.js` |
| **3. Загрузка фото** | `POST /api/artist/products/:id/media` (multer) → запись в `ProductMedia` + раздача `/uploads` статики | сейчас `image_url` — заглушки вида `/uploads/products/1-main.jpg` |
| **4. Оплата** | реальный платёжный шлюз вместо `paymentMethod` в чекауте | `orders.repo.js` → `checkout()` |
| **5. Boxberry** | создание накладной при переходе в статус «Отправлен», трек в `Orders.TrackingNumber` | `orders.controller.js` → `setOrderStatus()` |

Подключение фронта — в файле `FRONTEND.md`.
