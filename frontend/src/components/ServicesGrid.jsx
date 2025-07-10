import React from 'react';
import { Code, Smartphone, Megaphone, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: <Code size={36} className="text-blue-400" />,
    title: 'Web Development',
    desc: 'Custom websites, portals, and web apps with modern tech and best practices.',
    link: '/services/web-development',
  },
  {
    icon: <Smartphone size={36} className="text-green-400" />,
    title: 'App Development',
    desc: 'iOS, Android, and cross-platform mobile apps for startups and enterprises.',
    link: '/services/app-development',
  },
  {
    icon: <Megaphone size={36} className="text-pink-400" />,
    title: 'Digital Marketing',
    desc: 'SEO, SEM, social media, and growth marketing to boost your online presence.',
    link: '/services/digital-marketing',
  },
  {
    icon: <Palette size={36} className="text-purple-400" />,
    title: 'Graphic Design',
    desc: 'Branding, UI/UX, and creative design for web, mobile, and print.',
    link: '/services/graphic-design',
  },
];

const ServicesGrid = () => (
  <section className="py-16 bg-gray-950">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center">
        Our <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Services</span>
      </h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {services.map((s, i) => (
          <div
            key={s.title}
            className="group bg-gray-900 rounded-2xl border border-blue-500/10 shadow-lg p-8 flex flex-col items-center text-center hover:scale-[1.04] transition-transform duration-300 hover:border-blue-500/30"
          >
            <div className="mb-4">{s.icon}</div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{s.title}</h3>
            <p className="text-gray-300 mb-6">{s.desc}</p>
            <Link
              to={s.link}
              className="inline-block px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm transition-all duration-300 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-500/40"
            >
              Learn More
            </Link>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesGrid; 