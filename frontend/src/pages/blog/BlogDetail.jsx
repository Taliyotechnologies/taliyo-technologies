import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft } from 'lucide-react';

// Dummy blog data (should match Blog.jsx order)
const blogs = [
  {
    id: '1',
    title: 'The Future of AI in Business',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80',
    author: 'Taliyo Team',
    date: 'June 2024',
    description: 'How artificial intelligence is transforming industries and what it means for your business in 2024 and beyond.',
    content: `
      <p>Artificial Intelligence (AI) is no longer a futuristic concept—it's a present-day reality transforming businesses across the globe. From automating routine tasks to providing deep insights through data analysis, AI is empowering companies to innovate and grow at an unprecedented pace.</p>
      <h2>Why AI Matters Now</h2>
      <p>AI-driven solutions are helping businesses improve efficiency, reduce costs, and deliver better customer experiences. Whether it’s chatbots for instant support, predictive analytics for smarter decisions, or automation for repetitive work, AI is at the heart of digital transformation.</p>
      <h2>How to Prepare Your Business</h2>
      <ul><li>Invest in AI training for your team</li><li>Start with small, impactful AI projects</li><li>Focus on data quality and security</li></ul>
      <p>Embracing AI today means staying ahead of the curve tomorrow. The future belongs to those who innovate!</p>
    `
  },
  {
    id: '2',
    title: 'Web Development Trends 2024',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80',
    author: 'Taliyo Team',
    date: 'June 2024',
    description: 'Explore the latest frameworks, tools, and best practices shaping the future of web development.',
    content: `
      <p>The web is evolving faster than ever. In 2024, expect to see more serverless architectures, edge computing, and AI-powered user experiences. Modern frameworks like Next.js and SvelteKit are making development faster and more scalable.</p>
      <h2>Key Trends</h2>
      <ul><li>Serverless & edge computing</li><li>AI-driven personalization</li><li>Progressive Web Apps (PWAs)</li></ul>
      <p>Staying updated with these trends will help your business deliver faster, smarter, and more engaging web experiences.</p>
    `
  },
  {
    id: '3',
    title: 'Mobile Apps: UX Matters',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
    author: 'Taliyo Team',
    date: 'June 2024',
    description: 'Why user experience is the key to successful mobile apps and how to design for engagement.',
    content: `
      <p>Great mobile apps are built on great user experiences. In 2024, users expect apps to be fast, intuitive, and visually appealing. Micro-interactions, smooth animations, and accessibility are more important than ever.</p>
      <h2>Design Tips</h2>
      <ul><li>Keep interfaces clean and simple</li><li>Use meaningful animations</li><li>Test for accessibility</li></ul>
      <p>Focus on UX, and your app will stand out in a crowded marketplace.</p>
    `
  },
  {
    id: '4',
    title: 'Digital Marketing in the AI Era',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=900&q=80',
    author: 'Taliyo Team',
    date: 'June 2024',
    description: 'How AI is revolutionizing digital marketing strategies and what you need to know to stay ahead.',
    content: `
      <p>AI is changing the way marketers reach and engage audiences. From smart segmentation to automated content creation, AI tools are making campaigns more effective and efficient.</p>
      <h2>What’s New?</h2>
      <ul><li>AI-powered ad targeting</li><li>Automated content generation</li><li>Real-time analytics</li></ul>
      <p>Adopting AI in your marketing strategy can give you a significant edge over the competition.</p>
    `
  },
  {
    id: '5',
    title: 'Cloud Computing: The Backbone of Modern IT',
    image: 'https://images.unsplash.com/photo-1467987506553-8f3916508521?auto=format&fit=crop&w=900&q=80',
    author: 'Taliyo Team',
    date: 'June 2024',
    description: 'Discover how cloud technology is powering innovation and scalability for businesses worldwide.',
    content: `
      <p>Cloud computing is the foundation of digital transformation. It enables businesses to scale quickly, reduce costs, and innovate faster than ever before.</p>
      <h2>Benefits of Cloud</h2>
      <ul><li>Scalability & flexibility</li><li>Cost savings</li><li>Enhanced security</li></ul>
      <p>Moving to the cloud is no longer optional—it's essential for modern business success.</p>
    `
  },
  {
    id: '6',
    title: 'Startup Culture: Building Teams that Win',
    image: 'https://images.unsplash.com/photo-1461344577544-4e5dc9487184?auto=format&fit=crop&w=900&q=80',
    author: 'Taliyo Team',
    date: 'June 2024',
    description: 'Lessons from top startups on building high-performing teams and a culture of innovation.',
    content: `
      <p>Startup success is all about people. Building a winning team means fostering a culture of trust, innovation, and collaboration.</p>
      <h2>How to Build a Great Team</h2>
      <ul><li>Hire for attitude and potential</li><li>Encourage open communication</li><li>Reward innovation</li></ul>
      <p>Invest in your people, and your startup will thrive in any market.</p>
    `
  },
];

export default function BlogDetail() {
  const { id } = useParams();
  const blog = blogs.find((b) => b.id === id);

  if (!blog) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold mb-4">Blog Not Found</h1>
        <Link to="/blog" className="text-blue-600 hover:underline">Back to Blogs</Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{blog.title} | Taliyo Technologies Blog</title>
        <meta name="description" content={blog.description} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.description} />
        <meta property="og:image" content={blog.image} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={`https://taliyotechnologies.com/blog/${blog.id}`} />
      </Helmet>
      {/* Hero Section */}
      <section className="relative min-h-[30vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900 via-purple-900 to-black">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center text-center px-4">
          <img src={blog.image} alt={blog.title} className="w-full max-h-80 object-cover rounded-2xl shadow-lg mb-8" loading="lazy" />
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
            {blog.title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-gray-300 text-sm mb-2">
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {blog.date}</span>
            <span className="flex items-center gap-1">By {blog.author}</span>
          </div>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto mb-6 leading-relaxed">{blog.description}</p>
          <Link to="/blog" className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-all mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Blogs
          </Link>
        </div>
      </section>
      {/* Content Section */}
      <section className="py-10 sm:py-16 bg-gray-950">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="prose prose-invert prose-lg max-w-none text-white/90" style={{lineHeight:1.8, letterSpacing:'0.01em'}}>
            {/* Render content as React elements, not dangerouslySetInnerHTML */}
            {parseBlogContent(blog.content)}
          </div>
          <div className="text-center mt-12">
            <Link to="/blog" className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400">
              <ArrowLeft className="w-4 h-4 inline-block mr-2" /> Back to Blogs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

// Helper to parse blog.content (HTML string) into React elements
function parseBlogContent(html) {
  // For now, fallback to dangerouslySetInnerHTML, but you should migrate to markdown or React elements for safety.
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
} 