import React, { useState } from 'react';
import { Edit, Download, Upload, RefreshCcw, Search, CheckCircle, AlertTriangle, Eye } from 'lucide-react';

const dummyPages = [
  {
    id: 1,
    name: 'Home',
    url: '/',
    meta: {
      title: 'Taliyo Technologies - Top IT Company in India',
      description: 'Leading IT company in India offering web development, app development, graphic design, and digital marketing services.',
      keywords: 'IT company, web development, app development, digital marketing, graphic design, Delhi, India',
      ogTitle: 'Taliyo Technologies - Top IT Company in India',
      ogDescription: 'Leading IT company in India offering web development, app development, graphic design, and digital marketing services.',
      ogImage: 'https://taliyo.com/og-image.jpg',
      ogType: 'website',
      ogUrl: 'https://taliyo.com/',
      twitterTitle: 'Taliyo Technologies - Top IT Company in India',
      twitterDescription: 'Leading IT company in India offering web development, app development, graphic design, and digital marketing services.',
      twitterImage: 'https://taliyo.com/twitter-image.jpg',
      twitterCard: 'summary_large_image',
      canonical: 'https://taliyo.com/',
      robots: 'index, follow',
      custom: [],
    },
    status: 'complete',
  },
  {
    id: 2,
    name: 'About',
    url: '/about',
    meta: {
      title: 'About Us - Taliyo Technologies',
      description: 'Learn more about Taliyo Technologies, our mission, vision, and team.',
      keywords: 'about, taliyo, team, mission, vision',
      ogTitle: 'About Us - Taliyo Technologies',
      ogDescription: 'Learn more about Taliyo Technologies, our mission, vision, and team.',
      ogImage: '',
      ogType: 'website',
      ogUrl: 'https://taliyo.com/about',
      twitterTitle: 'About Us - Taliyo Technologies',
      twitterDescription: 'Learn more about Taliyo Technologies, our mission, vision, and team.',
      twitterImage: '',
      twitterCard: 'summary',
      canonical: 'https://taliyo.com/about',
      robots: 'index, follow',
      custom: [],
    },
    status: 'warning',
  },
  {
    id: 3,
    name: 'Contact',
    url: '/contact',
    meta: {
      title: '',
      description: '',
      keywords: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      ogType: 'website',
      ogUrl: 'https://taliyo.com/contact',
      twitterTitle: '',
      twitterDescription: '',
      twitterImage: '',
      twitterCard: 'summary',
      canonical: 'https://taliyo.com/contact',
      robots: 'noindex, nofollow',
      custom: [],
    },
    status: 'incomplete',
  },
];

const statusColors = {
  complete: 'bg-green-600',
  warning: 'bg-yellow-500',
  incomplete: 'bg-red-600',
};
const statusLabels = {
  complete: 'Complete',
  warning: 'Warning',
  incomplete: 'Incomplete',
};

