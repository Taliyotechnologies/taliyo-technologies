import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Sparkles, TrendingUp, ShieldCheck, Zap, UserCheck, UserCircle } from 'lucide-react';
import authorImg from '../../assets/isha mehra.jpg'; // Example author image

const relatedPosts = [
  {
    title: 'E-commerce Website Development: Complete Guide 2024',
    link: '/blog/ecommerce-trends-2024',
  },
  {
    title: 'Mobile App Development Companies in India 2024',
    link: '/blog/mobile-app-development-trends-2024',
  },
];

const BlogDetailWebDev = () => (
  <>
    <Helmet>
      <title>Web Development Trends 2024 | Taliyo Technologies</title>
      <meta name="description" content="Explore the top web development trends for 2024, including AI, frameworks, performance, security, and UX best practices." />
      <meta property="og:title" content="Web Development Trends 2024" />
      <meta property="og:description" content="Explore the top web development trends for 2024, including AI, frameworks, performance, security, and UX best practices." />
      <meta property="og:type" content="article" />
      <link rel="canonical" href="https://taliyotechnologies.com/blog/web-development-trends-2024" />
    </Helmet>
    {/* Hero Section */}
    <section className="relative min-h-[45vh] flex items-end justify-center px-4 sm:px-6 lg:px-8 bg-black pt-20 pb-10">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80" alt="Web Development" className="w-full h-full object-cover object-center opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
      </div>
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center px-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-block px-3 py-1 bg-blue-600/80 text-white text-xs rounded-full font-semibold uppercase tracking-wider">Web Development</span>
          <span className="inline-block px-3 py-1 bg-purple-600/80 text-white text-xs rounded-full font-semibold uppercase tracking-wider">2024</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
          Web Development <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Trends 2024</span>
        </h1>
        <div className="flex items-center justify-center gap-4 text-gray-200 text-sm mb-4">
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Jan 10, 2024</span>
          <span className="flex items-center gap-1"><UserCircle className="w-4 h-4" /> Isha Mehra</span>
        </div>
        <img src={authorImg} alt="Isha Mehra" className="w-16 h-16 rounded-full border-4 border-white shadow-lg mb-2 object-cover" />
        <p className="text-base text-gray-200 max-w-2xl mx-auto mb-6 leading-relaxed">
          Discover the most exciting and impactful trends shaping the future of web development. From AI-powered tools to next-gen frameworks, 2024 is set to be a landmark year for developers and businesses alike.
        </p>
        <Link to="/blog" className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-all mb-2">
          <ArrowLeft className="w-4 h-4" /> Back to Blogs
        </Link>
      </div>
    </section>
    {/* Main Content + Sidebar */}
    <section className="bg-gray-950 py-12 px-2">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">
        {/* Main Content Card */}
        <div className="flex-1 bg-gray-900 rounded-3xl shadow-2xl p-8 lg:p-12 mb-10 lg:mb-0">
          <article className="prose prose-invert prose-lg max-w-none text-white/90" style={{ lineHeight: 1.8, letterSpacing: '0.01em' }}>
            <h2 className="flex items-center gap-2 text-blue-400"><Sparkles className="w-6 h-6 text-purple-400" /> AI & Automation Everywhere</h2>
            <div className="bg-blue-900/40 border-l-4 border-blue-500 rounded-xl p-4 mb-6">
              <p className="mb-2 font-semibold text-blue-200">AI is now a daily tool for web developers. In 2024, expect:</p>
              <ul>
                <li>AI-powered code completion and bug detection</li>
                <li>Automated UI testing and accessibility checks</li>
                <li>Personalized user experiences using AI-driven analytics</li>
                <li>Chatbots and virtual assistants on business sites</li>
              </ul>
            </div>
            <h2 className="flex items-center gap-2 text-blue-400"><Zap className="w-6 h-6 text-yellow-400" /> Next-Gen Frameworks</h2>
            <div className="bg-yellow-900/40 border-l-4 border-yellow-400 rounded-xl p-4 mb-6">
              <ul>
                <li>React Server Components for dynamic UIs</li>
                <li>Next.js 14, Remix, Astro, SvelteKit</li>
                <li>TypeScript as the default for new projects</li>
              </ul>
            </div>
            <h2 className="flex items-center gap-2 text-blue-400"><TrendingUp className="w-6 h-6 text-blue-400" /> Performance is King</h2>
            <div className="bg-blue-900/40 border-l-4 border-blue-400 rounded-xl p-4 mb-6">
              <ul>
                <li>Optimizing Core Web Vitals (LCP, FID, CLS)</li>
                <li>Edge computing and serverless for global speed</li>
                <li>Image and asset optimization (AVIF, lazy loading, etc.)</li>
                <li>PWAs for app-like feel</li>
              </ul>
            </div>
            <h2 className="flex items-center gap-2 text-blue-400"><ShieldCheck className="w-6 h-6 text-green-400" /> Security & Privacy by Design</h2>
            <div className="bg-green-900/40 border-l-4 border-green-400 rounded-xl p-4 mb-6">
              <ul>
                <li>Zero-trust architectures and strong authentication</li>
                <li>Automatic HTTPS, CSP, secure cookies</li>
                <li>GDPR and privacy-first analytics</li>
                <li>Regular dependency audits</li>
              </ul>
            </div>
            <h2 className="flex items-center gap-2 text-blue-400"><UserCheck className="w-6 h-6 text-pink-400" /> UX & Accessibility for All</h2>
            <div className="bg-pink-900/40 border-l-4 border-pink-400 rounded-xl p-4 mb-6">
              <ul>
                <li>Accessible color schemes and keyboard navigation</li>
                <li>Dark mode and user theme preferences</li>
                <li>Micro-interactions and smooth animations</li>
                <li>Content that’s easy to scan and understand</li>
              </ul>
            </div>
          </article>
        </div>
        {/* Sidebar */}
        <aside className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-gray-900 rounded-2xl shadow-xl p-6 mb-8 flex flex-col items-center">
            <img src={authorImg} alt="Isha Mehra" className="w-20 h-20 rounded-full border-4 border-blue-500 shadow mb-3 object-cover" />
            <div className="text-white font-bold text-lg">Isha Mehra</div>
            <div className="text-blue-400 text-sm mb-2">Lead Web Developer</div>
            <p className="text-gray-300 text-center text-sm mb-2">Passionate about building modern, scalable web solutions and sharing the latest tech trends.</p>
            <div className="flex gap-2 mt-2">
              <span className="inline-block px-3 py-1 bg-blue-600/80 text-white text-xs rounded-full font-semibold">Web</span>
              <span className="inline-block px-3 py-1 bg-purple-600/80 text-white text-xs rounded-full font-semibold">2024</span>
            </div>
          </div>
          <div className="bg-gray-900 rounded-2xl shadow-xl p-6">
            <div className="text-white font-bold text-lg mb-3">Related Posts</div>
            <ul className="space-y-3">
              {relatedPosts.map((post) => (
                <li key={post.link}>
                  <Link to={post.link} className="text-blue-400 hover:underline font-medium">
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
      <div className="text-center mt-12">
        <Link to="/blog" className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400">
          <ArrowLeft className="w-4 h-4 inline-block mr-2" /> Back to Blogs
        </Link>
      </div>
    </section>
  </>
);

export default BlogDetailWebDev; 