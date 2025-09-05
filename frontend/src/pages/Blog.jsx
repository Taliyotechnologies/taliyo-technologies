import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Calendar, Clock, Eye, TrendingUp, Star, Users, Cloud } from 'lucide-react'
import aboutCompanyImg from '../assets/about company.jpg';
import webDevImg from '../assets/Web-Development-Trends-in-2024.png';
import mobileAppImg from '../assets/flutter-vs-react-native.jpg';
import marketingImg from '../assets/ai digital marketing.jpeg';
import cloudImg from '../assets/CloudComputing.jpg';
import remoteWorkImg from '../assets/remote work revolution.jpeg';
import ecommerceImg from '../assets/ecomerce trends.jpeg';
import quantumImg from '../assets/quantum computing.jpeg';
import SubscribeForm from '../components/forms/SubscribeForm.jsx';

const Blog = () => {
  // Newsletter form handled by SubscribeForm component

  return (
    <>
      <Helmet>
        <title>Blog | Taliyo Technologies - Our Story & Vision</title>
        <meta name="description" content="Discover the story, vision, and journey of Taliyo Technologies. Learn what makes us a leading IT company in India." />
        <meta name="keywords" content="Taliyo Technologies, IT company, web development, about us, story, vision, India" />
        <meta property="og:title" content="Blog | Taliyo Technologies" />
        <meta property="og:description" content="Our story, vision, and what makes Taliyo Technologies unique." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://taliyotechnologies.com/blog" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[40vh] sm:min-h-[50vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-950 via-gray-900 to-black">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 mt-8 sm:mt-10 md:mt-16 leading-tight">
            Tech <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Insights</span> & Company Blogs
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto mb-6 leading-relaxed">
            Explore the latest tech trends, company news, and expert insights from Taliyo Technologies.
          </p>
        </div>
      </section>

      {/* Blog Grid Section */}
      <section className="py-12 sm:py-16 bg-gray-950">
        <div className="container mx-auto px-2 sm:px-4 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-10 text-center">Latest Blogs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Blog Card 2 */}
            <div className="bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-blue-500/10 transition-transform duration-300 hover:scale-105 hover:shadow-blue-600/30 group">
              <img src={webDevImg} alt="Web Development" className="w-full h-48 object-cover rounded-t-3xl group-hover:brightness-110 transition-all duration-300" />
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">Web Development Trends 2024</h3>
                <span className="text-gray-400 text-sm mb-4 flex items-center gap-2"><Calendar className="w-4 h-4" /> Jan 10, 2024</span>
                <p className="text-gray-300 flex-1 mb-6">Explore the latest web development trends shaping 2024, from AI-driven interfaces to new frameworks and best practices.</p>
                <Link to="/blog/ai-in-web-development-2024" className="mt-auto px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold text-center shadow hover:from-blue-600 hover:to-purple-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400">Read More</Link>
              </div>
            </div>
            {/* Blog Card 3 */}
            <div className="bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-blue-500/10 transition-transform duration-300 hover:scale-105 hover:shadow-blue-600/30 group">
              <img src={mobileAppImg} alt="Mobile App Development" className="w-full h-48 object-cover rounded-t-3xl group-hover:brightness-110 transition-all duration-300" />
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">Mobile App Development: Flutter vs React Native 2024</h3>
                <span className="text-gray-400 text-sm mb-4 flex items-center gap-2"><Calendar className="w-4 h-4" /> April 27, 2024</span>
                <p className="text-gray-300 flex-1 mb-6">Flutter or React Native? Compare frameworks, performance, and real-world use cases for your next mobile app project.</p>
                <Link to="/blog/mobile-app-development-trends-2024" className="mt-auto px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-semibold text-center shadow hover:from-green-600 hover:to-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400">Read More</Link>
              </div>
            </div>
            {/* Blog Card 4 */}
            <div className="bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-blue-500/10 transition-transform duration-300 hover:scale-105 hover:shadow-blue-600/30 group">
              <img src={marketingImg} alt="Digital Marketing" className="w-full h-48 object-cover rounded-t-3xl group-hover:brightness-110 transition-all duration-300" />
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">Digital Marketing in the AI Era</h3>
                <span className="text-gray-400 text-sm mb-4 flex items-center gap-2"><Star className="w-4 h-4" /> Mar 15, 2024</span>
                <p className="text-gray-300 flex-1 mb-6">How artificial intelligence is transforming digital marketing strategies and campaign effectiveness.</p>
                <Link to="/blog/digital-marketing-strategies-2024" className="mt-auto px-4 py-2 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-lg font-semibold text-center shadow hover:from-pink-600 hover:to-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-400">Read More</Link>
              </div>
            </div>
            {/* Blog Card 5 */}
            <div className="bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-blue-500/10 transition-transform duration-300 hover:scale-105 hover:shadow-blue-600/30 group">
              <img src={cloudImg} alt="Cloud Computing" className="w-full h-48 object-cover rounded-t-3xl group-hover:brightness-110 transition-all duration-300" />
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">Cloud Computing: The Backbone of Modern IT</h3>
                <span className="text-gray-400 text-sm mb-4 flex items-center gap-2"><Cloud className="w-4 h-4" /> Apr 5, 2024</span>
                <p className="text-gray-300 flex-1 mb-6">Discover how cloud computing powers today’s businesses and what’s next for the cloud ecosystem.</p>
                <Link to="/blog/cloud-computing-backbone-modern-it" className="mt-auto px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold text-center shadow hover:from-blue-600 hover:to-purple-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400">Read More</Link>
              </div>
            </div>
            {/* Blog Card 6 */}
            <div className="bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-blue-500/10 transition-transform duration-300 hover:scale-105 hover:shadow-blue-600/30 group">
              <img src={remoteWorkImg} alt="Remote Work Revolution" className="w-full h-48 object-cover rounded-t-3xl group-hover:brightness-110 transition-all duration-300" />
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">Remote Work Revolution: How to Build and Lead Distributed Teams</h3>
                <span className="text-gray-400 text-sm mb-4 flex items-center gap-2"><Calendar className="w-4 h-4" /> May 1, 2024</span>
                <p className="text-gray-300 flex-1 mb-6">Explore the secrets to building high-performing, happy remote teams. Learn proven strategies, tools, and leadership tips for the new era of work.</p>
                <Link to="/blog/remote-work-revolution-2024" className="mt-auto px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold text-center shadow hover:from-blue-600 hover:to-purple-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400">Read More</Link>
              </div>
            </div>
            {/* Blog Card 7 */}
            <div className="bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-blue-500/10 transition-transform duration-300 hover:scale-105 hover:shadow-blue-600/30 group">
              <img src={ecommerceImg} alt="E-commerce Trends" className="w-full h-48 object-cover rounded-t-3xl group-hover:brightness-110 transition-all duration-300" />
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">E-commerce Trends 2024</h3>
                <span className="text-gray-400 text-sm mb-4 flex items-center gap-2"><Eye className="w-4 h-4" /> Jun 10, 2024</span>
                <p className="text-gray-300 flex-1 mb-6">What to expect in e-commerce in 2024, from AI-powered personalization to new payment methods.</p>
                <Link to="/blog/ecommerce-trends-2024" className="mt-auto px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold text-center shadow hover:from-blue-600 hover:to-purple-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400">Read More</Link>
              </div>
            </div>
            {/* Blog Card 8 */}
            <div className="bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-blue-500/10 transition-transform duration-300 hover:scale-105 hover:shadow-blue-600/30 group">
              <img src={quantumImg} alt="Quantum Computing" className="w-full h-48 object-cover rounded-t-3xl group-hover:brightness-110 transition-all duration-300" />
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">Quantum Computing: The Next Tech Revolution</h3>
                <span className="text-gray-400 text-sm mb-4 flex items-center gap-2"><Calendar className="w-4 h-4" /> Aug 20, 2024</span>
                <p className="text-gray-300 flex-1 mb-6">Discover how quantum computing is set to transform industries, solve problems classical computers can’t, and what it means for the future of technology.</p>
                <Link to="/blog/quantum-computing-revolution-2024" className="mt-auto px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg font-semibold text-center shadow hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400">Read More</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Newsletter Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-2 sm:px-4 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              Stay Updated with Latest Tech Trends
            </h2>
            <p className="text-white/90 mb-8 text-sm sm:text-base leading-relaxed">
              Get the latest insights, tips, and industry updates delivered to your inbox. Join thousands of tech professionals who trust our expertise.
            </p>
            <SubscribeForm />
          </div>
        </div>
      </section>
    </>
  )
}

export default Blog 