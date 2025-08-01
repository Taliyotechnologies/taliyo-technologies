import React from 'react';
import { AlertTriangle, FileX, Server, Lock, Home, RefreshCw, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const iconMap = {
  404: <FileX className="text-red-400" size={56} />, // Not Found
  500: <Server className="text-orange-400" size={56} />, // Server Error
  403: <Lock className="text-yellow-400" size={56} />, // Forbidden
  default: <AlertTriangle className="text-blue-400" size={56} />,
};

const UniversalErrorPage = ({
  code = 404,
  title = 'Page Not Found',
  message = "Sorry, the page you are looking for doesn't exist or an error occurred.",
  suggestions = [
    'Check the URL for typos',
    'Go back to the previous page',
    'Visit our homepage',
  ],
  actions = [
    { label: 'Go Back', icon: <ArrowLeft size={18} />, onClick: null, to: null, type: 'button', style: 'bg-gray-700 hover:bg-gray-600' },
    { label: 'Refresh', icon: <RefreshCw size={18} />, onClick: null, to: null, type: 'button', style: 'bg-blue-600 hover:bg-blue-700' },
    { label: 'Home', icon: <Home size={18} />, onClick: null, to: '/', type: 'link', style: 'bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-800 hover:to-purple-800' },
  ],
  showSupport = true,
  supportLinks = [
    { label: 'Contact Support', to: '/contact' },
    { label: 'FAQ', to: '/faq' },
  ],
}) => {
  const navigate = useNavigate();
  const icon = iconMap[code] || iconMap.default;

  // Default action handlers
  const handleGoBack = () => navigate(-1);
  const handleRefresh = () => window.location.reload();

  // Render actions
  const renderAction = (action, idx) => {
    if (action.type === 'link') {
      return (
        <Link
          key={idx}
          to={action.to}
          className={`flex-1 flex items-center justify-center gap-2 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 ${action.style}`}
        >
          {action.icon}
          {action.label}
        </Link>
      );
    }
    return (
      <button
        key={idx}
        onClick={
          action.onClick ||
          (action.label.toLowerCase().includes('back') ? handleGoBack :
            action.label.toLowerCase().includes('refresh') ? handleRefresh : null)
        }
        className={`flex-1 flex items-center justify-center gap-2 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 ${action.style}`}
      >
        {action.icon}
        {action.label}
      </button>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 px-4">
      <div className="flex flex-col items-center bg-gray-900/95 border border-blue-900 rounded-3xl shadow-2xl p-10 md:p-16 relative overflow-hidden max-w-2xl w-full animate-fade-in">
        {/* Background decoration */}
        <div className="absolute -top-10 -right-10 opacity-10 text-blue-900 text-[10rem] pointer-events-none select-none">
          {icon}
        </div>
        {/* Error Icon */}
        <div className="mb-6 z-10">
          {icon}
        </div>
        {/* Error Code */}
        <h1 className="text-6xl md:text-7xl font-extrabold text-blue-400 mb-2 tracking-tight drop-shadow-lg z-10">
          {code}
        </h1>
        {/* Error Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-100 mb-4 text-center z-10">
          {title}
        </h2>
        {/* Error Message */}
        <p className="text-lg md:text-xl text-gray-300 mb-8 text-center max-w-md leading-relaxed z-10">
          {message}
        </p>
        {/* Suggestions */}
        <div className="mb-8 w-full max-w-md z-10">
          <h3 className="text-sm font-semibold text-gray-400 mb-3 text-center">What you can try:</h3>
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-center text-sm text-gray-300">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md z-10">
          {actions.map(renderAction)}
        </div>
        {/* Additional Help */}
        {showSupport && (
          <div className="mt-8 text-center z-10">
            <p className="text-sm text-gray-500 mb-2">Need more help?</p>
            <div className="flex justify-center gap-4 text-sm">
              {supportLinks.map((link, idx) => (
                <Link key={idx} to={link.to} className="text-blue-400 hover:text-blue-300 underline">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversalErrorPage; 