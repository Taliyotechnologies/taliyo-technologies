import React, { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Calendar, Tag, Search } from 'lucide-react'
import SubscribeForm from '../components/forms/SubscribeForm.jsx';

const API = import.meta.env.VITE_API_URL || 'https://taliyo-backend.onrender.com'

const Blog = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState('All')
  const [showAllTags, setShowAllTags] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API}/api/blogs?limit=30`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Failed to load blogs')
        const list = Array.isArray(data) ? data : []
        setItems(list)
      } catch (e) {
        setError(e.message || 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const allTags = useMemo(() => {
    const t = new Set()
    items.forEach(b => (b.tags || []).forEach(tag => t.add(tag)))
    return ['All', ...Array.from(t)]
  }, [items])

  const filtered = useMemo(() => {
    const r = query ? new RegExp(query.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i') : null
    return items.filter(b => {
      const tagMatch = activeTag === 'All' || (b.tags || []).includes(activeTag)
      const qMatch = !r || r.test(b.title) || r.test(b.excerpt || '')
      return tagMatch && qMatch
    })
  }, [items, query, activeTag])

  return (
    <>
      <Helmet>
        <title>Blog | Taliyo Technologies - Our Story & Vision</title>
        <meta name="description" content="Discover the story, vision, and journey of Taliyo Technologies. Learn what makes us a leading IT company in India." />
        <meta name="keywords" content="Taliyo Technologies, IT company, web development, about us, story, vision, India" />
        <meta property="og:title" content="Blog | Taliyo Technologies" />
        <meta property="og:description" content="Our story, vision, and what makes Taliyo Technologies unique." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://taliyotechnologies.com/blog" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[40vh] sm:min-h-[50vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-950 via-gray-900 to-black">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 mt-8 sm:mt-10 md:mt-16 leading-tight">
            Tech <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Insights</span> & Company Blogs
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto mb-6 leading-relaxed">
            Explore the latest tech trends, company news, and expert insights from Taliyo Technologies.
          </p>
        </div>
      </section>

      {/* Blog Grid Section */}
      <section className="py-12 sm:py-16 bg-gray-950">
        <div className="container mx-auto px-2 sm:px-4 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 text-center">Latest Blogs</h2>
          {/* Filters */}
          <div className="max-w-5xl mx-auto mb-6">
            {/* Tag bar */}
            <div className="relative -mx-2 px-2">
              <div className="overflow-x-auto hide-scrollbar">
                <div className="whitespace-nowrap flex items-center gap-2 pb-2">
                  {(showAllTags ? allTags : allTags.slice(0, 12)).map(tag => (
                    <button key={tag} onClick={() => setActiveTag(tag)} className={`text-xs px-3 py-1.5 rounded-full border shrink-0 ${activeTag===tag?'bg-blue-600 text-white border-blue-600':'border-gray-700 text-gray-300 hover:bg-gray-800'}`}>
                      <span className="inline-flex items-center gap-1"><Tag className="w-3 h-3" /> {tag}</span>
                    </button>
                  ))}
                  {allTags.length > 12 && (
                    <button onClick={() => setShowAllTags(v => !v)} className="text-xs px-3 py-1.5 rounded-full border border-gray-700 text-gray-300 hover:bg-gray-800 shrink-0">
                      {showAllTags ? 'Less' : 'More'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="relative w-full mt-4">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search articles..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 animate-pulse">
                  <div className="w-full h-48 bg-gray-800" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 w-24 bg-gray-800 rounded" />
                    <div className="h-5 w-3/4 bg-gray-800 rounded" />
                    <div className="h-4 w-full bg-gray-800 rounded" />
                    <div className="h-4 w-2/3 bg-gray-800 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-red-400 text-center">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((b) => (
                <article key={b.slug} className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-colors">
                  {b.image && (
                    <Link to={`/blog/${b.slug}`}><img src={b.image} alt={b.title} className="w-full h-48 object-cover" loading="lazy" /></Link>
                  )}
                  <div className="p-5">
                    <div className="mb-2 flex items-center gap-2 text-xs text-gray-400">
                      <span className="px-2 py-0.5 rounded-full border border-gray-700 text-gray-300">{b.category || 'General'}</span>
                      <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(b.publishedAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2"><Link to={`/blog/${b.slug}`} className="hover:text-blue-400">{b.title}</Link></h3>
                    <p className="text-gray-300 text-sm line-clamp-3 min-h-[3.6em]">{b.excerpt || b.description || ''}</p>
                    <div className="mt-4 flex flex-wrap gap-1">
                      {(b.tags || []).slice(0,3).map(t => <span key={t} className="text-[10px] px-2 py-0.5 bg-blue-500/10 text-blue-300 rounded-full">{t}</span>)}
                    </div>
                    <div className="mt-5">
                      <Link to={`/blog/${b.slug}`} className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300">Read More →</Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
      {/* Newsletter Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-2 sm:px-4 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              Stay Updated with Latest Tech Trends
            </h2>
            <p className="text-white/90 mb-8 text-sm sm:text-base leading-relaxed">
              Get the latest insights, tips, and industry updates delivered to your inbox. Join thousands of tech professionals who trust our expertise.
            </p>
            <SubscribeForm />
          </div>
        </div>
      </section>
    </>
  )
}

export default Blog 