import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Star, TrendingUp, CheckCircle, Globe, UserCircle } from 'lucide-react';
import authorImg from '../../assets/md aman.jpeg';

const relatedPosts = [
  {
    title: 'Digital Marketing Strategies for Startups 2024',
    link: '/blog/digital-marketing-strategies-2024',
  },
  {
    title: 'AI in Web Development 2024',
    link: '/blog/ai-in-web-development-2024',
  },
];

const BlogDetailMarketingAI = () => (
  <>
    <Helmet>
      <title>Digital Marketing in the AI Era: How AI is Changing Everything | Taliyo Technologies</title>
      <meta name="description" content="How is AI transforming digital marketing in 2024? Discover the latest AI-powered strategies, tools, and real-world examples to boost your campaigns and ROI." />
      <meta property="og:title" content="Digital Marketing in the AI Era: How AI is Changing Everything" />
      <meta property="og:description" content="How is AI transforming digital marketing in 2024? Discover the latest AI-powered strategies, tools, and real-world examples to boost your campaigns and ROI." />
      <meta property="og:type" content="article" />
      <link rel="canonical" href="https://taliyotechnologies.com/blog/digital-marketing-ai-era" />
    </Helmet>
    {/* Hero Section */}
    <section className="relative min-h-[45vh] flex items-end justify-center px-4 sm:px-6 lg:px-8 bg-black pt-20 pb-10">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80" alt="Digital Marketing AI" className="w-full h-full object-cover object-center opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
      </div>
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center px-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-block px-3 py-1 bg-pink-600/80 text-white text-xs rounded-full font-semibold uppercase tracking-wider">Marketing</span>
          <span className="inline-block px-3 py-1 bg-blue-600/80 text-white text-xs rounded-full font-semibold uppercase tracking-wider">AI</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
          Digital Marketing in the <span className="bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">AI Era</span>
        </h1>
        <div className="flex items-center justify-center gap-4 text-gray-200 text-sm mb-4">
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Mar 15, 2024</span>
          <span className="flex items-center gap-1"><UserCircle className="w-4 h-4" /> Md Aman</span>
        </div>
        <img src={authorImg} alt="Md Aman" className="w-16 h-16 rounded-full border-4 border-white shadow-lg mb-2 object-cover" />
        <p className="text-base text-gray-200 max-w-2xl mx-auto mb-6 leading-relaxed">
          <span className="font-bold text-pink-300">Can AI really make your marketing smarter, faster, and more profitable?</span> In 2024, artificial intelligence is not just a buzzword—it's the engine behind the most successful digital campaigns. Are you ready to see how AI can transform your marketing?
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
            <h2 className="flex items-center gap-2 text-pink-400"><Star className="w-6 h-6 text-pink-400" /> What is AI Marketing?</h2>
            <div className="bg-pink-900/40 border-l-4 border-pink-400 rounded-xl p-4 mb-6">
              <ul>
                <li>AI marketing uses machine learning, data, and automation to optimize campaigns.</li>
                <li>It helps you target the right audience, personalize content, and improve ROI.</li>
                <li>AI tools can analyze huge datasets in seconds—something humans can’t do alone.</li>
              </ul>
            </div>
            <h2 className="flex items-center gap-2 text-blue-400"><TrendingUp className="w-6 h-6 text-blue-400" /> AI Tools Every Marketer Should Know</h2>
            <div className="bg-blue-900/40 border-l-4 border-blue-400 rounded-xl p-4 mb-6">
              <ul>
                <li>Chatbots for instant customer support (e.g., Drift, Intercom)</li>
                <li>AI-powered ad platforms (Google Ads Smart Bidding, Facebook AI)</li>
                <li>Content generators (Jasper, Copy.ai) for blogs, ads, and emails</li>
                <li>Predictive analytics for smarter targeting and segmentation</li>
              </ul>
            </div>
            <h2 className="flex items-center gap-2 text-green-400"><CheckCircle className="w-6 h-6 text-green-400" /> Real-World AI Marketing Examples</h2>
            <div className="bg-green-900/40 border-l-4 border-green-400 rounded-xl p-4 mb-6">
              <ul>
                <li>Netflix uses AI to recommend shows you’ll love</li>
                <li>Amazon personalizes product suggestions for every user</li>
                <li>Spotify’s AI curates playlists based on your mood and habits</li>
                <li>Startups use AI chatbots to answer FAQs 24/7</li>
              </ul>
            </div>
            <h2 className="flex items-center gap-2 text-yellow-400"><Globe className="w-6 h-6 text-yellow-400" /> How to Start Using AI in Your Marketing</h2>
            <div className="bg-yellow-900/40 border-l-4 border-yellow-400 rounded-xl p-4 mb-6">
              <ul>
                <li>Identify repetitive tasks that can be automated (e.g., email follow-ups, reporting)</li>
                <li>Test AI tools for content, ads, and analytics</li>
                <li>Use AI to segment your audience and personalize offers</li>
                <li>Track results and optimize—AI gets smarter with more data</li>
              </ul>
            </div>
            <h2 className="flex items-center gap-2 text-blue-400"><CheckCircle className="w-6 h-6 text-blue-400" /> Actionable Tips for 2024</h2>
            <div className="bg-blue-900/40 border-l-4 border-blue-400 rounded-xl p-4 mb-6">
              <ul>
                <li>Don’t fear AI—embrace it as your marketing partner</li>
                <li>Start small: automate one process, then scale up</li>
                <li>Keep learning: AI is evolving fast, so stay updated</li>
                <li>Focus on value: AI is a tool, but your strategy and creativity matter most</li>
              </ul>
            </div>
            <blockquote className="border-l-4 border-pink-400 pl-4 italic text-pink-200 bg-pink-900/20 rounded-xl py-2">
              “AI won’t replace marketers, but marketers who use AI will replace those who don’t.”
            </blockquote>
            <h2 className="flex items-center gap-2 text-blue-400"><Star className="w-6 h-6 text-blue-400" /> FAQ: What People Ask About AI Marketing</h2>
            <div className="bg-blue-900/40 border-l-4 border-blue-400 rounded-xl p-4 mb-6">
              <ul>
                <li><strong>Q:</strong> Will AI take my marketing job?<br/><strong>A:</strong> No, but it will change your role. Marketers who use AI will be in high demand.</li>
                <li><strong>Q:</strong> Is AI expensive for small businesses?<br/><strong>A:</strong> Many AI tools are affordable or even free to start. ROI is often high.</li>
                <li><strong>Q:</strong> How do I learn AI marketing?<br/><strong>A:</strong> Start with online courses, experiment with free tools, and follow industry blogs.</li>
              </ul>
            </div>
          </article>
        </div>
        {/* Sidebar */}
        <aside className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-gray-900 rounded-2xl shadow-xl p-6 mb-8 flex flex-col items-center">
            <img src={authorImg} alt="Md Aman" className="w-20 h-20 rounded-full border-4 border-pink-500 shadow mb-3 object-cover" />
            <div className="text-white font-bold text-lg">Md Aman</div>
            <div className="text-pink-400 text-sm mb-2">AI Marketing Specialist</div>
            <p className="text-gray-300 text-center text-sm mb-2">Helping businesses grow with smart, AI-powered digital marketing strategies and creative campaigns.</p>
            <div className="flex gap-2 mt-2">
              <span className="inline-block px-3 py-1 bg-pink-600/80 text-white text-xs rounded-full font-semibold">Marketing</span>
              <span className="inline-block px-3 py-1 bg-blue-600/80 text-white text-xs rounded-full font-semibold">AI</span>
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

export default BlogDetailMarketingAI; 