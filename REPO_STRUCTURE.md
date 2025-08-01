# Taliyo Technologies - Repository Structure

## Current Structure (Monorepo)
```
taliyo-technologies/
├── frontend/          # React + Vite frontend
├── backend/           # Node.js + Express backend
├── push.bat          # Simple 3-step push script
└── README.md
```

## Recommended Structure (Separate Repos)

### Option 1: Separate Repositories
```
taliyo-frontend/       # Frontend only repo
├── src/
├── public/
├── package.json
├── vite.config.js
├── vercel.json
└── push.bat

taliyo-backend/        # Backend only repo
├── routes/
├── models/
├── package.json
├── index.js
└── push.bat
```

### Option 2: Keep Current Structure (Recommended)
- **Frontend:** Deploy to Vercel
- **Backend:** Deploy to Render/Railway
- **Single Repo:** Easier to manage

## Simple 3-Step Push Process

### Method 1: Using push.bat script
```bash
# Just double-click push.bat or run:
./push.bat
```

### Method 2: Manual commands
```bash
# Step 1: Add files
git add .

# Step 2: Commit changes
git commit -m "Update: $(date)"

# Step 3: Push to main
git push origin main
```

## Deployment URLs
- **Frontend:** https://taliyo-technologies.vercel.app
- **Backend:** https://taliyo-backend.onrender.com

## Quick Commands
```bash
# Build frontend
cd frontend && npm run build

# Start backend
cd backend && npm start

# Push everything
./push.bat
``` 