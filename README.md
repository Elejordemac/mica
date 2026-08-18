# Baby Shower Guest Registration Website

A beautiful blue-themed baby shower invitation and guest registration website.

## Project Structure

```
baby-shower-website/
├── frontend/          # React + TypeScript + Vite
│   ├── src/
│   │   ├── api/       # API client layer
│   │   ├── components/# Reusable UI components
│   │   ├── pages/     # Route pages
│   │   └── styles/    # Global CSS
│   └── public/        # Static assets
└── backend/           # Node.js + Express + TypeScript
    └── src/
        ├── routes/    # API routes
        ├── middleware/# Auth middleware
        └── services/  # Validation service
```

## Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Backend Setup

1. Navigate to backend:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file (copy from `.env.example`):
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/baby_shower
   JWT_SECRET=any-random-secret-string
   ADMIN_PASSWORD=micamicamica
   PORT=3001
   FRONTEND_URL=http://localhost:5173
   ```

4. Run the migration SQL against your database:
   ```bash
   psql $DATABASE_URL -f migration.sql
   ```

5. Start the dev server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to frontend:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```
   VITE_API_URL=http://localhost:3001
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:5173

## Deployment

### Step 1: Deploy Backend to Render

1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repo (or push this code to GitHub first)
4. Set the root directory to `backend`
5. Configure:
   - Build Command: `npm install && npx tsc`
   - Start Command: `node dist/index.js`
6. Add environment variables:
   - `DATABASE_URL` — your PostgreSQL connection string
   - `JWT_SECRET` — any random string (e.g., `mysecretkey12345`)
   - `ADMIN_PASSWORD` — `micamicamica`
   - `PORT` — `3001`
   - `FRONTEND_URL` — your Vercel URL (add after deploying frontend)
7. Deploy!

### Step 2: Create PostgreSQL Database

On Render:
1. Click "New +" → "PostgreSQL"
2. Pick a name and create it
3. Copy the "External Database URL" 
4. Paste it as the `DATABASE_URL` env var on your backend service
5. Connect to the database and run `migration.sql`

### Step 3: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New" → "Project"
3. Import your GitHub repo
4. Set the root directory to `frontend`
5. Add environment variable:
   - `VITE_API_URL` = your Render backend URL (e.g., `https://baby-shower-backend.onrender.com`)
6. Deploy!

### Step 4: Update CORS

After both are deployed, update the `FRONTEND_URL` env var on Render to your actual Vercel URL.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Invitation + RSVP form |
| `/guests` | Public guest list |
| `/wishlist` | Gift registry link |
| `/admin` | Admin panel (password: micamicamica) |

## Admin Login

- URL: `yoursite.com/admin`
- Password: `micamicamica`
