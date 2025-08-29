import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { ArrowRight, Play, Star, Users, Award, Clock, CheckCircle, Zap, Shield, Globe, Smartphone, Palette, TrendingUp, ChevronDown, ExternalLink, Cpu, Code, Brain, Rocket, Target, BarChart3, Headphones, Brush, Database, Mail, Phone, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

const Home = () => {
  const stats = [
    { icon: Users, value: '500+', label: 'Happy Clients', color: 'text-blue-400', description: 'Satisfied customers worldwide' },
    { icon: Award, value: '1000+', label: 'Projects Completed', color: 'text-yellow-400', description: 'Successful deliveries' },
    { icon: Clock, value: '5+', label: 'Years Experience', color: 'text-green-400', description: 'Proven track record' },
    { icon: Star, value: '4.9', label: 'Client Rating', color: 'text-purple-400', description: 'Average satisfaction score' },
  ]

  const services = [
    {
      title: 'Web Development',
      description: 'Custom websites and web applications built with modern technologies like React, Node.js, and more. We create responsive, scalable, and high-performance web solutions.',
      icon: Globe,
      href: '/services/web-development',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      features: ['Responsive Design', 'SEO Optimized', 'Fast Loading', 'Security Focused']
    },
    {
      title: 'App Development',
      description: 'Native and cross-platform mobile applications for iOS and Android with React Native and Flutter. We build intuitive, feature-rich applications.',
      icon: Smartphone,
      href: '/services/app-development',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      features: ['Cross-Platform', 'Native Performance', 'Offline Support', 'Push Notifications']
    },
    {
      title: 'Graphic Design',
      description: 'Creative visual designs, brand identity, and UI/UX solutions that captivate your audience. We craft stunning visuals that strengthen brand identity.',
      icon: Palette,
      href: '/services/graphic-design',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      features: ['Brand Identity', 'UI/UX Design', 'Print Materials', 'Social Media Graphics']
    },
    {
      title: 'Digital Marketing',
      description: 'SEO, SEM, social media marketing, and content strategy to grow your business online. We drive growth and increase your online presence.',
      icon: TrendingUp,
      href: '/services/digital-marketing',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
      features: ['SEO Optimization', 'PPC Campaigns', 'Social Media', 'Content Marketing']
    },
  ]

  const features = [
    {
      title: 'Expert Team',
      description: 'Experienced developers, designers, and marketers with proven track records and years of industry experience.',
      icon: Users,
      color: 'text-blue-400',
      details: '50+ professionals with 5+ years average experience'
    },
    {
      title: 'Quality Assurance',
      description: 'Rigorous testing and quality control processes ensure flawless delivery and 99% client satisfaction rate.',
      icon: CheckCircle,
      color: 'text-green-400',
      details: 'Comprehensive testing and quality control'
    },
    {
      title: '24/7 Support',
      description: 'Round-the-clock support and maintenance to help you whenever you need assistance.',
      icon: Shield,
      color: 'text-purple-400',
      details: 'Always available for urgent issues and updates'
    },
    {
      title: 'Fast Delivery',
      description: 'Quick turnaround times without compromising on quality or features.',
      icon: Zap,
      color: 'text-yellow-400',
      details: 'Average delivery time 30% faster than industry standard'
    },
    {
      title: 'Custom Solutions',
      description: 'Tailored solutions designed specifically for your business needs and requirements.',
      icon: Target,
      color: 'text-pink-400',
      details: 'Every project is uniquely crafted for your requirements'
    },
    {
      title: 'Data-Driven',
      description: 'Analytics and insights to optimize your digital performance and drive results.',
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
    { name: 'React Native', icon: Smartphone, category: 'Mobile' },
    { name: 'Figma', icon: Brush, category: 'Design' },
    { name: 'Google Analytics', icon: BarChart3, category: 'Marketing' },
    { name: 'AWS', icon: Database, category: 'Cloud' },
    { name: 'MongoDB', icon: Database, category: 'Database' },
    { name: 'TypeScript', icon: Code, category: 'Frontend' },
    { name: 'Flutter', icon: Smartphone, category: 'Mobile' },
    { name: 'Adobe Creative Suite', icon: Brush, category: 'Design' },
    { name: 'Google Ads', icon: Target, category: 'Marketing' },
    { name: 'Firebase', icon: Database, category: 'Backend' },
  ]

  const trustedBy = [
    'TechCorp', 'InnovateLabs', 'DigitalFlow', 'SmartSolutions', 'FutureTech'
  ]

  const testimonials = [
    {
      name: "Amit Sharma",
      company: "FinEdge Solutions",
      quote: "Taliyo Technologies delivered our project on time with exceptional quality. Their team is highly professional and responsive!",
      photo: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      name: "Priya Verma",
      company: "Verma Designs",
      quote: "The best web development partner we've worked with. Creative, reliable, and always ahead of the curve.",
      photo: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      name: "John Lee",
      company: "TechNova Inc.",
      quote: "Their digital marketing strategies helped us grow our business online. Highly recommended!",
      photo: "https://randomuser.me/api/portraits/men/65.jpg"
    },
    {
      name: "Sara Ali",
      company: "Ali Ventures",
      quote: "Amazing UI/UX design and seamless app delivery. We loved working with Taliyo!",
      photo: "https://randomuser.me/api/portraits/women/68.jpg"
    },
    {
      name: "Rohit Singh",
      company: "Singh Logistics",
      quote: "Great support and communication throughout the project. Will definitely hire again.",
      photo: "https://randomuser.me/api/portraits/men/77.jpg"
    }
  ]

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <Helmet>
        <title>Taliyo Technologies - Leading IT Company in India | Web Development, App Development, Digital Marketing</title>
        <meta name="description" content="Taliyo Technologies is a premier IT company in India specializing in web development, app development, graphic design, and digital marketing. Based in Delhi, serving clients worldwide with innovative digital solutions." />
        <meta name="keywords" content="IT company India, web development Delhi, app development, digital marketing, graphic design, software development, IT services, technology solutions" />
        <meta name="author" content="Taliyo Technologies" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://taliyo.com" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Taliyo Technologies - Leading IT Company in India" />
        <meta property="og:description" content="Premier IT company offering web development, app development, and digital marketing services. Transform your business with our innovative solutions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://taliyo.com" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Taliyo Technologies - Leading IT Company in India" />
        <meta name="twitter:description" content="Premier IT company offering web development, app development, and digital marketing services." />
      </Helmet>

      {/* Hero Section */}
      <section 
        className="relative min-h-[85vh] flex items-center justify-center overflow-x-hidden overflow-hidden px-4 md:px-0"
        aria-labelledby="hero-heading"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-black">
          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.10) 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          
          {/* Floating Elements */}
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              x: [0, 20, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
              x: [0, -30, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/3 w-64 h-64 bg-green-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
              x: [0, 40, 0],
              y: [0, -40, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
          {/* Left Content */}
          <div className="flex-1 flex flex-col items-center text-center order-2 lg:order-1 pl-0 md:items-start md:text-left md:pl-8 lg:pl-12">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-300 text-xs md:text-sm font-medium mb-6 md:mb-8 mt-20 md:mt-12 lg:mt-24 backdrop-blur-sm"
            >
              <Star size={16} className="mr-2" />
              Top IT Company in India • Trusted by 500+ Clients
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              id="hero-heading"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 lg:mb-8 leading-tight tracking-tight"
            >
              We Build
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Digital </span>
              Solutions That
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent"> Drive Growth</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-base md:text-lg lg:text-xl text-gray-200 mb-6 md:mb-8 lg:mb-10 max-w-3xl leading-relaxed"
            >
              Leading IT company in India offering innovative web development, 
              app development, and digital marketing solutions to help businesses 
              thrive in the digital age. We transform ideas into powerful digital experiences.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="w-full flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 sm:gap-4 lg:gap-6 mb-6 md:mb-8 lg:mb-10 max-w-xl"
            >
              <Link 
                to="/contact" 
                className="group w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 lg:px-10 lg:py-5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 flex items-center justify-center text-sm md:text-base lg:text-lg focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                aria-label="Get started with your project"
              >
                Get Started Today
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button 
                className="group w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 lg:px-10 lg:py-5 border-2 border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-semibold rounded-xl transition-all duration-300 backdrop-blur-sm flex items-center justify-center text-sm md:text-base lg:text-lg focus:outline-none focus:ring-4 focus:ring-gray-500/50"
                aria-label="Watch our demo video"
              >
                <Play size={18} className="mr-2 group-hover:scale-110 transition-transform" />
                Watch Demo
              </button>
            </motion.div>

            {/* Trusted By */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="w-full"
            >
              
            </motion.div>
          </div>

          {/* Right Content - Large AI Neural Network Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex-1 hidden lg:flex justify-end order-1 lg:order-2 max-w-xl w-full mt-4 lg:mt-0 mb-2 lg:mb-0"
          >
            <div className="relative w-full h-[340px] md:h-[400px] flex items-center justify-center">
              {/* Central Core */}
              <motion.div
                className="absolute left-1/2 top-1/2 w-28 h-28 bg-gradient-to-br from-blue-400 via-purple-400 to-green-400 rounded-full shadow-2xl"
                style={{ transform: 'translate(-50%, -50%)' }}
                animate={{ scale: [1, 1.1, 1], filter: ["blur(0px)", "blur(8px)", "blur(0px)"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Orbiting Dots */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-6 h-6 bg-gradient-to-br from-blue-400 to-green-400 rounded-full shadow-lg"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                  animate={{
                    x: [0, Math.cos((i * 45) * Math.PI / 180) * 120, 0],
                    y: [0, Math.sin((i * 45) * Math.PI / 180) * 120, 0],
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 5 + i * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:flex"
        >
          <button
            onClick={() => scrollToSection('services')}
            className="group w-8 h-12 border-2 border-gray-400 rounded-full flex justify-center cursor-pointer hover:border-gray-300 transition-colors focus:outline-none focus:ring-4 focus:ring-gray-500/50"
            aria-label="Scroll to services section"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-gray-400 rounded-full mt-2 group-hover:bg-gray-300 transition-colors"
            />
          </button>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group bg-gray-800/60 rounded-xl p-6 text-center shadow-lg hover:shadow-blue-500/10 transition-all duration-300 border border-gray-700/50 hover:border-gray-600/50 cursor-pointer"
                tabIndex={0}
                role="button"
                aria-label={`${stat.label}: ${stat.value}`}
                onKeyDown={(e) => e.key === 'Enter' && e.target.click()}
              >
                <div className="flex items-center justify-center mb-3">
                  <stat.icon size={24} className={`${stat.color} mr-3 group-hover:scale-110 transition-transform`} />
                  <span className="text-2xl md:text-3xl font-bold text-white group-hover:text-gray-200 transition-colors">
                    {stat.value}
                  </span>
                </div>
                <h3 className="text-sm md:text-base font-semibold text-gray-300 mb-1 group-hover:text-white transition-colors">
                  {stat.label}
                </h3>
                <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                  {stat.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section id="services" className="py-20 bg-gray-900" aria-labelledby="services-heading">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 id="services-heading" className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Our <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Services</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We offer comprehensive digital solutions to help your business grow 
              and succeed in the competitive digital landscape.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Link to={service.href} className="block h-full focus:outline-none focus:ring-4 focus:ring-blue-500/50 rounded-2xl">
                  <div className={`h-full p-8 rounded-2xl border ${service.borderColor} ${service.bgColor} backdrop-blur-sm transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-blue-500/10 group-focus:shadow-2xl group-focus:shadow-blue-500/10`}>
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <service.icon size={28} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-gray-200 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-white mb-3">Key Features:</h4>
                      <div className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-300">
                            <CheckCircle className="text-green-400 mr-2" size={14} />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
                      <span className="text-sm font-medium">Learn More</span>
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link 
              to="/services" 
              className="inline-flex items-center px-8 py-4 border-2 border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-semibold rounded-xl transition-all duration-300 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-gray-500/50"
              aria-label="View all our services"
            >
              View All Services
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-950">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Our <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Process</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We follow a proven methodology to deliver exceptional results for every project.
            </p>
          </motion.div>

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
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Technologies We <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Use</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We leverage cutting-edge technologies to build robust and scalable solutions.
            </p>
          </motion.div>

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
      <section className="py-20 bg-gray-950" aria-labelledby="why-choose-heading">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 id="why-choose-heading" className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">
                Why Choose <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Taliyo</span>
              </h2>
              <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                We combine technical expertise with creative innovation to deliver 
                solutions that not only meet your requirements but exceed your expectations.
              </p>
              
              <div className="space-y-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start space-x-4 group"
                  >
                    <div className={`p-3 rounded-xl bg-gray-800 group-hover:bg-gray-700 transition-colors flex-shrink-0`}>
                      <feature.icon size={24} className={feature.color} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-gray-200 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed mb-2">
                        {feature.description}
                      </p>
                      <p className="text-sm text-gray-400">
                        {feature.details}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Hide Watch Our Story box on mobile, show only on md and above */}
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl"></div>
                <div className="relative bg-gray-900 rounded-3xl p-8 border border-gray-800">
                  <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl flex items-center justify-center">
                    <iframe
                      src="https://www.canva.com/design/DAGsku9yL84/Qef2Lq6T1xg-HOj94rfF4g/watch?embed&autoplay=1"
                      allow="autoplay; fullscreen"
                      allowFullScreen
                      frameBorder="0"
                      width="100%"
                      height="315"
                      style={{ borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}
                      title="Taliyo Technologies Video"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 bg-gray-900">
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

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-950" aria-label="Client Testimonials">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center">What Our Clients Say</h2>
          <div className="relative overflow-hidden">
            <div className="testimonials-marquee flex gap-8">
              {[...testimonials, ...testimonials].map((testimonial, idx) => (
                <div
                  key={idx}
                  className="min-w-[320px] max-w-xs bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col items-center shadow-lg mx-2"
                  aria-hidden={idx >= testimonials.length}
                  aria-label={`Testimonial from ${testimonial.name}`}
                >
                  <img
                    src={testimonial.photo}
                    alt={`Photo of ${testimonial.name}`}
                    className="w-16 h-16 rounded-full mb-4 object-cover border-2 border-blue-500 shadow"
                    loading="lazy"
                  />
                  <p className="text-gray-200 text-base mb-4 text-center">"{testimonial.quote}"</p>
                  <div className="text-sm text-gray-400 font-semibold text-center">
                    {testimonial.name}
                    <span className="block text-xs text-blue-400 font-normal">{testimonial.company}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600" aria-labelledby="cta-heading">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 id="cta-heading" className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">
              Ready to Start Your <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Project</span>?
            </h2>
            <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              Let's discuss your project requirements and create something amazing together. 
              Get in touch with us today for a free consultation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                to="/contact" 
                className="group px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center focus:outline-none focus:ring-4 focus:ring-white/50"
                aria-label="Get free consultation for your project"
              >
                Get Free Consultation
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/projects" 
                className="group px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold rounded-xl transition-all duration-300 flex items-center focus:outline-none focus:ring-4 focus:ring-white/50"
                aria-label="View our portfolio and past projects"
              >
                View Our Work
                <ExternalLink size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default Home 