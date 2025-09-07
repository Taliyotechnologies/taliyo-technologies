import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function Maintenance({ message = "We'll be back soon.", companyName = 'Taliyo Technologies' }) {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-6 py-20 overflow-hidden">
      <Helmet>
        <title>{companyName} — Maintenance</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Background gradient + shapes */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute -top-32 -left-24 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-24 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl" />
      </div>

      <div className="w-full max-w-3xl">
        {/* Brand */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <img
            src="/Taliyo technologies logo.png"
            alt={`${companyName} logo`}
            className="h-10 w-10 rounded-md object-contain shadow-sm ring-1 ring-white/10"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <span className="text-sm tracking-wider uppercase text-white/70">{companyName}</span>
        </div>

        {/* Card */}
        <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 text-center shadow-2xl">
          {/* Status chip */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-amber-300 text-xs mb-5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
            </span>
            Maintenance in progress
          </div>

          {/* Icon */}
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/15 to-purple-500/15 ring-1 ring-white/10">
            <svg className="h-10 w-10 text-white/80 animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 6V3M12 21v-3M6 12H3m18 0h-3M5 5l-2-2m18 18-2-2M19 5l2-2M3 21l2-2" strokeLinecap="round" />
              <circle cx="12" cy="12" r="4" opacity=".8" />
            </svg>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3">
            We’re improving your experience
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto">
            {message}
          </p>

          {/* Progress shimmer */}
          <div className="mt-8 mx-auto h-2 w-full max-w-lg overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-1/3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-[shimmer_2.2s_infinite]" />
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button onClick={() => window.location.reload()} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-medium text-white shadow focus:outline-none focus:ring-2 focus:ring-blue-400/50">
              Refresh
            </button>
            <a href="mailto:admin@taliyotechnologies.com" className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2 text-sm font-medium text-white/90">
              Contact Support
            </a>
            <a href="/admin/login" className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2 text-sm font-medium text-white/90">
              Admin Login
            </a>
          </div>
        </div>

        {/* Footnote */}
        <p className="mt-6 text-center text-xs text-white/50">
          Tip: keep this page open — we’ll be back shortly.
        </p>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        .animate-spin-slow { animation: spin 6s linear infinite; }
      `}</style>
    </div>
  );
}
