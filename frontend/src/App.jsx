import { Routes, Route } from 'react-router-dom'
import { useEffect, Suspense, lazy } from 'react'
import { Helmet } from 'react-helmet-async'
import AOS from 'aos'
import 'aos/dist/aos.css'
import useScrollToTop from './hooks/useScrollToTop'

// Layout Components
import Layout from './components/layout/Layout'
import AdminLayout from './components/admin/AdminLayout'
import RequireAuth from './components/auth/RequireAuth'

// Lazy load with preload hints
const lazyWithPreload = (importFn) => {
  const Component = lazy(importFn);
  Component.preload = importFn;
  return Component;
};

// Preload critical pages immediately
const Home = lazyWithPreload(() => import('./pages/Home.jsx'));

// Lazy load other pages with preload
const Services = lazyWithPreload(() => import('./pages/Services.jsx'));
const ServiceDetail = lazyWithPreload(() => import('./pages/ServiceDetail.jsx'));
const About = lazyWithPreload(() => import('./pages/About.jsx'));
const ProjectsPublic = lazyWithPreload(() => import('./pages/Projects.jsx'));
const ProjectDetail = lazyWithPreload(() => import('./pages/ProjectDetail.jsx'));
const Contact = lazyWithPreload(() => import('./pages/Contact.jsx'));

// Lazy load less critical pages
const Testimonials = lazy(() => import('./pages/Testimonials.jsx'));
const Blog = lazy(() => import('./pages/Blog.jsx'));
const BlogDetailWebDev = lazy(() => import('./pages/blog/BlogDetailWebDev.jsx'));
const EcommerceBlog = lazy(() => import('./pages/blog/EcommerceBlog.jsx'));
const MobileAppBlog = lazy(() => import('./pages/blog/MobileAppBlog.jsx'));
const BlogDetail = lazy(() => import('./pages/blog/BlogDetail.jsx'));
const FAQ = lazy(() => import('./pages/FAQ.jsx'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy.jsx'));
const TermsConditions = lazy(() => import('./pages/TermsConditions.jsx'));
const AiInWebDev = lazy(() => import('./pages/blog/AiInWebDev.jsx'));
const BlogDetailMarketingAI = lazy(() => import('./pages/blog/BlogDetailMarketingAI.jsx'));
const BlogDetailCloudComputing = lazy(() => import('./pages/blog/BlogDetailCloudComputing.jsx'));
const BlogDetailQuantumComputing = lazy(() => import('./pages/blog/BlogDetailQuantumComputing.jsx'));
const BlogDetailRemoteWork = lazy(() => import('./pages/blog/BlogDetailRemoteWork.jsx'));

// Lazy load Admin Pages
const Dashboard = lazy(() => import('./pages/admin/Dashboard.jsx'));
const TeamManagement = lazy(() => import('./pages/admin/TeamManagement.jsx'));
const Projects = lazy(() => import('./pages/admin/Projects.jsx'));
const SEO = lazy(() => import('./pages/admin/SEO.jsx'));
const BlogManagement = lazy(() => import('./pages/admin/Blog.jsx'));
const Settings = lazy(() => import('./pages/admin/Settings.jsx'));
const AdminLogin = lazy(() => import('./pages/admin/Login.jsx'));

function App() {
  // Use scroll to top hook
  useScrollToTop()

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100,
    })
  }, [])

  // Preload critical pages on initial load
  useEffect(() => {
    // Preload critical pages in the background
    const preloadCriticalPages = async () => {
      try {
        await Promise.all([
          Home.preload(),
          Services.preload(),
          About.preload(),
          Contact.preload()
        ]);
      } catch (error) {
        console.error('Error preloading pages:', error);
      }
    };
    
    preloadCriticalPages();
  }, []);

  return (
    <>
      <Helmet>
        <title>Taliyo Technologies - Top IT Company in India</title>
        <meta name="description" content="Leading IT company in India offering web development, app development, graphic design, and digital marketing services. Based in Delhi, serving clients worldwide." />
        <meta name="keywords" content="IT company, web development, app development, digital marketing, graphic design, Delhi, India" />
        <link rel="canonical" href="https://taliyo.com" />
        
        {/* Preload critical assets */}
        <link rel="preload" href="/taliyo logo.png" as="image" />
        <link rel="preload" href="/src/assets/hero-bg.jpg" as="image" />
        
        {/* Preconnect to important origins */}
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://api.taliyo.com" />
      </Helmet>
      
      <Suspense fallback={null}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="services" element={<Services />} />
            <Route path="services/:slug" element={<ServiceDetail />} />
            <Route path="about" element={<About />} />
            <Route path="projects" element={<ProjectsPublic />} />
            <Route path="projects/:slug" element={<ProjectDetail />} />
            <Route path="testimonials" element={<Testimonials />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/web-development-trends-2024" element={<BlogDetailWebDev />} />
            <Route path="blog/ecommerce-trends-2024" element={<EcommerceBlog />} />
            <Route path="blog/mobile-app-development-trends-2024" element={<MobileAppBlog />} />
            <Route path="blog/ai-in-web-development-2024" element={<AiInWebDev />} />
            <Route path="blog/digital-marketing-strategies-2024" element={<BlogDetailMarketingAI />} />
            <Route path="blog/cloud-computing-backbone-modern-it" element={<BlogDetailCloudComputing />} />
            <Route path="blog/quantum-computing-revolution-2024" element={<BlogDetailQuantumComputing />} />
            <Route path="blog/remote-work-revolution-2024" element={<BlogDetailRemoteWork />} />
            <Route path="blog/:id" element={<BlogDetail />} />
            <Route path="contact" element={<Contact />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms-conditions" element={<TermsConditions />} />
          </Route>

          {/* Admin Auth Route */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Protected Routes */}
          <Route path="/admin" element={<RequireAuth><AdminLayout /></RequireAuth>}>
            <Route index element={<Dashboard />} />
            <Route path="team" element={<TeamManagement />} />
            <Route path="projects" element={<Projects />} />
            <Route path="seo" element={<SEO />} />
            <Route path="blog" element={<BlogManagement />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<Layout><div>404 - Page Not Found</div></Layout>} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App 