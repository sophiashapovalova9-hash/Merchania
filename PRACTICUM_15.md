# Практическое занятие №15 — делай по шагам

Проект на компьютере: `C:\Users\Софья\Desktop\Merch`

Работа уже написана в файлах. Твоя часть — запустить Docker, отправить проект на GitHub и вставить скриншоты в отчёт `ОТЧЕТ_практика_15.docx`.

Команды ниже — для PowerShell. Каждую вставляй отдельно и жми Enter. Знак `&&` не используй.

---

## 0. Что уже готово, а что делаешь ты

Уже лежит в проекте и является выполнением заданий:

| Файл | Задание методички |
|---|---|
| `backend/Dockerfile` | Dockerfile с FROM, WORKDIR, COPY, RUN, ENV, EXPOSE, CMD |
| `backend/.dockerignore`, `frontend/.dockerignore` | не класть в образ `node_modules` и `.env` |
| `frontend/Dockerfile`, `frontend/nginx.conf` | контейнер сайта |
| `db/Dockerfile`, `db/entrypoint.sh` | контейнер SQL Server |
| `docker-compose.yml` | база + API + сайт одной командой |
| `.gitignore` | не отправлять на GitHub секреты и `node_modules` |
| `.github/workflows/build.yml` | тесты на каждый push/PR, сборка образов только из `main` |
| `postman/merchania.postman_collection.json` | проверка API |

Только на твоём компьютере, потому что нужен твой GitHub и Docker Desktop:

- команды `docker build / run / ps / stop` и скриншоты;
- публичный репозиторий и push;
- зелёный прогон во вкладке Actions и образы в Packages;
- скриншот Secrets;
- Pull Request и скриншоты;
- вписать фамилию, группу и вариант в отчёт.

---

## 1. Один раз установить

1. Git — https://git-scm.com/download/win
2. Docker Desktop — https://www.docker.com/products/docker-desktop/
3. Аккаунт GitHub — https://github.com/signup

Docker Desktop после установки надо открыть и дождаться, пока кит в трее перестанет крутиться.

Проверка, три отдельные команды:

```powershell
git --version
docker --version
node -v
```

Если какая-то пишет «не является внутренней или внешней командой» — программа не установлена или PowerShell надо закрыть и открыть заново.

---

## 2. Проверь, что файлы практики лежат в корне Merch

```powershell
cd C:\Users\Софья\Desktop\Merch
dir -Force
```

В списке должны быть папки `backend`, `frontend`, `db`, `.github` и файлы `docker-compose.yml`, `.gitignore`, `ПРАКТИКА_15.md`.

Если `.github` или `docker-compose.yml` нет — скачай архив `praktika-15-vlozhit-v-Merch.zip` из этого чата, открой его и скопируй **содержимое** в `C:\Users\Софья\Desktop\Merch`. Если Windows спросит «заменить файлы» — замени. Свои страницы сайта это не сотрёт: в архиве нет `src`.

Повторная проверка:

```powershell
dir .github\workflows
dir backend\Dockerfile
dir frontend\Dockerfile
```

---

## 3. Docker: собрать и запустить бэкенд

Сначала останови окно, где крутится `npm run dev` у бэкенда: кликни в него и нажми **Ctrl+C**. Иначе порт 4000 занят, и Docker не запустится. Окно сайта можно не трогать.

Дальше в новом PowerShell:

```powershell
cd C:\Users\Софья\Desktop\Merch
docker build -t merchania-backend .\backend
```

Подожди, пока дойдёт до `Successfully tagged merchania-backend`. Это скриншот «docker build».

```powershell
docker run -d --name merchania-api -p 4000:4000 -e MOCK_DB=true merchania-backend
docker ps
```

В таблице должен быть контейнер `merchania-api` со статусом `Up`. Это скриншот «docker ps».

Открой в браузере:

http://localhost:4000/api/health

Должен быть текст `"success": true` и `"mode": "mock"`. Скриншот браузера тоже положи в отчёт.

Остановить, как просит методичка:

```powershell
docker stop merchania-api
docker ps
```

После `stop` контейнера в списке `docker ps` уже нет. Скриншот этой команды — «docker stop».

Убрать остановленный контейнер, чтобы имя освободилось:

```powershell
docker rm merchania-api
```

Если `docker build` пишет `error during connect` или `docker daemon` — Docker Desktop не запущен. Открой его и подожди кита.

Если `port is already allocated` — бэкенд из `npm run dev` ещё работает. Ctrl+C в том окне и повтори `docker run`.

---

## 4. Репозиторий на GitHub

