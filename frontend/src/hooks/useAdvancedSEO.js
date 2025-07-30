import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const useAdvancedSEO = () => {
  const location = useLocation();

  // Track page views for analytics
  const trackPageView = useCallback((pageData) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: pageData.title,
        page_location: pageData.url,
        custom_map: {
          'custom_dimension1': 'page_type',
          'custom_dimension2': 'content_category',
          'custom_dimension3': 'user_segment'
        }
      });

      // Track custom events
      window.gtag('event', 'page_view', {
        event_category: 'engagement',
        event_label: pageData.title,
        custom_parameter: pageData.category || 'general'
      });
    }
  }, []);

  // Track user engagement
  const trackEngagement = useCallback((eventName, eventData) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        event_category: 'engagement',
        event_label: eventData.label,
        value: eventData.value,
        custom_parameter: eventData.parameter
      });
    }
  }, []);

  // Track conversions
  const trackConversion = useCallback((conversionData) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL',
        value: conversionData.value,
        currency: conversionData.currency || 'INR',
        transaction_id: conversionData.transactionId
      });
    }
  }, []);

  // Track scroll depth
  const trackScrollDepth = useCallback(() => {
    let maxScroll = 0;
    let ticking = false;

    const updateScrollDepth = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        
        // Track scroll milestones
        if ([25, 50, 75, 90, 100].includes(maxScroll)) {
          trackEngagement('scroll_depth', {
            label: `${maxScroll}%`,
            value: maxScroll,
            parameter: 'scroll_depth'
          });
        }
      }
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollDepth);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick);
    return () => window.removeEventListener('scroll', requestTick);
  }, [trackEngagement]);

  // Track time on page
  const trackTimeOnPage = useCallback(() => {
    const startTime = Date.now();
    
    const trackTime = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      
      // Track time milestones
      if ([30, 60, 120, 300, 600].includes(timeSpent)) {
        trackEngagement('time_on_page', {
          label: `${timeSpent}s`,
          value: timeSpent,
          parameter: 'time_on_page'
        });
      }
    };

    const interval = setInterval(trackTime, 1000);
    return () => clearInterval(interval);
  }, [trackEngagement]);

  // Track clicks on important elements
  const trackClicks = useCallback(() => {
    const handleClick = (event) => {
      const target = event.target;
      const tagName = target.tagName.toLowerCase();
      const className = target.className || '';
      const id = target.id || '';
      const text = target.textContent?.trim() || '';

      // Track CTA clicks
      if (tagName === 'button' || tagName === 'a') {
        let eventLabel = 'button_click';
        
        if (className.includes('cta') || className.includes('btn')) {
          eventLabel = 'cta_click';
        } else if (id.includes('contact') || text.toLowerCase().includes('contact')) {
          eventLabel = 'contact_click';
        } else if (id.includes('quote') || text.toLowerCase().includes('quote')) {
          eventLabel = 'quote_click';
        } else if (id.includes('service') || className.includes('service')) {
          eventLabel = 'service_click';
        }

        trackEngagement(eventLabel, {
          label: text || target.getAttribute('href') || 'unknown',
          value: 1,
          parameter: 'click_tracking'
        });
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [trackEngagement]);

  // Track form interactions
  const trackFormInteractions = useCallback(() => {
    const handleFormInteraction = (event) => {
      const form = event.target.closest('form');
      if (!form) return;

      const formId = form.id || form.className || 'unknown_form';
      const fieldName = event.target.name || event.target.id || 'unknown_field';
      const eventType = event.type;

      trackEngagement('form_interaction', {
        label: `${formId}_${fieldName}`,
        value: 1,
        parameter: eventType
      });
    };

    document.addEventListener('focus', handleFormInteraction);
    document.addEventListener('blur', handleFormInteraction);
    document.addEventListener('change', handleFormInteraction);
    document.addEventListener('submit', handleFormInteraction);

    return () => {
      document.removeEventListener('focus', handleFormInteraction);
      document.removeEventListener('blur', handleFormInteraction);
      document.removeEventListener('change', handleFormInteraction);
      document.removeEventListener('submit', handleFormInteraction);
    };
  }, [trackEngagement]);

  // Track search queries
  const trackSearch = useCallback((searchTerm) => {
    trackEngagement('search', {
      label: searchTerm,
      value: 1,
      parameter: 'search_term'
    });
  }, [trackEngagement]);

  // Track social media clicks
  const trackSocialClicks = useCallback(() => {
    const handleSocialClick = (event) => {
      const target = event.target.closest('a');
      if (!target) return;

      const href = target.getAttribute('href') || '';
      const text = target.textContent?.trim() || '';

      if (href.includes('facebook.com') || text.toLowerCase().includes('facebook')) {
        trackEngagement('social_click', {
          label: 'facebook',
          value: 1,
          parameter: 'social_media'
        });
      } else if (href.includes('twitter.com') || text.toLowerCase().includes('twitter')) {
        trackEngagement('social_click', {
          label: 'twitter',
          value: 1,
          parameter: 'social_media'
        });
      } else if (href.includes('linkedin.com') || text.toLowerCase().includes('linkedin')) {
        trackEngagement('social_click', {
          label: 'linkedin',
          value: 1,
          parameter: 'social_media'
        });
      } else if (href.includes('instagram.com') || text.toLowerCase().includes('instagram')) {
        trackEngagement('social_click', {
          label: 'instagram',
          value: 1,
          parameter: 'social_media'
        });
      }
    };

    document.addEventListener('click', handleSocialClick);
    return () => document.removeEventListener('click', handleSocialClick);
  }, [trackEngagement]);

  // Track phone number clicks
  const trackPhoneClicks = useCallback(() => {
    const handlePhoneClick = (event) => {
      const target = event.target;
      const href = target.getAttribute('href') || '';
      const text = target.textContent?.trim() || '';

      if (href.startsWith('tel:') || text.match(/\b\d{10,}\b/)) {
        trackEngagement('phone_click', {
          label: href.replace('tel:', '') || text,
          value: 1,
          parameter: 'contact_method'
        });
      }
    };

    document.addEventListener('click', handlePhoneClick);
    return () => document.removeEventListener('click', handlePhoneClick);
  }, [trackEngagement]);

  // Track email clicks
  const trackEmailClicks = useCallback(() => {
    const handleEmailClick = (event) => {
      const target = event.target;
      const href = target.getAttribute('href') || '';
      const text = target.textContent?.trim() || '';

      if (href.startsWith('mailto:') || text.includes('@')) {
        trackEngagement('email_click', {
          label: href.replace('mailto:', '') || text,
          value: 1,
          parameter: 'contact_method'
        });
      }
    };

    document.addEventListener('click', handleEmailClick);
    return () => document.removeEventListener('click', handleEmailClick);
  }, [trackEngagement]);

  // Track video interactions
  const trackVideoInteractions = useCallback(() => {
    const handleVideoInteraction = (event) => {
      const video = event.target;
      if (video.tagName.toLowerCase() !== 'video') return;

      const videoSrc = video.src || video.currentSrc || 'unknown';
      const eventType = event.type;

      trackEngagement('video_interaction', {
        label: videoSrc,
        value: 1,
        parameter: eventType
      });
    };

    document.addEventListener('play', handleVideoInteraction);
    document.addEventListener('pause', handleVideoInteraction);
    document.addEventListener('ended', handleVideoInteraction);
    document.addEventListener('seeking', handleVideoInteraction);

    return () => {
      document.removeEventListener('play', handleVideoInteraction);
      document.removeEventListener('pause', handleVideoInteraction);
      document.removeEventListener('ended', handleVideoInteraction);
      document.removeEventListener('seeking', handleVideoInteraction);
    };
  }, [trackEngagement]);

  // Initialize tracking on mount
  useEffect(() => {
    const cleanupFunctions = [];

    // Start all tracking functions
    cleanupFunctions.push(trackScrollDepth());
    cleanupFunctions.push(trackTimeOnPage());
    cleanupFunctions.push(trackClicks());
    cleanupFunctions.push(trackFormInteractions());
    cleanupFunctions.push(trackSocialClicks());
    cleanupFunctions.push(trackPhoneClicks());
    cleanupFunctions.push(trackEmailClicks());
    cleanupFunctions.push(trackVideoInteractions());

    // Cleanup on unmount
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [
    trackScrollDepth,
    trackTimeOnPage,
    trackClicks,
    trackFormInteractions,
    trackSocialClicks,
    trackPhoneClicks,
    trackEmailClicks,
    trackVideoInteractions
  ]);

  // Track page changes
  useEffect(() => {
    const pageData = {
      title: document.title,
      url: window.location.href,
      category: location.pathname.split('/')[1] || 'home'
    };

    trackPageView(pageData);
  }, [location, trackPageView]);

  return {
    trackPageView,
    trackEngagement,
    trackConversion,
    trackSearch
  };
};

export default useAdvancedSEO; 