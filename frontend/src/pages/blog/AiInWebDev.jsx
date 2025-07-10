import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Sparkles, Zap, UserCircle } from 'lucide-react';
import authorImg from '../../assets/isha mehra.jpg';

const relatedPosts = [
  {
    title: 'Web Development Trends 2024',
    link: '/blog/web-development-trends-2024',
  },
  {
    title: 'E-commerce Website Development: Complete Guide 2024',
    link: '/blog/ecommerce-trends-2024',
  },
];

const AiInWebDev = () => (
  <>
    <Helmet>
      <title>How AI is Transforming Web Development in 2024 | Taliyo Technologies</title>
      <meta name="description" content="Discover how artificial intelligence is revolutionizing web development in 2024. Learn about AI-powered tools, automation, and the future of building smarter websites." />
      <meta property="og:title" content="How AI is Transforming Web Development in 2024" />
      <meta property="og:description" content="Discover how artificial intelligence is revolutionizing web development in 2024. Learn about AI-powered tools, automation, and the future of building smarter websites." />
      <meta property="og:type" content="article" />
      <link rel="canonical" href="https://taliyotechnologies.com/blog/ai-in-web-development-2024" />
    </Helmet>
    {/* Hero Section */}
    <section className="relative min-h-[45vh] flex items-end justify-center px-4 sm:px-6 lg:px-8 bg-black pt-20 pb-10">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80" alt="AI in Web Development" className="w-full h-full object-cover object-center opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
      </div>
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center px-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-block px-3 py-1 bg-blue-600/80 text-white text-xs rounded-full font-semibold uppercase tracking-wider">AI</span>
          <span className="inline-block px-3 py-1 bg-purple-600/80 text-white text-xs rounded-full font-semibold uppercase tracking-wider">Web Development</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
          How <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AI</span> is Transforming Web Development in 2024
        </h1>
        <div className="flex items-center justify-center gap-4 text-gray-200 text-sm mb-4">
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> April 27, 2024</span>
          <span className="flex items-center gap-1"><UserCircle className="w-4 h-4" /> Isha Mehra</span>
        </div>
        <img src={authorImg} alt="Isha Mehra" className="w-16 h-16 rounded-full border-4 border-white shadow-lg mb-2 object-cover" />
        <p className="text-base text-gray-200 max-w-2xl mx-auto mb-6 leading-relaxed">
          Artificial intelligence is no longer a buzzword—it's a daily reality for web developers. Discover how AI is powering smarter websites, automating workflows, and shaping the future of the web in 2024.
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
            <h2 className="flex items-center gap-2 text-blue-400"><Sparkles className="w-6 h-6 text-purple-400" /> AI-Powered Code & Automation</h2>
            <div className="bg-blue-900/40 border-l-4 border-blue-500 rounded-xl p-4 mb-6">
              <p className="mb-2 font-semibold text-blue-200">AI tools are writing code, finding bugs, and automating repetitive tasks. In 2024, expect:</p>
              <ul>
                <li>AI code assistants (like GitHub Copilot, Tabnine) for faster development</li>
                <li>Automated code reviews and bug detection</li>
                <li>AI-driven test generation and UI testing</li>
              </ul>
            </div>
            <h2 className="flex items-center gap-2 text-blue-400"><Zap className="w-6 h-6 text-yellow-400" /> Smarter User Experiences</h2>
            <div className="bg-yellow-900/40 border-l-4 border-yellow-400 rounded-xl p-4 mb-6">
              <ul>
                <li>Personalized content and recommendations using AI analytics</li>
                <li>Chatbots and virtual assistants for instant support</li>
                <li>Voice and image recognition for accessibility</li>
              </ul>
            </div>
            <h2 className="flex items-center gap-2 text-blue-400"><Sparkles className="w-6 h-6 text-purple-400" /> The Future: AI + Web = Innovation</h2>
            <div className="bg-purple-900/40 border-l-4 border-purple-400 rounded-xl p-4 mb-6">
              <ul>
                <li>AI-generated design and layout suggestions</li>
                <li>Real-time data analysis for smarter business decisions</li>
                <li>AI-powered SEO and content optimization</li>
              </ul>
            </div>
            <blockquote className="border-l-4 border-blue-400 pl-4 italic text-blue-200 bg-blue-900/20 rounded-xl py-2">
              “The future of web development is not just about writing code—it's about collaborating with intelligent systems to build better, faster, and more accessible websites.”
            </blockquote>
          </article>
        </div>
        {/* Sidebar */}
        <aside className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-gray-900 rounded-2xl shadow-xl p-6 mb-8 flex flex-col items-center">
            <img src={authorImg} alt="Isha Mehra" className="w-20 h-20 rounded-full border-4 border-blue-500 shadow mb-3 object-cover" />
            <div className="text-white font-bold text-lg">Isha Mehra</div>
            <div className="text-blue-400 text-sm mb-2">AI & Web Specialist</div>
            <p className="text-gray-300 text-center text-sm mb-2">Exploring the intersection of artificial intelligence and web technology to create smarter digital experiences.</p>
            <div className="flex gap-2 mt-2">
              <span className="inline-block px-3 py-1 bg-blue-600/80 text-white text-xs rounded-full font-semibold">AI</span>
              <span className="inline-block px-3 py-1 bg-purple-600/80 text-white text-xs rounded-full font-semibold">Web</span>
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

export default AiInWebDev; 