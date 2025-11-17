# ⚡ Швидке налаштування доменів

## 📍 Куди вставляти домени

### 1️⃣ Backend - файл `backend/.env`

```bash
# Ваш backend домен (наприклад: https://api.your-domain.com)
PORT=3001
NODE_ENV=production

# База даних
DB_HOST=shoefactory-maindb-xnqknj
DB_PORT=3306
DB_USER=mysql
DB_PASSWORD=jomlhltwodv03ccx
DB_NAME=shoe_factory

# ВАЖЛИВО! Тут вказуємо домен FRONTEND для CORS
FRONTEND_URL=https://your-frontend-domain.com
```

**Приклади FRONTEND_URL:**
- `https://shoe-factory.com`
- `https://my-shop.com`
- `http://localhost:3000` (для локальної розробки)

---

### 2️⃣ Frontend - файл `frontend/.env.production`

```bash
# Тут вказуємо URL вашого BACKEND API
VITE_API_URL=https://api.your-backend-domain.com/api
```

**Приклади VITE_API_URL:**
- `https://api.shoe-factory.com/api`
- `https://backend.my-shop.com/api`
- `https://my-backend-server.herokuapp.com/api`

---

## 📋 Швидкий старт

### Крок 1: Налаштуйте Backend
```bash
cd backend
cp .env.example .env
nano .env  # відредагуйте файл
```

Замініть:
- `FRONTEND_URL=...` на ваш frontend домен

### Крок 2: Налаштуйте Frontend
```bash
cd frontend
cp .env.example .env.production
nano .env.production  # відредагуйте файл
```

Замініть:
- `VITE_API_URL=...` на ваш backend API URL

### Крок 3: Запустіть
```bash
# Backend
cd backend
npm install
npm run build
npm start

# Frontend
cd frontend
npm install
npm run build
```

---

## 🌐 Приклади конфігурацій

### Приклад 1: Окремі піддомени
```
Frontend: https://shop.mycompany.com
Backend:  https://api.mycompany.com
```

**backend/.env:**
```bash
FRONTEND_URL=https://shop.mycompany.com
```

**frontend/.env.production:**
```bash
VITE_API_URL=https://api.mycompany.com/api
```

---

### Приклад 2: Головний домен + піддомен API
```
Frontend: https://myshop.com
Backend:  https://api.myshop.com
```

**backend/.env:**
```bash
FRONTEND_URL=https://myshop.com
```

**frontend/.env.production:**
```bash
VITE_API_URL=https://api.myshop.com/api
```

---

### Приклад 3: Vercel + Heroku
```
Frontend: https://my-shop.vercel.app
Backend:  https://my-backend.herokuapp.com
```

**backend/.env (на Heroku в Config Vars):**
```bash
FRONTEND_URL=https://my-shop.vercel.app
```

**frontend/.env.production (в Vercel Environment Variables):**
```bash
VITE_API_URL=https://my-backend.herokuapp.com/api
```

---

## ❗ Важливо

1. **Завжди вказуйте повний URL з протоколом:**
   - ✅ `https://api.example.com`
   - ❌ `api.example.com`

2. **Backend API URL повинен мати `/api` в кінці:**
   - ✅ `https://api.example.com/api`
   - ❌ `https://api.example.com`

3. **Не забудьте про HTTPS на production!**

4. **Файли `.env` не комітяться в Git** - це нормально!

---

## 🆘 Перевірка

Після налаштування перевірте:

1. **Backend працює:**
```bash
curl https://your-backend-domain.com/api/health
```

Має повернути: `{"status":"OK","message":"Shoe Factory API is running"}`

2. **Frontend підключається:**
- Відкрийте свій сайт
- Натисніть F12 → Network
- Перевірте, що запити йдуть на правильний backend URL

---

## 📖 Детальна інструкція

Для детальної інструкції по deployment дивіться: **[DEPLOYMENT.md](./DEPLOYMENT.md)**
