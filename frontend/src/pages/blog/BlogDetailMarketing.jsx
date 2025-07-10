import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Star, TrendingUp, CheckCircle, Globe, UserCircle } from 'lucide-react';
import authorImg from '../../assets/md aman.jpeg';

const relatedPosts = [
  {
    title: 'E-commerce Website Development Trends 2024',
    link: '/blog/ecommerce-trends-2024',
  },
  {
    title: 'AI in Web Development 2024',
    link: '/blog/ai-in-web-development-2024',
  },
];

const BlogDetailMarketing = () => (
  <>
    <Helmet>
      <title>Digital Marketing Strategies for Startups 2024 | Taliyo Technologies</title>
      <meta name="description" content="Discover the most effective digital marketing strategies for startups in 2024. Learn about SEO, content, social media, and growth tactics to boost your business." />
      <meta property="og:title" content="Digital Marketing Strategies for Startups 2024" />
      <meta property="og:description" content="Discover the most effective digital marketing strategies for startups in 2024. Learn about SEO, content, social media, and growth tactics to boost your business." />
      <meta property="og:type" content="article" />
      <link rel="canonical" href="https://taliyotechnologies.com/blog/digital-marketing-strategies-2024" />
    </Helmet>
    {/* Hero Section */}
    <section className="relative min-h-[45vh] flex items-end justify-center px-4 sm:px-6 lg:px-8 bg-black pt-20 pb-10">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80" alt="Digital Marketing" className="w-full h-full object-cover object-center opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
      </div>
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center px-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-block px-3 py-1 bg-pink-600/80 text-white text-xs rounded-full font-semibold uppercase tracking-wider">Marketing</span>
          <span className="inline-block px-3 py-1 bg-blue-600/80 text-white text-xs rounded-full font-semibold uppercase tracking-wider">2024</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
          Digital Marketing <span className="bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">Strategies for Startups 2024</span>
        </h1>
        <div className="flex items-center justify-center gap-4 text-gray-200 text-sm mb-4">
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> April 27, 2024</span>
          <span className="flex items-center gap-1"><UserCircle className="w-4 h-4" /> Md Aman</span>
        </div>
        <img src={authorImg} alt="Md Aman" className="w-16 h-16 rounded-full border-4 border-white shadow-lg mb-2 object-cover" />
        <p className="text-base text-gray-200 max-w-2xl mx-auto mb-6 leading-relaxed">
          Startups need smart, cost-effective marketing to grow fast. Discover the latest digital marketing strategies, tools, and real-world tactics to help your business stand out in 2024.
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
            <h2 className="flex items-center gap-2 text-pink-400"><Star className="w-6 h-6 text-pink-400" /> SEO: The Foundation</h2>
            <div className="bg-pink-900/40 border-l-4 border-pink-400 rounded-xl p-4 mb-6">
              <ul>
                <li>Optimize your website for speed, mobile, and keywords</li>
                <li>Write high-quality, helpful content for your audience</li>
                <li>Build backlinks from reputable sources</li>
              </ul>
            </div>
            <h2 className="flex items-center gap-2 text-blue-400"><TrendingUp className="w-6 h-6 text-blue-400" /> Content Marketing</h2>
            <div className="bg-blue-900/40 border-l-4 border-blue-400 rounded-xl p-4 mb-6">
              <ul>
                <li>Start a blog and publish regularly</li>
                <li>Use infographics, videos, and case studies</li>
                <li>Share your expertise on LinkedIn, Quora, and Medium</li>
              </ul>
            </div>
            <h2 className="flex items-center gap-2 text-green-400"><CheckCircle className="w-6 h-6 text-green-400" /> Social Media Growth</h2>
            <div className="bg-green-900/40 border-l-4 border-green-400 rounded-xl p-4 mb-6">
              <ul>
                <li>Pick 2-3 platforms where your audience hangs out</li>
                <li>Post consistently and engage with followers</li>
                <li>Run targeted ads with small budgets to test</li>
              </ul>
            </div>
            <h2 className="flex items-center gap-2 text-yellow-400"><Globe className="w-6 h-6 text-yellow-400" /> Email & Automation</h2>
            <div className="bg-yellow-900/40 border-l-4 border-yellow-400 rounded-xl p-4 mb-6">
              <ul>
                <li>Build an email list from day one</li>
                <li>Send value-packed newsletters and offers</li>
                <li>Use automation for onboarding and follow-ups</li>
              </ul>
            </div>
            <h2 className="flex items-center gap-2 text-blue-400"><CheckCircle className="w-6 h-6 text-blue-400" /> Actionable Tips for 2024</h2>
            <div className="bg-blue-900/40 border-l-4 border-blue-400 rounded-xl p-4 mb-6">
              <ul>
                <li>Leverage AI tools for content and analytics</li>
                <li>Collaborate with micro-influencers</li>
                <li>Host webinars and live Q&A sessions</li>
                <li>Track everything—double down on what works</li>
              </ul>
            </div>
            <blockquote className="border-l-4 border-pink-400 pl-4 italic text-pink-200 bg-pink-900/20 rounded-xl py-2">
              “The best marketing is about building trust, delivering value, and creating real connections with your audience.”
            </blockquote>
            <h2 className="flex items-center gap-2 text-blue-400"><Star className="w-6 h-6 text-blue-400" /> Real-World Example: Startup Growth Story</h2>
            <div className="bg-blue-900/40 border-l-4 border-blue-400 rounded-xl p-4 mb-6">
              <p className="mb-2 font-semibold text-blue-200">Case Study: How a startup grew from 0 to 10,000 users in 6 months:</p>
              <ul>
                <li>Focused on SEO and content for organic traffic</li>
                <li>Ran Instagram and LinkedIn campaigns</li>
                <li>Used email automation for onboarding</li>
                <li>Built a community with webinars and Q&A</li>
              </ul>
            </div>
          </article>
        </div>
        {/* Sidebar */}
        <aside className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-gray-900 rounded-2xl shadow-xl p-6 mb-8 flex flex-col items-center">
            <img src={authorImg} alt="Md Aman" className="w-20 h-20 rounded-full border-4 border-pink-500 shadow mb-3 object-cover" />
            <div className="text-white font-bold text-lg">Md Aman</div>
            <div className="text-pink-400 text-sm mb-2">Digital Marketing Specialist</div>
            <p className="text-gray-300 text-center text-sm mb-2">Helping startups grow with smart, data-driven digital marketing strategies and creative campaigns.</p>
            <div className="flex gap-2 mt-2">
              <span className="inline-block px-3 py-1 bg-pink-600/80 text-white text-xs rounded-full font-semibold">Marketing</span>
              <span className="inline-block px-3 py-1 bg-blue-600/80 text-white text-xs rounded-full font-semibold">2024</span>
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
        <Link to="/blog" className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-lg font-semibold shadow hover:from-pink-600 hover:to-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-pink-400">
          <ArrowLeft className="w-4 h-4 inline-block mr-2" /> Back to Blogs
        </Link>
      </div>
    </section>
  </>
);

export default BlogDetailMarketing; 