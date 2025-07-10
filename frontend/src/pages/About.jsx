import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Users, Award, Lightbulb, Shield, Heart, Linkedin, Eye, Target, Zap, Globe, Star, CheckCircle, ArrowRight, Phone, Mail, MapPin } from 'lucide-react'
import aboutCompanyImg from '../assets/about company.jpg';
import businessVisionImg from '../assets/business-vision.webp';
import teamImg from '../assets/logo1.png';
import taliyoLogo from '../assets/taliyo logo.png';
import ishaMehraImg from '../assets/isha mehra.jpg';
import uditaImg from '../assets/udita .jpg';
import virajImg from '../assets/viraj srivastav.jpg';
import mdAmanImg from '../assets/md aman.jpeg';
import sriRamImg from '../assets/sri ram.jpg';

const team = [
  {
    name: 'Harsh Budhauliya',
    role: 'CEO & Founder',
    experience: '6+ years',
    expertise: 'Strategic Leadership, Business Development',
    img: taliyoLogo,
    linkedin: 'https://www.linkedin.com/in/harsh-budhauliya/',
    bio: 'Visionary leader with expertise in scaling tech companies and driving innovation.'
  },
  {
    name: 'Viraj Shrivastav',
    role: 'COM & Co-Founder',
    experience: '6+ years',
    expertise: 'Communications, Operations Management',
    img: virajImg,
    linkedin: 'https://www.linkedin.com/in/viraj-srivastav/',
    bio: 'Expert in communications and operations, driving company success and co-founding vision.'
  },
  {
    name: 'MD Aman',
    role: 'CMO',
    experience: '4+ years',
    expertise: 'Marketing, Brand Strategy',
    img: mdAmanImg,
    linkedin: '#',
    bio: 'Creative marketing leader focused on growth and brand experiences.'
  },
  {
    name: 'Isha Mehra',
    role: 'CTO',
    experience: '7+ years',
    expertise: 'Cloud, Security, AI',
    img: ishaMehraImg,
    linkedin: '#',
    bio: 'Technology leader driving innovation and technical excellence.'
  },
  {
    name: 'Udita Shori',
    role: 'HR Head',
    experience: '6+ years',
    expertise: 'Human Resources, Talent Management',
    img: uditaImg,
    linkedin: '#',
    bio: 'HR expert ensuring a great workplace and team culture.'
  },
  {
    name: 'Sri Ram',
    role: 'Team Leader',
    experience: '5+ years',
    expertise: 'Team Management, Project Delivery',
    img: sriRamImg,
    linkedin: '#',
    bio: 'Team leader focused on successful project execution and collaboration.'
  },
];

const timeline = [
  { year: '2019', title: 'Founded', desc: 'Taliyo Technologies is born in Delhi with a vision to transform businesses through technology.', achievements: ['First office setup', 'Core team formation'] },
  { year: '2020', title: 'First 50 Clients', desc: 'Rapid growth and first major projects across web development and digital marketing.', achievements: ['50+ successful projects', 'Team expansion to 15 members'] },
  { year: '2021', title: 'Awarded Best Startup', desc: 'Recognized for innovation and quality in the Delhi startup ecosystem.', achievements: ['Industry recognition', 'Client base growth to 200+'] },
  { year: '2022', title: 'Technology Expansion', desc: 'Expanded services to include AI/ML, mobile app development, and advanced analytics.', achievements: ['New service offerings', 'Technical team growth'] },
  { year: '2023', title: 'Global Expansion', desc: 'Serving clients worldwide with offices in multiple cities and remote teams.', achievements: ['International clients', '500+ projects completed'] },
  { year: '2024', title: 'Future Ready', desc: 'Leading the digital transformation with cutting-edge technologies and innovative solutions.', achievements: ['AI integration', 'Global partnerships'] },
]

const values = [
  {
    icon: Lightbulb,
    title: 'Innovation',
    desc: 'We embrace new ideas and technologies, constantly pushing boundaries to deliver cutting-edge solutions that drive business growth.',
    color: 'text-yellow-400'
  },
  {
    icon: Shield,
    title: 'Integrity',
    desc: 'We act with honesty and transparency in all our dealings, building trust with clients and maintaining the highest ethical standards.',
    color: 'text-blue-400'
  },
  {
    icon: Heart,
    title: 'Customer Focus',
    desc: 'We put our clients at the center of everything we do, understanding their needs and delivering solutions that exceed expectations.',
    color: 'text-pink-400'
  },
  {
    icon: Award,
    title: 'Excellence',
    desc: 'We deliver the highest quality solutions with attention to detail, ensuring every project meets our rigorous standards.',
    color: 'text-green-400'
  },
  {
    icon: Target,
    title: 'Results-Driven',
    desc: 'We focus on measurable outcomes and tangible results, helping clients achieve their business objectives and ROI.',
    color: 'text-purple-400'
  },
  {
    icon: Globe,
    title: 'Global Perspective',
    desc: 'We bring international best practices and diverse perspectives to every project, ensuring world-class solutions.',
    color: 'text-orange-400'
  },
]

