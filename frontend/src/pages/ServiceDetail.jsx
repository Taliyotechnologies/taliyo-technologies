import React from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Code, Smartphone, Megaphone, Palette, ArrowRight, CheckCircle, Zap, Globe, Users, Database, Shield, Rocket, TrendingUp, Clock, Award } from "lucide-react";

const serviceData = {
  "web-development": {
    title: "Web Development",
    icon: <Code size={40} className="text-blue-400" />,
    gradient: "from-blue-600 to-cyan-500",
    intro: "Transform your business with cutting-edge web solutions. We build scalable, high-performance websites and web applications that drive growth and deliver exceptional user experiences.",
    features: [
      "Responsive, mobile-first design for all devices",
      "SEO-optimized with fast loading speeds",
      "E-commerce platforms with secure payment gateways",
      "Custom CMS and content management systems",
      "API integration and third-party service connections",
      "Advanced analytics and performance monitoring",
      "Security best practices and SSL certificates",
      "Cross-browser compatibility and accessibility"
    ],
    process: [
      {
        phase: "Discovery & Strategy",
        description: "Deep dive into your business requirements, target audience analysis, and competitive research to create a comprehensive development strategy.",
        duration: "1-2 weeks",
        icon: <Users size={24} className="text-blue-400" />
      },
      {
        phase: "UI/UX Design",
        description: "Create stunning, user-centric designs with wireframes, prototypes, and interactive mockups that align with your brand identity.",
        duration: "2-3 weeks",
        icon: <Palette size={24} className="text-purple-400" />
      },
      {
        phase: "Development",
        description: "Build robust, scalable applications using modern technologies and best practices for optimal performance and maintainability.",
        duration: "4-8 weeks",
        icon: <Code size={24} className="text-green-400" />
      },
      {
        phase: "Testing & QA",
        description: "Comprehensive testing including functionality, performance, security, and cross-browser compatibility to ensure flawless delivery.",
        duration: "1-2 weeks",
        icon: <Shield size={24} className="text-yellow-400" />
      },
      {
        phase: "Deployment & Launch",
        description: "Seamless deployment to production with monitoring, backup systems, and ongoing support setup for smooth operations.",
        duration: "1 week",
        icon: <Rocket size={24} className="text-red-400" />
      }
    ],
    tech: [
      "React.js", "Next.js", "Node.js", "Express.js", "MongoDB", "PostgreSQL", 
      "TypeScript", "Tailwind CSS", "Vite", "Docker", "AWS", "Vercel"
    ],
    benefits: [
      {
        title: "Increased Conversion Rates",
        description: "Optimized user experience leads to higher engagement and conversions",
        icon: <TrendingUp size={24} className="text-green-400" />
      },
      {
        title: "Improved SEO Rankings",
        description: "Search engine optimized websites that rank higher in search results",
        icon: <Award size={24} className="text-blue-400" />
      },
      {
        title: "Enhanced Security",
        description: "Enterprise-grade security measures to protect your data and users",
        icon: <Shield size={24} className="text-purple-400" />
      },
      {
        title: "Scalable Architecture",
        description: "Built to grow with your business needs and handle increased traffic",
        icon: <Rocket size={24} className="text-orange-400" />
      }
    ],
    results: [
      "300% average increase in website traffic",
      "50% improvement in page load speeds",
      "40% increase in user engagement",
      "99.9% uptime guarantee"
    ],
    meta: {
      title: "Professional Web Development Services | Taliyo Technologies",
      desc: "Expert web development services in India. Custom websites, e-commerce platforms, and web applications built with modern technologies. Get a free consultation today!",
    },
  },
  "app-development": {
    title: "App Development",
    icon: <Smartphone size={40} className="text-green-400" />,
    gradient: "from-green-500 to-emerald-500",
    intro: "Transform your ideas into powerful mobile applications. We develop native and cross-platform mobile apps that deliver exceptional user experiences and drive business growth across iOS and Android platforms.",
    features: [
      "Native iOS and Android app development",
      "Cross-platform solutions with React Native & Flutter",
      "App Store and Google Play Store optimization",
      "Push notifications and real-time messaging",
      "Advanced analytics and user behavior tracking",
      "Secure authentication and data encryption",
      "Offline functionality and data synchronization",
      "Performance optimization and battery efficiency"
    ],
    process: [
      {
        phase: "Requirement Analysis",
        description: "Deep dive into your business goals, target audience, and technical requirements to create a comprehensive app development strategy.",
        duration: "1-2 weeks",
        icon: <Users size={24} className="text-green-400" />
      },
      {
        phase: "Wireframing & Prototyping",
        description: "Create detailed wireframes, interactive prototypes, and user flow diagrams to visualize the app experience before development.",
        duration: "2-3 weeks",
        icon: <Palette size={24} className="text-purple-400" />
      },
      {
        phase: "App Development",
        description: "Build robust, scalable mobile applications using modern technologies and best practices for optimal performance and user experience.",
        duration: "6-12 weeks",
        icon: <Code size={24} className="text-blue-400" />
      },
      {
        phase: "Testing & Quality Assurance",
        description: "Comprehensive testing including functionality, performance, security, and user acceptance across multiple devices and platforms.",
        duration: "2-3 weeks",
        icon: <Shield size={24} className="text-yellow-400" />
      },
      {
        phase: "App Store Launch",
        description: "Prepare app store listings, create compelling descriptions, and manage the submission process for both iOS and Android stores.",
        duration: "1-2 weeks",
        icon: <Rocket size={24} className="text-red-400" />
      }
    ],
    tech: [
      "React Native", "Flutter", "Swift", "Kotlin", "Firebase", "Node.js", 
      "MongoDB", "AWS", "Figma", "Xcode", "Android Studio", "TestFlight"
    ],
    benefits: [
      {
        title: "Increased User Engagement",
        description: "Mobile apps provide 24/7 access and higher engagement rates compared to websites",
        icon: <TrendingUp size={24} className="text-green-400" />
      },
      {
        title: "Better User Experience",
        description: "Native app performance and intuitive mobile interfaces enhance user satisfaction",
        icon: <Award size={24} className="text-blue-400" />
      },
      {
        title: "Offline Functionality",
        description: "Apps work seamlessly even without internet connection, improving accessibility",
        icon: <Shield size={24} className="text-purple-400" />
      },
      {
        title: "Push Notifications",
        description: "Direct communication channel to keep users engaged and informed",
        icon: <Rocket size={24} className="text-orange-400" />
      }
    ],
    results: [
      "10,000+ app downloads on average",
      "4.8/5 average app store rating",
      "60% increase in user retention",
      "40% faster user onboarding"
    ],
    meta: {
      title: "Professional Mobile App Development Services | Taliyo Technologies",
      desc: "Expert mobile app development for iOS, Android, and cross-platform. Native and React Native apps with modern features. Get a free consultation today!",
    },
  },
  "digital-marketing": {
    title: "Digital Marketing",
    icon: <Megaphone size={40} className="text-pink-400" />,
    gradient: "from-pink-500 to-orange-500",
    intro: "Accelerate your business growth with data-driven digital marketing strategies. We create comprehensive campaigns that increase brand visibility, drive qualified traffic, and deliver measurable ROI across all digital channels.",
    features: [
      "Search Engine Optimization (SEO) and content marketing",
      "Pay-per-click (PPC) campaigns on Google and social media",
      "Social media marketing and community management",
      "Email marketing and automation campaigns",
      "Content strategy and blog management",
      "Analytics and performance tracking",
      "Brand strategy and market research",
      "Conversion rate optimization (CRO)"
    ],
    process: [
      {
        phase: "Audit & Strategy",
        description: "Comprehensive analysis of your current digital presence, competitor research, and development of a customized marketing strategy aligned with your business goals.",
        duration: "1-2 weeks",
        icon: <Users size={24} className="text-pink-400" />
      },
      {
        phase: "Campaign Setup",
        description: "Implementation of SEO optimizations, PPC account setup, social media profiles, and content calendar creation for maximum reach and engagement.",
        duration: "2-3 weeks",
        icon: <Palette size={24} className="text-orange-400" />
      },
      {
        phase: "Content Creation",
        description: "Development of high-quality, SEO-optimized content including blog posts, social media content, email campaigns, and landing pages.",
        duration: "4-8 weeks",
        icon: <Code size={24} className="text-blue-400" />
      },
      {
        phase: "Optimization",
        description: "Continuous monitoring, A/B testing, and optimization of campaigns based on performance data to maximize ROI and achieve business objectives.",
        duration: "Ongoing",
        icon: <Shield size={24} className="text-green-400" />
      },
      {
        phase: "Reporting & Growth",
        description: "Monthly performance reports, insights analysis, and strategic recommendations for continuous improvement and business growth.",
        duration: "Monthly",
        icon: <Rocket size={24} className="text-purple-400" />
      }
    ],
    tech: [
      "Google Analytics", "Google Ads", "Facebook Ads", "SEMrush", "Ahrefs", "WordPress", 
      "Mailchimp", "HubSpot", "Canva", "Hootsuite", "Buffer", "Hotjar"
    ],
    benefits: [
      {
        title: "Increased Brand Visibility",
        description: "Strategic SEO and PPC campaigns improve your search rankings and online presence",
        icon: <TrendingUp size={24} className="text-pink-400" />
      },
      {
        title: "Higher Conversion Rates",
        description: "Data-driven optimization leads to better user experience and increased sales",
        icon: <Award size={24} className="text-orange-400" />
      },
      {
        title: "Measurable ROI",
        description: "Comprehensive analytics and reporting show clear return on marketing investment",
        icon: <Shield size={24} className="text-blue-400" />
      },
      {
        title: "Targeted Audience Reach",
        description: "Precise targeting ensures your message reaches the right people at the right time",
        icon: <Rocket size={24} className="text-purple-400" />
      }
    ],
    results: [
      "200% average increase in organic traffic",
      "150% improvement in conversion rates",
      "300% boost in social media engagement",
      "25% reduction in customer acquisition cost"
    ],
    meta: {
      title: "Professional Digital Marketing Services | Taliyo Technologies",
      desc: "Expert digital marketing services including SEO, PPC, social media, and content marketing. Drive growth with data-driven strategies. Get a free consultation today!",
    },
  },
  "graphic-design": {
    title: "Graphic Design",
    icon: <Palette size={40} className="text-purple-400" />,
    gradient: "from-purple-600 to-pink-500",
    intro: "Transform your brand with stunning visual designs that captivate your audience. We create compelling graphics, logos, and marketing materials that strengthen your brand identity and drive engagement across all platforms.",
    features: [
      "Logo design and brand identity packages",
      "UI/UX design for websites and mobile apps",
      "Marketing collateral and print materials",
      "Social media graphics and templates",
      "Infographics and data visualization",
      "Packaging design and product branding",
      "Digital illustrations and custom artwork",
      "Brand guidelines and style guides"
    ],
    process: [
      {
        phase: "Brief & Research",
        description: "Deep understanding of your brand, target audience, and project requirements through comprehensive research and competitor analysis.",
        duration: "1 week",
        icon: <Users size={24} className="text-purple-400" />
      },
      {
        phase: "Concept & Sketches",
        description: "Development of multiple design concepts, wireframes, and initial sketches to explore creative directions and visual approaches.",
        duration: "1-2 weeks",
        icon: <Palette size={24} className="text-pink-400" />
      },
      {
        phase: "Design & Review",
        description: "Creation of refined designs with multiple iterations based on feedback, ensuring perfect alignment with brand guidelines and objectives.",
        duration: "2-4 weeks",
        icon: <Code size={24} className="text-blue-400" />
      },
      {
        phase: "Finalization",
        description: "Final design approval, file preparation, and delivery of all formats needed for various applications and platforms.",
        duration: "1 week",
        icon: <Shield size={24} className="text-green-400" />
      },
      {
        phase: "Delivery",
        description: "Comprehensive brand guidelines, style guides, and ongoing support for consistent brand application across all touchpoints.",
        duration: "1 week",
        icon: <Rocket size={24} className="text-orange-400" />
      }
    ],
    tech: [
      "Figma", "Adobe XD", "Photoshop", "Illustrator", "InDesign", "Canva", 
      "Sketch", "Procreate", "After Effects", "Premiere Pro", "Blender", "Cinema 4D"
    ],
    benefits: [
      {
        title: "Strong Brand Identity",
        description: "Professional designs create memorable brand experiences and build customer trust",
        icon: <TrendingUp size={24} className="text-purple-400" />
      },
      {
        title: "Increased Engagement",
        description: "Visually appealing graphics capture attention and drive higher user engagement",
        icon: <Award size={24} className="text-pink-400" />
      },
      {
        title: "Consistent Branding",
        description: "Comprehensive style guides ensure brand consistency across all platforms",
        icon: <Shield size={24} className="text-blue-400" />
      },
      {
        title: "Competitive Advantage",
        description: "Unique, professional designs set your brand apart from competitors",
        icon: <Rocket size={24} className="text-orange-400" />
      }
    ],
    results: [
      "85% improvement in brand recognition",
      "60% increase in social media engagement",
      "40% boost in website conversion rates",
      "90% client satisfaction rating"
    ],
    meta: {
      title: "Professional Graphic Design Services | Taliyo Technologies",
      desc: "Expert graphic design services including logo design, brand identity, UI/UX, and marketing materials. Create stunning visuals that drive engagement. Get a free consultation today!",
    },
  },
};

