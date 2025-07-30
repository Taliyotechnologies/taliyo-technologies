import React from 'react';
import { Helmet } from 'react-helmet-async';
import BookForm from '../components/forms/BookForm';

const Book = () => (
  <>
    <Helmet>
      <title>Book Your Project | Taliyo Technologies</title>
      <meta name="description" content="Book your web development, app development, or digital marketing project with Taliyo Technologies. Get a free consultation and custom proposal for your business needs." />
      <meta name="keywords" content="book project, free consultation, web development quote, app development proposal, digital marketing services, project booking, taliyo technologies" />
      <meta property="og:title" content="Book Your Project | Taliyo Technologies" />
      <meta property="og:description" content="Book your web development, app development, or digital marketing project with Taliyo Technologies. Get a free consultation and custom proposal for your business needs." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://taliyotechnologies.com/book" />
      <meta property="og:image" content="https://taliyotechnologies.com/logo.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Book Your Project | Taliyo Technologies" />
      <meta name="twitter:description" content="Book your web development, app development, or digital marketing project with Taliyo Technologies. Get a free consultation and custom proposal for your business needs." />
      <meta name="twitter:image" content="https://taliyotechnologies.com/logo.png" />
      <link rel="canonical" href="https://taliyotechnologies.com/book" />
    </Helmet>
    <div className="min-h-screen bg-gray-950 py-16 px-4 flex flex-col items-center justify-center">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 mt-5 text-center">Book Your Project</h1>
      <p className="text-lg text-gray-300 mb-8 text-center max-w-2xl">
        Tell us about your project requirements and our team will get in touch with you for a free consultation and proposal.
      </p>
      <div style={{ marginTop: '10px' }}>
        <BookForm />
      </div>
    </div>
  </>
);

export default Book; 