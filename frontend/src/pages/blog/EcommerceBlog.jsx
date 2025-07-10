import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Calendar, ArrowLeft, ShoppingCart, CheckCircle, Star, Globe, UserCircle } from 'lucide-react';
import authorImg from '../../assets/viraj srivastav.jpg';

const relatedPosts = [
  {
    title: 'AI in Web Development 2024',
    link: '/blog/ai-in-web-development-2024',
  },
  {
    title: 'Mobile App Development: Flutter vs React Native',
    link: '/blog/mobile-app-development-trends-2024',
  },
];

const EcommerceBlog = () => (
  <>
    <Helmet>
      <title>E-commerce Website Development Trends 2024 | Taliyo Technologies</title>
      <meta name="description" content="Explore the latest e-commerce website development trends for 2024. Learn about platforms, payment gateways, security, UI/UX, SEO, and actionable strategies for online store success." />
      <meta property="og:title" content="E-commerce Website Development Trends 2024" />
      <meta property="og:description" content="Explore the latest e-commerce website development trends for 2024. Learn about platforms, payment gateways, security, UI/UX, SEO, and actionable strategies for online store success." />
      <meta property="og:type" content="article" />
      <link rel="canonical" href="https://taliyotechnologies.com/blog/ecommerce-trends-2024" />
    </Helmet>
    {/* Hero Section */}
    <section className="relative min-h-[45vh] flex items-end justify-center px-4 sm:px-6 lg:px-8 bg-black pt-20 pb-10">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1467987506553-8f3916508521?auto=format&fit=crop&w=1200&q=80" alt="E-commerce Development" className="w-full h-full object-cover object-center opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
      </div>
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center px-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-block px-3 py-1 bg-orange-600/80 text-white text-xs rounded-full font-semibold uppercase tracking-wider">E-commerce</span>
          <span className="inline-block px-3 py-1 bg-blue-600/80 text-white text-xs rounded-full font-semibold uppercase tracking-wider">2024</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
          E-commerce Website <span className="bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent">Development Trends 2024</span>
        </h1>
        <div className="flex items-center justify-center gap-4 text-gray-200 text-sm mb-4">
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> April 27, 2024</span>
          <span className="flex items-center gap-1"><UserCircle className="w-4 h-4" /> Viraj Srivastav</span>
        </div>
        <img src={authorImg} alt="Viraj Srivastav" className="w-16 h-16 rounded-full border-4 border-white shadow-lg mb-2 object-cover" />
        <p className="text-base text-gray-200 max-w-2xl mx-auto mb-6 leading-relaxed">
          The e-commerce landscape is evolving rapidly in 2024. Discover the latest trends, technologies, and strategies to build, launch, and grow a successful online store in today’s competitive market.
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
            <h2 className="flex items-center gap-2 text-orange-400"><ShoppingCart className="w-6 h-6 text-orange-400" /> Choosing the Right Platform</h2>
            <div className="bg-orange-900/40 border-l-4 border-orange-500 rounded-xl p-4 mb-6">
              <p className="mb-2 font-semibold text-orange-200">Your platform is the foundation of your store. In 2024, top choices include:</p>
              <ul>
                <li><strong>Shopify:</strong> Fast, secure, and easy to use for all business sizes.</li>
                <li><strong>WooCommerce:</strong> Highly customizable, perfect for WordPress users.</li>
                <li><strong>Magento:</strong> Enterprise-grade, best for large, complex stores.</li>
                <li><strong>Custom Solutions:</strong> For unique needs and full control.</li>
              </ul>
            </div>
            <h2 className="flex items-center gap-2 text-blue-400"><CheckCircle className="w-6 h-6 text-blue-400" /> Payment Gateways & Security</h2>
            <div className="bg-blue-900/40 border-l-4 border-blue-500 rounded-xl p-4 mb-6">
              <ul>
                <li>Integrate trusted gateways: Razorpay, Paytm, Stripe, PayPal</li>
                <li>SSL certificates for secure data transfer</li>
                <li>PCI DSS compliance for payment security</li>
                <li>GDPR and privacy-first analytics</li>
              </ul>
            </div>
            <h2 className="flex items-center gap-2 text-green-400"><Star className="w-6 h-6 text-green-400" /> UI/UX Design Best Practices</h2>
            <div className="bg-green-900/40 border-l-4 border-green-400 rounded-xl p-4 mb-6">
              <ul>
                <li>Mobile-first, responsive design for all devices</li>
                <li>Fast loading times and optimized images</li>
                <li>Clear navigation and frictionless checkout</li>
                <li>Personalized shopping experiences using AI</li>
              </ul>
            </div>
            <h2 className="flex items-center gap-2 text-yellow-400"><Globe className="w-6 h-6 text-yellow-400" /> SEO & Marketing Strategies</h2>
            <div className="bg-yellow-900/40 border-l-4 border-yellow-400 rounded-xl p-4 mb-6">
              <ul>
                <li>On-page SEO for product/category pages</li>
                <li>Content marketing and blogging for organic growth</li>
                <li>Social media and email marketing integration</li>
                <li>Retargeting and personalized offers</li>
              </ul>
            </div>
            <h2 className="flex items-center gap-2 text-blue-400"><CheckCircle className="w-6 h-6 text-blue-400" /> Actionable Tips for 2024</h2>
            <div className="bg-blue-900/40 border-l-4 border-blue-400 rounded-xl p-4 mb-6">
              <ul>
                <li>Leverage AI for product recommendations and customer support</li>
                <li>Use analytics to track user behavior and optimize conversions</li>
                <li>Offer multiple payment and delivery options</li>
                <li>Focus on customer reviews and trust signals</li>
              </ul>
            </div>
            <blockquote className="border-l-4 border-orange-400 pl-4 italic text-orange-200 bg-orange-900/20 rounded-xl py-2">
              “Success in e-commerce is about delivering value, trust, and a seamless experience at every step of the customer journey.”
            </blockquote>
            <h2 className="flex items-center gap-2 text-blue-400"><Star className="w-6 h-6 text-blue-400" /> Real-World Example: Scaling an Online Store</h2>
            <div className="bg-blue-900/40 border-l-4 border-blue-400 rounded-xl p-4 mb-6">
              <p className="mb-2 font-semibold text-blue-200">Case Study: How a small business grew 300% in 12 months:</p>
              <ul>
                <li>Chose Shopify for fast launch and scalability</li>
                <li>Integrated Razorpay and PayPal for payments</li>
                <li>Used WhatsApp and email marketing for retention</li>
                <li>Optimized product pages for SEO and speed</li>
              </ul>
            </div>
          </article>
        </div>
        {/* Sidebar */}
        <aside className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-gray-900 rounded-2xl shadow-xl p-6 mb-8 flex flex-col items-center">
            <img src={authorImg} alt="Viraj Srivastav" className="w-20 h-20 rounded-full border-4 border-orange-500 shadow mb-3 object-cover" />
            <div className="text-white font-bold text-lg">Viraj Srivastav</div>
            <div className="text-orange-400 text-sm mb-2">E-commerce Specialist</div>
            <p className="text-gray-300 text-center text-sm mb-2">Helping businesses launch, scale, and succeed in the digital marketplace with the latest tech and strategies.</p>
            <div className="flex gap-2 mt-2">
              <span className="inline-block px-3 py-1 bg-orange-600/80 text-white text-xs rounded-full font-semibold">E-commerce</span>
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
        <Link to="/blog" className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-blue-500 text-white rounded-lg font-semibold shadow hover:from-orange-600 hover:to-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-orange-400">
          <ArrowLeft className="w-4 h-4 inline-block mr-2" /> Back to Blogs
        </Link>
      </div>
    </section>
  </>
);

export default EcommerceBlog; 