import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaClock,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube
} from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StickyButton from '../components/StickyButton';
import "tailwindcss";

const ContactUs = () => {
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
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Contact Information */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Our Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

          {/* Social Media */}
          <div className="pt-8 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Follow Us</h3>
            <div className="flex justify-center space-x-4">
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
      
      <StickyButton/>
    </div>
  );
};

export default ContactUs;