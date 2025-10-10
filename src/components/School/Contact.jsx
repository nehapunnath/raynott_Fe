import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaPhone, FaEnvelope, FaMapMarkerAlt, 
  FaGlobe, FaFacebookF, FaTwitter, FaInstagram,
  FaDirections, FaSchool, FaSpinner, FaExclamationTriangle
} from 'react-icons/fa';
import { schoolApi } from '../../services/schoolApi';
import { useParams } from 'react-router-dom';
import "tailwindcss";


const Contact = () => {
  const { id } = useParams();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        setLoading(true);
        const response = await schoolApi.getSchool(id);
        setSchool(response.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch school contact data');
        console.error('Error fetching school data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSchoolData();
    } else {
      setError('No school ID provided');
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12" role="status" aria-live="polite">
        <FaSpinner className="animate-spin text-orange-600 text-3xl" />
        <span className="ml-3 text-gray-600">Loading contact information...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600" role="alert">
        <FaExclamationTriangle className="text-2xl mx-auto mb-2" />
        <p>Error loading contact information: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Check if social media object exists and has any valid links
  const hasSocialMedia = school?.socialMedia && (
    school.socialMedia.facebook || 
    school.socialMedia.twitter || 
    school.socialMedia.instagram
  );

  // Format contact details with "Not specified" for missing data
  const contactDetails = {
    name: school?.name || 'Not specified',
    address: school?.address || 'Not specified',
    phone: school?.contactNumber || 'Not specified',
    email: school?.email || 'Not specified',
    website: school?.website || 'Not specified',
    socialMedia: {
      facebook: school?.socialMedia?.facebook || null,
      twitter: school?.socialMedia?.twitter || null,
      instagram: school?.socialMedia?.instagram || null,
    },
    googleMapsEmbedUrl: school?.googleMapsEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.008888888889!2d77.63964131572784!3d13.11296749083023!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae191736000000%3A0x0000000000000000!2sNew%20Horizon%20International%20School!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
  };

  return (
    <div className="p-8 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl shadow-xl border border-orange-100">
      <h2 className="text-3xl font-bold text-center mb-6">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-600">
          Contact Us
        </span>
      </h2>
      
      <div className="space-y-5 max-w-2xl mx-auto">
        {/* Contact Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-500 hover:shadow-lg transition-shadow duration-300"
        >
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-orange-100 p-2 rounded-full mr-4">
                <FaSchool className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">School Name</h3>
                <p className="text-gray-600">{contactDetails.name}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-orange-100 p-2 rounded-full mr-4">
                <FaMapMarkerAlt className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Address</h3>
                <p className="text-gray-600">{contactDetails.address}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-orange-100 p-2 rounded-full mr-4">
                <FaPhone className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Phone</h3>
                {contactDetails.phone !== 'Not specified' ? (
                  <a href={`tel:${contactDetails.phone}`} className="text-orange-600 hover:text-orange-800 transition-colors duration-200">
                    {contactDetails.phone}
                  </a>
                ) : (
                  <p className="text-gray-600">{contactDetails.phone}</p>
                )}
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-orange-100 p-2 rounded-full mr-4">
                <FaEnvelope className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Email</h3>
                {contactDetails.email !== 'Not specified' ? (
                  <a href={`mailto:${contactDetails.email}`} className="text-orange-600 hover:text-orange-800 transition-colors duration-200">
                    {contactDetails.email}
                  </a>
                ) : (
                  <p className="text-gray-600">{contactDetails.email}</p>
                )}
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-orange-100 p-2 rounded-full mr-4">
                <FaGlobe className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Website</h3>
                {contactDetails.website !== 'Not specified' ? (
                  <a href={contactDetails.website} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-800 transition-colors duration-200">
                    {contactDetails.website}
                  </a>
                ) : (
                  <p className="text-gray-600">{contactDetails.website}</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Social Media - Only show if there are social media links */}
        {hasSocialMedia && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-md border-l-4 border-amber-500"
          >
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
              Follow Us
            </h3>
            <div className="flex justify-center space-x-6">
              {contactDetails.socialMedia.facebook && (
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  href={contactDetails.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-100 p-3 rounded-full text-blue-600 hover:bg-blue-200 transition-colors duration-300"
                  aria-label="Facebook"
                >
                  <FaFacebookF className="w-6 h-6" />
                </motion.a>
              )}
              
              {contactDetails.socialMedia.twitter && (
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  href={contactDetails.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-sky-100 p-3 rounded-full text-sky-600 hover:bg-sky-200 transition-colors duration-300"
                  aria-label="Twitter"
                >
                  <FaTwitter className="w-6 h-6" />
                </motion.a>
              )}
              
              {contactDetails.socialMedia.instagram && (
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  href={contactDetails.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-pink-100 p-3 rounded-full text-pink-600 hover:bg-pink-200 transition-colors duration-300"
                  aria-label="Instagram"
                >
                  <FaInstagram className="w-6 h-6" />
                </motion.a>
              )}
            </div>
          </motion.div>
        )}

        {/* Google Map */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-md overflow-hidden"
        >
          <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
            <FaMapMarkerAlt className="h-5 w-5 text-orange-600 mr-2" />
            Find Us
          </h3>
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
            <iframe
              src={contactDetails.googleMapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="min-h-[300px]"
              title={`${contactDetails.name} Location`}
            ></iframe>
          </div>
          <div className="mt-4 text-center">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(contactDetails.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
            >
              <FaDirections className="h-5 w-5 mr-2" />
              Get Directions
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;