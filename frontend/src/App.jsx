import { Routes, Route } from 'react-router-dom'
import { useEffect, Suspense, lazy } from 'react'
import { Helmet } from 'react-helmet-async'
import AOS from 'aos'
import 'aos/dist/aos.css'
import useScrollToTop from './hooks/useScrollToTop'

// Layout Components
import Layout from './components/layout/Layout'

// Lazy load Public Pages
const Home = lazy(() => import('./pages/Home'))
const Services = lazy(() => import('./pages/Services'))
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'))
const About = lazy(() => import('./pages/About'))
const ProjectsPublic = lazy(() => import('./pages/Projects'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const Testimonials = lazy(() => import('./pages/Testimonials'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogDetailWebDev = lazy(() => import('./pages/blog/BlogDetailWebDev'))
const EcommerceBlog = lazy(() => import('./pages/blog/EcommerceBlog'))
const MobileAppBlog = lazy(() => import('./pages/blog/MobileAppBlog'))
const BlogDetail = lazy(() => import('./pages/blog/BlogDetail'))
const Contact = lazy(() => import('./pages/Contact'))
const FAQ = lazy(() => import('./pages/FAQ'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsConditions = lazy(() => import('./pages/TermsConditions'))
const AiInWebDev = lazy(() => import('./pages/blog/AiInWebDev'))
const BlogDetailMarketingAI = lazy(() => import('./pages/blog/BlogDetailMarketingAI'))
const BlogDetailCloudComputing = lazy(() => import('./pages/blog/BlogDetailCloudComputing'))
const BlogDetailQuantumComputing = lazy(() => import('./pages/blog/BlogDetailQuantumComputing'))
const BlogDetailRemoteWork = lazy(() => import('./pages/blog/BlogDetailRemoteWork'))

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

  return (
    <>
      <Helmet>
        <title>Taliyo Technologies - Top IT Company in India</title>
        <meta name="description" content="Leading IT company in India offering web development, app development, graphic design, and digital marketing services. Based in Delhi, serving clients worldwide." />
        <meta name="keywords" content="IT company, web development, app development, digital marketing, graphic design, Delhi, India" />
        <link rel="canonical" href="https://taliyo.com" />
      </Helmet>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xl text-gray-400">Loading...</div>}>
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
          
          {/* 404 Route */}
          <Route path="*" element={<Layout><div>404 - Page Not Found</div></Layout>} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App 