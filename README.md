# Taliyo Technologies Frontend

A modern, responsive website for Taliyo Technologies featuring a comprehensive blog system and contact management.

## 🚀 Features

### Public Features
- **Responsive Design**: Modern, mobile-first design
- **Blog System**: Dynamic blog posts with categories and tags
- **Contact Form**: Lead generation with status tracking
- **Services Showcase**: Detailed service pages
- **Project Portfolio**: Project management and display
- **Newsletter Subscription**: Email subscription functionality

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Framer Motion** for animations
- **React Query** for data fetching
- **React Hook Form** for forms
- **Lucide React** for icons

## 📁 Project Structure

```
taliyo-frontend/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/          # Page components (public only)
│   ├── contexts/       # React contexts
│   ├── hooks/          # Custom hooks
│   └── services/       # API services
├── package.json        # Frontend dependencies
├── vite.config.js      # Vite configuration
└── README.md          # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd taliyo-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🎯 Deployment

This project is configured for deployment on Vercel with automatic builds and deployments.

### Environment Variables

Set these in your Vercel dashboard:

```
VITE_API_URL=https://taliyo-backend.onrender.com
VITE_FRONTEND_URL=https://taliyo-frontend.onrender.com
```

## 📝 Notes

- **Clean version**: This is a clean public website without any admin functionality
- **Public only**: All admin pages and functionality have been removed
- **UI/UX unchanged**: Website appearance and user experience remain the same

---

**Built with ❤️ by Taliyo Technologies** 