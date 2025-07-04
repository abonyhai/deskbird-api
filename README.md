# Deskbird API

A modern, secure NestJS backend with JWT authentication, role-based access, refresh tokens, and PostgreSQL. Built for production and ready to serve an Angular frontend.

---

## 🚀 Features
- NestJS + TypeORM + PostgreSQL
- JWT authentication (access & refresh tokens)
- Bcrypt password hashing
- Role-based access control (admin/user)
- Modular, scalable project structure
- Swagger API docs at `/api`
- Docker support for local development
- Database migrations and seeding

---

## 🛠️ Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) (for local DB)

---

## ⚡ Quick Start

### 1. **Clone the repo**
```bash
 git clone <your-repo-url>
 cd deskbird-api
```

### 2. **Configure Environment**
Copy `.env.example` to `.env` and adjust as needed:
```env
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=deskbird
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=3600s
```

### 3. **Start PostgreSQL with Docker**
```bash
docker-compose up -d
```
- This will start a Postgres DB on port 5433 (change in `.env` and `docker-compose.yml` if needed).

### 4. **Install dependencies**
```bash
npm install
```

### 5. **Run Migrations**
```bash
npm run migration:run
```
- This creates the DB schema and seeds an admin user (`admin@deskbird.com` / `admin123`).

### 6. **Start the API**
```bash
npm run start:dev
```
- The API will be available at [http://localhost:3000](http://localhost:3000)
- Swagger docs: [http://localhost:3000/api](http://localhost:3000/api)

---

## 🧪 Testing
- Run all unit tests:
  ```bash
  npm run test
  ```
- Lint and auto-fix:
  ```bash
  npm run lint -- --fix
  ```

---

## 🗝️ Authentication & Usage
- **Login:** `POST /auth/login` with `{ "email": "admin@deskbird.com", "password": "admin123" }`
- **Signup:** `POST /auth/signup`
- **Refresh:** `POST /auth/refresh` (uses httpOnly cookie)
- **Logout:** `POST /auth/logout`
- **All `/users` endpoints require a Bearer token**
- **PATCH/DELETE `/users/:id` require admin role**

---

## 🐳 Docker Compose
- `docker-compose up -d` starts the Postgres DB.
- You can add a service for the API in `docker-compose.yml` for full containerization.

---

## 📝 Project Structure
```
src/
  resources/
    user/
      dto/
      types/
      utils/
      entities/
    auth/
      dto/
      utils/
      types/
  shared/
    decorators/
    guards/
    strategies/
```

---

## 🛡️ Security Notes
- Never commit real secrets to `.env`.
- Use strong JWT secrets in production.
- Always use HTTPS in production for secure cookies.

---

## 📚 API Documentation
- Visit [http://localhost:3000/api](http://localhost:3000/api) for interactive Swagger docs.
- Use the "Authorize" button to test protected endpoints with your JWT.

---

## 👤 Default Admin User
- Email: `admin@deskbird.com`
- Password: `admin123`

---

## 🤝 Contributing
PRs and issues welcome!

---

## 📄 License
MIT
