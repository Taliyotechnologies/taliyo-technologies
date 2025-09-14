import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { seoLandingPages, seoJsonLd } from '../data/seoLandingPages';

const SEOLanding = () => {
  const { slug } = useParams();
  const page = seoLandingPages.find(p => p.slug === slug);

  if (!page) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white p-8">
        <Helmet>
          <title>Solution Not Found | Taliyo Technologies</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="mb-6">The page you are looking for doesn’t exist.</p>
        <Link to="/services" className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold transition-all hover:from-blue-700 hover:to-purple-700">View Services</Link>
      </div>
    );
  }

  const canonical = `https://taliyotechnologies.com/solutions/${slug}`;
  const jsonLdService = seoJsonLd({ title: page.title, location: page.location, category: page.category });
  const jsonLdFAQ = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: (page.faqs || []).map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-16">
      <Helmet>
        <title>{page.title}</title>
        <meta name="description" content={page.metaDescription} />
        <link rel="canonical" href={canonical} />
        <script type="application/ld+json">{jsonLdService}</script>
        {page.faqs?.length ? (
          <script type="application/ld+json">{jsonLdFAQ}</script>
        ) : null}
      </Helmet>

      {/* Hero */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 mb-12">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">{page.h1}</h1>
          <p className="text-lg text-white/90 mb-8">{page.metaDescription}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="px-8 py-3 rounded-xl bg-white text-gray-900 font-semibold text-lg shadow-lg hover:bg-gray-100 transition-all">Get Free Consultation</Link>
            <Link to="/projects" className="px-8 py-3 rounded-xl border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold text-lg transition-all">View Our Work</Link>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="container mx-auto px-4 mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">Why choose us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(page.highlights || []).map((item, idx) => (
            <div key={idx} className="bg-gray-900 rounded-2xl p-6 border border-blue-500/10 shadow-lg">
              <div className="text-lg text-white leading-relaxed">{item}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      {page.faqs?.length ? (
        <section className="py-16 bg-gray-900">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">FAQs</h2>
            <div className="space-y-4">
              {page.faqs.map((f, i) => (
                <details key={i} className="group bg-gray-800/70 rounded-xl border border-blue-500/10">
                  <summary className="cursor-pointer p-4 text-lg font-semibold text-white">{f.q}</summary>
                  <div className="p-4 text-gray-300 leading-relaxed">{f.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* CTA */}
      <section className="container mx-auto px-4 text-center mt-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to start?</h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Book a free 30‑minute call. We’ll map your scope, budgets, and fastest path to launch.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link to="/contact" className="inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all">
            Get Free Consultation
          </Link>
          <Link to="/services" className="inline-flex items-center px-8 py-4 rounded-xl border-2 border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 font-semibold text-lg transition-all">
            Explore Services
          </Link>
        </div>
      </section>
    </div>
  );
};

export default SEOLanding;
