import { Helmet } from 'react-helmet-async';

const AdvancedSEO = ({ 
  title, 
  description, 
  keywords, 
  canonicalUrl, 
  ogImage, 
  ogType = 'website',
  twitterCard = 'summary_large_image',
  structuredData,
  breadcrumbs,
  articleData,
  localBusinessData,
  faqData,
  reviewData,
  productData,
  serviceData,
  organizationData,
  websiteData,
  additionalMeta = []
}) => {
  // Generate comprehensive keywords if not provided
  const defaultKeywords = [
    // Primary Keywords - High Search Volume
    'IT company Delhi', 'web development company India', 'mobile app development Delhi',
    'digital marketing services', 'AI solutions', 'cloud computing', 'software development company',
    'ecommerce website development', 'React development', 'Node.js development', 'Python development',
    'PHP development', 'WordPress development', 'SEO services', 'social media marketing',
    'content marketing', 'graphic design services', 'UI/UX design', 'custom software development',
    'enterprise solutions', 'startup solutions', 'IT consulting', 'technology consulting',
    
    // Location-based Keywords
    'Delhi NCR', 'Noida', 'Gurgaon', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata',
    'India', 'best IT company', 'top web development company', 'professional app development',
    
    // Technology Keywords
    'digital transformation', 'technology solutions', 'business automation', 'custom software',
    'web application development', 'mobile application development', 'responsive web design',
    'progressive web apps', 'cross-platform development', 'native app development',
    'full-stack development', 'frontend development', 'backend development', 'database design',
    'API development', 'microservices', 'cloud migration', 'devops services', 'CI/CD pipeline',
    'agile development', 'scrum methodology', 'project management', 'quality assurance',
    'testing services', 'performance optimization', 'security implementation', 'data analytics',
    'business intelligence', 'machine learning', 'artificial intelligence', 'chatbot development',
    'voice assistant', 'IoT solutions', 'blockchain development', 'cryptocurrency development',
    
    // Industry-specific Keywords
    'fintech solutions', 'healthtech solutions', 'edtech solutions', 'real estate technology',
    'ecommerce solutions', 'marketplace development', 'CRM development', 'ERP solutions',
    'inventory management', 'order management', 'payment gateway integration', 'third-party API integration',
    'legacy system migration', 'system integration', 'data migration', 'backup solutions',
    'disaster recovery', 'cybersecurity', 'penetration testing', 'vulnerability assessment',
    
    // Compliance and Certification Keywords
    'compliance services', 'GDPR compliance', 'HIPAA compliance', 'SOX compliance',
    'ISO certification', 'CMMI certification', 'agile certification', 'scrum certification',
    'project management certification', 'ITIL certification', 'COBIT framework', 'TOGAF framework',
    'enterprise architecture', 'digital strategy', 'technology roadmap', 'innovation consulting',
    
    // Digital Marketing Keywords
    'digital marketing agency', 'SEO agency', 'PPC management', 'social media agency',
    'content creation', 'brand strategy', 'marketing automation', 'email marketing',
    'lead generation', 'conversion optimization', 'analytics implementation', 'Google Analytics',
    'Google Tag Manager', 'Facebook Pixel', 'LinkedIn Insight Tag', 'Twitter Pixel',
    'TikTok Pixel', 'Snapchat Pixel', 'Pinterest Tag', 'YouTube Analytics',
    'Google Search Console', 'Bing Webmaster Tools', 'Yandex Webmaster', 'Baidu Webmaster',
    'local SEO', 'national SEO', 'international SEO', 'technical SEO', 'on-page SEO',
    'off-page SEO', 'link building', 'guest posting', 'influencer marketing', 'affiliate marketing',
    'remarketing', 'retargeting', 'programmatic advertising', 'display advertising',
    'video advertising', 'native advertising', 'sponsored content', 'brand awareness',
    
    // Research and Analysis Keywords
    'market research', 'competitive analysis', 'customer journey mapping', 'user experience design',
    'user interface design', 'wireframing', 'prototyping', 'usability testing', 'A/B testing',
    'multivariate testing', 'heatmap analysis', 'session recording', 'funnel analysis',
    'conversion tracking', 'goal setting', 'KPI measurement', 'ROI analysis', 'cost per acquisition',
    'customer lifetime value', 'churn rate', 'net promoter score', 'customer satisfaction',
    
    // Support and Maintenance Keywords
    'customer support', 'help desk', 'knowledge base', 'FAQ management', 'ticket system',
    'live chat', 'chatbot support', 'voice support', 'email support', 'phone support',
    'remote support', 'onsite support', 'premium support', 'dedicated support', '24/7 support',
    'maintenance services', 'monitoring services', 'backup services', 'update services',
    'security services', 'performance services', 'optimization services', 'scaling services',
    'migration services', 'integration services', 'consulting services', 'training services',
    'documentation services', 'support services', 'hosting services', 'domain services',
    'SSL certificate', 'CDN services', 'load balancing', 'auto scaling', 'disaster recovery',
    'business continuity', 'risk management', 'compliance management', 'audit services',
    
    // Testing and Quality Keywords
    'penetration testing', 'vulnerability assessment', 'security audit', 'privacy audit',
    'performance audit', 'SEO audit', 'accessibility audit', 'usability audit',
    'mobile audit', 'desktop audit', 'tablet audit', 'cross-browser testing', 'cross-device testing',
    'responsive testing', 'progressive testing', 'regression testing', 'unit testing',
    'integration testing', 'system testing', 'acceptance testing', 'user acceptance testing',
    'load testing', 'stress testing', 'performance testing', 'security testing', 'penetration testing',
    'vulnerability testing', 'compatibility testing', 'accessibility testing', 'usability testing',
    'localization testing', 'internationalization testing', 'globalization testing',
    'automation testing', 'manual testing', 'exploratory testing', 'ad-hoc testing',
    'smoke testing', 'sanity testing', 'regression testing', 'retesting', 'confirmation testing',
    'alpha testing', 'beta testing', 'gamma testing', 'delta testing', 'epsilon testing',
    'zeta testing', 'eta testing', 'theta testing', 'iota testing', 'kappa testing',
    'lambda testing', 'mu testing', 'nu testing', 'xi testing', 'omicron testing',
    'pi testing', 'rho testing', 'sigma testing', 'tau testing', 'upsilon testing',
    'phi testing', 'chi testing', 'psi testing', 'omega testing',
    
    // Long-tail Keywords for Better Conversion
    'best web development company in Delhi', 'top mobile app development company India',
    'professional SEO services Delhi', 'custom software development company Delhi',
    'AI solutions for business Delhi', 'cloud computing services Delhi',
    'ecommerce website development Delhi', 'React development company Delhi',
    'Node.js development services Delhi', 'Python development company Delhi',
    'PHP development services Delhi', 'WordPress development company Delhi',
    'digital marketing agency Delhi', 'social media marketing Delhi',
    'content marketing services Delhi', 'graphic design company Delhi',
    'UI/UX design services Delhi', 'enterprise software solutions Delhi',
    'startup technology solutions Delhi', 'IT consulting services Delhi',
    'technology consulting Delhi', 'business automation Delhi',
    'custom software development Delhi', 'web application development Delhi',
    'mobile application development Delhi', 'responsive web design Delhi',
    'progressive web apps Delhi', 'cross-platform development Delhi',
    'native app development Delhi', 'full-stack development Delhi',
    'frontend development Delhi', 'backend development Delhi',
    'database design Delhi', 'API development Delhi', 'microservices Delhi',
    'cloud migration Delhi', 'devops services Delhi', 'CI/CD pipeline Delhi',
    'agile development Delhi', 'scrum methodology Delhi', 'project management Delhi',
    'quality assurance Delhi', 'testing services Delhi', 'performance optimization Delhi',
    'security implementation Delhi', 'data analytics Delhi', 'business intelligence Delhi',
    'machine learning Delhi', 'artificial intelligence Delhi', 'chatbot development Delhi',
    'voice assistant Delhi', 'IoT solutions Delhi', 'blockchain development Delhi',
    'cryptocurrency development Delhi', 'fintech solutions Delhi', 'healthtech solutions Delhi',
    'edtech solutions Delhi', 'real estate technology Delhi', 'ecommerce solutions Delhi',
    'marketplace development Delhi', 'CRM development Delhi', 'ERP solutions Delhi',
    'inventory management Delhi', 'order management Delhi', 'payment gateway integration Delhi',
    'third-party API integration Delhi', 'legacy system migration Delhi', 'system integration Delhi',
    'data migration Delhi', 'backup solutions Delhi', 'disaster recovery Delhi',
    'cybersecurity Delhi', 'penetration testing Delhi', 'vulnerability assessment Delhi',
    'compliance services Delhi', 'GDPR compliance Delhi', 'HIPAA compliance Delhi',
    'SOX compliance Delhi', 'ISO certification Delhi', 'CMMI certification Delhi',
    'agile certification Delhi', 'scrum certification Delhi', 'project management certification Delhi',
    'ITIL certification Delhi', 'COBIT framework Delhi', 'TOGAF framework Delhi',
    'enterprise architecture Delhi', 'digital strategy Delhi', 'technology roadmap Delhi',
    'innovation consulting Delhi', 'digital marketing agency Delhi', 'SEO agency Delhi',
    'PPC management Delhi', 'social media agency Delhi', 'content creation Delhi',
    'brand strategy Delhi', 'marketing automation Delhi', 'email marketing Delhi',
    'lead generation Delhi', 'conversion optimization Delhi', 'analytics implementation Delhi',
    'Google Analytics Delhi', 'Google Tag Manager Delhi', 'Facebook Pixel Delhi',
    'LinkedIn Insight Tag Delhi', 'Twitter Pixel Delhi', 'TikTok Pixel Delhi',
    'Snapchat Pixel Delhi', 'Pinterest Tag Delhi', 'YouTube Analytics Delhi',
    'Google Search Console Delhi', 'Bing Webmaster Tools Delhi', 'Yandex Webmaster Delhi',
    'Baidu Webmaster Delhi', 'local SEO Delhi', 'national SEO Delhi', 'international SEO Delhi',
    'technical SEO Delhi', 'on-page SEO Delhi', 'off-page SEO Delhi', 'link building Delhi',
    'guest posting Delhi', 'influencer marketing Delhi', 'affiliate marketing Delhi',
    'remarketing Delhi', 'retargeting Delhi', 'programmatic advertising Delhi',
    'display advertising Delhi', 'video advertising Delhi', 'native advertising Delhi',
    'sponsored content Delhi', 'brand awareness Delhi', 'market research Delhi',
    'competitive analysis Delhi', 'customer journey mapping Delhi', 'user experience design Delhi',
    'user interface design Delhi', 'wireframing Delhi', 'prototyping Delhi',
    'usability testing Delhi', 'A/B testing Delhi', 'multivariate testing Delhi',
    'heatmap analysis Delhi', 'session recording Delhi', 'funnel analysis Delhi',
    'conversion tracking Delhi', 'goal setting Delhi', 'KPI measurement Delhi',
    'ROI analysis Delhi', 'cost per acquisition Delhi', 'customer lifetime value Delhi',
    'churn rate Delhi', 'net promoter score Delhi', 'customer satisfaction Delhi',
    'customer support Delhi', 'help desk Delhi', 'knowledge base Delhi', 'FAQ management Delhi',
    'ticket system Delhi', 'live chat Delhi', 'chatbot support Delhi', 'voice support Delhi',
    'email support Delhi', 'phone support Delhi', 'remote support Delhi', 'onsite support Delhi',
    'premium support Delhi', 'dedicated support Delhi', '24/7 support Delhi',
    'maintenance services Delhi', 'monitoring services Delhi', 'backup services Delhi',
    'update services Delhi', 'security services Delhi', 'performance services Delhi',
    'optimization services Delhi', 'scaling services Delhi', 'migration services Delhi',
    'integration services Delhi', 'consulting services Delhi', 'training services Delhi',
    'documentation services Delhi', 'support services Delhi', 'hosting services Delhi',
    'domain services Delhi', 'SSL certificate Delhi', 'CDN services Delhi',
    'load balancing Delhi', 'auto scaling Delhi', 'disaster recovery Delhi',
    'business continuity Delhi', 'risk management Delhi', 'compliance management Delhi',
    'audit services Delhi', 'penetration testing Delhi', 'vulnerability assessment Delhi',
    'security audit Delhi', 'privacy audit Delhi', 'performance audit Delhi',
    'SEO audit Delhi', 'accessibility audit Delhi', 'usability audit Delhi',
    'mobile audit Delhi', 'desktop audit Delhi', 'tablet audit Delhi',
    'cross-browser testing Delhi', 'cross-device testing Delhi', 'responsive testing Delhi',
    'progressive testing Delhi', 'regression testing Delhi', 'unit testing Delhi',
    'integration testing Delhi', 'system testing Delhi', 'acceptance testing Delhi',
    'user acceptance testing Delhi', 'load testing Delhi', 'stress testing Delhi',
    'performance testing Delhi', 'security testing Delhi', 'penetration testing Delhi',
    'vulnerability testing Delhi', 'compatibility testing Delhi', 'accessibility testing Delhi',
    'usability testing Delhi', 'localization testing Delhi', 'internationalization testing Delhi',
    'globalization testing Delhi', 'automation testing Delhi', 'manual testing Delhi',
    'exploratory testing Delhi', 'ad-hoc testing Delhi', 'smoke testing Delhi',
    'sanity testing Delhi', 'regression testing Delhi', 'retesting Delhi',
    'confirmation testing Delhi', 'alpha testing Delhi', 'beta testing Delhi',
    'gamma testing Delhi', 'delta testing Delhi', 'epsilon testing Delhi',
    'zeta testing Delhi', 'eta testing Delhi', 'theta testing Delhi', 'iota testing Delhi',
    'kappa testing Delhi', 'lambda testing Delhi', 'mu testing Delhi', 'nu testing Delhi',
    'xi testing Delhi', 'omicron testing Delhi', 'pi testing Delhi', 'rho testing Delhi',
    'sigma testing Delhi', 'tau testing Delhi', 'upsilon testing Delhi',
    'phi testing Delhi', 'chi testing Delhi', 'psi testing Delhi', 'omega testing Delhi'
  ];

  const finalKeywords = keywords ? [...new Set([...keywords, ...defaultKeywords])] : defaultKeywords;

  // Generate structured data based on type
  const generateStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": title,
      "description": description,
      "url": canonicalUrl,
      "inLanguage": "en-US",
      "isPartOf": {
        "@type": "WebSite",
        "name": "Taliyo Technologies",
        "url": "https://taliyotechnologies.com"
      }
    };

    if (structuredData) {
      return structuredData;
    }

    if (articleData) {
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "image": ogImage,
        "author": {
          "@type": "Organization",
          "name": "Taliyo Technologies"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Taliyo Technologies",
          "logo": {
            "@type": "ImageObject",
            "url": "https://taliyotechnologies.com/taliyo_technologies_logo.png"
          }
        },
        "datePublished": articleData.datePublished,
        "dateModified": articleData.dateModified,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": canonicalUrl
        }
      };
    }

    if (localBusinessData) {
      return {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Taliyo Technologies",
        "image": "https://taliyotechnologies.com/taliyo_technologies_logo.png",
        "description": description,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Delhi",
          "addressLocality": "Delhi",
          "addressRegion": "Delhi",
          "postalCode": "110001",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "28.7041",
          "longitude": "77.1025"
        },
        "url": "https://taliyotechnologies.com",
        "telephone": "+91-XXXXXXXXXX",
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "09:00",
          "closes": "18:00"
        },
        "priceRange": "$$",
        "currenciesAccepted": "INR, USD",
        "paymentAccepted": "Cash, Credit Card, Bank Transfer",
        "areaServed": "Delhi NCR, Mumbai, Bangalore, Hyderabad, Chennai, Pune, Kolkata, India"
      };
    }

    if (faqData) {
      return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqData.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      };
    }

    if (reviewData) {
      return {
        "@context": "https://schema.org",
        "@type": "Review",
        "itemReviewed": {
          "@type": "Organization",
          "name": "Taliyo Technologies"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": reviewData.rating,
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": reviewData.author
        },
        "reviewBody": reviewData.review
      };
    }

    if (productData) {
      return {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": productData.name,
        "description": productData.description,
        "image": productData.image,
        "offers": {
          "@type": "Offer",
          "price": productData.price,
          "priceCurrency": "INR",
          "availability": "https://schema.org/InStock"
        }
      };
    }

    if (serviceData) {
      return {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": serviceData.name,
        "description": serviceData.description,
        "provider": {
          "@type": "Organization",
          "name": "Taliyo Technologies"
        },
        "areaServed": {
          "@type": "Country",
          "name": "India"
        },
        "serviceType": serviceData.type
      };
    }

    return baseData;
  };

  // Generate breadcrumb structured data
  const generateBreadcrumbData = () => {
    if (!breadcrumbs) return null;

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url
      }))
    };
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={finalKeywords.join(', ')} />
      <meta name="author" content="Taliyo Technologies" />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta name="coverage" content="worldwide" />
      <meta name="target" content="all" />
      <meta name="HandheldFriendly" content="true" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Performance optimizations */}
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#0f172a" />
      <meta name="msapplication-TileColor" content="#0f172a" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Taliyo" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage || "https://taliyotechnologies.com/og-image.jpg"} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="Taliyo Technologies" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="hi_IN" />
      <meta property="og:country-name" content="India" />
      <meta property="og:region" content="Delhi" />
      <meta property="og:locality" content="Delhi" />
      
      {/* Twitter */}
      <meta property="twitter:card" content={twitterCard} />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage || "https://taliyotechnologies.com/twitter-image.jpg"} />
      <meta property="twitter:site" content="@taliyotech" />
      <meta property="twitter:creator" content="@taliyotech" />
      
      {/* Additional Meta Tags */}
      {additionalMeta.map((meta, index) => (
        <meta key={index} {...meta} />
      ))}
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(generateStructuredData())}
      </script>
      
      {/* Breadcrumb Structured Data */}
      {breadcrumbs && (
        <script type="application/ld+json">
          {JSON.stringify(generateBreadcrumbData())}
        </script>
      )}
      
      {/* Organization Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Taliyo Technologies",
          "alternateName": "Taliyo",
          "url": "https://taliyotechnologies.com",
          "logo": "https://taliyotechnologies.com/taliyo_technologies_logo.png",
          "description": "Leading IT company in Delhi, India offering professional web development, mobile app development, AI solutions, cloud computing, and digital marketing services.",
          "foundingDate": "2020",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Delhi",
            "addressRegion": "Delhi",
            "addressCountry": "IN"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-XXXXXXXXXX",
            "contactType": "customer service",
            "areaServed": "IN",
            "availableLanguage": ["English", "Hindi"]
          },
          "sameAs": [
            "https://www.linkedin.com/company/taliyo-technologies",
            "https://www.facebook.com/taliyotechnologies",
            "https://twitter.com/taliyotech",
            "https://www.instagram.com/taliyotechnologies"
          ],
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "IT Services",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Web Development",
                  "description": "Custom web development services using React, Node.js, Python, PHP"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Mobile App Development",
                  "description": "iOS and Android app development services"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Digital Marketing",
                  "description": "SEO, social media marketing, content marketing services"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "AI Solutions",
                  "description": "Artificial intelligence and machine learning solutions"
                }
              }
            ]
          },
          "areaServed": {
            "@type": "Country",
            "name": "India"
          },
          "serviceArea": {
            "@type": "Place",
            "name": "Delhi NCR"
          },
          "keywords": finalKeywords.join(', ')
        })}
      </script>
      
      {/* Website Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Taliyo Technologies",
          "url": "https://taliyotechnologies.com",
          "description": "Leading IT company in Delhi, India offering professional web development, mobile app development, AI solutions, cloud computing, and digital marketing services.",
          "publisher": {
            "@type": "Organization",
            "name": "Taliyo Technologies"
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://taliyotechnologies.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}
      </script>
    </Helmet>
  );
};

export default AdvancedSEO; 