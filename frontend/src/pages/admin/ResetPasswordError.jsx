import React from 'react';
import { AlertTriangle, Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ResetPasswordError = ({ errorType = 'invalid', message = "The reset link is invalid or has expired." }) => {
  const navigate = useNavigate();

  const getErrorConfig = (errorType) => {
    switch (errorType) {
      case 'invalid':
        return {
          icon: <AlertTriangle className="text-red-400" size={48} />,
          title: "Invalid Reset Link",
          message: "The password reset link is invalid or has expired.",
          suggestions: [
            "Request a new password reset link",
            "Check your email for the correct link",
            "Make sure you're using the link from your email"
          ]
        };
      case 'expired':
        return {
          icon: <AlertTriangle className="text-orange-400" size={48} />,
          title: "Link Expired",
          message: "This password reset link has expired. Reset links are valid for 1 hour.",
          suggestions: [
            "Request a new password reset",
            "Check your email for a fresh link",
            "Try logging in with your current password"
          ]
        };
      case 'used':
        return {
          icon: <AlertTriangle className="text-yellow-400" size={48} />,
          title: "Link Already Used",
          message: "This reset link has already been used. Each link can only be used once.",
          suggestions: [
            "Request a new password reset",
            "Try logging in with your new password",
            "Contact support if you need help"
          ]
        };
      default:
        return {
          icon: <AlertTriangle className="text-blue-400" size={48} />,
          title: "Reset Error",
          message: message,
          suggestions: [
            "Request a new password reset",
            "Check your email for the correct link",
            "Contact support if the problem persists"
          ]
        };
    }
  };

  const errorConfig = getErrorConfig(errorType);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 px-4">
      <div className="flex flex-col items-center bg-gray-900/95 border border-gray-800 rounded-3xl shadow-2xl p-10 md:p-16 relative overflow-hidden max-w-2xl w-full">
        {/* Background decoration */}
        <div className="absolute -top-10 -right-10 opacity-10 text-blue-900 text-[10rem] pointer-events-none select-none">
          <Mail size={160} />
        </div>
        
        {/* Error Icon */}
        <div className="mb-6">
          {errorConfig.icon}
        </div>
        
        {/* Error Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4 text-center">
          {errorConfig.title}
        </h1>
        
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
            to="/admin/forgot-password"
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-800 hover:to-purple-800 text-white font-semibold py-3 px-6 rounded-xl transition duration-200"
          >
            <Mail size={18} />
            Request Reset
          </Link>
        </div>
        
        {/* Additional Help */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-2">
            Need more help?
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <Link to="/admin/login" className="text-blue-400 hover:text-blue-300 underline">
              Back to Login
            </Link>
            <span className="text-gray-600">|</span>
            <Link to="/contact" className="text-blue-400 hover:text-blue-300 underline">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordError; 