import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, Tag, ArrowLeft } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'https://taliyo-backend.onrender.com';

export default function Post() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API}/api/blogs/${encodeURIComponent(slug)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || 'Failed to load blog');
        if (!ignore) {
          setPost(data);
          // load related by category
          if (data?.category) {
            try {
              const r = await fetch(`${API}/api/blogs?category=${encodeURIComponent(data.category)}&limit=4`);
              const rr = await r.json();
              if (Array.isArray(rr)) {
                const filtered = rr.filter(b => b.slug !== data.slug).slice(0, 3);
                setRelated(filtered);
              }
            } catch {}
          }
        }
      } catch (e) {
        if (!ignore) setError(e.message || 'Something went wrong');
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => { ignore = true; };
  }, [slug]);

  const readingTime = useMemo(() => {
    if (!post?.content) return 3;
    const words = String(post.content).replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    return Math.max(2, Math.round(words / 200));
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-gray-300">Loading post...</div>
    );
  }
  if (error) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-2xl font-semibold text-white mb-2">Failed to load post</h1>
        <p className="text-gray-400 mb-6">{error}</p>
        <Link to="/blog" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-800">
          <ArrowLeft className="w-4 h-4" /> Back to Blogs
        </Link>
      </div>
    );
  }
  if (!post) return null;

  const published = new Date(post.publishedAt || Date.now()).toLocaleDateString();

  return (
    <>
      <Helmet>
        <title>{post.title} | Taliyo Technologies Blog</title>
        <meta name="description" content={post.excerpt || post.description || ''} />
        {Array.isArray(post.keywords) && post.keywords.length > 0 && (
          <meta name="keywords" content={post.keywords.join(', ')} />
        )}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || post.description || ''} />
        {post.image && <meta property="og:image" content={post.image} />}
        <meta property="og:type" content="article" />
        <link rel="canonical" href={`https://taliyotechnologies.com/blog/${post.slug}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt || post.description || '',
            image: post.image || undefined,
            author: [{ '@type': 'Organization', name: 'Taliyo Technologies' }],
            publisher: { '@type': 'Organization', name: 'Taliyo Technologies' },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://taliyotechnologies.com/blog/${post.slug}`
            },
            datePublished: post.publishedAt || undefined,
            dateModified: post.updatedAt || post.publishedAt || undefined,
            keywords: Array.isArray(post.keywords) ? post.keywords.join(', ') : undefined,
            articleSection: post.category || 'General'
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://taliyotechnologies.com/' },
              { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://taliyotechnologies.com/blog' },
              { '@type': 'ListItem', position: 3, name: post.title, item: `https://taliyotechnologies.com/blog/${post.slug}` }
            ]
          })}
        </script>
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {post.image && (
          <div className="absolute inset-0 -z-10">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-b from-gray-950/90 via-gray-950/95 to-gray-950" />
          </div>
        )}
        <div className="container mx-auto px-4 py-14 md:py-20">
          <div className="max-w-3xl">
            <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-gray-300">
              <span className="px-2 py-0.5 rounded-full border border-gray-700 text-gray-200">{post.category || 'General'}</span>
              <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" /> {published}</span>
              <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {readingTime} min read</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-3">{post.title}</h1>
            {post.excerpt && <p className="text-gray-300 text-lg">{post.excerpt}</p>}
            <div className="mt-4 flex flex-wrap gap-1">
              {(post.tags || []).map(t => (
                <span key={t} className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 bg-blue-500/10 text-blue-300 rounded-full"><Tag className="w-3 h-3" /> {t}</span>
              ))}
            </div>
            <div className="mt-6">
              <Link to="/blog" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-800">
                <ArrowLeft className="w-4 h-4" /> Back to Blogs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Article */}
      <section className="py-10 md:py-14 bg-gray-950">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <article className="lg:col-span-8">
            <div className="prose prose-invert max-w-none prose-headings:scroll-mt-24">
              <ArticleContent html={post.content} />
            </div>
          </article>
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
                <h3 className="text-sm font-semibold text-white mb-3">About this article</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li><span className="text-gray-400">Published:</span> {published}</li>
                  <li><span className="text-gray-400">Category:</span> {post.category || 'General'}</li>
                  <li><span className="text-gray-400">Read time:</span> {readingTime} min</li>
                </ul>
              </div>
              {related.length > 0 && (
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
                  <h3 className="text-sm font-semibold text-white mb-3">Related Posts</h3>
                  <div className="space-y-3">
                    {related.map(r => (
                      <Link key={r.slug} to={`/blog/${r.slug}`} className="block group">
                        <div className="flex gap-3">
                          {r.image && <img src={r.image} alt={r.title} className="w-16 h-16 object-cover rounded border border-gray-800" />}
                          <div>
                            <p className="text-sm text-white group-hover:text-blue-300 line-clamp-2">{r.title}</p>
                            <p className="text-xs text-gray-400">{new Date(r.publishedAt || Date.now()).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

function ArticleContent({ html }) {
  if (!html) return null;
  // Basic sanitize: strip script tags
  const safe = String(html).replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script>/gi, '');
  return <div dangerouslySetInnerHTML={{ __html: safe }} />;
}
