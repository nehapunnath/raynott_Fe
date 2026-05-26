// src/components/dashboards/SchoolDetailsView.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSchool, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaCalendarAlt, FaUsers, FaChalkboardTeacher, FaRupeeSign, FaWifi, FaFlask, FaBook, FaRunning, FaTheaterMasks, FaFirstAid, FaVideo } from 'react-icons/fa';

const SchoolDetailsView = ({ schoolData }) => {
  const [showFullDetails, setShowFullDetails] = useState(false);

  if (!schoolData) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">No school data available.</p>
      </div>
    );
  }

  const facilitiesList = Array.isArray(schoolData.facilities) 
    ? schoolData.facilities 
    : JSON.parse(schoolData.facilities || '[]');

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-6">School Details</h1>

        {/* Hero Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          {schoolData.schoolImage && (
            <div className="h-64 overflow-hidden">
              <img 
                src={schoolData.schoolImage} 
                alt={schoolData.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{schoolData.name}</h2>
            <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
              <span className="flex items-center">
                <FaMapMarkerAlt className="mr-2 text-orange-600" />
                {schoolData.city}, {schoolData.address}
              </span>
              <span className="flex items-center">
                <FaCalendarAlt className="mr-2 text-orange-600" />
                Est. {schoolData.establishmentYear}
              </span>
              <span className="flex items-center">
                <FaUsers className="mr-2 text-orange-600" />
                Grade: {schoolData.grade}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                {schoolData.typeOfSchool}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {schoolData.affiliation}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                {schoolData.language}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <FaPhone className="text-orange-600 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{schoolData.phone || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaEnvelope className="text-orange-600 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{schoolData.email || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaGlobe className="text-orange-600 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Website</p>
                <a href={schoolData.website} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">
                  {schoolData.website || 'N/A'}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Fee Structure */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <FaRupeeSign className="mr-2 text-orange-600" />
            Fee Structure
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Total Annual Fee</p>
              <p className="text-xl font-bold text-gray-800">{schoolData.totalAnnualFee || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Admission Fee</p>
              <p className="text-xl font-bold text-gray-800">{schoolData.admissionFee || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Tuition Fee</p>
              <p className="text-xl font-bold text-gray-800">{schoolData.tuitionFee || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Transport Fee</p>
              <p className="text-xl font-bold text-gray-800">{schoolData.transportFee || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Books & Uniforms</p>
              <p className="text-xl font-bold text-gray-800">{schoolData.booksUniformsFee || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Infrastructure */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Infrastructure</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <FaSchool className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="font-medium">{schoolData.classrooms || 'N/A'}</p>
              <p className="text-sm text-gray-500">Classrooms</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <FaFlask className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="font-medium">{schoolData.laboratories === 'Yes' ? 'Available' : 'Not Available'}</p>
              <p className="text-sm text-gray-500">Laboratories</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <FaBook className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="font-medium">{schoolData.library === 'Yes' ? 'Available' : 'Not Available'}</p>
              <p className="text-sm text-gray-500">Library</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <FaRunning className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="font-medium">{schoolData.playground === 'Yes' ? 'Available' : 'Not Available'}</p>
              <p className="text-sm text-gray-500">Playground</p>
            </div>
          </div>
        </div>

        {/* Facilities */}
        {facilitiesList.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Facilities</h3>
            <div className="flex flex-wrap gap-2">
              {facilitiesList.map((facility, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {facility}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Gallery */}
        {schoolData.photos && schoolData.photos.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Gallery</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {schoolData.photos.map((photo, index) => (
                <div key={index} className="aspect-square overflow-hidden rounded-lg">
                  <img src={photo} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SchoolDetailsView;