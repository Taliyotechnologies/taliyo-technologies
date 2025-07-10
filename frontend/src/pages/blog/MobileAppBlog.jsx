import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Smartphone, CheckCircle, Star, Globe, UserCircle } from 'lucide-react';
import authorImg from '../../assets/udita .jpg';

const relatedPosts = [
  {
    title: 'AI in Web Development 2024',
    link: '/blog/ai-in-web-development-2024',
  },
  {
    title: 'E-commerce Website Development Trends 2024',
    link: '/blog/ecommerce-trends-2024',
  },
];

const MobileAppBlog = () => (
  <>
    <Helmet>
      <title>Mobile App Development: Flutter vs React Native 2024 | Taliyo Technologies</title>
      <meta name="description" content="Compare Flutter and React Native for mobile app development in 2024. Discover pros, cons, performance, and which is best for your next project." />
      <meta property="og:title" content="Mobile App Development: Flutter vs React Native 2024" />
      <meta property="og:description" content="Compare Flutter and React Native for mobile app development in 2024. Discover pros, cons, performance, and which is best for your next project." />
      <meta property="og:type" content="article" />
      <link rel="canonical" href="https://taliyotechnologies.com/blog/mobile-app-development-trends-2024" />
    </Helmet>
    {/* Hero Section */}
    <section className="relative min-h-[45vh] flex items-end justify-center px-4 sm:px-6 lg:px-8 bg-black pt-20 pb-10">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80" alt="Mobile App Development" className="w-full h-full object-cover object-center opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
      </div>
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center px-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-block px-3 py-1 bg-green-600/80 text-white text-xs rounded-full font-semibold uppercase tracking-wider">Mobile Apps</span>
          <span className="inline-block px-3 py-1 bg-blue-600/80 text-white text-xs rounded-full font-semibold uppercase tracking-wider">2024</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
          Mobile App Development: <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Flutter vs React Native</span> 2024
        </h1>
        <div className="flex items-center justify-center gap-4 text-gray-200 text-sm mb-4">
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> April 27, 2024</span>
          <span className="flex items-center gap-1"><UserCircle className="w-4 h-4" /> Udita</span>
        </div>
        <img src={authorImg} alt="Udita" className="w-16 h-16 rounded-full border-4 border-white shadow-lg mb-2 object-cover" />
        <p className="text-base text-gray-200 max-w-2xl mx-auto mb-6 leading-relaxed">
          Flutter or React Native? In 2024, choosing the right framework is crucial for mobile app success. Dive deep into features, performance, and real-world use cases to make the best choice for your next project.
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
            <h2 className="flex items-center gap-2 text-green-400"><Smartphone className="w-6 h-6 text-green-400" /> Why Cross-Platform?</h2>
            <div className="bg-green-900/40 border-l-4 border-green-500 rounded-xl p-4 mb-6">
              <p className="mb-2 font-semibold text-green-200">Cross-platform frameworks save time and money. In 2024, they power most new apps:</p>
              <ul>
                <li>Single codebase for iOS & Android</li>
                <li>Faster development and updates</li>
                <li>Consistent UI/UX across devices</li>
              </ul>
            </div>
            <h2 className="flex items-center gap-2 text-blue-400"><CheckCircle className="w-6 h-6 text-blue-400" /> Flutter: Pros & Cons</h2>
            <div className="bg-blue-900/40 border-l-4 border-blue-500 rounded-xl p-4 mb-6">
              <ul>
                <li><strong>Pros:</strong> Fast performance, beautiful UIs, strong community, Google support</li>
                <li><strong>Cons:</strong> Larger app size, fewer third-party libraries than React Native</li>
              </ul>
            </div>
            <h2 className="flex items-center gap-2 text-purple-400"><Star className="w-6 h-6 text-purple-400" /> React Native: Pros & Cons</h2>
            <div className="bg-purple-900/40 border-l-4 border-purple-400 rounded-xl p-4 mb-6">
              <ul>
                <li><strong>Pros:</strong> Mature ecosystem, lots of libraries, hot reloading, Facebook support</li>
                <li><strong>Cons:</strong> Sometimes slower for complex UIs, native modules needed for some features</li>
              </ul>
            </div>
            <h2 className="flex items-center gap-2 text-yellow-400"><Globe className="w-6 h-6 text-yellow-400" /> Performance & Real-World Use</h2>
            <div className="bg-yellow-900/40 border-l-4 border-yellow-400 rounded-xl p-4 mb-6">
              <ul>
                <li>Flutter: Great for visually rich, animation-heavy apps</li>
                <li>React Native: Best for apps needing lots of integrations or rapid prototyping</li>
                <li>Both: Used by top brands (Google, Facebook, Alibaba, BMW, etc.)</li>
              </ul>
            </div>
            <h2 className="flex items-center gap-2 text-blue-400"><CheckCircle className="w-6 h-6 text-blue-400" /> How to Choose?</h2>
            <div className="bg-blue-900/40 border-l-4 border-blue-400 rounded-xl p-4 mb-6">
              <ul>
                <li>Consider your team’s expertise and project needs</li>
                <li>Prototype both and test performance</li>
                <li>Think about long-term support and community</li>
              </ul>
            </div>
            <blockquote className="border-l-4 border-green-400 pl-4 italic text-green-200 bg-green-900/20 rounded-xl py-2">
              “The best framework is the one that fits your project, team, and goals. Both Flutter and React Native are excellent choices in 2024.”
            </blockquote>
            <h2 className="flex items-center gap-2 text-blue-400"><Star className="w-6 h-6 text-blue-400" /> Real-World Example: Building a Startup App</h2>
            <div className="bg-blue-900/40 border-l-4 border-blue-400 rounded-xl p-4 mb-6">
              <p className="mb-2 font-semibold text-blue-200">Case Study: How a startup launched in 3 months:</p>
              <ul>
                <li>Chose React Native for fast prototyping</li>
                <li>Used Expo for easy deployment</li>
                <li>Integrated Firebase for backend</li>
                <li>Launched on both iOS and Android with one team</li>
              </ul>
            </div>
          </article>
        </div>
        {/* Sidebar */}
        <aside className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-gray-900 rounded-2xl shadow-xl p-6 mb-8 flex flex-col items-center">
            <img src={authorImg} alt="Udita" className="w-20 h-20 rounded-full border-4 border-green-500 shadow mb-3 object-cover" />
            <div className="text-white font-bold text-lg">Udita</div>
            <div className="text-green-400 text-sm mb-2">Mobile App Specialist</div>
            <p className="text-gray-300 text-center text-sm mb-2">Helping startups and enterprises build high-performance mobile apps with the latest frameworks.</p>
            <div className="flex gap-2 mt-2">
              <span className="inline-block px-3 py-1 bg-green-600/80 text-white text-xs rounded-full font-semibold">Mobile</span>
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
        <Link to="/blog" className="inline-block px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-semibold shadow hover:from-green-600 hover:to-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-green-400">
          <ArrowLeft className="w-4 h-4 inline-block mr-2" /> Back to Blogs
        </Link>
      </div>
    </section>
  </>
);

export default MobileAppBlog; 