1. Зайди на https://github.com/new
2. Repository name: `merchania`
3. Поставь **Public**.
4. Галочки README, .gitignore и license **не ставь**. Репозиторий должен быть пустой.
5. Create repository.
6. Скопируй адрес вида `https://github.com/ТВОЙ-ЛОГИН/merchania.git`

Перед первым коммитом, если Git ещё не представлялся:

```powershell
git config --global user.name "Софья"
git config --global user.email "почта-от-аккаунта-github@example.com"
```

Почту замени на свою. Эти две команды — один раз в жизни, не на каждый проект.

Отправка кода:

```powershell
cd C:\Users\Софья\Desktop\Merch
git init
git branch -M main
git remote add origin https://github.com/ТВОЙ-ЛОГИН/merchania.git
git add .
git commit -m "feat: frontend, backend, docker и CI"
git push -u origin main
```

`ТВОЙ-ЛОГИН` замени на логин с GitHub. Адрес можно вставить целиком той ссылкой, которую скопировала.

Если пишет `remote origin already exists`:

```powershell
git remote set-url origin https://github.com/ТВОЙ-ЛОГИН/merchania.git
git push -u origin main
```

Когда попросит войти — войди через окно браузера. Обычный пароль от сайта GitHub в терминал не принимается. Если не пускает — напиши мне текст ошибки, не пароль.

Сразу после создания репозитория, до или после push:

GitHub → твой репозиторий → **Settings** → слева **Actions** → **General** → внизу **Workflow permissions** → выбери **Read and write permissions** → Save.

Без этого сборка образа упадёт с ошибкой доступа, хотя тесты будут зелёные.

---

## 5. Скриншоты Actions и Packages

1. В репозитории вкладка **Actions**. Через 1–2 минуты появится запуск `build`.
2. Открой его. Должны быть зелёные `test`, `build-backend`, `build-frontend`.
3. Кликни `test` и сними шаги: Checkout, Setup Node, Install, Run tests.
4. Справа в профиле GitHub → **Packages**. Там два образа: `merchania-backend` и `merchania-frontend`, теги `latest` и длинный хеш коммита.

Если пакет пишет, что он private:

Packages → пакет → Package settings → Change visibility → Public. Иначе преподаватель по ссылке его не откроет. Код репозитория и так должен быть Public — это требует методичка.

Если `test` зелёный, а `build-backend` красный с `denied` / `permission` — вернись в Settings → Actions → General и включи Read and write, потом в Actions нажми Re-run jobs.

---

## 6. Secrets — скриншот для отчёта

Репозиторий → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.

- Name: `DB_PASSWORD`
- Value: любой учебный пароль, например `DevPassw0rd!`

Save. Сними экран, где секрет уже есть в списке. Значение после сохранения не показывается — так и должно быть, это и напиши в отчёте. В код этот секрет подставлять не нужно: для загрузки образов GitHub сам выдаёт `GITHUB_TOKEN`.

---

## 7. Pull Request

В PowerShell:

```powershell
cd C:\Users\Софья\Desktop\Merch
git checkout -b feature/readme
```

Открой `README.md` блокнотом и допиши в конец одну строку, например: `Проект подготовлен к практическому занятию №15.`

Сохрани файл. Дальше:

```powershell
git add README.md
git commit -m "docs: пометка о практическом занятии"
git push -u origin feature/readme
```

На GitHub появится жёлтая плашка **Compare & pull request**. Нажми её.

- base: `main`
- compare: `feature/readme`
- название: `docs: пометка о практическом занятии`

Скриншоты: страница PR, вкладка **Files changed** (виден один изменённый файл), зелёная проверка Actions.

Потом **Merge pull request** → **Confirm merge**. Скриншот после слияния тоже в отчёт. Ветку можно удалить кнопкой Delete branch.

Зачем это: в `main` попадает только проверенный код. В PR преподаватель видит, что именно изменилось.

---

## 8. Отчёт

Открой `ОТЧЕТ_практика_15.docx`.

1. Впиши фамилию, группу и вариант.
2. Вставь ссылку на репозиторий вида `https://github.com/ТВОЙ-ЛОГИН/merchania`
3. Под каждый жёлтый абзац «ВСТАВЬ СКРИНШОТ» вставь свою картинку: в Word это Вставка → Рисунки.
4. Сохрани и сдай вместе со ссылкой.

Текст отчёта уже написан под этот проект. Скриншоты подделать нельзя — их делает только твой компьютер после команд выше.

---

## Если снова непонятно

Пришли сюда целиком текст из PowerShell или скрин ошибки. Не присылай пароль от GitHub и не присылай содержимое `.env`, если там настоящий пароль.
