import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Calendar, ArrowLeft, TrendingUp, CheckCircle, Globe, UserCircle, Zap } from 'lucide-react';
import authorImg from '../../assets/isha mehra.jpg';

const relatedPosts = [
  {
    title: 'AI in Web Development 2024',
    link: '/blog/ai-in-web-development-2024',
  },
  {
    title: 'Cloud Computing: The Backbone of Modern IT',
    link: '/blog/cloud-computing-backbone-modern-it',
  },
];

const BlogDetailQuantumComputing = () => (
  <>
    <Helmet>
      <title>Quantum Computing: The Next Tech Revolution | Taliyo Technologies</title>
      <meta name="description" content="What is quantum computing and why is it the next big thing in tech? Explore how quantum computers will transform industries, solve impossible problems, and shape the future." />
      <meta property="og:title" content="Quantum Computing: The Next Tech Revolution" />
      <meta property="og:description" content="What is quantum computing and why is it the next big thing in tech? Explore how quantum computers will transform industries, solve impossible problems, and shape the future." />
      <meta property="og:type" content="article" />
      <link rel="canonical" href="https://taliyotechnologies.com/blog/quantum-computing-revolution-2024" />
    </Helmet>
    {/* Hero Section */}
    <section className="relative min-h-[45vh] flex items-end justify-center px-4 sm:px-6 lg:px-8 bg-black pt-20 pb-10">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80" alt="Quantum Computing" className="w-full h-full object-cover object-center opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
      </div>
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center px-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-block px-3 py-1 bg-indigo-600/80 text-white text-xs rounded-full font-semibold uppercase tracking-wider">Quantum</span>
          <span className="inline-block px-3 py-1 bg-blue-600/80 text-white text-xs rounded-full font-semibold uppercase tracking-wider">Tech</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
          Quantum Computing: <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">The Next Tech Revolution</span>
        </h1>
        <div className="flex items-center justify-center gap-4 text-gray-200 text-sm mb-4">
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Aug 20, 2024</span>
          <span className="flex items-center gap-1"><UserCircle className="w-4 h-4" /> Isha Mehra</span>
        </div>
        <img src={authorImg} alt="Isha Mehra" className="w-16 h-16 rounded-full border-4 border-white shadow-lg mb-2 object-cover" />
        <p className="text-base text-gray-200 max-w-2xl mx-auto mb-6 leading-relaxed">
          <span className="font-bold text-indigo-300">Will quantum computers change the world as we know it?</span> As we stand on the edge of a new era, quantum computing promises to solve problems that were once thought impossible. Are you ready for the revolution?
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
            <h2 className="flex items-center gap-2 text-indigo-400"><Zap className="w-6 h-6 text-indigo-400" /> What is Quantum Computing?</h2>
            <div className="bg-indigo-900/40 border-l-4 border-indigo-400 rounded-xl p-4 mb-6">
              <ul>
                <li>Quantum computers use quantum bits (qubits) that can exist in multiple states at once, unlike classical bits (0 or 1).</li>
                <li>This allows them to process complex calculations exponentially faster than traditional computers.</li>
                <li>Quantum computing could revolutionize cryptography, drug discovery, AI, and more.</li>
              </ul>
            </div>
            <h2 className="flex items-center gap-2 text-blue-400"><TrendingUp className="w-6 h-6 text-blue-400" /> Why is Quantum Computing Important?</h2>
            <div className="bg-blue-900/40 border-l-4 border-blue-400 rounded-xl p-4 mb-6">
              <ul>
                <li>It can solve optimization problems that are impossible for classical computers.</li>
                <li>Quantum computers can break current encryption, but also create unbreakable codes.</li>
                <li>They enable simulations of molecules and materials for breakthroughs in science and medicine.</li>
              </ul>
            </div>
            <h2 className="flex items-center gap-2 text-green-400"><CheckCircle className="w-6 h-6 text-green-400" /> Real-World Quantum Applications</h2>
            <div className="bg-green-900/40 border-l-4 border-green-400 rounded-xl p-4 mb-6">
              <ul>
                <li>Google’s quantum computer solved a problem in 200 seconds that would take supercomputers 10,000 years.</li>
                <li>IBM, Microsoft, and startups are racing to build practical quantum machines.</li>
                <li>Pharmaceutical companies use quantum simulations to design new drugs.</li>
                <li>Financial firms explore quantum for risk analysis and portfolio optimization.</li>
              </ul>
            </div>
            <h2 className="flex items-center gap-2 text-yellow-400"><Globe className="w-6 h-6 text-yellow-400" /> How to Prepare for the Quantum Era</h2>
            <div className="bg-yellow-900/40 border-l-4 border-yellow-400 rounded-xl p-4 mb-6">
              <ul>
                <li>Stay informed: Follow quantum research and industry news.</li>
                <li>Learn the basics: Online courses and resources are available for all levels.</li>
                <li>Experiment: Try quantum programming with IBM Q Experience or Microsoft Quantum Development Kit.</li>
                <li>Think security: Prepare for post-quantum cryptography.</li>
              </ul>
            </div>
            <h2 className="flex items-center gap-2 text-blue-400"><CheckCircle className="w-6 h-6 text-blue-400" /> Actionable Tips for 2024</h2>
            <div className="bg-blue-900/40 border-l-4 border-blue-400 rounded-xl p-4 mb-6">
              <ul>
                <li>Don’t ignore quantum—start learning now to stay ahead.</li>
                <li>Encourage your team to explore quantum concepts and tools.</li>
                <li>Watch for quantum breakthroughs in your industry.</li>
                <li>Be ready to adapt: The revolution may come sooner than you think.</li>
              </ul>
            </div>
            <blockquote className="border-l-4 border-indigo-400 pl-4 italic text-indigo-200 bg-indigo-900/20 rounded-xl py-2">
              “Quantum computing will do things we once thought impossible. The future is closer than you think.”
            </blockquote>
            <h2 className="flex items-center gap-2 text-blue-400"><Zap className="w-6 h-6 text-blue-400" /> FAQ: What People Ask About Quantum Computing</h2>
            <div className="bg-blue-900/40 border-l-4 border-blue-400 rounded-xl p-4 mb-6">
              <ul>
                <li><strong>Q:</strong> When will quantum computers be mainstream?<br/><strong>A:</strong> Experts predict within 5-10 years for practical applications, but research is moving fast.</li>
                <li><strong>Q:</strong> Will quantum computers replace classical computers?<br/><strong>A:</strong> No, they will complement them for specific tasks.</li>
                <li><strong>Q:</strong> How can I start learning quantum computing?<br/><strong>A:</strong> Try free online courses, tutorials, and cloud-based quantum simulators.</li>
              </ul>
            </div>
          </article>
        </div>
        {/* Sidebar */}
        <aside className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-gray-900 rounded-2xl shadow-xl p-6 mb-8 flex flex-col items-center">
            <img src={authorImg} alt="Isha Mehra" className="w-20 h-20 rounded-full border-4 border-indigo-500 shadow mb-3 object-cover" />
            <div className="text-white font-bold text-lg">Isha Mehra</div>
            <div className="text-indigo-400 text-sm mb-2">Quantum Tech Enthusiast</div>
            <p className="text-gray-300 text-center text-sm mb-2">Exploring the frontiers of technology and making complex topics simple for everyone.</p>
            <div className="flex gap-2 mt-2">
              <span className="inline-block px-3 py-1 bg-indigo-600/80 text-white text-xs rounded-full font-semibold">Quantum</span>
              <span className="inline-block px-3 py-1 bg-blue-600/80 text-white text-xs rounded-full font-semibold">Tech</span>
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
        <Link to="/blog" className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg font-semibold shadow hover:from-indigo-600 hover:to-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400">
          <ArrowLeft className="w-4 h-4 inline-block mr-2" /> Back to Blogs
        </Link>
      </div>
    </section>
  </>
);

export default BlogDetailQuantumComputing; 