import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown } from 'lucide-react'
// import logoT from '../../assets/Untitled design.png';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false)
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Company', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  const services = [
    { name: 'Web Development', href: '/services/web-development' },
    { name: 'App Development', href: '/services/app-development' },
    { name: 'Graphic Design', href: '/services/graphic-design' },
    { name: 'Digital Marketing', href: '/services/digital-marketing' },
  ]

  const companyLinks = [
    { name: 'About', href: '/about' },
    { name: 'Projects', href: '/projects' },
    { name: 'Testimonials', href: '/testimonials' },
    { name: 'Blog', href: '/blog' },
    { name: 'FAQ', href: '/faq' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-gray-900/95 backdrop-blur-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/Taliyo technologies logo.png"
              alt="Taliyo Technologies Logo"
              className="w-8 h-8 lg:w-10 lg:h-10 object-contain"
            />
            <span className="text-xl lg:text-2xl font-bold text-white">
              Taliyo
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {/* Home Link */}
            <Link
              key="Home"
              to="/"
              className={`text-gray-300 hover:text-white transition-colors duration-200 font-medium ${isActive('/') ? 'text-blue-400 font-semibold' : ''}`}
            >
              Home
            </Link>
            {/* Services Dropdown */}
            <div className="relative group">
              <button
                className={`flex items-center text-gray-300 hover:text-white transition-colors duration-200 font-medium ${isActive('/services') ? 'text-blue-400 font-semibold' : ''}`}
                onMouseEnter={() => setIsServicesDropdownOpen(true)}
                onMouseLeave={() => setIsServicesDropdownOpen(false)}
                onClick={() => setIsServicesDropdownOpen((v) => !v)}
                type="button"
              >
                Services <ChevronDown size={18} className="ml-1" />
              </button>
              <AnimatePresence>
                {isServicesDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    onMouseEnter={() => setIsServicesDropdownOpen(true)}
                    onMouseLeave={() => setIsServicesDropdownOpen(false)}
                    className="absolute left-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-xl shadow-lg py-2 z-50"
                  >
                    {services.map((service) => (
                      <Link
                        key={service.name}
                        to={service.href}
                        className="block px-5 py-3 text-gray-300 hover:bg-blue-500/10 hover:text-blue-400 rounded-lg transition-colors"
                        onClick={() => setIsServicesDropdownOpen(false)}
                      >
                        {service.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Company Dropdown */}
            <div className="relative group">
              <button
                className={`flex items-center text-gray-300 hover:text-white transition-colors duration-200 font-medium ${isActive('/about') ? 'text-blue-400 font-semibold' : ''}`}
                onMouseEnter={() => setIsCompanyDropdownOpen(true)}
                onMouseLeave={() => setIsCompanyDropdownOpen(false)}
                onClick={() => setIsCompanyDropdownOpen((v) => !v)}
                type="button"
              >
                Company <ChevronDown size={18} className="ml-1" />
              </button>
              <AnimatePresence>
                {isCompanyDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    onMouseEnter={() => setIsCompanyDropdownOpen(true)}
                    onMouseLeave={() => setIsCompanyDropdownOpen(false)}
                    className="absolute left-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-xl shadow-lg py-2 z-50"
                  >
                    {companyLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.href}
                        className="block px-5 py-3 text-gray-300 hover:bg-blue-500/10 hover:text-blue-400 rounded-lg transition-colors"
                        onClick={() => setIsCompanyDropdownOpen(false)}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Contact Link */}
            <Link
              key="Contact"
              to="/contact"
              className={`text-gray-300 hover:text-white transition-colors duration-200 font-medium ${isActive('/contact') ? 'text-blue-400 font-semibold' : ''}`}
            >
              Contact
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-gray-900 border-t border-gray-800"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <nav className="space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block py-2 text-lg ${
                      isActive(item.href) ? 'text-blue-400 font-semibold' : 'text-gray-300 hover:text-white transition-colors duration-200 font-medium'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Services Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
                    className="flex items-center justify-between w-full py-2 text-lg text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                  >
                    Services
                    <ChevronDown
                      size={20}
                      className={`transition-transform ${
                        isServicesDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isServicesDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-4 space-y-2"
                      >
                        {services.map((service) => (
                          <Link
                            key={service.name}
                            to={service.href}
                            onClick={() => {
                              setIsMobileMenuOpen(false)
                              setIsServicesDropdownOpen(false)
                            }}
                            className="block py-2 text-base text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                          >
                            {service.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Company Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
                    className="flex items-center justify-between w-full py-2 text-lg text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                  >
                    Company
                    <ChevronDown
                      size={20}
                      className={`transition-transform ${isCompanyDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence>
                    {isCompanyDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-4 space-y-2"
                      >
                        {companyLinks.map((link) => (
                          <Link
                            key={link.name}
                            to={link.href}
                            onClick={() => {
                              setIsMobileMenuOpen(false)
                              setIsCompanyDropdownOpen(false)
                            }}
                            className="block py-2 text-base text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                          >
                            {link.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="pt-4 border-t border-gray-800">
                  <Link
                    to="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center w-full px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Get Started
                  </Link>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header 