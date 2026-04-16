# TaskFlow

Premium task management app with Supabase backend and beautiful React frontend.

## Features

- **Supabase Auth** - Secure authentication
- **Role-Based Access** - User and Admin roles
- **Task CRUD** - Full task management
- **Real-time** - Powered by Supabase
- **Premium UI** - Dark glassmorphism design with animations

## Tech Stack

**Frontend:** React 18, Vite, Supabase SDK, Framer Motion, Lucide Icons
**Backend:** Supabase (Auth + Database + Auto-generated API)

## Quick Start

### 1. Clone

```bash
git clone https://github.com/Suraj-H675/ProjectAssignment-.git
cd ProjectAssignment-
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 3. Supabase Setup

1. Create project at [supabase.com](https://supabase.com)
2. Go to **Settings** → **API** → Copy **Project URL** and **anon public** key
3. Create `.env` file:
```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```
4. Run this SQL in Supabase SQL Editor:

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

CREATE POLICY "Users can view own tasks" ON tasks FOR SELECT USING (true);
CREATE POLICY "Users can insert own tasks" ON tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own tasks" ON tasks FOR UPDATE USING (true);
CREATE POLICY "Users can delete own tasks" ON tasks FOR DELETE USING (true);
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (true);
```

Frontend: `http://localhost:5173`

## Deployment

### Frontend (Vercel)

```bash
cd frontend
vercel
```

Set environment variables in Vercel:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Architecture

```
Frontend → Supabase (Auth + Database + API)
           No backend server needed!
```

## Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── context/      # Auth context
│   │   ├── lib/         # Supabase client
│   │   ├── pages/       # Auth, Dashboard
│   │   └── App.tsx
│   └── package.json
└── README.md
```

## License

MIT
