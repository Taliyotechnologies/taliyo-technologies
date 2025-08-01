# Taliyo Technologies Website

A modern, responsive website for Taliyo Technologies featuring a comprehensive blog system and contact management.

## 🚀 Features

### Public Features
- **Responsive Design**: Modern, mobile-first design
- **Blog System**: Dynamic blog posts with categories and tags
- **Contact Form**: Lead generation with status tracking
- **Services Showcase**: Detailed service pages
- **Project Portfolio**: Project management and display
- **Team Management**: Team member profiles and task tracking



## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Framer Motion** for animations
- **React Query** for data fetching
- **React Hook Form** for forms
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Nodemailer** for email functionality
- **Socket.IO** for real-time features
- **bcryptjs** for password hashing

## 📁 Project Structure

```
taliyo-technologies/
├── backend/                 # Backend API server
│   ├── index.js            # Main server file
│   ├── package.json        # Backend dependencies
│   ├── railway.json        # Railway deployment config
│   └── env.example         # Environment variables template
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   └── services/       # API services
│   ├── package.json        # Frontend dependencies
│   ├── vite.config.js      # Vite configuration
│   ├── vercel.json         # Vercel deployment config
│   └── env.example         # Environment variables template
├── DEPLOYMENT.md           # Detailed deployment guide
├── deploy.sh              # Deployment script
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 16.0.0
- npm or yarn
- MongoDB (local or Atlas)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd taliyo-technologies
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Backend
   cd backend
   cp env.example .env
   # Edit .env with your configuration
   
   # Frontend
   cd ../frontend
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development servers**
   ```bash
   # Start backend (from backend directory)
   npm run dev
   
   # Start frontend (from frontend directory)
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🚀 Deployment

### Quick Deployment

Run the deployment script to check if everything is ready:
```bash
chmod +x deploy.sh
./deploy.sh
```

### Manual Deployment

#### Backend (Railway)
1. Push code to GitHub
2. Go to [railway.app](https://railway.app)
3. Create new project from GitHub repo
4. Select `backend` folder
5. Set environment variables (see `backend/env.example`)
6. Deploy

#### Frontend (Vercel)
1. Go to [vercel.com](https://vercel.com)
2. Create new project from GitHub repo
3. Set root directory to `frontend`
4. Set environment variables (see `frontend/env.example`)
5. Deploy

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 🔧 Configuration

### Environment Variables

#### Backend (Railway)
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taliyo
JWT_SECRET=your-super-secret-jwt-key
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=https://your-frontend-domain.vercel.app
NODE_ENV=production
```

#### Frontend (Vercel)
```env
VITE_API_URL=https://your-backend-domain.railway.app
VITE_FRONTEND_URL=https://your-frontend-domain.vercel.app
VITE_NODE_ENV=production
```



## 📊 Features Overview

### Public Pages
- **Home**: Landing page with services overview
- **About**: Company information and team
- **Services**: Detailed service offerings
- **Projects**: Portfolio showcase
- **Blog**: Articles and insights
- **Contact**: Contact form and information



## 🔒 Security Features

- **CORS Protection**: Configured for production domains
- **Input Validation**: Server-side validation
- **Rate Limiting**: Protection against abuse

## 📱 Responsive Design

The website is fully responsive and optimized for:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## 🚀 Performance Optimizations

- **Code Splitting**: Automatic chunk splitting
- **Image Optimization**: Optimized images and lazy loading
- **Caching**: Browser and CDN caching
- **Compression**: Gzip compression enabled
- **PWA Ready**: Progressive Web App features

## 🛠️ Development

### Available Scripts

#### Backend
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run build      # Build check (no build step required)
```

#### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues
```

### Code Style
- ESLint configuration included
- Prettier formatting
- Consistent naming conventions
- Component-based architecture

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary to Taliyo Technologies.

## 📞 Support

For support and questions:
- Email: support@taliyotechnologies.com
- Website: https://taliyotechnologies.com

---

**Built with ❤️ by Taliyo Technologies** 