import React from 'react';
import { Helmet } from 'react-helmet-async';

const TermsConditions = () => {
  return (
    <>
      <Helmet>
        <title>Terms and Conditions - Taliyo Technologies</title>
        <meta name="description" content="Terms and Conditions for Taliyo Technologies. Read our service terms, payment policies, and client responsibilities." />
        <meta name="keywords" content="terms and conditions, service terms, payment policy, client agreement, Taliyo Technologies" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-900 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <span className="text-4xl mr-4">📜</span>
                <h1 className="text-4xl lg:text-5xl mt-5 font-bold text-gray-900 dark:text-white">
                  Terms and Conditions
                </h1>
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Please read these terms carefully before using our services. These terms govern your relationship with Taliyo Technologies.
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
                Taliyo Technologies Terms and Conditions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
                <div>
                  <strong>Effective Date:</strong> 08 July 2016
                </div>
                <div>
                  <strong>Last Updated:</strong> 08 July 2024
                </div>
              </div>
            </div>

            {/* Section 1: Acceptance of Terms */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                By accessing or using the website <a href="https://taliyotechnologies.com" className="text-blue-600 dark:text-blue-400 hover:underline">https://taliyotechnologies.com</a> and any of its services, products, or tools (collectively, "Services"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree with any part of these Terms, please do not use our website or services.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                These Terms constitute a legally binding agreement between you (the "Client", "User", or "You") and Taliyo Technologies ("Company", "We", "Us", or "Our").
              </p>
            </div>

            {/* Section 2: About Us */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">2. About Us</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Taliyo Technologies is a digital service company offering:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4 mb-4">
                <li>Web Development</li>
                <li>App Development</li>
                <li>Graphic Design</li>
                <li>Digital Marketing</li>
                <li>Technology Consultation</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300">
                We serve clients across India and globally.
              </p>
            </div>

            {/* Section 3: Eligibility */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">3. Eligibility</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                To use our services, you must:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>Be at least 18 years of age</li>
                <li>Be legally capable of entering into contracts</li>
                <li>Provide accurate and complete information</li>
              </ul>
            </div>

            {/* Section 4: Scope of Services */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">4. Scope of Services</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We offer custom digital solutions tailored to your business needs. The specific scope, features, pricing, and timeline for any service will be outlined in a formal proposal or agreement shared with you via email or documentation.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We reserve the right to:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>Accept or reject any project or client</li>
                <li>Make changes to our services, pricing, and packages</li>
              </ul>
            </div>

            {/* Section 5: Client Responsibilities */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">5. Client Responsibilities</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You agree to:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4 mb-4">
                <li>Provide clear project requirements</li>
                <li>Respond promptly to feedback and communication</li>
                <li>Make timely payments</li>
                <li>Not use our services for any illegal, abusive, or unethical purposes</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300">
                Failure to cooperate or provide necessary inputs may delay or impact project outcomes.
              </p>
            </div>

            {/* Section 6: Payments & Invoicing */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">6. Payments & Invoicing</h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>All prices are in INR (₹) unless otherwise stated</li>
                <li>A minimum 50% advance is required before project initiation</li>
                <li>Remaining payment is due upon project completion, before final handover</li>
                <li>No refunds are issued once a project is started unless stated otherwise in a separate agreement</li>
                <li>Late payments may incur service suspension or additional fees</li>
                <li>Payment methods accepted: UPI, Bank Transfer, Razorpay, PayPal (for international clients)</li>
              </ul>
            </div>

            {/* Section 7: Project Timeline & Delivery */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">7. Project Timeline & Delivery</h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>Estimated timelines are shared at the beginning of each project</li>
                <li>Delays may occur due to external dependencies or client-side inactivity</li>
                <li>Revisions beyond the agreed scope may require additional time and charges</li>
                <li>Project is considered complete once final files are handed over and final payment is made</li>
              </ul>
            </div>

            {/* Section 8: Revisions & Changes */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">8. Revisions & Changes</h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>We offer limited revisions as per project agreement</li>
                <li>Excessive revisions or change requests outside scope will be billed additionally</li>
                <li>Any new feature request during development may shift the delivery timeline</li>
              </ul>
            </div>

            {/* Section 9: Intellectual Property */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">9. Intellectual Property</h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>All custom code, design, and assets created by Taliyo Technologies are the property of the company until full payment is received</li>
                <li>Upon completion and payment, ownership of project-specific deliverables is transferred to the client</li>
                <li>We reserve the right to showcase completed projects in our portfolio, unless the client requests otherwise in writing</li>
              </ul>
            </div>

            {/* Section 10: Confidentiality */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">10. Confidentiality</h3>
              <p className="text-gray-700 dark:text-gray-300">
                We respect the confidentiality of your data, business plans, and intellectual property. Any information shared during the project will not be disclosed to third parties without your consent.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mt-4">
                You also agree not to disclose any confidential or proprietary information related to Taliyo Technologies.
              </p>
            </div>

            {/* Section 11: Limitation of Liability */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">11. Limitation of Liability</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Taliyo Technologies shall not be liable for:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4 mb-4">
                <li>Any indirect, incidental, or consequential damages</li>
                <li>Loss of profits, data, or business opportunities</li>
                <li>Issues arising from third-party plugins, APIs, hosting, or platforms used in the project</li>
                <li>Delays caused by the client's inaction or miscommunication</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300">
                Our maximum liability shall not exceed the total project fee paid by the client.
              </p>
            </div>

            {/* Section 12: Third-Party Services */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">12. Third-Party Services</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We may integrate or recommend third-party tools (e.g., hosting, APIs, CMS, marketing tools). Taliyo Technologies is not responsible for:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4 mb-4">
                <li>The availability, performance, or updates of third-party services</li>
                <li>Any breaches or losses resulting from their use</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300">
                You are advised to read and accept the terms of such third parties separately.
              </p>
            </div>

            {/* Section 13: Termination */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">13. Termination</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We reserve the right to suspend or terminate any ongoing project or relationship if:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4 mb-4">
                <li>The client fails to make timely payments</li>
                <li>The client is found violating any laws or ethical boundaries</li>
                <li>There is consistent lack of cooperation or abusive behavior</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300">
                Any termination will be communicated formally with details.
              </p>
            </div>

            {/* Section 14: Refund Policy */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">14. Refund Policy</h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>No refunds will be issued once a project is underway and initial work has started</li>
                <li>Refunds are only possible if we are unable to initiate work after receiving payment, and the client hasn't breached any clause</li>
                <li>Partial refunds (if any) are solely at the discretion of Taliyo Technologies</li>
              </ul>
            </div>

            {/* Section 15: Governing Law */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">15. Governing Law</h3>
              <p className="text-gray-700 dark:text-gray-300">
                These Terms shall be governed by and interpreted in accordance with the laws of India. Any disputes shall be subject to the jurisdiction of the courts in New Delhi, India.
              </p>
            </div>

            {/* Section 16: Updates to Terms */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">16. Updates to Terms</h3>
              <p className="text-gray-700 dark:text-gray-300">
                We may update these Terms and Conditions from time to time without prior notice. You are advised to review this page periodically. Continued use of our website or services after changes implies acceptance of the revised terms.
              </p>
            </div>

            {/* Section 17: Contact Us */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">17. Contact Us</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                For any questions, concerns, or requests related to these Terms, please contact us at:
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p><strong>Taliyo Technologies</strong></p>
                  <p>Email: <a href="mailto:info@taliyotechnologies.com" className="text-blue-600 dark:text-blue-400 hover:underline">info@taliyotechnologies.com</a></p>
                  <p>Website: <a href="https://www.taliyotechnologies.com" className="text-blue-600 dark:text-blue-400 hover:underline">www.taliyotechnologies.com</a></p>
                  <p>Business Address: Delhi, India</p>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                These Terms and Conditions are effective as of the date listed above and apply to all users of our services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsConditions; 