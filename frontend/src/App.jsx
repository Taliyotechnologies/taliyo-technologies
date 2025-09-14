import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, Suspense, lazy } from 'react'
import { Helmet } from 'react-helmet-async'
import useAppearance from './hooks/useAppearance'
import useTheme from './hooks/useTheme'
import AOS from 'aos'
import 'aos/dist/aos.css'
import useScrollToTop from './hooks/useScrollToTop'
import useAnalyticsTracker from './hooks/useAnalyticsTracker'

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
const ErrorPage = lazy(() => import('./pages/ErrorPage.jsx'));
const Blog = lazy(() => import('./pages/Blog.jsx'));
const BlogDetailWebDev = lazy(() => import('./pages/blog/BlogDetailWebDev.jsx'));
const EcommerceBlog = lazy(() => import('./pages/blog/EcommerceBlog.jsx'));
const MobileAppBlog = lazy(() => import('./pages/blog/MobileAppBlog.jsx'));
const BlogDetail = lazy(() => import('./pages/blog/BlogDetail.jsx'));
const BlogPost = lazy(() => import('./pages/blog/Post.jsx'));
const FAQ = lazy(() => import('./pages/FAQ.jsx'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy.jsx'));
const TermsConditions = lazy(() => import('./pages/TermsConditions.jsx'));
const AiInWebDev = lazy(() => import('./pages/blog/AiInWebDev.jsx'));
const BlogDetailMarketingAI = lazy(() => import('./pages/blog/BlogDetailMarketingAI.jsx'));
const BlogDetailCloudComputing = lazy(() => import('./pages/blog/BlogDetailCloudComputing.jsx'));
const BlogDetailQuantumComputing = lazy(() => import('./pages/blog/BlogDetailQuantumComputing.jsx'));
const BlogDetailRemoteWork = lazy(() => import('./pages/blog/BlogDetailRemoteWork.jsx'));
const SEOLanding = lazy(() => import('./pages/SEOLanding.jsx'));

// Lazy load Admin Pages
const Dashboard = lazy(() => import('./pages/admin/Dashboard.jsx'));
const TeamManagement = lazy(() => import('./pages/admin/TeamManagement.jsx'));
const Projects = lazy(() => import('./pages/admin/Projects.jsx'));
const SEO = lazy(() => import('./pages/admin/SEO.jsx'));
const BlogManagement = lazy(() => import('./pages/admin/Blog.jsx'));
const Settings = lazy(() => import('./pages/admin/Settings.jsx'));
const AdminLogin = lazy(() => import('./pages/admin/Login.jsx'));
const ContactsAdmin = lazy(() => import('./pages/admin/Contacts.jsx'));
const SubscribersAdmin = lazy(() => import('./pages/admin/Subscribers.jsx'));
const Analytics = lazy(() => import('./pages/admin/Analytics.jsx'));

function App() {
  // Use scroll to top hook
  useScrollToTop()
  // Track page views
  useAnalyticsTracker()
  // Apply theme (dark/light/auto) globally
  useTheme()
  // Apply appearance (font size, compact, contrast, reduced motion) globally
  useAppearance()

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
        <link rel="canonical" href="https://taliyotechnologies.com" />
        
        {/* Preload critical assets */}
        {/** Removed unused image preload to avoid console warnings */}
        
        {/* Preconnect to important origins */}
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://api.taliyotechnologies.com" />
      </Helmet>
      <Suspense fallback={<div className="min-h-[50vh]" />}>
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
            <Route path="blog/:slug" element={<BlogPost />} />
            <Route path="contact" element={<Contact />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms-conditions" element={<TermsConditions />} />
            {/* SEO Landing Pages */}
            <Route path="solutions/:slug" element={<SEOLanding />} />
            {/* 404 inside layout so header/footer stay visible */}
            <Route path="*" element={<ErrorPage status={404} />} />
          </Route>

          {/* 404 for admin routes */}
          <Route path="/admin/*" element={<ErrorPage status={404} title="Admin Page Not Found" message="The admin page you are looking for doesn't exist or you don't have permission to access it." />} />

          {/* Admin Auth Route */}
          <Route
            path="/admin/login"
            element={
              <Suspense fallback={<div className="min-h-[50vh]" />}> 
                <AdminLogin />
              </Suspense>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <Suspense fallback={<div className="min-h-[50vh]" />}> 
                <RequireAuth><AdminLayout /></RequireAuth>
              </Suspense>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="team" element={<TeamManagement />} />
            <Route path="projects" element={<Projects />} />
            <Route path="seo" element={<SEO />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="blog" element={<BlogManagement />} />
            <Route path="contacts" element={<ContactsAdmin />} />
            <Route path="subscribers" element={<SubscribersAdmin />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* Catch-all route for any other unmatched paths */}
          <Route path="*" element={
            <Layout>
              <ErrorPage status={404} />
            </Layout>
          } />
        </Routes>
      </Suspense>
    </>
  )
}

export default App 