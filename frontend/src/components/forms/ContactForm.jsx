import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const API = import.meta.env.VITE_API_URL || 'https://taliyo-backend.onrender.com';
  
  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`${API}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to send');
      setSubmitted(true)
      reset()
      setTimeout(() => setSubmitted(false), 15000)
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <AnimatePresence>
        {submitted ? (
          <motion.div
            key="thankyou"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-16 px-6 bg-gradient-to-br from-blue-600/90 to-purple-600/90 rounded-2xl shadow-xl border border-blue-500/20 min-h-[350px]"
          >
            <CheckCircle size={64} className="text-green-400 mb-4 animate-bounce-in" />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">Thank you for contacting us!</h2>
            <p className="text-lg text-gray-100 mb-4 text-center max-w-md">
              We have received your message and will get back to you soon.<br />
              You can continue browsing our website or check your email for confirmation.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <a href="/" className="btn btn-primary mt-2">Go to Home</a>
            </motion.div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                  Full Name *
                </label>
                <input
                  id="name"
                  type="text"
                  {...register('name', {
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' },
                  })}
                  className={`input ${errors.name ? 'input-error' : ''}`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-error-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address',
                    },
                  })}
                  className={`input ${errors.email ? 'input-error' : ''}`}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="text-error-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  {...register('phone', {
                    pattern: {
                      value: /^[\+]?[1-9][\d]{0,15}$/,
                      message: 'Please enter a valid phone number',
                    },
                  })}
                  className={`input ${errors.phone ? 'input-error' : ''}`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="text-error-500 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>

              {/* Company */}
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-white mb-2">
                  Company Name
                </label>
                <input
                  id="company"
                  type="text"
                  {...register('company')}
                  className="input"
                  placeholder="Enter your company name"
                />
              </div>
            </div>

            {/* Service */}
            <div>
              <label htmlFor="service" className="block text-sm font-medium text-white mb-2">
                Service Interested In
              </label>
              <select
                id="service"
                {...register('service')}
                className="input"
              >
                <option value="">Select a service</option>
                <option value="web-development">Web Development</option>
                <option value="app-development">App Development</option>
                <option value="graphic-design">Graphic Design</option>
                <option value="digital-marketing">Digital Marketing</option>
                <option value="consultation">Consultation</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Budget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-white mb-2">
                  Budget Range
                </label>
                <select
                  id="budget"
                  {...register('budget')}
                  className="input"
                >
                  <option value="">Select budget range</option>
                  <option value="under-10k">Under ₹10,000</option>
                  <option value="10k-50k">₹10,000 - ₹50,000</option>
                  <option value="50k-100k">₹50,000 - ₹100,000</option>
                  <option value="100k-500k">₹100,000 - ₹500,000</option>
                  <option value="500k+">₹500,000+</option>
                  <option value="not-specified">Not specified</option>
                </select>
              </div>

              <div>
                <label htmlFor="timeline" className="block text-sm font-medium text-white mb-2">
                  Project Timeline
                </label>
                <select
                  id="timeline"
                  {...register('timeline')}
                  className="input"
                >
                  <option value="">Select timeline</option>
                  <option value="1-2-weeks">1-2 weeks</option>
                  <option value="1-month">1 month</option>
                  <option value="2-3-months">2-3 months</option>
                  <option value="3-6-months">3-6 months</option>
                  <option value="6-months+">6 months+</option>
                  <option value="not-specified">Not specified</option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                Message *
              </label>
              <textarea
                id="message"
                rows={6}
                {...register('message', {
                  required: 'Message is required',
                  minLength: { value: 10, message: 'Message must be at least 10 characters' },
                  maxLength: { value: 1000, message: 'Message cannot exceed 1000 characters' },
                })}
                className={`input resize-none ${errors.message ? 'input-error' : ''}`}
                placeholder="Tell us about your project requirements..."
              />
              {errors.message && (
                <p className="text-error-500 text-sm mt-1">{errors.message.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="mr-2 animate-spin" />
                  Sending Message...
                </>
              ) : (
                <>
                  <Send size={20} className="mr-2" />
                  Send Message
                </>
              )}
            </motion.button>

            <p className="text-sm text-secondary-400 text-center">
              By submitting this form, you agree to our{' '}
              <a href="/privacy-policy" className="text-primary-400 hover:text-primary-300 underline">
                Privacy Policy
              </a>{' '}and{' '}
              <a href="/terms-conditions" className="text-primary-400 hover:text-primary-300 underline">
                Terms & Conditions
              </a>.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ContactForm 