import React, { useState } from 'react';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL || 'https://taliyo-backend.onrender.com';

const SubscribeForm = ({ compact = false }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        // Allow 409 as a friendly success
        if (res.status === 409) {
          setSubscribed(true);
          setEmail('');
          setTimeout(() => setSubscribed(false), 5000);
          return;
        }
        throw new Error(data.message || 'Subscription failed');
      }
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    } catch (err) {
      toast.error(err.message || 'Subscription failed.');
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <div className={`${compact ? 'py-3 text-sm' : 'py-8 text-lg'} text-white font-semibold bg-green-600/80 rounded-xl shadow mb-4 animate-fade-in text-center`}>
        Thank you for subscribing!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`flex ${compact ? 'flex-col' : 'flex-col sm:flex-row'} gap-3 max-w-md mx-auto w-full`}>
      <input
        type="email"
        placeholder="Enter your email"
        className={`${compact ? 'px-3 py-2' : 'px-4 py-3'} flex-1 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all`}
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />
      <button
        className={`${compact ? 'px-4 py-2' : 'px-6 py-3'} bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-60`}
        disabled={loading}
        type="submit"
      >
        {loading ? 'Subscribing...' : 'Subscribe'}
      </button>
    </form>
  );
};

export default SubscribeForm;
