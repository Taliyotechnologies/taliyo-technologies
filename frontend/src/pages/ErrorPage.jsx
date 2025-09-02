import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ErrorPage = ({ status = 404, title = 'Page Not Found', message = 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
          <span className="text-4xl font-bold text-red-600 dark:text-red-400">{status}</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
          {status === 404 ? 'Oops!' : 'Error!'}
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {title}
        </h2>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          {message}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Contact Support
          </Link>
        </div>
        
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Need help?{' '}
            <a 
              href="mailto:support@taliyotechnologies.com" 
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-200"
            >
              support@taliyotechnologies.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
