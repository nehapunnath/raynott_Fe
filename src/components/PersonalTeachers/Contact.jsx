import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaGlobe, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaChalkboardTeacher } from 'react-icons/fa';

const Contact = () => {
  const contactDetails = {
    name: 'Dr. Priya Sharma',
    address: 'HSR Layout, Bengaluru, Karnataka, India',
    phone: '+91 9876543210',
    email: 'priya.sharma@example.com',
    website: 'https://www.priyasharma.com',
    socialMedia: {
      facebook: 'https://facebook.com/drpriyasharma',
      twitter: 'https://twitter.com/drpriyasharma',
      instagram: 'https://instagram.com/drpriyasharma',
      linkedin: 'https://linkedin.com/in/drpriyasharma'
    },
    googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.008888888889!2d77.63964131572784!3d12.97296749083023!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae191736000000%3A0x0000000000000000!2sHSR%20Layout!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
  };

  return (
    <div className="p-8 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl shadow-xl border border-orange-100">
      <h2 className="text-3xl font-bold text-center mb-6">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-600">
          Contact Information
        </span>
      </h2>
      
      <div className="space-y-5 max-w-2xl mx-auto">
        {/* Contact Card */}
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-500 hover:shadow-lg transition-shadow duration-300">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-orange-100 p-2 rounded-full mr-4">
                <FaChalkboardTeacher className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Teacher Name</h3>
                <p className="text-gray-600">{contactDetails.name}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-orange-100 p-2 rounded-full mr-4">
                <FaMapMarkerAlt className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Location</h3>
                <p className="text-gray-600">{contactDetails.address}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-orange-100 p-2 rounded-full mr-4">
                <FaPhone className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Phone</h3>
                <a href={`tel:${contactDetails.phone}`} className="text-orange-600 hover:text-orange-800 transition-colors duration-200">
                  {contactDetails.phone}
                </a>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-orange-100 p-2 rounded-full mr-4">
                <FaEnvelope className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Email</h3>
                <a href={`mailto:${contactDetails.email}`} className="text-orange-600 hover:text-orange-800 transition-colors duration-200">
                  {contactDetails.email}
                </a>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-orange-100 p-2 rounded-full mr-4">
                <FaGlobe className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Website</h3>
                <a href={contactDetails.website} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-800 transition-colors duration-200">
                  {contactDetails.website}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-amber-500">
          <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
            <span className="bg-orange-100 p-2 rounded-full mr-3">
              <FaGlobe className="h-5 w-5 text-amber-600" />
            </span>
            Connect on Social Media
          </h3>
          <div className="flex justify-center space-x-6">
            <a href={contactDetails.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="bg-blue-100 p-3 rounded-full text-blue-600 hover:bg-blue-200 transition-colors duration-300">
              <FaFacebook className="w-6 h-6" />
            </a>
            <a href={contactDetails.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="bg-sky-100 p-3 rounded-full text-sky-600 hover:bg-sky-200 transition-colors duration-300">
              <FaTwitter className="w-6 h-6" />
            </a>
            <a href={contactDetails.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="bg-pink-100 p-3 rounded-full text-pink-600 hover:bg-pink-200 transition-colors duration-300">
              <FaInstagram className="w-6 h-6" />
            </a>
            <a href={contactDetails.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="bg-blue-100 p-3 rounded-full text-blue-600 hover:bg-blue-200 transition-colors duration-300">
              <FaLinkedin className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* Google Map */}
        <div className="bg-white p-6 rounded-xl shadow-md overflow-hidden">
          <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
            <span className="bg-orange-100 p-2 rounded-full mr-3">
              <FaMapMarkerAlt className="h-5 w-5 text-orange-600" />
            </span>
            Teaching Location
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
              title="Dr. Priya Sharma Teaching Location"
            ></iframe>
          </div>
          <div className="mt-4 text-center">
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(contactDetails.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
            >
              <FaMapMarkerAlt className="h-5 w-5 mr-2" />
              Get Directions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;