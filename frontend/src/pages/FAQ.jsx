import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronDown, ChevronUp, HelpCircle, Code, Smartphone, Megaphone, Palette, Users, Clock, DollarSign, Shield } from 'lucide-react';

const FAQ = () => {
  const [openItems, setOpenItems] = useState(new Set());

  const toggleItem = (id) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const faqCategories = [
    {
      title: "General Questions",
      icon: <HelpCircle size={24} className="text-blue-400" />,
      items: [
        {
          id: 1,
          question: "What services does Taliyo Technologies offer?",
          answer: "We offer comprehensive digital solutions including web development, mobile app development, graphic design, and digital marketing services. Our team specializes in creating modern, responsive websites, cross-platform mobile applications, brand identity design, and growth marketing strategies to help businesses succeed online."
        },
        {
          id: 2,
          question: "How long does it take to complete a project?",
          answer: "Project timelines vary depending on complexity and scope. A simple website typically takes 2-4 weeks, while complex e-commerce platforms or mobile apps can take 2-6 months. We provide detailed timelines during the initial consultation and keep you updated throughout the development process."
        },
        {
          id: 3,
          question: "Do you provide ongoing support after project completion?",
          answer: "Yes, we offer various support and maintenance packages. This includes regular updates, security patches, performance monitoring, and technical support. We also provide training for your team to manage the platform effectively."
        },
        {
          id: 4,
          question: "What is your pricing structure?",
          answer: "Our pricing is project-based and depends on the scope, complexity, and requirements. We provide detailed quotes after understanding your needs. We offer flexible payment plans and can work within various budgets while maintaining quality standards."
        }
      ]
    },
    {
      title: "Web Development",
      icon: <Code size={24} className="text-green-400" />,
      items: [
        {
          id: 5,
          question: "What technologies do you use for web development?",
          answer: "We use modern, industry-standard technologies including React, Node.js, MongoDB, Express, and various other frameworks. Our tech stack is chosen based on project requirements to ensure optimal performance, scalability, and maintainability."
        },
        {
          id: 6,
          question: "Do you create responsive websites?",
          answer: "Absolutely! All our websites are mobile-first and fully responsive. We ensure your website looks and functions perfectly across all devices - desktops, tablets, and smartphones. This is crucial for SEO and user experience."
        },
        {
          id: 7,
          question: "Can you integrate third-party services and APIs?",
          answer: "Yes, we have extensive experience integrating various third-party services including payment gateways (Stripe, PayPal), CRM systems, email marketing tools, analytics platforms, and custom APIs. We ensure seamless integration with your existing systems."
        },
        {
          id: 8,
          question: "Do you provide SEO optimization?",
          answer: "Yes, we implement SEO best practices during development including proper meta tags, structured data, optimized content structure, fast loading times, and mobile-friendly design. We also provide ongoing SEO services to improve your search rankings."
        }
      ]
    },
    {
      title: "App Development",
      icon: <Smartphone size={24} className="text-purple-400" />,
      items: [
        {
          id: 9,
          question: "Do you develop for both iOS and Android?",
          answer: "Yes, we develop for both platforms. We use cross-platform technologies like React Native and Flutter to create apps that work seamlessly on both iOS and Android, reducing development time and cost while maintaining native performance."
        },
        {
          id: 10,
          question: "How do you handle app store submissions?",
          answer: "We handle the entire app store submission process including preparing store listings, creating app icons and screenshots, writing descriptions, and managing the submission to both Apple App Store and Google Play Store. We also help with app store optimization (ASO)."
        },
        {
          id: 11,
          question: "Can you integrate push notifications?",
          answer: "Yes, we implement push notifications to keep users engaged. This includes setting up notification services, creating engaging notification content, and implementing analytics to track notification effectiveness and user engagement."
        },
        {
          id: 12,
          question: "Do you provide app maintenance and updates?",
          answer: "We offer comprehensive app maintenance services including bug fixes, performance updates, new feature development, and compatibility updates for new OS versions. We also monitor app performance and user feedback to suggest improvements."
        }
      ]
    },
    {
      title: "Digital Marketing",
      icon: <Megaphone size={24} className="text-pink-400" />,
      items: [
        {
          id: 13,
          question: "What digital marketing services do you offer?",
          answer: "We offer comprehensive digital marketing services including SEO (Search Engine Optimization), SEM (Search Engine Marketing), social media marketing, content marketing, email marketing, and analytics. We create customized strategies based on your business goals and target audience."
        },
        {
          id: 14,
          question: "How long does it take to see SEO results?",
          answer: "SEO is a long-term strategy. Initial improvements in technical SEO can be seen within 2-4 weeks, while significant organic traffic increases typically take 3-6 months. We provide regular reports and analytics to track progress and make necessary adjustments."
        },
        {
          id: 15,
          question: "Do you manage social media accounts?",
          answer: "Yes, we provide complete social media management including content creation, posting schedules, community engagement, paid advertising, and performance analytics. We create engaging content that aligns with your brand voice and business objectives."
        },
        {
          id: 16,
          question: "What ROI can I expect from digital marketing?",
          answer: "ROI varies by industry and strategy. We typically see 200-500% ROI on well-executed campaigns. We provide detailed analytics and reporting to track performance, conversions, and revenue impact. Our goal is to maximize your marketing budget efficiency."
        }
      ]
    },
    {
      title: "Graphic Design",
      icon: <Palette size={24} className="text-orange-400" />,
      items: [
        {
          id: 17,
          question: "What design services do you provide?",
          answer: "We offer comprehensive design services including logo design, brand identity packages, UI/UX design for websites and apps, marketing collateral (brochures, flyers, social media graphics), infographics, and print design. We ensure all designs align with your brand guidelines."
        },
        {
          id: 18,
          question: "How many design revisions do you include?",
          answer: "We typically include 3 rounds of revisions in our design packages. This allows for feedback and adjustments while maintaining project timelines. Additional revisions can be added if needed, and we work closely with clients to ensure satisfaction."
        },
        {
          id: 19,
          question: "Do you provide brand guidelines?",
          answer: "Yes, we create comprehensive brand guidelines including logo usage, color palettes, typography, spacing guidelines, and design principles. This ensures consistency across all your marketing materials and helps maintain brand integrity."
        },
        {
          id: 20,
          question: "Can you design for both digital and print?",
          answer: "Absolutely! We design for both digital and print mediums. We understand the technical requirements for each medium and ensure designs are optimized for their intended use, whether it's for web, mobile, or print materials."
        }
      ]
    },
    {
      title: "Project Management",
      icon: <Users size={24} className="text-cyan-400" />,
      items: [
        {
          id: 21,
          question: "How do you communicate during projects?",
          answer: "We maintain regular communication through scheduled calls, email updates, and project management tools. You'll have a dedicated project manager who keeps you informed about progress, milestones, and any important decisions that need your input."
        },
        {
          id: 22,
          question: "What is your project management process?",
          answer: "We follow a structured process: Discovery & Planning, Design & Prototyping, Development, Testing & QA, and Deployment. Each phase includes client feedback and approval before moving to the next stage. We use agile methodologies for flexibility and transparency."
        },
        {
          id: 23,
          question: "Do you provide project timelines and milestones?",
          answer: "Yes, we provide detailed project timelines with specific milestones and deliverables. You'll receive regular updates on progress, and we'll notify you immediately if there are any delays or changes to the timeline."
        },
        {
          id: 24,
          question: "What happens if I need changes during development?",
          answer: "We understand that requirements can evolve. We handle change requests through a structured process, evaluating impact on timeline and budget. Minor changes are usually accommodated, while major changes may require timeline adjustments and additional costs."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Helmet>
        <title>Frequently Asked Questions | Taliyo Technologies</title>
        <meta name="description" content="Find answers to common questions about our web development, app development, digital marketing, and graphic design services. Get detailed information about our process, pricing, and support." />
      </Helmet>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Frequently Asked <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Questions</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Find answers to common questions about our services, process, and what you can expect when working with Taliyo Technologies.
          </p>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
                <div className="flex items-center gap-3 mb-8">
                  {category.icon}
                  <h2 className="text-2xl font-bold text-white">{category.title}</h2>
                </div>
                
                <div className="space-y-4">
                  {category.items.map((item) => (
                    <div key={item.id} className="border border-gray-800 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleItem(item.id)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      >
                        <span className="font-semibold text-white pr-4">{item.question}</span>
                        {openItems.has(item.id) ? (
                          <ChevronUp size={20} className="text-blue-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown size={20} className="text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      
                      {openItems.has(item.id) && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-300 leading-relaxed">{item.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Still Have Questions?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our team is here to help. Contact us for personalized assistance.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a 
              href="/contact" 
              className="group px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center"
            >
              Contact Us
            </a>
            <a 
              href="/services" 
              className="group px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold rounded-xl transition-all duration-300 flex items-center"
            >
              View Services
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ; 