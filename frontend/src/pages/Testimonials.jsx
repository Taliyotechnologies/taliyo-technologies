import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Star, Quote, Filter, Users, Award, TrendingUp } from 'lucide-react';

const Testimonials = () => {
  const [filter, setFilter] = useState('all');

  const testimonials = [
    {
      id: 1,
      name: "Amit Sharma",
      role: "CEO",
      company: "FinEdge Solutions",
      photo: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
      category: "web-development",
      quote: "Taliyo Technologies delivered our project on time with exceptional quality. Their team is highly professional and responsive. The e-commerce platform they built for us increased our online sales by 300% in the first quarter.",
      project: "E-Commerce Platform",
      duration: "3 months",
      results: "300% increase in sales"
    },
    {
      id: 2,
      name: "Priya Verma",
      role: "Founder",
      company: "Verma Designs",
      photo: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5,
      category: "web-development",
      quote: "The best web development partner we've worked with. Creative, reliable, and always ahead of the curve. Our new website has significantly improved our brand presence and user engagement.",
      project: "Corporate Website",
      duration: "2 months",
      results: "50% increase in leads"
    },
    {
      id: 3,
      name: "John Lee",
      role: "Marketing Director",
      company: "TechNova Inc.",
      photo: "https://randomuser.me/api/portraits/men/65.jpg",
      rating: 5,
      category: "digital-marketing",
      quote: "Their digital marketing strategies helped us grow our business online. The SEO and PPC campaigns delivered exceptional ROI. Highly recommended for any business looking to scale digitally.",
      project: "Digital Marketing Campaign",
      duration: "6 months",
      results: "200% increase in traffic"
    },
    {
      id: 4,
      name: "Sara Ali",
      role: "Product Manager",
      company: "Ali Ventures",
      photo: "https://randomuser.me/api/portraits/women/68.jpg",
      rating: 5,
      category: "app-development",
      quote: "Amazing UI/UX design and seamless app delivery. We loved working with Taliyo! The mobile app they developed for us has over 10,000 downloads and excellent user ratings.",
      project: "Mobile App Development",
      duration: "4 months",
      results: "10,000+ downloads"
    },
    {
      id: 5,
      name: "Rohit Singh",
      role: "Operations Manager",
      company: "Singh Logistics",
      photo: "https://randomuser.me/api/portraits/men/77.jpg",
      rating: 5,
      category: "web-development",
      quote: "Great support and communication throughout the project. The logistics management system they built has streamlined our operations and reduced costs by 25%. Will definitely hire again.",
      project: "Logistics Management System",
      duration: "5 months",
      results: "25% cost reduction"
    },
    {
      id: 6,
      name: "Meera Patel",
      role: "Creative Director",
      company: "Patel Studios",
      photo: "https://randomuser.me/api/portraits/women/89.jpg",
      rating: 5,
      category: "graphic-design",
      quote: "Outstanding graphic design work! They created a complete brand identity for our studio that perfectly captures our vision. The designs are modern, professional, and have received great feedback from our clients.",
      project: "Brand Identity Design",
      duration: "1 month",
      results: "Enhanced brand recognition"
    },
    {
      id: 7,
      name: "David Chen",
      role: "CTO",
      company: "Chen Technologies",
      photo: "https://randomuser.me/api/portraits/men/91.jpg",
      rating: 5,
      category: "app-development",
      quote: "Exceptional mobile app development services. The team delivered a high-performance app that handles complex data processing efficiently. Their technical expertise is outstanding.",
      project: "Enterprise Mobile App",
      duration: "6 months",
      results: "Improved efficiency by 40%"
    },
    {
      id: 8,
      name: "Anjali Reddy",
      role: "Business Owner",
      company: "Reddy Enterprises",
      photo: "https://randomuser.me/api/portraits/women/95.jpg",
      rating: 5,
      category: "digital-marketing",
      quote: "Taliyo's digital marketing services transformed our online presence. Their strategic approach to SEO and social media marketing helped us reach new customers and increase our market share significantly.",
      project: "Digital Marketing Strategy",
      duration: "8 months",
      results: "150% increase in conversions"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Services', icon: <Users size={20} /> },
    { id: 'web-development', name: 'Web Development', icon: <Award size={20} /> },
    { id: 'app-development', name: 'App Development', icon: <TrendingUp size={20} /> },
    { id: 'digital-marketing', name: 'Digital Marketing', icon: <Star size={20} /> },
    { id: 'graphic-design', name: 'Graphic Design', icon: <Quote size={20} /> }
  ];

  const filteredTestimonials = filter === 'all' 
    ? testimonials 
    : testimonials.filter(t => t.category === filter);

  const stats = [
    { label: "Happy Clients", value: "500+", icon: <Users size={24} /> },
    { label: "Projects Completed", value: "200+", icon: <Award size={24} /> },
    { label: "Average Rating", value: "4.9/5", icon: <Star size={24} /> },
    { label: "Client Retention", value: "95%", icon: <TrendingUp size={24} /> }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Helmet>
        <title>Client Testimonials | Taliyo Technologies</title>
        <meta name="description" content="Read what our clients say about Taliyo Technologies. Real testimonials from satisfied customers across web development, app development, and digital marketing services." />
      </Helmet>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            What Our <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Clients Say</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Don't just take our word for it. Here's what our clients have to say about their experience working with Taliyo Technologies.
          </p>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-blue-400 mb-2 flex justify-center">{stat.icon}</div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Filter Section */}
      <section className="py-8 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setFilter(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  filter === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category.icon}
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>
      {/* Testimonials Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTestimonials.map(testimonial => (
              <div key={testimonial.id} className="relative bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-8 border-2 border-blue-700/20 hover:border-blue-500/40 transition-all shadow-xl flex flex-col h-full">
                {/* Quote Icon */}
                <div className="absolute -top-6 left-6 bg-blue-600 rounded-full p-3 shadow-lg">
                  <Quote size={32} className="text-white opacity-80" />
                </div>
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4 mt-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                {/* Quote */}
                <blockquote className="text-lg text-white font-medium mb-6 leading-relaxed italic relative z-10">
                  “{testimonial.quote}”
                </blockquote>
                {/* Project Info */}
                <div className="mb-6 p-4 bg-gray-800/80 rounded-xl">
                  <div className="text-xs text-blue-400 font-semibold mb-1 uppercase tracking-wider">Project Details</div>
                  <div className="text-white font-semibold mb-1">{testimonial.project}</div>
                  <div className="text-sm text-gray-400">Duration: {testimonial.duration}</div>
                  <div className="text-sm text-green-400">Result: {testimonial.results}</div>
                </div>
                {/* Author */}
                <div className="flex items-center gap-4 mt-auto">
                  <img 
                    src={testimonial.photo} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full border-2 border-blue-500 object-cover"
                  />
                  <div>
                    <div className="font-semibold text-white text-base">{testimonial.name}</div>
                    <div className="text-gray-400 text-sm">{testimonial.role}</div>
                    <div className="text-blue-400 text-sm font-medium">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Ready to Join Our Happy Clients?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Let's discuss your project and see how we can help you achieve your goals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a 
              href="/contact" 
              className="group px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center"
            >
              Start Your Project
            </a>
            <a 
              href="/projects" 
              className="group px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold rounded-xl transition-all duration-300 flex items-center"
            >
              View Our Work
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials; 