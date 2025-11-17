# 🚀 Інструкція по розгортанню (Deployment)

## 📋 Зміст
1. [Налаштування доменів](#налаштування-доменів)
2. [Backend налаштування](#backend-налаштування)
3. [Frontend налаштування](#frontend-налаштування)
4. [Варіанти розгортання](#варіанти-розгортання)

---

## Налаштування доменів

### Приклад структури доменів:
- **Frontend**: `https://shoe-factory.com`
- **Backend API**: `https://api.shoe-factory.com`

Або на піддоменах:
- **Frontend**: `https://shop.your-domain.com`
- **Backend API**: `https://shop-api.your-domain.com`

---

## Backend налаштування

### 1. Створіть `.env` файл для production

```bash
cd backend
cp .env.example .env
```

### 2. Відредагуйте `backend/.env`:

```bash
# Production settings
PORT=3001
NODE_ENV=production

# Database configuration
DB_HOST=your-mysql-host.com
DB_PORT=3306
DB_USER=your-db-user
DB_PASSWORD=your-secure-password
DB_NAME=shoe_factory

# JWT Secret (згенеруйте сильний пароль)
JWT_SECRET=your-very-secure-secret-key-here

# Frontend URL (для CORS) - ВАЖЛИВО!
FRONTEND_URL=https://shoe-factory.com
```

### 3. Місця, де вказати backend домен:

#### У файлі `backend/src/index.ts`:
Вже налаштовано! Використовує `process.env.FRONTEND_URL`

```typescript
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
```

---

## Frontend налаштування

### 1. Створіть `.env.production` файл

```bash
cd frontend
cp .env.example .env.production
```

### 2. Відредагуйте `frontend/.env.production`:

```bash
# Production API URL
VITE_API_URL=https://api.shoe-factory.com/api
```

**Замініть `api.shoe-factory.com` на ваш реальний домен backend!**

### 3. Місця, де вказати API URL:

#### У файлі `frontend/src/services/api.ts`:
Вже налаштовано! Використовує `import.meta.env.VITE_API_URL`

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
```

---

## Варіанти розгортання

### Варіант 1: На різних серверах

#### Backend (Node.js сервер):
```bash
cd backend
npm install
npm run build
npm start
```

Або з PM2:
```bash
pm2 start dist/index.js --name shoe-factory-api
```

#### Frontend (статичні файли + Nginx):
```bash
cd frontend
npm install
npm run build
```

Налаштування Nginx для frontend:
```nginx
server {
    listen 80;
    server_name shoe-factory.com;
    root /path/to/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass https://api.shoe-factory.com;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

### Варіант 2: Docker Compose

#### 1. Оновіть `docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
      - FRONTEND_URL=https://shoe-factory.com
    depends_on:
      - mysql
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=https://api.shoe-factory.com/api
    restart: unless-stopped

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: your-password
      MYSQL_DATABASE: shoe_factory
    volumes:
      - mysql_data:/var/lib/mysql
```

#### 2. Запустіть:
```bash
docker-compose up -d
```

---

### Варіант 3: На одному сервері з Nginx

Структура:
- Nginx слухає на порту 80/443
- Backend працює на `localhost:3001`
- Frontend - статичні файли

#### Повна конфігурація Nginx:

```nginx
# Backend API
server {
    listen 80;
    server_name api.shoe-factory.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Frontend
server {
    listen 80;
    server_name shoe-factory.com;
    root /var/www/shoe-factory/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Кешування статичних файлів
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## Варіант 4: Vercel/Netlify (Frontend) + Heroku/Railway (Backend)

### Frontend на Vercel:

1. Підключіть репозиторій до Vercel
2. Налаштування build:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Додайте змінні оточення:
   - `VITE_API_URL` = `https://your-backend.herokuapp.com/api`

### Backend на Heroku:

1. Створіть додаток на Heroku
2. Додайте змінні оточення (Config Vars):
   - `NODE_ENV` = `production`
   - `DB_HOST` = `your-db-host`
   - `DB_USER` = `your-db-user`
   - `DB_PASSWORD` = `your-db-password`
   - `FRONTEND_URL` = `https://your-frontend.vercel.app`
3. Deploy:
```bash
cd backend
git push heroku main
```

---

## 🔐 SSL сертифікати (HTTPS)

### Для Nginx (Let's Encrypt):
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d shoe-factory.com -d api.shoe-factory.com
```

---

## 📝 Чеклист перед deployment

### Backend:
- [ ] Налаштовано `.env` з правильними значеннями
- [ ] Вказано `FRONTEND_URL` для CORS
- [ ] Налаштовано підключення до production MySQL
- [ ] Змінено `JWT_SECRET` на сильний пароль
- [ ] Запущено міграції: `npm run migrate`
- [ ] Заповнено тестові дані (опціонально): `npm run seed`

### Frontend:
- [ ] Створено `.env.production` з `VITE_API_URL`
- [ ] `VITE_API_URL` вказує на правильний backend домен
- [ ] Виконано build: `npm run build`
- [ ] Перевірено, що всі API запити йдуть на правильний URL

### Сервер:
- [ ] Налаштовано Nginx/reverse proxy
- [ ] Встановлено SSL сертифікати
- [ ] Налаштовано firewall
- [ ] Налаштовано автоматичний перезапуск (PM2/systemd)

---

## 🧪 Тестування після deployment

1. Перевірте backend API:
```bash
curl https://api.shoe-factory.com/api/health
```

Відповідь:
```json
{"status":"OK","message":"Shoe Factory API is running"}
```

2. Відкрийте frontend у браузері:
```
https://shoe-factory.com
```

3. Перевірте у Developer Tools → Network:
   - Всі API запити мають йти на правильний backend URL
   - Перевірте CORS headers

---

## ❗ Важливі примітки

1. **CORS**: Backend повинен знати frontend URL! Вкажіть `FRONTEND_URL` у backend `.env`

2. **API URL**: Frontend повинен знати backend URL! Вкажіть `VITE_API_URL` у frontend `.env.production`

3. **База даних**: Не використовуйте локальну базу для production! Використовуйте окремий MySQL сервер.

4. **Безпека**:
   - Ніколи не комітьте `.env` файли
   - Використовуйте сильні паролі
   - Завжди використовуйте HTTPS
   - Налаштуйте rate limiting

5. **Змінні оточення**:
   - Development: автоматично використовує `.env.development`
   - Production: використовує `.env.production` або системні змінні

---

## 📞 Підтримка

Якщо виникли проблеми:
1. Перевірте логи: `pm2 logs` або `docker logs`
2. Перевірте підключення до бази даних
3. Перевірте CORS налаштування
4. Перевірте, чи правильно вказані URL у змінних оточення
