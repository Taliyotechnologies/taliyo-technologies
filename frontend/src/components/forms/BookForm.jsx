import React, { useState } from 'react';
import { Rocket } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const projectTypes = [
  'Website Development',
  'App Development',
  'UI/UX Design',
  'Digital Marketing',
  'Consultation',
  'Other',
];
const budgets = [
  'Under ₹10,000',
  '₹10,000 - ₹50,000',
  '₹50,000 - ₹100,000',
  '₹100,000 - ₹500,000',
  '₹500,000+',
  'Not specified',
];
const timelines = [
  '1-2 weeks',
  '1 month',
  '2-3 months',
  '3-6 months',
  '6 months+',
  'Not specified',
];

const BookForm = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    budget: '',
    timeline: '',
    requirement: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const res = await fetch(`${API}/api/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess('Thank you! We have received your requirements. Our team will contact you soon.');
        setForm({ name: '', email: '', phone: '', projectType: '', budget: '', timeline: '', requirement: '' });
      } else {
        setError(data.message || 'Failed to submit.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-7 max-w-xl mx-auto p-10 rounded-3xl shadow-2xl border-0 bg-gradient-to-br from-blue-700 via-purple-700 to-indigo-800 relative overflow-hidden"
      style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)' }}
    >
      <div className="flex flex-col items-center mb-2">
        <span className="bg-white/10 p-4 rounded-full mb-2 shadow-md">
          <Rocket size={40} className="text-white drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 8px #a78bfa)' }} />
        </span>
        <h2 className="text-3xl font-extrabold text-white mb-1 text-center tracking-tight drop-shadow-lg" style={{ textShadow: '0 2px 16px #6366f1' }}>Book Your Project</h2>
        <p className="text-indigo-100 text-center text-base mb-2 font-medium">Let’s build something amazing together!</p>
      </div>
      {success && <div className="bg-gradient-to-r from-green-400/90 to-green-200/80 border border-green-300 text-green-900 px-4 py-3 rounded-lg mb-2 text-center font-semibold animate-fade-in shadow-lg">{success}</div>}
      {error && <div className="bg-gradient-to-r from-red-400/90 to-red-200/80 border border-red-300 text-red-900 px-4 py-3 rounded-lg mb-2 text-center font-semibold animate-fade-in shadow-lg">{error}</div>}
      <div>
        <label className="block text-sm font-semibold text-white mb-2">Name *</label>
        <input name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-3 border border-transparent bg-white/90 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition duration-200 text-gray-900 placeholder-gray-400 shadow-sm focus:shadow-lg" placeholder="Your Name" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-white mb-2">Email *</label>
        <input name="email" value={form.email} onChange={handleChange} required type="email" className="w-full px-4 py-3 border border-transparent bg-white/90 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition duration-200 text-gray-900 placeholder-gray-400 shadow-sm focus:shadow-lg" placeholder="Your Email" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-white mb-2">Phone</label>
        <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-3 border border-transparent bg-white/90 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition duration-200 text-gray-900 placeholder-gray-400 shadow-sm focus:shadow-lg" placeholder="Your Phone (optional)" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-white mb-2">Project Type *</label>
        <select name="projectType" value={form.projectType} onChange={handleChange} required className="w-full px-4 py-3 border border-transparent bg-white/90 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-500 transition duration-200 text-gray-900 shadow-sm focus:shadow-lg">
          <option value="">Select a project type</option>
          {projectTypes.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-white mb-2">Budget</label>
          <select name="budget" value={form.budget} onChange={handleChange} className="w-full px-4 py-3 border border-transparent bg-white/90 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-500 transition duration-200 text-gray-900 shadow-sm focus:shadow-lg">
            <option value="">Select budget</option>
            {budgets.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-white mb-2">Timeline</label>
          <select name="timeline" value={form.timeline} onChange={handleChange} className="w-full px-4 py-3 border border-transparent bg-white/90 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-500 transition duration-200 text-gray-900 shadow-sm focus:shadow-lg">
            <option value="">Select timeline</option>
            {timelines.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-white mb-2">Requirement *</label>
        <textarea name="requirement" value={form.requirement} onChange={handleChange} required className="w-full px-4 py-3 border border-transparent bg-white/90 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition duration-200 text-gray-900 placeholder-gray-400 resize-none shadow-sm focus:shadow-lg" placeholder="Describe your project requirements..." rows={5} />
      </div>
      <button type="submit" disabled={loading} className={`w-full py-3 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition duration-200 shadow-xl ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 hover:scale-105 hover:shadow-2xl'} text-white`}>
        <Rocket size={22} className="inline-block mb-0.5" />
        {loading ? 'Booking...' : 'Book Now'}
      </button>
    </form>
  );
};

export default BookForm; 