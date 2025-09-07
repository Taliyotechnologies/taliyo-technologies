import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'https://taliyo-backend.onrender.com'

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [allTags, setAllTags] = useState([])
  const [selectedTag, setSelectedTag] = useState('All')
  const [modal, setModal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const buildSampleProjects = () => {
    const year = new Date().getFullYear()
    const img = (seed) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/600`
    const base = [
      { title: 'E‑commerce Fashion Store', description: 'High‑performance ecommerce site with personalized recommendations and seamless checkout.', category: 'ecommerce', tags: ['Ecommerce', 'Next.js', 'Stripe'], technologies: ['React', 'Next.js', 'Node.js', 'Stripe'] },
      { title: 'Food Delivery Mobile App', description: 'Real‑time order tracking, geolocation, and restaurant discovery for a city‑wide network.', category: 'mobile', tags: ['Mobile', 'Maps', 'Realtime'], technologies: ['React Native', 'Socket.IO', 'Node.js'] },
      { title: 'SaaS CRM Dashboard', description: 'Multi‑tenant CRM with analytics, role‑based access, and billing integration.', category: 'saas', tags: ['SaaS', 'Analytics', 'Dashboard'], technologies: ['React', 'Chart.js', 'Express', 'MongoDB'] },
      { title: 'Healthcare Appointment System', description: 'Scheduling platform with reminders and telemedicine integration.', category: 'healthcare', tags: ['Healthcare', 'Scheduling'], technologies: ['Node.js', 'React', 'Twilio'] },
      { title: 'Fintech Payments Gateway', description: 'Secure payment orchestration with fraud detection and dynamic routing.', category: 'fintech', tags: ['Fintech', 'Payments', 'Security'], technologies: ['Node.js', 'NestJS', 'PostgreSQL'] },
      { title: 'Real Estate Listing Portal', description: 'Advanced search, map filters, and agent dashboards for property management.', category: 'real-estate', tags: ['Portal', 'Search', 'Maps'], technologies: ['React', 'Elasticsearch', 'Leaflet'] },
      { title: 'Education LMS Platform', description: 'Course authoring, quizzes, and progress tracking for remote learning.', category: 'education', tags: ['LMS', 'Video', 'Quizzes'], technologies: ['React', 'Node.js', 'MongoDB'] },
      { title: 'Travel Booking Website', description: 'Hotel and flight aggregation with price alerts and user reviews.', category: 'travel', tags: ['Travel', 'Booking'], technologies: ['Next.js', 'Node.js', 'Redis'] },
      { title: 'Restaurant Ordering System', description: 'QR‑based table ordering, kitchen screens, and POS integration.', category: 'restaurant', tags: ['Ordering', 'POS'], technologies: ['React', 'WebSockets', 'MySQL'] },
      { title: 'Agency Portfolio Website', description: 'Animated case studies with SEO‑optimized pages and blazing performance.', category: 'portfolio', tags: ['Portfolio', 'SEO', 'Animations'], technologies: ['Vite', 'React', 'GSAP'] },
    ]
    return base.map((p, i) => ({
      ...p,
      slug: `${p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${i + 1}`,
      status: 'completed',
      progress: 100,
      startDate: new Date(year - 1, (i % 12), 1).toISOString(),
      endDate: new Date(year - 1, (i % 12) + 1, 1).toISOString(),
      budget: 0,
      team: [],
      priority: 'medium',
      duration: '4-8 weeks',
      liveUrl: '',
      githubUrl: '',
      image: img(p.title),
      overview: p.description,
      features: ['Responsive UI', 'Fast performance', 'Secure auth'],
      results: ['Improved conversions', 'Reduced bounce rate'],
      year: year - (i % 2),
      isPublished: true,
      publishedAt: new Date(year - (i % 2), (i % 12), 10).toISOString(),
      createdAt: new Date(year - (i % 2), (i % 12), 5).toISOString(),
      updatedAt: new Date(year - (i % 2), (i % 12), 12).toISOString(),
    }))
  }

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API}/api/projects?limit=100`)
        const data = await res.json()
        if (!res.ok || data.success === false) throw new Error(data.message || 'Failed to load projects')
        let items = Array.isArray(data.items) ? data.items : (Array.isArray(data) ? data : [])
        if (!items || items.length === 0) {
          items = buildSampleProjects()
        }
        setProjects(items)
        const tags = Array.from(new Set(items.flatMap(p => Array.isArray(p.tags) ? p.tags : [])))
        setAllTags(tags)
      } catch (e) {
        // Fallback to sample data when fetch fails
        const sample = buildSampleProjects()
        setProjects(sample)
        const tags = Array.from(new Set(sample.flatMap(p => Array.isArray(p.tags) ? p.tags : [])))
        setAllTags(tags)
        setError('')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = selectedTag === 'All' ? projects : projects.filter(p => Array.isArray(p.tags) && p.tags.includes(selectedTag))

  return (
    <>
      <Helmet>
        <title>Our Projects | Taliyo Technologies</title>
        <meta name="description" content="Explore our portfolio of web, app, SaaS, and AI projects delivered for leading companies." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden px-4 md:px-0">
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
            Our <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Projects</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto mb-8"
          >
            Explore our portfolio of web, app, SaaS, and AI projects delivered for leading companies.
          </motion.p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="py-8 bg-gray-950">
        <div className="container mx-auto px-4 flex flex-wrap gap-3 justify-center">
          <button
            className={`px-5 py-2 rounded-full font-medium text-sm transition-all border border-blue-500/30 text-blue-300 hover:bg-blue-500/10 hover:text-white ${selectedTag === 'All' ? 'bg-blue-500/20 text-white' : ''}`}
            onClick={() => setSelectedTag('All')}
          >
            All
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              className={`px-5 py-2 rounded-full font-medium text-sm transition-all border border-blue-500/30 text-blue-300 hover:bg-blue-500/10 hover:text-white ${selectedTag === tag ? 'bg-blue-500/20 text-white' : ''}`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-gray-300">Loading projects...</div>
          ) : error ? (
            <div className="p-4 rounded border border-red-500/30 text-red-300 bg-red-500/10">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="text-gray-400">No projects found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {filtered.map((project, i) => (
                <motion.div
                  key={project._id || project.slug || project.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-6 flex flex-col shadow-lg border border-blue-500/10 cursor-pointer hover:shadow-blue-500/20 transition-shadow duration-300"
                  onClick={() => setModal(project)}
                >
                  <img src={project.image || 'https://via.placeholder.com/800x600?text=Project'} alt={project.title} className="w-full h-48 object-cover rounded-xl mb-5 border border-blue-500/10" />
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(project.tags || []).map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-300 mb-3 flex-1">
                    {project.description}
                  </p>
                  {project.slug && (
                    <Link
                      to={`/projects/${project.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors mt-2"
                    >
                      <span className="text-sm font-medium">View Details</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 group-hover:translate-x-1 transition-transform"><path d="m18 15-6-6-6 6"/></svg>
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal for Project Details */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setModal(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-900 rounded-2xl p-8 max-w-lg w-full border border-blue-500/20 shadow-2xl relative"
            onClick={e => e.stopPropagation()}
          >
            <button className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold" onClick={() => setModal(null)}>&times;</button>
            <img src={modal.image || 'https://via.placeholder.com/800x600?text=Project'} alt={modal.title} className="w-full h-48 object-cover rounded-xl mb-5 border border-blue-500/10" />
            <div className="flex flex-wrap gap-2 mb-3">
              {(modal.tags || []).map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{modal.title}</h3>
            <p className="text-gray-300 mb-4">{modal.description}</p>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">Year: {modal.year}</span>
              {modal.liveUrl && (
                <a href={modal.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium">
                  Live Project <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="m18 15-6-6-6 6"/></svg>
                </a>
              )}
            </div>
          </motion.div>
        </div>
      )}

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
            Let’s discuss your project requirements and create something amazing together. Get in touch for a free consultation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="/contact"
              className="group px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center focus:outline-none focus:ring-4 focus:ring-white/50"
              aria-label="Contact us"
            >
              Contact Us
            </a>
            <a
              href="/services"
              className="group px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold rounded-xl transition-all duration-300 flex items-center focus:outline-none focus:ring-4 focus:ring-white/50"
              aria-label="View our services"
            >
              View Services
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

export default Projects 