import React from 'react';
import { Helmet } from 'react-helmet-async';

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - Taliyo Technologies</title>
        <meta name="description" content="Privacy Policy for Taliyo Technologies. Learn how we collect, use, and protect your personal information." />
        <meta name="keywords" content="privacy policy, data protection, personal information, Taliyo Technologies" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-900 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <span className="text-4xl mr-4">🛡️</span>
                <h1 className="text-4xl lg:text-5xl mt-4 font-bold text-gray-900 dark:text-white">
                  Privacy Policy
                </h1>
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Taliyo Technologies is committed to protecting your privacy and ensuring the security of your personal information.
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 lg:p-12">
            
            {/* Header Info */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Taliyo Technologies Privacy Policy
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
                <div>
                  <strong>Effective Date:</strong> 08 July 2020
                </div>
                <div>
                  <strong>Last Updated:</strong> 08 July 2023
                </div>
              </div>
            </div>

            {/* Introduction */}
            <div className="mb-8">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Welcome to Taliyo Technologies ("Company", "we", "our", or "us"). Your privacy is of utmost importance to us. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our 
                website <a href="https://taliyotechnologies.com" className="text-blue-600 dark:text-blue-400 hover:underline">https://taliyotechnologies.com </a> 
                 or use any of our services.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                By accessing or using our site or services, you consent to the practices described in this Privacy Policy.
              </p>
            </div>

            {/* Section 1: Information We Collect */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">1. Information We Collect</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We collect various types of information when you interact with us:
              </p>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">a) Personal Information</h4>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    We may collect personal data such as:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                    <li>Name</li>
                    <li>Email address</li>
                    <li>Phone number</li>
                    <li>Business name</li>
                    <li>Billing details</li>
                    <li>IP address</li>
                    <li>Any other information you voluntarily provide via contact forms, chats, or email.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">b) Usage Data</h4>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    We automatically collect information on how our website is accessed and used. This includes:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                    <li>Browser type</li>
                    <li>Device information</li>
                    <li>Pages visited</li>
                    <li>Time spent on pages</li>
                    <li>Referring URLs</li>
                    <li>Clickstream data</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">c) Cookies & Tracking Technologies</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    We use cookies, pixels, and other tracking technologies to enhance user experience, perform analytics, 
                    and enable personalized content. You can manage cookie preferences in your browser settings.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: How We Use Your Information */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">2. How We Use Your Information</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We use the collected information for various legitimate business purposes:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>To provide, operate, and maintain our services</li>
                <li>To improve, personalize, and expand our website</li>
                <li>To respond to your inquiries, support requests, and feedback</li>
                <li>To send administrative information and service-related announcements</li>
                <li>To process transactions and billing</li>
                <li>To detect, prevent, and address security issues or fraud</li>
                <li>To comply with legal obligations</li>
              </ul>
            </div>

            {/* Section 3: Sharing Your Information */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">3. Sharing Your Information</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We do not sell or rent your personal information. However, we may share it in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>With trusted third-party service providers (e.g., hosting, payment gateways, analytics) who assist us in operating our website and business</li>
                <li>When legally required, such as to comply with a subpoena, law, or legal process</li>
                <li>In connection with a business transfer, merger, acquisition, or asset sale</li>
                <li>With your consent, in cases where you've agreed to specific disclosures</li>
              </ul>
            </div>

            {/* Section 4: Data Retention */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">4. Data Retention</h3>
              <p className="text-gray-700 dark:text-gray-300">
                We retain your personal information only for as long as necessary for the purposes set out in this Privacy Policy, 
                including to comply with legal, tax, or regulatory obligations.
              </p>
            </div>

            {/* Section 5: Your Privacy Rights */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">5. Your Privacy Rights</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
                <li><strong>Rectification:</strong> Request correction of inaccurate or incomplete data</li>
                <li><strong>Erasure:</strong> Request deletion of your data</li>
                <li><strong>Restriction:</strong> Request to restrict the processing of your data</li>
                <li><strong>Objection:</strong> Object to our processing of your data</li>
                <li><strong>Data Portability:</strong> Request your data in a structured, machine-readable format</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 mt-4">
                To exercise any of the above rights, contact us at{' '}
                <a href="mailto:info@taliyotechnologies.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                  info@taliyotechnologies.com
                </a>.
              </p>
            </div>

            {/* Section 6: Data Security */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">6. Data Security</h3>
              <p className="text-gray-700 dark:text-gray-300">
                We implement industry-standard security measures to protect your personal data. However, no method of transmission 
                over the Internet is 100% secure. We cannot guarantee absolute security.
              </p>
            </div>

            {/* Section 7: Third-Party Links */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">7. Third-Party Links</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Our website may contain links to third-party websites or services. We are not responsible for the privacy practices 
                or the content of those websites. Please review their privacy policies individually.
              </p>
            </div>

            {/* Section 8: Children's Privacy */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">8. Children's Privacy</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Our services are not intended for children under the age of 13, and we do not knowingly collect personal information 
                from children. If you believe we have inadvertently collected such data, please contact us immediately.
              </p>
            </div>

            {/* Section 9: International Data Transfers */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">9. International Data Transfers</h3>
              <p className="text-gray-700 dark:text-gray-300">
                If you access our services from outside India, please note that your information may be transferred to, stored, 
                and processed in India or other jurisdictions.
              </p>
            </div>

            {/* Section 10: Updates to This Policy */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">10. Updates to This Policy</h3>
              <p className="text-gray-700 dark:text-gray-300">
                We may update this Privacy Policy from time to time. When we do, we will revise the "Last Updated" date at the top. 
                We encourage you to review this policy periodically.
              </p>
            </div>

            {/* Section 11: Contact Us */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">11. Contact Us</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                If you have any questions or concerns regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p><strong>Taliyo Technologies</strong></p>
                  <p>Email: <a href="mailto:info@taliyotechnologies.com" className="text-blue-600 dark:text-blue-400 hover:underline">info@taliyotechnologies.com</a></p>
                  <p>Website: <a href="https://www.taliyotechnologies.com" className="text-blue-600 dark:text-blue-400 hover:underline">www.taliyotechnologies.com</a></p>
                  <p>Address: Delhi, India</p>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                This Privacy Policy is effective as of the date listed above and applies to all users of our services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy; 