const ServiceDetail = () => {
  const { slug } = useParams();
  const service = serviceData[slug];

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white p-8">
        <Helmet>
          <title>Service Not Found | Taliyo Technologies</title>
        </Helmet>
        <h1 className="text-3xl font-bold mb-4">404 - Service Not Found</h1>
        <p className="mb-6">Sorry, the service you are looking for does not exist.</p>
        <Link to="/services" className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold transition-all hover:from-blue-700 hover:to-purple-700">Back to Services</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-16">
      <Helmet>
        <title>{service.meta.title}</title>
        <meta name="description" content={service.meta.desc} />
      </Helmet>

      {/* Hero Section */}
      <section className={`py-20 bg-gradient-to-r ${service.gradient} mb-12`}>
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <div className="mb-6">{service.icon}</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">{service.title}</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-6">{service.intro}</p>
          <Link to="/contact" className="inline-flex items-center px-8 py-3 rounded-xl bg-white text-gray-900 font-semibold text-lg shadow-lg hover:bg-gray-100 transition-all">
            Book a Free Consultation <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Why Choose Our {service.title}?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {service.features.map((feature, index) => (
            <div key={index} className="bg-gray-900 rounded-2xl p-8 border border-blue-500/10 shadow-lg flex items-start gap-4 hover:border-blue-500/30 transition-all">
              <CheckCircle className="text-blue-400 flex-shrink-0 mt-1" size={24} />
              <span className="text-lg text-white leading-relaxed">{feature}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Our Development Process</h2>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              {service.process.map((phase, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    {phase.icon}
                  </div>
                  <div className="text-2xl font-bold text-blue-400 mb-2">{index + 1}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{phase.phase}</h3>
                  <p className="text-gray-300 mb-3 leading-relaxed">{phase.description}</p>
                  <span className="text-blue-400 font-medium text-sm">{phase.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Technologies We Use</h2>
          <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
            {service.tech.map((tech, index) => (
              <span key={index} className="px-6 py-3 rounded-xl bg-gray-800 text-blue-300 text-lg font-semibold shadow border border-blue-500/10 hover:bg-gray-700 transition-all">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section - Only for Web Development */}
      {slug === "web-development" && (
        <section className="py-16 bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Benefits You'll Get</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {service.benefits.map((benefit, index) => (
                <div key={index} className="bg-gray-800 rounded-2xl p-8 text-center border border-blue-500/10 hover:border-blue-500/30 transition-all">
                  <div className="mb-4 flex justify-center">{benefit.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Results Section - Only for Web Development */}
      {slug === "web-development" && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Proven Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {service.results.map((result, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-8 text-center border border-blue-500/20">
                  <div className="text-3xl font-bold text-white mb-2">{result.split(' ')[0]}</div>
                  <p className="text-gray-300 leading-relaxed">{result.split(' ').slice(1).join(' ')}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits Section - Only for App Development */}
      {slug === "app-development" && (
        <section className="py-16 bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Benefits You'll Get</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {service.benefits.map((benefit, index) => (
                <div key={index} className="bg-gray-800 rounded-2xl p-8 text-center border border-green-500/10 hover:border-green-500/30 transition-all">
                  <div className="mb-4 flex justify-center">{benefit.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Results Section - Only for App Development */}
      {slug === "app-development" && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Proven Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {service.results.map((result, index) => (
                <div key={index} className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-8 text-center border border-green-500/20">
                  <div className="text-3xl font-bold text-white mb-2">{result.split(' ')[0]}</div>
                  <p className="text-gray-300 leading-relaxed">{result.split(' ').slice(1).join(' ')}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits Section - Only for Digital Marketing */}
      {slug === "digital-marketing" && (
        <section className="py-16 bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Benefits You'll Get</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {service.benefits.map((benefit, index) => (
                <div key={index} className="bg-gray-800 rounded-2xl p-8 text-center border border-pink-500/10 hover:border-pink-500/30 transition-all">
                  <div className="mb-4 flex justify-center">{benefit.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Results Section - Only for Digital Marketing */}
      {slug === "digital-marketing" && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Proven Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {service.results.map((result, index) => (
                <div key={index} className="bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-2xl p-8 text-center border border-pink-500/20">
                  <div className="text-3xl font-bold text-white mb-2">{result.split(' ')[0]}</div>
                  <p className="text-gray-300 leading-relaxed">{result.split(' ').slice(1).join(' ')}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits Section - Only for Graphic Design */}
      {slug === "graphic-design" && (
        <section className="py-16 bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Benefits You'll Get</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {service.benefits.map((benefit, index) => (
                <div key={index} className="bg-gray-800 rounded-2xl p-8 text-center border border-purple-500/10 hover:border-purple-500/30 transition-all">
                  <div className="mb-4 flex justify-center">{benefit.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Results Section - Only for Graphic Design */}
      {slug === "graphic-design" && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Proven Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {service.results.map((result, index) => (
                <div key={index} className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-8 text-center border border-purple-500/20">
                  <div className="text-3xl font-bold text-white mb-2">{result.split(' ')[0]}</div>
                  <p className="text-gray-300 leading-relaxed">{result.split(' ').slice(1).join(' ')}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to get started?</h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Let's discuss your project requirements and create something amazing together.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link to="/contact" className="inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all">
            Get Free Consultation <ArrowRight size={20} className="ml-2" />
          </Link>
          <Link to="/projects" className="inline-flex items-center px-8 py-4 rounded-xl border-2 border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 font-semibold text-lg transition-all">
            View Our Work
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail; 