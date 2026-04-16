# TaskFlow API

**Live Demo:** [https://frontend-q9rruqoep-suraj-h675s-projects.vercel.app](https://frontend-q9rruqoep-suraj-h675s-projects.vercel.app)

Scalable REST API with JWT Authentication & Role-Based Access Control, featuring a beautiful React frontend.

---

## Backend Architecture (Primary Focus)

This project demonstrates a **production-ready Node.js/Express backend** with modern architectural patterns:

### Tech Stack
- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js with modular routing
- **Database:** PostgreSQL (via Supabase)
- **Authentication:** JWT with bcrypt password hashing
- **API Design:** RESTful with versioned endpoints (`/api/v1/`)

### API Endpoints

#### Authentication (`/api/v1/auth`)
```
POST /api/v1/auth/register   - User registration
POST /api/v1/auth/login      - User login (returns JWT)
GET  /api/v1/auth/profile    - Get current user
PUT  /api/v1/auth/profile    - Update user profile
```

#### Tasks (`/api/v1/tasks`) - Protected routes (JWT required
```
POST   /api/v1/tasks         - Create task
GET    /api/v1/tasks         - Get all tasks
GET    /api/v1/tasks/:id     - Get single task
PUT    /api/v1/tasks/:id     - Update task
DELETE /api/v1/tasks/:id     - Delete task
```

### Security Features
- **JWT Authentication** - Stateless token-based auth
- **Password Hashing** - bcrypt with 12 rounds
- **Input Validation** - express-validator middleware
- **Role-Based Access Control** - User vs Admin roles
- **CORS Protection** - Configured for frontend origins
- **Helmet.js** - Security headers
- **Row Level Security** - Database-level access control

### Backend Project Structure
```
backend/
├── src/
│   ├── config/           # Database & JWT config
│   ├── controllers/      # Auth & Task handlers
│   ├── middleware/       # Auth, validation, errors
│   ├── models/           # User & Task models
│   ├── routes/           # API route definitions
│   └── index.ts          # Express app entry
├── migrations/            # Database schema
└── package.json
```

### Database Schema

**Users Table:**
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| email | VARCHAR(255) | Unique email |
| password | VARCHAR(255) | Bcrypt hashed |
| name | VARCHAR(255) | Display name |
| role | VARCHAR(50) | 'user' or 'admin' |
| createdAt | TIMESTAMP | Creation time |
| updatedAt | TIMESTAMP | Last update |

**Tasks Table:**
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | VARCHAR(200) | Task title |
| description | TEXT | Optional details |
| status | VARCHAR(50) | pending/in_progress/completed |
| priority | VARCHAR(50) | low/medium/high |
| userId | UUID | Foreign key to users |
| createdAt | TIMESTAMP | Creation time |
| updatedAt | TIMESTAMP | Last update |

---

## Features

- **JWT Authentication** - Secure token-based auth
- **Role-Based Access Control** - User and Admin roles
- **Task CRUD** - Full task management
- **API Versioning** - v1 API routes for future-proofing
- **Input Validation** - Sanitized inputs with express-validator
- **Error Handling** - Centralized error middleware
- **Supabase** - Cloud PostgreSQL for data persistence
- **Premium UI** - Dark glassmorphism design with animations

## Quick Start

### 1. Clone

```bash
git clone https://github.com/Suraj-H675/ProjectAssignment-.git
cd ProjectAssignment-
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
JWT_SECRET=your-secret-key-min-32-chars
```

Start backend:
```bash
npm run dev
```

Backend runs on `http://localhost:3000`

### 3. Supabase Database Setup

1. Create project at [supabase.com](https://supabase.com)
2. Go to **Settings** → **API** → Copy credentials
3. Run this SQL in Supabase SQL Editor:

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

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

## Deployment

### Frontend (Vercel)

```bash
cd frontend
vercel
```

### Backend (Railway/Render)

Deploy backend to Railway/Render with environment variables:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `JWT_SECRET`

## Scalability Considerations

This backend is designed for scale:

1. **Stateless JWT** - Horizontal scaling ready
2. **Connection Pooling** - Database connection management
3. **Modular Architecture** - Easy to add new routes/controllers
4. **Supabase** - Managed PostgreSQL with automatic backups
5. **Future Options:**
   - Add Redis caching
   - Load balancer for multiple instances
   - Microservices split (auth service vs task service)

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/       # Supabase, JWT
│   │   ├── controllers/  # Auth, Task
│   │   ├── middleware/  # Auth, validation
│   │   ├── models/      # User, Task
│   │   └── routes/      # API routes
├── frontend/
│   ├── src/
│   │   ├── context/      # Auth context
│   │   ├── lib/         # Supabase client
│   │   ├── pages/       # Auth, Dashboard
│   │   └── App.tsx
└── README.md
```

## License

MIT
