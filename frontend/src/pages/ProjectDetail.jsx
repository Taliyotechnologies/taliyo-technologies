import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, Globe, Code, CheckCircle, TrendingUp, Clock, Award } from 'lucide-react';

const ProjectDetail = () => {
  const { slug } = useParams();

  // Mock project data - in real app, this would come from API
  const project = {
    title: "E-Commerce Platform for Fashion Retailer",
    client: "StyleHub India",
    category: "Web Development",
    duration: "3 months",
    team: "5 developers",
    liveUrl: "https://stylehub-india.com",
    githubUrl: "https://github.com/taliyo/stylehub",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop",
    overview: "A comprehensive e-commerce platform built for a leading fashion retailer in India. The platform handles thousands of daily transactions and provides a seamless shopping experience across all devices.",
    challenge: "The client needed a scalable e-commerce solution that could handle high traffic during sales events, integrate with multiple payment gateways, and provide real-time inventory management.",
    solution: "We built a modern, responsive e-commerce platform using React, Node.js, and MongoDB. The solution includes advanced features like real-time inventory tracking, multiple payment gateways, and a robust admin panel.",
    technologies: ["React", "Node.js", "MongoDB", "Express", "Stripe", "AWS", "Docker", "Redis"],
    features: [
      "Responsive design for all devices",
      "Advanced product filtering and search",
      "Real-time inventory management",
      "Multiple payment gateways",
      "Order tracking and notifications",
      "Admin dashboard with analytics",
      "SEO optimized product pages",
      "Mobile app integration"
    ],
    results: [
      "300% increase in online sales",
      "50% reduction in cart abandonment",
      "99.9% uptime during peak traffic",
      "4.8/5 customer satisfaction rating"
    ],
    process: [
      {
        phase: "Discovery & Planning",
        description: "Analyzed business requirements, user personas, and technical constraints.",
        duration: "2 weeks"
      },
      {
        phase: "Design & Prototyping",
        description: "Created wireframes, UI/UX designs, and interactive prototypes.",
        duration: "3 weeks"
      },
      {
        phase: "Development",
        description: "Built the platform using modern technologies and best practices.",
        duration: "8 weeks"
      },
      {
        phase: "Testing & QA",
        description: "Comprehensive testing including performance, security, and user acceptance.",
        duration: "2 weeks"
      },
      {
        phase: "Deployment & Launch",
        description: "Deployed to production with monitoring and support setup.",
        duration: "1 week"
      }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop"
    ]
  };

  const relatedProjects = [
    {
      title: "Healthcare Management System",
      category: "Web Development",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop",
      slug: "healthcare-management"
    },
    {
      title: "Food Delivery App",
      category: "App Development",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=250&fit=crop",
      slug: "food-delivery-app"
    },
    {
      title: "Real Estate Portal",
      category: "Web Development",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop",
      slug: "real-estate-portal"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Helmet>
        <title>{project.title} | Taliyo Technologies Portfolio</title>
        <meta name="description" content={project.overview} />
      </Helmet>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="container mx-auto px-4">
          <Link to="/projects" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to Projects
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full">{project.category}</span>
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar size={16} />
                  {project.duration}
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Users size={16} />
                  {project.team}
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {project.title}
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                {project.overview}
              </p>
              
              <div className="flex flex-wrap gap-4">
                {project.liveUrl && (
                  <a 
                    href={project.liveUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    <Globe size={20} className="mr-2" />
                    View Live
                  </a>
                )}
                {project.githubUrl && (
                  <a 
                    href={project.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 font-semibold rounded-xl transition-all"
                  >
                    <Code size={20} className="mr-2" />
                    View Code
                  </a>
                )}
              </div>
            </div>
            
            <div>
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Challenge & Solution */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">The Challenge</h2>
              <p className="text-gray-300 leading-relaxed mb-8">
                {project.challenge}
              </p>
              
              <h2 className="text-3xl font-bold text-white mb-8">Our Solution</h2>
              <p className="text-gray-300 leading-relaxed">
                {project.solution}
              </p>
            </div>
            
            {/* Technologies & Features */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Technologies Used</h2>
              <div className="flex flex-wrap gap-3 mb-8">
                {project.technologies.map(tech => (
                  <span key={tech} className="px-4 py-2 bg-gray-800 text-blue-300 rounded-lg font-medium">
                    {tech}
                  </span>
                ))}
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-8">Key Features</h2>
              <div className="space-y-4">
                {project.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="text-green-400 mt-1 flex-shrink-0" size={20} />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Development Process</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {project.process.map((phase, index) => (
                <div key={index} className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{phase.phase}</h3>
                    <p className="text-gray-300 mb-2">{phase.description}</p>
                    <span className="text-blue-400 font-medium">{phase.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Results & Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {project.results.map((result, index) => (
              <div key={index} className="bg-gray-900 rounded-2xl p-8 text-center border border-blue-500/10">
                <TrendingUp className="text-blue-400 mx-auto mb-4" size={32} />
                <p className="text-white text-lg font-semibold">{result}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Gallery */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Project Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {project.gallery.map((image, index) => (
              <img 
                key={index}
                src={image} 
                alt={`${project.title} screenshot ${index + 1}`}
                className="w-full rounded-2xl shadow-lg hover:scale-105 transition-transform cursor-pointer"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Related Projects */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Related Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProjects.map(relatedProject => (
              <Link key={relatedProject.slug} to={`/projects/${relatedProject.slug}`} className="group">
                <div className="bg-gray-800 rounded-2xl overflow-hidden hover:bg-gray-700 transition-colors">
                  <img 
                    src={relatedProject.image} 
                    alt={relatedProject.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="p-6">
                    <span className="text-blue-400 text-sm font-medium">{relatedProject.category}</span>
                    <h3 className="text-xl font-bold text-white mt-2 group-hover:text-blue-400 transition-colors">
                      {relatedProject.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetail; 