const SeoMeta = () => {
  const [pages, setPages] = useState(dummyPages);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMeta, setEditMeta] = useState(null);

  const filtered = pages.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.url.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    alert('Exported meta as JSON (dummy)');
  };
  const handleImport = () => {
    alert('Import meta from JSON (dummy)');
  };
  const handleReset = () => {
    alert('Reset to default meta (dummy)');
  };
  const handleEdit = (page) => {
    setEditMeta({ ...page });
    setShowModal(true);
  };
  const handleSave = () => {
    setPages(pages.map(p => p.id === editMeta.id ? { ...editMeta, status: 'complete' } : p));
    setShowModal(false);
  };
  const handlePreview = (meta) => {
    setSelected(meta);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-2 sm:mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-white">SEO & Meta Control</h1>
        <div className="flex gap-2">
          <button onClick={handleExport} className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded font-semibold transition text-xs sm:text-sm"><Download className="w-4 h-4 mr-2" /> Export</button>
          <button onClick={handleImport} className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-4 py-2 rounded font-semibold transition text-xs sm:text-sm"><Upload className="w-4 h-4 mr-2" /> Import</button>
          <button onClick={handleReset} className="flex items-center bg-gray-700 hover:bg-gray-800 text-white px-3 sm:px-4 py-2 rounded font-semibold transition text-xs sm:text-sm"><RefreshCcw className="w-4 h-4 mr-2" /> Reset</button>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-2">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search page name or URL..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
          />
          <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
        </div>
      </div>
      <div className="bg-gray-900 rounded-xl shadow overflow-x-auto">
        <table className="min-w-[700px] w-full text-left text-xs sm:text-sm">
          <thead>
            <tr>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-gray-400 font-semibold whitespace-nowrap">Page</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-gray-400 font-semibold whitespace-nowrap">URL</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-gray-400 font-semibold whitespace-nowrap">Status</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-gray-400 font-semibold whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((page) => (
              <tr key={page.id} className="border-b border-gray-800 hover:bg-gray-800">
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-white font-medium whitespace-nowrap">{page.name}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-blue-400 font-medium whitespace-nowrap">{page.url}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-3">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold text-white ${statusColors[page.status]}`}>{statusLabels[page.status]}</span>
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 flex items-center gap-1 sm:gap-2">
                  <button onClick={() => handleEdit(page)} className="bg-gray-800 hover:bg-blue-600 text-white rounded p-2 transition" title="Edit"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handlePreview(page.meta)} className="bg-gray-800 hover:bg-green-600 text-white rounded p-2 transition" title="Preview"><Eye className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Live Preview */}
      {selected && (
        <div className="bg-gray-900 rounded-xl p-4 mt-2 max-w-2xl mx-auto shadow">
          <div className="mb-2 text-gray-400 text-xs">Google Snippet Preview</div>
          <div className="bg-gray-800 rounded p-3">
            <div className="text-blue-400 text-sm font-semibold truncate">{selected.title || 'Page Title'}</div>
            <div className="text-green-500 text-xs mb-1">{selected.canonical || 'https://yourdomain.com/page'}</div>
            <div className="text-gray-300 text-xs line-clamp-2">{selected.description || 'Meta description will appear here.'}</div>
          </div>
        </div>
      )}
      {/* Edit Modal */}
      {showModal && editMeta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-2">
          <div className="bg-gray-900 rounded-xl p-4 sm:p-6 w-full max-w-lg shadow-xl relative overflow-y-auto max-h-[90vh]">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl" onClick={() => setShowModal(false)}>×</button>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Edit Meta for {editMeta.name}</h2>
            <div className="space-y-2">
              <input type="text" className="w-full rounded bg-gray-800 text-white px-3 py-2 text-xs sm:text-sm" placeholder="Title" value={editMeta.meta.title} onChange={e => setEditMeta({ ...editMeta, meta: { ...editMeta.meta, title: e.target.value } })} />
              <textarea className="w-full rounded bg-gray-800 text-white px-3 py-2 text-xs sm:text-sm" placeholder="Description" value={editMeta.meta.description} onChange={e => setEditMeta({ ...editMeta, meta: { ...editMeta.meta, description: e.target.value } })} />
              <input type="text" className="w-full rounded bg-gray-800 text-white px-3 py-2 text-xs sm:text-sm" placeholder="Keywords" value={editMeta.meta.keywords} onChange={e => setEditMeta({ ...editMeta, meta: { ...editMeta.meta, keywords: e.target.value } })} />
              <input type="text" className="w-full rounded bg-gray-800 text-white px-3 py-2 text-xs sm:text-sm" placeholder="Canonical URL" value={editMeta.meta.canonical} onChange={e => setEditMeta({ ...editMeta, meta: { ...editMeta.meta, canonical: e.target.value } })} />
              <select className="w-full rounded bg-gray-800 text-white px-3 py-2 text-xs sm:text-sm" value={editMeta.meta.robots} onChange={e => setEditMeta({ ...editMeta, meta: { ...editMeta.meta, robots: e.target.value } })}>
                <option value="index, follow">index, follow</option>
                <option value="noindex, nofollow">noindex, nofollow</option>
              </select>
              <div className="font-semibold text-gray-400 mt-2">Open Graph</div>
              <input type="text" className="w-full rounded bg-gray-800 text-white px-3 py-2 text-xs sm:text-sm" placeholder="og:title" value={editMeta.meta.ogTitle} onChange={e => setEditMeta({ ...editMeta, meta: { ...editMeta.meta, ogTitle: e.target.value } })} />
              <input type="text" className="w-full rounded bg-gray-800 text-white px-3 py-2 text-xs sm:text-sm" placeholder="og:description" value={editMeta.meta.ogDescription} onChange={e => setEditMeta({ ...editMeta, meta: { ...editMeta.meta, ogDescription: e.target.value } })} />
              <input type="text" className="w-full rounded bg-gray-800 text-white px-3 py-2 text-xs sm:text-sm" placeholder="og:image" value={editMeta.meta.ogImage} onChange={e => setEditMeta({ ...editMeta, meta: { ...editMeta.meta, ogImage: e.target.value } })} />
              <input type="text" className="w-full rounded bg-gray-800 text-white px-3 py-2 text-xs sm:text-sm" placeholder="og:type" value={editMeta.meta.ogType} onChange={e => setEditMeta({ ...editMeta, meta: { ...editMeta.meta, ogType: e.target.value } })} />
              <input type="text" className="w-full rounded bg-gray-800 text-white px-3 py-2 text-xs sm:text-sm" placeholder="og:url" value={editMeta.meta.ogUrl} onChange={e => setEditMeta({ ...editMeta, meta: { ...editMeta.meta, ogUrl: e.target.value } })} />
              <div className="font-semibold text-gray-400 mt-2">Twitter Card</div>
              <input type="text" className="w-full rounded bg-gray-800 text-white px-3 py-2 text-xs sm:text-sm" placeholder="twitter:title" value={editMeta.meta.twitterTitle} onChange={e => setEditMeta({ ...editMeta, meta: { ...editMeta.meta, twitterTitle: e.target.value } })} />
              <input type="text" className="w-full rounded bg-gray-800 text-white px-3 py-2 text-xs sm:text-sm" placeholder="twitter:description" value={editMeta.meta.twitterDescription} onChange={e => setEditMeta({ ...editMeta, meta: { ...editMeta.meta, twitterDescription: e.target.value } })} />
              <input type="text" className="w-full rounded bg-gray-800 text-white px-3 py-2 text-xs sm:text-sm" placeholder="twitter:image" value={editMeta.meta.twitterImage} onChange={e => setEditMeta({ ...editMeta, meta: { ...editMeta.meta, twitterImage: e.target.value } })} />
              <input type="text" className="w-full rounded bg-gray-800 text-white px-3 py-2 text-xs sm:text-sm" placeholder="twitter:card" value={editMeta.meta.twitterCard} onChange={e => setEditMeta({ ...editMeta, meta: { ...editMeta.meta, twitterCard: e.target.value } })} />
              <div className="font-semibold text-gray-400 mt-2">Custom Meta Tags</div>
              {/* Custom meta tags UI (add/remove) */}
              <button onClick={handleSave} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeoMeta; 