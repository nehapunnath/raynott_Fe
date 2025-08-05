import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaClock, 
  FaPaperPlane,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StickyButton from '../components/StickyButton';

const ContactUs = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    navigate('/thank-you');
  };

  const socialMedia = [
    { name: 'Facebook', icon: <FaFacebookF />, color: 'bg-blue-600 hover:bg-blue-700' },
    { name: 'Twitter', icon: <FaTwitter />, color: 'bg-blue-400 hover:bg-blue-500' },
    { name: 'Instagram', icon: <FaInstagram />, color: 'bg-pink-600 hover:bg-pink-700' },
    { name: 'LinkedIn', icon: <FaLinkedinIn />, color: 'bg-blue-700 hover:bg-blue-800' },
    { name: 'YouTube', icon: <FaYoutube />, color: 'bg-red-600 hover:bg-red-700' }
  ];

  return (
    
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        <Header/>
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white py-16 px-6 text-center">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-4"
        >
          Contact Us
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg max-w-2xl mx-auto"
        >
          We'd love to hear from you! Reach out with questions, feedback, or partnership inquiries.
        </motion.p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-orange-100 p-3 rounded-full mr-4">
                  <FaMapMarkerAlt className="text-orange-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Headquarters</h3>
                  <p className="text-gray-600">123 Education Street<br />Bengaluru, Karnataka 560001<br />India</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-orange-100 p-3 rounded-full mr-4">
                  <FaPhone className="text-orange-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Phone</h3>
                  <p className="text-gray-600">
                    <a href="tel:+911234567890" className="hover:text-orange-600 transition">+91 12345 67890</a><br />
                    <a href="tel:+911234567891" className="hover:text-orange-600 transition">+91 12345 67891</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-orange-100 p-3 rounded-full mr-4">
                  <FaEnvelope className="text-orange-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Email</h3>
                  <p className="text-gray-600">
                    <a href="mailto:info@raynott.com" className="hover:text-orange-600 transition">info@raynott.com</a><br />
                    <a href="mailto:support@raynott.com" className="hover:text-orange-600 transition">support@raynott.com</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-orange-100 p-3 rounded-full mr-4">
                  <FaClock className="text-orange-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Working Hours</h3>
                  <p className="text-gray-600">
                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                    Saturday: 10:00 AM - 4:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Follow Us</h3>
              <div className="flex space-x-4">
                {socialMedia.map((social) => (
                  <motion.a
                    key={social.name}
                    href="#"
                    whileHover={{ y: -3 }}
                    className={`${social.color} text-white p-3 rounded-full transition flex items-center justify-center`}
                    aria-label={social.name}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-700 mb-2">Full Name*</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-2">Email*</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-gray-700 mb-2">Subject*</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-gray-700 mb-2">Message*</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                ></textarea>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-orange-700 hover:to-amber-700 transition shadow-lg"
              >
                <FaPaperPlane className="inline mr-2" /> Send Message
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="h-96 w-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">Map Integration Would Appear Here</p>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Our Location</h3>
            <p className="text-gray-600">Visit our headquarters during working hours for in-person support.</p>
          </div>
        </motion.div>
      </div>
      {/* <Footer/> */}
          <StickyButton/>
    </div>
  );
};

export default ContactUs;