const stats = [
  { number: '500+', label: 'Happy Clients', icon: Users },
  { number: '1000+', label: 'Projects Completed', icon: Award },
  { number: '50+', label: 'Team Members', icon: Users },
  { number: '99%', label: 'Client Satisfaction', icon: Star },
]

const About = () => (
  <>
    <Helmet>
      <title>About Us | Taliyo Technologies - Leading IT Solutions Company</title>
      <meta name="description" content="Learn about Taliyo Technologies, our mission, team, and values. We are a leading IT company delivering innovative digital solutions with 500+ happy clients worldwide." />
      <meta name="keywords" content="Taliyo Technologies, IT company, web development, digital marketing, about us, team, values" />
    </Helmet>

    {/* Hero Section */}
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden px-4 md:px-0 mt-20">
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
          About <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Taliyo Technologies</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed"
        >
          Empowering businesses with innovative digital solutions, cutting-edge technology, and a passion for excellence. We transform ideas into powerful digital experiences that drive growth and success.
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

    {/* Mission / Who We Are */}
    <section className="py-20 bg-gray-950">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-6"
          >
            Who We Are
          </motion.h2>
          <p className="text-lg text-gray-300 mb-6 leading-relaxed">
            Taliyo Technologies is a leading IT company based in Delhi, India, specializing in comprehensive digital solutions including web development, mobile app development, digital marketing, and creative design. Our mission is to help businesses thrive in the digital age through innovative, reliable, and scalable solutions that drive real results.
          </p>
          <p className="text-base text-gray-400 mb-6 leading-relaxed">
            With over 500+ successful projects and a team of 50+ experts, we combine technical excellence with creative innovation to deliver solutions that not only meet but exceed client expectations. Our customer-centric approach ensures that every project is tailored to specific business needs and goals.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="space-y-3 text-gray-400 text-base">
              <li className="flex items-center"><CheckCircle className="text-green-400 mr-2" size={16} /> 500+ happy clients worldwide</li>
              <li className="flex items-center"><CheckCircle className="text-green-400 mr-2" size={16} /> Award-winning team of experts</li>
              <li className="flex items-center"><CheckCircle className="text-green-400 mr-2" size={16} /> Cutting-edge technology & AI-driven solutions</li>
            </ul>
            <ul className="space-y-3 text-gray-400 text-base">
              <li className="flex items-center"><CheckCircle className="text-green-400 mr-2" size={16} /> Customer-centric approach</li>
              <li className="flex items-center"><CheckCircle className="text-green-400 mr-2" size={16} /> 99% client satisfaction rate</li>
              <li className="flex items-center"><CheckCircle className="text-green-400 mr-2" size={16} /> 24/7 support and maintenance</li>
            </ul>
          </div>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <img
            src={aboutCompanyImg}
            alt="About Taliyo Technologies Company"
            className="rounded-2xl shadow-2xl max-w-xs md:max-w-sm lg:max-w-md w-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>

    {/* Our Vision Section */}
    <section className="py-16 bg-gradient-to-br from-gray-900 via-gray-950 to-black">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
        {/* Illustration */}
        <div className="flex-1 flex justify-center mb-8 md:mb-0">
          <img
            src={businessVisionImg}
            alt="Taliyo Technologies Vision"
            className="w-80 md:w-[28rem] rounded-2xl shadow-2xl border border-blue-500/10 bg-gradient-to-br from-blue-500/10 to-purple-500/10"
            loading="lazy"
          />
        </div>
        {/* Text */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Our <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">Vision</span>
          </h2>
          <p className="text-lg text-gray-300 mb-4 leading-relaxed">
            To be a global leader in digital innovation, empowering businesses to thrive in a connected world through cutting-edge technology and creative solutions.
          </p>
          <p className="text-base text-gray-400 leading-relaxed">
            We create technology that not only solves today's challenges but also anticipates tomorrow's opportunities. Our passion for progress drives us to deliver solutions that inspire growth, foster trust, and make a positive impact on society. We envision a future where every business can leverage the power of technology to achieve unprecedented success.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center text-blue-400">
              <Zap className="mr-2" size={20} />
              <span className="text-sm font-medium">Innovation First</span>
            </div>
            <div className="flex items-center text-green-400">
              <Globe className="mr-2" size={20} />
              <span className="text-sm font-medium">Global Reach</span>
            </div>
            <div className="flex items-center text-purple-400">
              <Target className="mr-2" size={20} />
              <span className="text-sm font-medium">Results Driven</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Timeline / Journey */}
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-white mb-12 text-center"
        >
          Our Journey
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {timeline.map((item, i) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800/70 rounded-2xl p-8 shadow-lg border border-blue-500/10 hover:border-blue-500/30 transition-all"
            >
              <div className="text-2xl font-bold text-blue-400 mb-2">{item.year}</div>
              <div className="text-lg font-semibold text-white mb-3">{item.title}</div>
              <div className="text-gray-300 mb-4 leading-relaxed">{item.desc}</div>
              <div className="space-y-2">
                {item.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-400">
                    <CheckCircle className="text-green-400 mr-2" size={14} />
                    {achievement}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Values Section */}
    <section className="py-20 bg-gray-950">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-white mb-12 text-center"
        >
          Our Core Values
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {values.map((val, i) => (
            <motion.div
              key={val.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-8 flex flex-col items-center text-center shadow-lg border border-blue-500/10 hover:border-blue-500/30 transition-all"
            >
              <val.icon size={40} className={`mb-4 ${val.color}`} />
              <div className="text-xl font-semibold text-white mb-3">{val.title}</div>
              <div className="text-gray-300 leading-relaxed">{val.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Meet the Team */}
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-white mb-12 text-center"
        >
          Meet Our Expert Team
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800/70 rounded-2xl p-6 flex flex-col items-center text-center shadow-lg border border-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300"
            >
              <img src={member.img} alt={member.name} className="w-24 h-24 rounded-full mb-4 object-cover border-2 border-blue-400 shadow" />
              <div className="text-xl font-semibold text-white mb-1">{member.name}</div>
              <div className="text-blue-400 text-sm mb-2">{member.role}</div>
              <div className="text-gray-400 text-xs mb-3">{member.experience} Experience</div>
              <div className="text-gray-300 text-sm mb-4 leading-relaxed">{member.bio}</div>
              <div className="text-gray-400 text-xs mb-4">
                <strong>Expertise:</strong> {member.expertise}
              </div>
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-300 hover:text-blue-400 transition-colors">
                <Linkedin size={18} className="mr-1" /> LinkedIn
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

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

    {/* Testimonials Section */}
    <section className="py-20 bg-gray-900" aria-label="Client Testimonials">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-white mb-12 text-center"
        >
          What Our Clients Say
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              name: "Amit Sharma",
              company: "FinEdge Solutions",
              role: "CEO",
              quote: "Taliyo Technologies delivered our project on time with exceptional quality. Their team is highly professional and responsive. The website they built increased our conversions by 150%!",
              photo: "https://randomuser.me/api/portraits/men/32.jpg",
              rating: 5
            },
            {
              name: "Priya Verma",
              company: "Verma Designs",
              role: "Founder",
              quote: "The best web development partner we've worked with. Creative, reliable, and always ahead of the curve. They transformed our vision into a stunning digital experience.",
              photo: "https://randomuser.me/api/portraits/women/44.jpg",
              rating: 5
            },
            {
              name: "John Lee",
              company: "TechNova Inc.",
              role: "Marketing Director",
              quote: "Their digital marketing strategies helped us grow our business online. We saw a 200% increase in organic traffic within 6 months. Highly recommended!",
              photo: "https://randomuser.me/api/portraits/men/65.jpg",
              rating: 5
            },
            {
              name: "Sara Ali",
              company: "Ali Ventures",
              role: "Product Manager",
              quote: "Amazing UI/UX design and seamless app delivery. We loved working with Taliyo! Their attention to detail and user experience expertise is outstanding.",
              photo: "https://randomuser.me/api/portraits/women/68.jpg",
              rating: 5
            },
            {
              name: "Rohit Singh",
              company: "Singh Logistics",
              role: "Operations Head",
              quote: "Great support and communication throughout the project. Will definitely hire again. They understood our business needs perfectly and delivered beyond expectations.",
              photo: "https://randomuser.me/api/portraits/men/77.jpg",
              rating: 5
            },
            {
              name: "Anjali Patel",
              company: "Patel Enterprises",
              role: "Founder & CEO",
              quote: "Taliyo's team is incredibly talented and professional. They helped us build a comprehensive digital presence that drives real business results. Exceptional service!",
              photo: "https://randomuser.me/api/portraits/women/89.jpg",
              rating: 5
            }
          ].map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800/70 rounded-2xl p-6 shadow-lg border border-blue-500/10 hover:border-blue-500/30 transition-all"
              aria-label={`Testimonial from ${testimonial.name}`}
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.photo}
                  alt={`Photo of ${testimonial.name}`}
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 shadow mr-4"
                  loading="lazy"
                />
                <div>
                  <div className="text-lg font-semibold text-white">{testimonial.name}</div>
                  <div className="text-blue-400 text-sm">{testimonial.role}</div>
                  <div className="text-gray-400 text-xs">{testimonial.company}</div>
                </div>
              </div>
              <div className="flex items-center mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="text-yellow-400" size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-gray-200 text-sm leading-relaxed">"{testimonial.quote}"</p>
            </motion.div>
          ))}
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
          Join 500+ satisfied clients who trust Taliyo Technologies for their digital success. Let's create something amazing together!
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a
            href="/contact"
            className="group px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center focus:outline-none focus:ring-4 focus:ring-white/50"
            aria-label="Contact us"
          >
            Get Free Consultation <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="/projects"
            className="group px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold rounded-xl transition-all duration-300 flex items-center focus:outline-none focus:ring-4 focus:ring-white/50"
            aria-label="View our work"
          >
            View Our Work <Eye size={20} className="ml-2 group-hover:scale-110 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  </>
)

export default About 