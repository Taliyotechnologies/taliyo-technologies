import React from 'react';
import { AlertTriangle, Home, ArrowLeft, RefreshCw, Wifi, Server, FileX } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ErrorPage = ({ code = 404, message = "Sorry, the page you are looking for doesn't exist." }) => {
  const navigate = useNavigate();

  // Error configurations based on error code
  const getErrorConfig = (code) => {
    switch (code) {
      case 404:
        return {
          icon: <FileX className="text-red-400" size={48} />,
          title: "Page Not Found",
          message: "The page you're looking for doesn't exist or has been moved.",
          suggestions: [
            "Check the URL for typos",
            "Go back to the previous page",
            "Visit our homepage"
          ]
        };
      case 500:
        return {
          icon: <Server className="text-orange-400" size={48} />,
          title: "Server Error",
          message: "Something went wrong on our end. We're working to fix it.",
          suggestions: [
            "Try refreshing the page",
            "Check your internet connection",
            "Contact support if the problem persists"
          ]
        };
      case 403:
        return {
          icon: <AlertTriangle className="text-yellow-400" size={48} />,
          title: "Access Denied",
          message: "You don't have permission to access this page.",
          suggestions: [
            "Log in with proper credentials",
            "Contact support for access",
            "Go back to homepage"
          ]
        };

      default:
        return {
          icon: <AlertTriangle className="text-blue-400" size={48} />,
          title: "Something Went Wrong",
          message: message,
          suggestions: [
            "Try refreshing the page",
            "Go back to homepage",
            "Contact our support team"
          ]
        };
    }
  };

  const errorConfig = getErrorConfig(code);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 px-4">
      <div className="flex flex-col items-center bg-gray-900/95 border border-gray-800 rounded-3xl shadow-2xl p-10 md:p-16 relative overflow-hidden max-w-2xl w-full">
        {/* Background decoration */}
        <div className="absolute -top-10 -right-10 opacity-10 text-blue-900 text-[10rem] pointer-events-none select-none">
          <AlertTriangle size={160} />
        </div>
        
        {/* Error Icon */}
        <div className="mb-6">
          {errorConfig.icon}
        </div>
        
        {/* Error Code */}
        <h1 className="text-7xl md:text-8xl font-extrabold text-blue-400 mb-4 tracking-tight drop-shadow-lg">
          {code}
        </h1>
        
        {/* Error Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-100 mb-4 text-center">
          {errorConfig.title}
        </h2>
        
        {/* Error Message */}
        <p className="text-lg md:text-xl text-gray-300 mb-8 text-center max-w-md leading-relaxed">
          {errorConfig.message}
        </p>
        
        {/* Suggestions */}
        <div className="mb-8 w-full max-w-md">
          <h3 className="text-sm font-semibold text-gray-400 mb-3 text-center">What you can try:</h3>
          <ul className="space-y-2">
            {errorConfig.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-center text-sm text-gray-300">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <button
            onClick={handleGoBack}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition duration-200"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
          
          <button
            onClick={handleRefresh}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-200"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
          
          <Link
            to="/"
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-800 hover:to-purple-800 text-white font-semibold py-3 px-6 rounded-xl transition duration-200"
          >
            <Home size={18} />
            Home
          </Link>
        </div>
        
        {/* Additional Help */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-2">
            Still having trouble?
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <Link to="/contact" className="text-blue-400 hover:text-blue-300 underline">
              Contact Support
            </Link>
            <span className="text-gray-600">|</span>
            <Link to="/faq" className="text-blue-400 hover:text-blue-300 underline">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage; 