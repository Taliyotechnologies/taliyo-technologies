import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Users, TrendingUp, CheckCircle, Globe, UserCircle } from 'lucide-react';
import authorImg from '../../assets/taliyo logo.png';

const relatedPosts = [
  {
    title: 'Startup Culture: Building Teams that Win',
    link: '/blog/startup-culture-building-teams',
  },
  {
    title: 'Cloud Computing: The Backbone of Modern IT',
    link: '/blog/cloud-computing-backbone-modern-it',
  },
];

const BlogDetailRemoteWork = () => (
  <>
    <Helmet>
      <title>Remote Work Revolution: How to Build and Lead Distributed Teams | Taliyo Technologies</title>
      <meta name="description" content="How do you build and lead high-performing remote teams? Discover proven strategies, tools, and leadership tips for the remote work era." />
      <meta property="og:title" content="Remote Work Revolution: How to Build and Lead Distributed Teams" />
      <meta property="og:description" content="How do you build and lead high-performing remote teams? Discover proven strategies, tools, and leadership tips for the remote work era." />
      <meta property="og:type" content="article" />
      <link rel="canonical" href="https://taliyotechnologies.com/blog/remote-work-revolution-2024" />
    </Helmet>
    {/* Hero Section */}
    <section className="relative min-h-[45vh] flex items-end justify-center px-4 sm:px-6 lg:px-8 bg-black pt-20 pb-10">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=80" alt="Remote Work Revolution" className="w-full h-full object-cover object-center opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
      </div>
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center px-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-block px-3 py-1 bg-blue-600/80 text-white text-xs rounded-full font-semibold uppercase tracking-wider">Remote</span>
          <span className="inline-block px-3 py-1 bg-purple-600/80 text-white text-xs rounded-full font-semibold uppercase tracking-wider">Teams</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
          Remote Work Revolution: <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">How to Build and Lead Distributed Teams</span>
        </h1>
        <div className="flex items-center justify-center gap-4 text-gray-200 text-sm mb-4">
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> May 1, 2024</span>
          <span className="flex items-center gap-1"><UserCircle className="w-4 h-4" /> Harsh Budhauliya</span>
        </div>
        <img src={authorImg} alt="Harsh Budhauliya" className="w-16 h-16 rounded-full border-4 border-white shadow-lg mb-2 object-cover" />
        <p className="text-base text-gray-200 max-w-2xl mx-auto mb-6 leading-relaxed">
          <span className="font-bold text-blue-300">Can you build a world-class team without ever meeting in person?</span> The remote work revolution is here. Discover how to lead, motivate, and grow distributed teams that win.
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
            <h2 className="flex items-center gap-2 text-blue-400"><Users className="w-6 h-6 text-blue-400" /> Why Remote Work is Here to Stay</h2>
            <div className="bg-blue-900/40 border-l-4 border-blue-400 rounded-xl p-4 mb-6">
              <ul>
                <li>Remote work offers flexibility, access to global talent, and cost savings.</li>
                <li>Studies show remote teams can be more productive and happier.</li>
                <li>Companies like GitLab, Zapier, and Automattic are 100% remote and thriving.</li>
              </ul>
            </div>
            <h2 className="flex items-center gap-2 text-purple-400"><TrendingUp className="w-6 h-6 text-purple-400" /> Building a High-Performing Remote Team</h2>
            <div className="bg-purple-900/40 border-l-4 border-purple-400 rounded-xl p-4 mb-6">
              <ul>
                <li>Hire for self-motivation, communication, and adaptability.</li>
                <li>Set clear goals, expectations, and KPIs from day one.</li>
                <li>Foster a culture of trust, transparency, and recognition.</li>
                <li>Use async communication and regular check-ins to keep everyone aligned.</li>
              </ul>
            </div>
            <h2 className="flex items-center gap-2 text-green-400"><CheckCircle className="w-6 h-6 text-green-400" /> Tools for Remote Collaboration</h2>
            <div className="bg-green-900/40 border-l-4 border-green-400 rounded-xl p-4 mb-6">
              <ul>
                <li>Slack, Microsoft Teams, and Discord for communication.</li>
                <li>Notion, Trello, and Asana for project management.</li>
                <li>Zoom, Google Meet, and Loom for video and async updates.</li>
                <li>Time zone tools and virtual watercoolers for team bonding.</li>
              </ul>
            </div>
            <h2 className="flex items-center gap-2 text-yellow-400"><Globe className="w-6 h-6 text-yellow-400" /> Leading and Motivating Remotely</h2>
            <div className="bg-yellow-900/40 border-l-4 border-yellow-400 rounded-xl p-4 mb-6">
              <ul>
                <li>Lead by example: be responsive, empathetic, and proactive.</li>
                <li>Celebrate wins, birthdays, and milestones virtually.</li>
                <li>Encourage learning, growth, and work-life balance.</li>
                <li>Address burnout and isolation with regular check-ins and support.</li>
              </ul>
            </div>
            <h2 className="flex items-center gap-2 text-blue-400"><CheckCircle className="w-6 h-6 text-blue-400" /> Actionable Tips for 2024</h2>
            <div className="bg-blue-900/40 border-l-4 border-blue-400 rounded-xl p-4 mb-6">
              <ul>
                <li>Document everything: processes, decisions, and best practices.</li>
                <li>Invest in onboarding and remote training.</li>
                <li>Encourage feedback and continuous improvement.</li>
                <li>Stay flexible: remote work is always evolving.</li>
              </ul>
            </div>
            <blockquote className="border-l-4 border-blue-400 pl-4 italic text-blue-200 bg-blue-900/20 rounded-xl py-2">
              “Remote work is not a challenge—it’s an opportunity to build the best team, anywhere.”
            </blockquote>
            <h2 className="flex items-center gap-2 text-blue-400"><Users className="w-6 h-6 text-blue-400" /> FAQ: What People Ask About Remote Work</h2>
            <div className="bg-blue-900/40 border-l-4 border-blue-400 rounded-xl p-4 mb-6">
              <ul>
                <li><strong>Q:</strong> How do you keep remote teams engaged?<br/><strong>A:</strong> Regular check-ins, virtual events, and recognition go a long way.</li>
                <li><strong>Q:</strong> What are the biggest challenges of remote work?<br/><strong>A:</strong> Communication, time zones, and isolation—but all can be managed with the right approach.</li>
                <li><strong>Q:</strong> Can any company go remote?<br/><strong>A:</strong> Most knowledge-based companies can, with the right tools and mindset.</li>
              </ul>
            </div>
          </article>
        </div>
        {/* Sidebar */}
        <aside className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-gray-900 rounded-2xl shadow-xl p-6 mb-8 flex flex-col items-center">
            <img src={authorImg} alt="Harsh Budhauliya" className="w-20 h-20 rounded-full border-4 border-blue-500 shadow mb-3 object-cover" />
            <div className="text-white font-bold text-lg">Harsh Budhauliya</div>
            <div className="text-blue-400 text-sm mb-2">Remote Work Evangelist</div>
            <p className="text-gray-300 text-center text-sm mb-2">Passionate about building great teams and helping companies thrive in the remote era.</p>
            <div className="flex gap-2 mt-2">
              <span className="inline-block px-3 py-1 bg-blue-600/80 text-white text-xs rounded-full font-semibold">Remote</span>
              <span className="inline-block px-3 py-1 bg-purple-600/80 text-white text-xs rounded-full font-semibold">Teams</span>
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

export default BlogDetailRemoteWork; 