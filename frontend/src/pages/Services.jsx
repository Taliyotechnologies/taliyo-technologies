import React, { useRef, useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Globe, Smartphone, Palette, TrendingUp, Zap, Shield, Users, CheckCircle, ArrowRight, Star, Award, Clock, Headphones, Code, Database, Smartphone as Mobile, Brush, Target, BarChart3, Mail, Phone, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import logo1 from '../assets/logo1.png';
import logo2 from '../assets/logo2.png';
import logo3 from '../assets/logo3.png';
import logo4 from '../assets/logo4.png';
import logo5 from '../assets/logo5.png';
import logo6 from '../assets/logo6.png';
import logo7 from '../assets/logo7.png';
import logo8 from '../assets/logo8.png';
import logo9 from '../assets/logo9.png';
import logo10 from '../assets/logo10.png';
import logo11 from '../assets/logo11.png';
import logo12 from '../assets/logo12.png';
import logo13 from '../assets/logo13.png';
import logo14 from '../assets/logo14.png';


const features = [
  {
    title: 'Expert Team',
    description: 'Experienced developers, designers, and marketers with proven track records.',
    icon: Users,
    color: 'text-blue-400',
    details: '50+ professionals with 5+ years average experience'
  },
  {
    title: 'Quality Assurance',
    description: 'Rigorous testing and quality control processes for every project.',
    icon: CheckCircle,
    color: 'text-green-400',
    details: '99% client satisfaction rate with comprehensive testing'
  },
  {
    title: '24/7 Support',
    description: 'Round-the-clock support and maintenance for your business.',
    icon: Shield,
    color: 'text-purple-400',
    details: 'Always available for urgent issues and updates'
  },
  {
    title: 'Fast Delivery',
    description: 'Quick turnaround times with guaranteed project completion.',
    icon: Zap,
    color: 'text-yellow-400',
    details: 'Average delivery time 30% faster than industry standard'
  },
  {
    title: 'Custom Solutions',
    description: 'Tailored solutions designed specifically for your business needs.',
    icon: Target,
    color: 'text-pink-400',
    details: 'Every project is uniquely crafted for your requirements'
  },
  {
    title: 'Data-Driven',
    description: 'Analytics and insights to optimize your digital performance.',
    icon: BarChart3,
    color: 'text-orange-400',
    details: 'Comprehensive reporting and performance tracking'
  },
]

const process = [
  {
    step: '01',
    title: 'Discovery & Planning',
    description: 'We analyze your requirements, goals, and target audience to create a comprehensive project plan.',
    icon: Headphones,
    color: 'text-blue-400'
  },
  {
    step: '02',
    title: 'Design & Prototyping',
    description: 'Our designers create wireframes, mockups, and interactive prototypes for your approval.',
    icon: Brush,
    color: 'text-green-400'
  },
  {
    step: '03',
    title: 'Development & Testing',
    description: 'Expert developers build your solution with continuous testing and quality assurance.',
    icon: Code,
    color: 'text-purple-400'
  },
  {
    step: '04',
    title: 'Launch & Support',
    description: 'We deploy your project and provide ongoing support, maintenance, and optimization.',
    icon: Zap,
    color: 'text-orange-400'
  },
]

const technologies = [
  { name: 'React', icon: Code, category: 'Frontend' },
  { name: 'Node.js', icon: Database, category: 'Backend' },
  { name: 'React Native', icon: Mobile, category: 'Mobile' },
  { name: 'Figma', icon: Brush, category: 'Design' },
  { name: 'Google Analytics', icon: BarChart3, category: 'Marketing' },
  { name: 'AWS', icon: Database, category: 'Cloud' },
  { name: 'MongoDB', icon: Database, category: 'Database' },
  { name: 'TypeScript', icon: Code, category: 'Frontend' },
  { name: 'Flutter', icon: Mobile, category: 'Mobile' },
  { name: 'Adobe Creative Suite', icon: Brush, category: 'Design' },
  { name: 'Google Ads', icon: Target, category: 'Marketing' },
  { name: 'Firebase', icon: Database, category: 'Backend' },
]

const stats = [
  { number: '500+', label: 'Projects Completed', icon: Award },
  { number: '50+', label: 'Expert Team Members', icon: Users },
  { number: '99%', label: 'Client Satisfaction', icon: Star },
  { number: '24/7', label: 'Support Available', icon: Clock },
]

const clientLogos = [
  { name: 'Logo 1 taliyotechnologies', src: logo1 },
  { name: 'Logo 2 taliyotechnologies', src: logo2 },
  { name: 'Logo 3 taliyotechnologies', src: logo3 },
  { name: 'Logo 4 taliyotechnologies', src: logo4 },
  { name: 'Logo 5 taliyotechnologies', src: logo5 },
  { name: 'Logo 6 taliyotechnologies', src: logo6 },
  { name: 'Logo 7 taliyotechnologies', src: logo7 },
  { name: 'Logo 8 taliyotechnologies', src: logo8 },
  { name: 'Logo 9 taliyotechnologies', src: logo9 },
  { name: 'Logo 10 taliyotechnologies', src: logo10 },
  { name: 'Logo 11 taliyotechnologies', src: logo11 },
  { name: 'Logo 12 taliyotechnologies', src: logo12 },
  { name: 'Logo 13 taliyotechnologies', src: logo13 },
  { name: 'Logo 14 taliyotechnologies', src: logo14 },
];

function TrustedByLoop() {
  const containerRef = useRef(null)
  const [paused, setPaused] = useState(false)
  const [scrollLeft, setScrollLeft] = useState(0)
  const speed = 1 // px per frame

  useEffect(() => {
    const container = containerRef.current
    let frameId
    let start
    let totalWidth = 0
    if (container) {
      totalWidth = container.scrollWidth / 2
    }
    function animate(ts) {
      if (!paused && container) {
        setScrollLeft(prev => {
          let next = prev + speed
          if (next >= totalWidth) {
            next = 0
          }
          container.scrollLeft = next
          return next
        })
      }
      frameId = requestAnimationFrame(animate)
    }
    frameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameId)
  }, [paused])

  // Reset scrollLeft if container size changes
  useEffect(() => {
    setScrollLeft(0)
    if (containerRef.current) containerRef.current.scrollLeft = 0
  }, [clientLogos.length])

  return (
    <section className="py-16 bg-gray-950" aria-label="Trusted By">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">Trusted By Leading Companies</h2>
        <div
          className="relative overflow-hidden"
          style={{ width: '100%' }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          tabIndex={0}
          ref={containerRef}
        >
          <div className="flex gap-12 min-w-max" style={{ width: 'max-content' }}>
            {[...clientLogos, ...clientLogos].map((logo, idx) => (
              <img
                key={idx}
                src={logo.src}
                alt={logo.name}
                className="h-40 w-auto grayscale hover:grayscale-0 transition duration-300 cursor-pointer"
                style={{ maxHeight: 150, minWidth: 250, objectFit: 'contain' }}
                tabIndex={0}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                onFocus={() => setPaused(true)}
                onBlur={() => setPaused(false)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Restore the original static services array
const services = [
  {
    title: 'Web Development',
    description: 'Custom websites and web applications built with modern technologies like React, Node.js, and more. We create responsive, scalable, and high-performance web solutions that drive business growth.',
    icon: Globe,
    href: '/services/web-development',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    features: ['Responsive Design', 'SEO Optimized', 'Fast Loading', 'Security Focused'],
    technologies: ['React', 'Node.js', 'Next.js', 'TypeScript', 'MongoDB', 'AWS']
  },
  {
    title: 'App Development',
    description: 'Native and cross-platform mobile apps for iOS and Android. We build intuitive, feature-rich applications that provide exceptional user experiences and drive engagement.',
    icon: Smartphone,
    href: '/services/app-development',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    features: ['Cross-Platform', 'Native Performance', 'Offline Support', 'Push Notifications'],
    technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'App Store']
  },
  {
    title: 'Graphic Design',
    description: 'Creative visual designs, brand identity, and UI/UX solutions. We craft stunning visuals that strengthen brand identity and create memorable user experiences.',
    icon: Palette,
    href: '/services/graphic-design',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    features: ['Brand Identity', 'UI/UX Design', 'Print Materials', 'Social Media Graphics'],
    technologies: ['Figma', 'Adobe Creative Suite', 'Sketch', 'Procreate', 'Canva', 'Blender']
  },
  {
    title: 'Digital Marketing',
    description: 'Comprehensive digital marketing strategies including SEO, SEM, social media marketing, and content strategy. We drive growth and increase your online presence.',
    icon: TrendingUp,
    href: '/services/digital-marketing',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    features: ['SEO Optimization', 'PPC Campaigns', 'Social Media', 'Content Marketing'],
    technologies: ['Google Analytics', 'Google Ads', 'Facebook Ads', 'SEMrush', 'Mailchimp', 'HubSpot']
  },
];

const Services = () => {
  // Remove useEffect, useState, and live fetching logic for services
  // const [services, setServices] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   setLoading(true);
  //   servicesAPI.getAll()
  //     .then((res) => {
  //       setServices(res.services || []);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       setError(err?.message || 'Failed to load services');
  //       setLoading(false);
  //     });
  // }, []);

  return (
    <>
      <Helmet>
        <title>Our Services | Taliyo Technologies - Comprehensive Digital Solutions</title>
        <meta name="description" content="Explore our comprehensive digital services: web development, app development, graphic design, and digital marketing. Expert solutions for modern businesses." />
        <meta name="keywords" content="web development, app development, graphic design, digital marketing, IT services, software development" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden px-4 md:px-0 mt-20">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-black">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.10) 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], x: [0, 20, 0], y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5], x: [0, -30, 0], y: [0, 30, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight"
          >
            Our <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Services</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed"
          >
            We offer a comprehensive suite of digital solutions to help your business grow and succeed in the digital age. From web development to digital marketing, we've got you covered.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-8 mt-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-950">
        <div className="container mx-auto px-2 sm:px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-12 text-center"
          >
            What We Offer
          </motion.h2>
          {/* Remove loading, error, and empty services checks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="group h-full"
              >
                <Link to={service.href} className="block h-full focus:outline-none focus:ring-4 focus:ring-blue-500/50 rounded-2xl">
                  <div className={`h-full flex flex-col p-6 sm:p-8 rounded-2xl border ${service.borderColor} ${service.bgColor} backdrop-blur-sm transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-blue-500/10 group-focus:shadow-2xl group-focus:shadow-blue-500/10 hover:-translate-y-1 hover:scale-[1.02] active:scale-95`} style={{ minHeight: '420px' }}>
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform`}>
                      <service.icon size={26} className="text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 group-hover:text-gray-200 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
                      {service.description}
                    </p>
                    <div className="mb-4 sm:mb-6">
                      <h4 className="text-xs sm:text-sm font-semibold text-white mb-2 sm:mb-3">Key Features:</h4>
                      <div className="space-y-1 sm:space-y-2">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center text-xs sm:text-sm text-gray-300">
                            <CheckCircle className="text-green-400 mr-2" size={13} />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors mt-auto">
                      <span className="text-xs sm:text-sm font-medium">Learn More</span>
                      <ArrowRight size={15} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-12 text-center"
          >
            Our Process
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {process.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <step.icon size={24} className="text-white" />
                </div>
                <div className="text-2xl font-bold text-blue-400 mb-2">{step.step}</div>
                <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-gray-300 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-20 bg-gray-950">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-12 text-center"
          >
            Technologies We Use
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 rounded-xl p-6 text-center border border-blue-500/10 hover:border-blue-500/30 transition-all"
              >
                <tech.icon size={32} className="text-blue-400 mx-auto mb-3" />
                <div className="text-white font-semibold mb-1">{tech.name}</div>
                <div className="text-gray-400 text-xs">{tech.category}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-12 text-center"
          >
            Why Choose Taliyo?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-8 flex flex-col items-center text-center shadow-lg border border-blue-500/10 hover:border-blue-500/30 transition-all"
              >
                <feature.icon size={40} className={`mb-4 ${feature.color}`} />
                <div className="text-xl font-semibold text-white mb-3">{feature.title}</div>
                <div className="text-gray-300 mb-4 leading-relaxed">{feature.description}</div>
                <div className="text-sm text-gray-400">{feature.details}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <TrustedByLoop />

      {/* Contact Info Section */}
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 rounded-2xl p-6 text-center border border-blue-500/10"
            >
              <Phone className="text-blue-400 mx-auto mb-4" size={32} />
              <h3 className="text-lg font-semibold text-white mb-2">Call Us</h3>
              <p className="text-gray-300">70425 23611</p>
              <p className="text-gray-400 text-sm">Mon-Fri 9AM-6PM</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 rounded-2xl p-6 text-center border border-blue-500/10"
            >
              <a
                href="mailto:info@taliyotechnologies.com"
                className="block focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-2xl hover:bg-gray-700/40 transition-all duration-200"
                tabIndex={0}
                aria-label="Email info@taliyotechnologies.com"
              >
                <Mail className="text-blue-400 mx-auto mb-4" size={32} />
                <h3 className="text-lg font-semibold text-white mb-2">info@taliyo.com</h3>
                <p className="text-gray-300">24/7 Support</p>
              </a>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 rounded-2xl p-6 text-center border border-blue-500/10"
            >
              <MapPin className="text-blue-400 mx-auto mb-4" size={32} />
              <h3 className="text-lg font-semibold text-white mb-2">Visit Us</h3>
              <p className="text-gray-300">Delhi, India</p>
              <p className="text-gray-400 text-sm">Main Office</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600" aria-labelledby="cta-heading">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-8 tracking-tight"
          >
            Ready to Start Your Project?
          </motion.h2>
          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Let's discuss your requirements and create a custom solution that drives your business forward. Get a free consultation today!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              to="/contact"
              className="group px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center focus:outline-none focus:ring-4 focus:ring-white/50"
              aria-label="Contact us"
            >
              Get Free Consultation <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/projects"
              className="group px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold rounded-xl transition-all duration-300 flex items-center focus:outline-none focus:ring-4 focus:ring-white/50"
              aria-label="View our work"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default Services 