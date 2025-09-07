import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function Maintenance({ message = "We'll be back soon.", companyName = 'Taliyo Technologies' }) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-20">
      <Helmet>
        <title>{companyName} - Maintenance</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="max-w-2xl">
        <div className="mx-auto w-20 h-20 rounded-full bg-blue-600/10 border border-blue-500/30 flex items-center justify-center mb-6">
          <span className="text-3xl">🛠️</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Scheduled Maintenance</h1>
        <p className="text-gray-300 mb-8">{message}</p>
        <p className="text-sm text-gray-400">
          Thank you for your patience. If you need assistance, please contact us at{' '}
          <a className="underline" href="mailto:admin@taliyotechnologies.com">admin@taliyotechnologies.com</a>.
        </p>
        <div className="mt-10">
          <a href="/admin/login" className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-600 hover:bg-gray-800 text-sm">Admin Login</a>
        </div>
      </div>
    </div>
  );
}
