import React, { useState, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaGlobe, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaChalkboardTeacher } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { teacherApi } from '../../services/TeacherApi';
import "tailwindcss";


const Contact = () => {
  const { id } = useParams(); // Get mentor ID from URL params
  const [contactDetails, setContactDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch mentor contact details when component mounts
  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await teacherApi.getPersonalMentorDetails(id);
        console.log('API response:', response); // Debug: Log the full response

        if (response.success && response.data) {
          const { basicInfo = {}, contact = {} } = response.data;
          const mappedContactDetails = {
            name: basicInfo.name || 'Not specified',
            address: basicInfo.address && basicInfo.city ? `${basicInfo.address}, ${basicInfo.city}` : 'Not specified',
            phone: contact.phone || 'Not specified',
            email: contact.email || 'Not specified',
            website: contact.website || '',
            socialMedia: {
              facebook: contact.socialMedia?.facebook || '',
              twitter: contact.socialMedia?.twitter || '',
              instagram: contact.socialMedia?.instagram || '',
              linkedin: contact.socialMedia?.linkedin || '',
            },
            googleMapsEmbedUrl: contact.googleMapsEmbedUrl || '',
          };
          console.log('Mapped contact details:', mappedContactDetails); // Debug: Log mapped data
          setContactDetails(mappedContactDetails);
        } else {
          setError('Failed to fetch mentor contact details');
        }
      } catch (err) {
        console.error('Error fetching mentor contact details:', err);
        setError(err.message || 'Failed to load mentor contact details');
      } finally {
        setLoading(false);
      }
    };

    fetchContactDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl shadow-xl border border-orange-100 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">Loading contact details...</p>
      </div>
    );
  }

  if (error || !contactDetails) {
    return (
      <div className="p-8 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl shadow-xl border border-orange-100 text-center">
        <p className="text-red-600">{error || 'Contact details not found'}</p>
      </div>
    );
  }

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
                <a
                  href={contactDetails.phone !== 'Not specified' ? `tel:${contactDetails.phone}` : '#'}
                  className={`text-orange-600 hover:text-orange-800 transition-colors duration-200 ${contactDetails.phone === 'Not specified' ? 'pointer-events-none opacity-50' : ''}`}
                >
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
                <a
                  href={contactDetails.email !== 'Not specified' ? `mailto:${contactDetails.email}` : '#'}
                  className={`text-orange-600 hover:text-orange-800 transition-colors duration-200 ${contactDetails.email === 'Not specified' ? 'pointer-events-none opacity-50' : ''}`}
                >
                  {contactDetails.email}
                </a>
              </div>
            </div>

            {contactDetails.website && (
              <div className="flex items-start">
                <div className="bg-orange-100 p-2 rounded-full mr-4">
                  <FaGlobe className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Website</h3>
                  <a
                    href={contactDetails.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:text-orange-800 transition-colors duration-200"
                  >
                    {contactDetails.website}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Social Media */}
        {(contactDetails.socialMedia.facebook || contactDetails.socialMedia.twitter || contactDetails.socialMedia.instagram || contactDetails.socialMedia.linkedin) && (
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-amber-500">
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
              <span className="bg-orange-100 p-2 rounded-full mr-3">
                <FaGlobe className="h-5 w-5 text-amber-600" />
              </span>
              Connect on Social Media
            </h3>
            <div className="flex justify-center space-x-6">
              {contactDetails.socialMedia.facebook && (
                <a
                  href={contactDetails.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-100 p-3 rounded-full text-blue-600 hover:bg-blue-200 transition-colors duration-300"
                >
                  <FaFacebook className="w-6 h-6" />
                </a>
              )}
              {contactDetails.socialMedia.twitter && (
                <a
                  href={contactDetails.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-sky-100 p-3 rounded-full text-sky-600 hover:bg-sky-200 transition-colors duration-300"
                >
                  <FaTwitter className="w-6 h-6" />
                </a>
              )}
              {contactDetails.socialMedia.instagram && (
                <a
                  href={contactDetails.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-pink-100 p-3 rounded-full text-pink-600 hover:bg-pink-200 transition-colors duration-300"
                >
                  <FaInstagram className="w-6 h-6" />
                </a>
              )}
              {contactDetails.socialMedia.linkedin && (
                <a
                  href={contactDetails.socialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-100 p-3 rounded-full text-blue-600 hover:bg-blue-200 transition-colors duration-300"
                >
                  <FaLinkedin className="w-6 h-6" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Google Map */}
        {contactDetails.googleMapsEmbedUrl && (
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
                title={`${contactDetails.name} Teaching Location`}
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
        )}
      </div>
    </div>
  );
};

export default Contact;