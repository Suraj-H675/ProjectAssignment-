# TaskFlow API

Scalable REST API with JWT Authentication & Role-Based Access Control, featuring a beautiful React frontend.

## Features

- **JWT Authentication** - Secure token-based auth
- **Role-Based Access Control** - User and Admin roles
- **Task CRUD** - Full task management
- **API Versioning** - v1 API routes
- **Supabase** - Cloud PostgreSQL
- **Premium UI** - Dark glassmorphism design with animations

## Tech Stack

**Backend:** Node.js, Express, TypeScript, Supabase, JWT, bcrypt
**Frontend:** React 18, Vite, Framer Motion, Lucide Icons

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/Suraj-H675/ProjectAssignment-.git
cd ProjectAssignment-
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

### 2. Supabase Setup

1. Create project at [supabase.com](https://supabase.com)
2. Go to **Settings** → **API**
3. Copy **Project URL** and **anon public** key

### 3. Backend Setup

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
JWT_SECRET=your-secret-key-min-32-chars
```

Run SQL in Supabase SQL Editor:
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  priority VARCHAR(50) NOT NULL DEFAULT 'medium',
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);
```

Start backend:
```bash
cd backend
npm run dev
```

### 4. Frontend Setup

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173`
Backend runs on `http://localhost:3000`

## API Endpoints

### Authentication
```
POST /api/v1/auth/register  - Register
POST /api/v1/auth/login     - Login
GET  /api/v1/auth/profile   - Get profile
PUT  /api/v1/auth/profile   - Update profile
```

### Tasks (requires JWT)
```
POST   /api/v1/tasks      - Create task
GET    /api/v1/tasks      - Get all tasks
GET    /api/v1/tasks/:id  - Get task
PUT    /api/v1/tasks/:id  - Update task
DELETE /api/v1/tasks/:id  - Delete task
```

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/       # Supabase, JWT
│   │   ├── controllers/  # Auth, Task
│   │   ├── middleware/   # Auth, validation
│   │   ├── models/      # User, Task
│   │   └── routes/      # API routes
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── context/      # Auth context
│   │   ├── pages/       # Auth, Dashboard
│   │   └── App.tsx
│   └── package.json
└── README.md
```

## Deployment

**Frontend:** Deploy frontend folder to Vercel

**Backend:** Deploy to Railway/Render with env variables

## License

MIT
