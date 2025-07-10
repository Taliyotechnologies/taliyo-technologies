import React from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Mail, Phone, Linkedin } from "lucide-react";
import ContactForm from "../components/forms/ContactForm";

const services = [
  "Web Development",
  "App Development",
  "Graphic Design",
  "Digital Marketing",
  "Other",
];

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us | Taliyo Technologies</title>
        <meta
          name="description"
          content="Contact Taliyo Technologies for web, app, design, and marketing services. Book a free consultation today!"
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden px-4 md:px-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-black">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.10) 1px, transparent 0)`,
                backgroundSize: "40px 40px",
              }}
            ></div>
          </div>
        </div>
        <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight mt-10 md:mt-16"
          >
            Contact{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Taliyo
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-gray-300 max-w-xl mx-auto mb-8"
          >
            Book a free consultation or ask us anything. We’ll get back to you
            within 24 hours.
          </motion.p>
        </div>
      </section>

      {/* Contact/Booking Form */}
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-4 flex flex-col md:flex-row gap-12 items-start justify-center">
          <div className="flex-1 max-w-xl mx-auto">
            <ContactForm />
          </div>

          {/* Company Info & Social */}
          <div className="flex-1 flex flex-col gap-6 max-w-md mx-auto">
            <div className="bg-gray-900 rounded-2xl p-6 border border-blue-500/10 flex items-center gap-4">
              <Mail size={28} className="text-blue-400" />
              <div>
                <div className="text-gray-300 text-sm">Email</div>
                <a
                  href="mailto:info@taliyotechnologies.com"
                  className="text-white font-medium hover:text-blue-400 transition-colors"
                >
                  info@taliyotechnologies.com
                </a>
              </div>
            </div>
            <div className="bg-gray-900 rounded-2xl p-6 border border-blue-500/10 flex items-center gap-4">
              <Phone size={28} className="text-green-400" />
              <div>
                <div className="text-gray-300 text-sm">Phone</div>
                <a
                  href="tel:+917042523611"
                  className="text-white font-medium hover:text-green-400 transition-colors"
                >
                  +91 70425 23611
                </a>
              </div>
            </div>
            <div className="bg-gray-900 rounded-2xl p-6 border border-blue-500/10 flex items-center gap-4">
              <Linkedin size={28} className="text-blue-300" />
              <div>
                <div className="text-gray-300 text-sm">LinkedIn</div>
                <a
                  href="https://www.linkedin.com/company/107573393"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white font-medium hover:text-blue-300 transition-colors"
                >
                  linkedin.com/company/taliyo
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20 bg-gradient-to-r from-blue-600 to-purple-600"
        aria-labelledby="cta-heading"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-8 tracking-tight"
          >
            Let’s Build Something Amazing Together
          </motion.h2>
          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Ready to take your business to the next level? Get in touch for a
            free consultation or to discuss your project requirements.
          </p>
        </div>
      </section>
    </>
  );
};

export default Contact;
