# Deskbird API

A modern, production-ready NestJS backend for user management, authentication, and role-based access, designed to power a secure web application.

---

## 🚀 Features

- **NestJS** with modular, scalable architecture
- **TypeORM** with PostgreSQL
- **JWT authentication** (access & refresh tokens)
- **Bcrypt** password hashing
- **Role-based access control** (`admin`/`user`)
- **Swagger API docs** at `/api`
- **Docker** support for local development
- **Database migrations** and optional user seeding
- **Global error handling** and custom exceptions

---

## 🛠️ Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) (for local DB)
- PostgreSQL (local or cloud)

---

## ⚡ Quick Start

### 1. **Clone the repo**

```bash
git clone https://github.com/abonyhai/deskbird-api.git
cd deskbird-api
```

### 2. **Configure Environment**

Copy `.env-local` or `.env-deployed` as needed. Example for local development:

```env
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=deskbird
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=3600s
DATABASE_SSL=false
```

For production, set `DATABASE_SSL=true` and use your cloud DB credentials.

### 3. **Start PostgreSQL with Docker**

```bash
docker-compose up -d
```

- This starts a Postgres DB on port 5433 (change in `.env` and `docker-compose.yml` if needed).

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
    exceptions/
    interceptors/
    config/
```

---

## 🗝️ Authentication & Usage

- **Login:** `POST /auth/login` with `{ "email": "admin@deskbird.com", "password": "admin123" }`
- **Signup:** `POST /auth/signup`
- **Refresh:** `POST /auth/refresh` (uses httpOnly cookie)
- **Logout:** `POST /auth/logout`
- **All `/users` endpoints require a Bearer token**
- **PATCH/DELETE `/users/:id` require admin role**
- **Get current user:** `GET /auth/me` (requires Bearer token)

---

## 👤 Roles & Access

- All users have a `role` field: either `user` or `admin`.
- Admins are just users with `role: 'admin'`.
- Use the `@Roles('admin')` decorator to protect endpoints for admins only.
- The `RolesGuard` enforces role-based access.

---

## 🧪 Testing & Linting

- Run all unit tests:
  ```bash
  npm run test
  ```
- Lint and auto-fix:
  ```bash
  npm run lint -- --fix
  ```

---

## 🗃️ Database & Seeding

- Migrations are managed with TypeORM. Run with:
  ```bash
  npm run migration:run
  ```
- The initial migration seeds a default admin user.
- **User seeding endpoint:**
  - There is a `/users/seed` endpoint (POST) that can generate 98 random users and 2 random admins for testing/demo purposes.
  - **This endpoint is commented out/disabled by default for security.**
  - To enable, uncomment the endpoint in `src/resources/user/user.controller.ts`.

---

## 📚 API Documentation

- Visit [http://localhost:3000/api](http://localhost:3000/api) for interactive Swagger docs.
- Use the "Authorize" button to test protected endpoints with your JWT.

---

## 🛡️ Security Notes

- Never commit real secrets to `.env`.
- Use strong JWT secrets in production.
- Always use HTTPS in production for secure cookies.
- Set `DATABASE_SSL=true` for production cloud DBs.

---

## 🧩 Error Handling

- All errors are handled with custom exceptions and meaningful error codes.
- See `src/shared/exceptions/` for details.

---

## 🤝 Contributing

PRs and issues welcome!

---

## 👤 Author

Andrei Bonyhai <andreibonyhai@gmail.com>

---

## 📄 License

MIT
