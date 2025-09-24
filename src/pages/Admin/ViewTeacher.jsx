import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { teacherApi } from '../../services/TeacherApi';

const ViewTeacher = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        setIsLoading(true);
        setError('');
        const response = await teacherApi.getTeacher(id);
        console.log('API Response:', response);

        if (response.success && response.data) {
          const teacherData = response.data;
          setTeacher({
            id: id,
            name: teacherData.name || '',
            institutionType: teacherData.institutionType || '',
            subjects: teacherData.subjects || '',
            qualification: teacherData.qualification || '',
            experience: teacherData.experience || '',
            teachingMode: teacherData.teachingMode || '',
            languages: teacherData.languages || '',
            specialization: teacherData.specialization || '',
            certifications: teacherData.certifications || '',
            about: teacherData.about || '',
            availability: teacherData.availability || '',
            hourlyRate: teacherData.hourlyRate || '',
            monthlyPackage: teacherData.monthlyPackage || '',
            examPreparation: teacherData.examPreparation || '',
            demoFee: teacherData.demoFee || '',
            teachingApproach: teacherData.teachingApproach || '',
            studyMaterials: teacherData.studyMaterials || '',
            sessionDuration: teacherData.sessionDuration || '',
            studentLevel: teacherData.studentLevel || '',
            classSize: teacherData.classSize || '',
            onlinePlatform: teacherData.onlinePlatform || '',
            progressReports: teacherData.progressReports || '',
            performanceTracking: teacherData.performanceTracking || '',
            address: teacherData.address || '',
            city: teacherData.city || '',
            phone: teacherData.phone || '',
            email: teacherData.email || '',
            website: teacherData.website || '',
            socialMedia: teacherData.socialMedia || { facebook: '', twitter: '', instagram: '', linkedin: '' },
            googleMapsEmbedUrl: teacherData.googleMapsEmbedUrl || '',
            teachingProcess: teacherData.teachingProcess || '',
            profileImage: teacherData.profileImage || '',
            facilities: Array.isArray(teacherData.facilities) ? teacherData.facilities : [],
          });
        } else {
          setError(response.message || 'Failed to fetch teacher details');
        }
      } catch (error) {
        console.error('Error fetching teacher:', error);
        setError(error.response?.status === 404 ? 'Teacher not found' : error.message || 'Failed to fetch teacher details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeacher();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-2xl mx-auto mt-8">
        <p>Error: {error || 'No teacher data available'}</p>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Back 
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-orange-50 to-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl mx-auto px-6 py-8"
      >
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Teacher Details</h1>
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-orange-100">
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-gray-700 font-semibold">Name</label>
                <p className="text-gray-900">{teacher.name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-gray-700 font-semibold">Institution Type</label>
                <p className="text-gray-900">{teacher.institutionType || 'N/A'}</p>
              </div>
              <div>
                <label className="text-gray-700 font-semibold">Subjects</label>
                <p className="text-gray-900">{teacher.subjects || 'N/A'}</p>
              </div>
              <div>
                <label className="text-gray-700 font-semibold">Qualification</label>
                <p className="text-gray-900">{teacher.qualification || 'N/A'}</p>
              </div>
              <div>
                <label className="text-gray-700 font-semibold">Experience</label>
                <p className="text-gray-900">{teacher.experience || 'N/A'}</p>
              </div>
              <div>
                <label className="text-gray-700 font-semibold">Teaching Mode</label>
                <p className="text-gray-900">{teacher.teachingMode || 'N/A'}</p>
              </div>
              <div>
                <label className="text-gray-700 font-semibold">Languages</label>
                <p className="text-gray-900">{teacher.languages || 'N/A'}</p>
              </div>
              <div>
                <label className="text-gray-700 font-semibold">Specialization</label>
                <p className="text-gray-900">{teacher.specialization || 'N/A'}</p>
              </div>
              <div>
                <label className="text-gray-700 font-semibold">Certifications</label>
                <p className="text-gray-900">{teacher.certifications || 'N/A'}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-gray-700 font-semibold">About</label>
                <p className="text-gray-900 whitespace-pre-wrap">{teacher.about || 'N/A'}</p>
              </div>
              <div>
                <label className="text-gray-700 font-semibold">Availability</label>
                <p className="text-gray-900">{teacher.availability || 'N/A'}</p>
              </div>
              <div>
                <label className="text-gray-700 font-semibold">Facilities</label>
                <p className="text-gray-900">
                  {teacher.facilities.length > 0 ? teacher.facilities.join(', ') : 'None'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Fee Structure */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
              Fee Structure
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-gray-700 font-semibold">Hourly Rate</label>
                <p className="text-gray-900">{teacher.hourlyRate || 'N/A'}</p>
              </div>
              <div>
                <label className="text-gray-700 font-semibold">Monthly Package</label>
                <p className="text-gray-900">{teacher.monthlyPackage || 'N/A'}</p>
              </div>
              <div>
                <label className="text-gray-700 font-semibold">Exam Preparation Fee</label>
                <p className="text-gray-900">{teacher.examPreparation || 'N/A'}</p>
              </div>
              <div>
                <label className="text-gray-700 font-semibold">Demo Class Fee</label>
                <p className="text-gray-900">{teacher.demoFee || 'N/A'}</p>
              </div>
            </div>
          </motion.div>

          {/* Teaching Methodology */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
              Teaching Methodology
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-gray-700 font-semibold">Teaching Approach</label>
                <p className="text-gray-900">{teacher.teachingApproach || 'N/A'}</p>
              </div>
              <div>
                <label className="text-gray-700 font-semibold">Study Materials</label>
                <p className="text-gray-900">{teacher.studyMaterials || 'N/A'}</p>
              </div>
              <div>
                <label className="text-gray-700 font-semibold">Session Duration</label>
                <p className="text-gray-900">{teacher.sessionDuration || 'N/A'}</p>
              </div>
              <div>
                <label className="text-gray-700 font-semibold">Student Level</label>
                <p className="text-gray-900">{teacher.studentLevel || 'N/A'}</p>
              </div>
              <div>
                <label className="text-gray-700 font-semibold">Class Size</label>
                <p className="text-gray-900">{teacher.classSize || 'N/A'}</p>
              </div>
              <div>
                <label className="text-gray-700 font-semibold">Online Platform</label>
                <p className="text-gray-900">{teacher.onlinePlatform || 'N/A'}</p>
              </div>
              <div>
                <label className="text-gray-700 font-semibold">Progress Reports</label>
                <p className="text-gray-900">{teacher.progressReports || 'N/A'}</p>
              </div>
              <div>
                <label className="text-gray-700 font-semibold">Performance Tracking</label>
                <p className="text-gray-900">{teacher.performanceTracking || 'N/A'}</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
              Contact Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-gray-700 font-semibold">Address</label>
                <p className="text-gray-900">{teacher.address || 'N/A'}</p>
              </div>
              <div>
                <label className="text-gray-700 font-semibold">City</label>
                <p className="text-gray-900">{teacher.city || 'N/A'}</p>
              </div>
              <div>
                <label className="text-gray-700 font-semibold">Phone</label>
                <p className="text-gray-900">{teacher.phone || 'N/A'}</p>
              </div>
              <div>
                <label className="text-gray-700 font-semibold">Email</label>
                <p className="text-gray-900">{teacher.email || 'N/A'}</p>
              </div>
              <div>
                <label className="text-gray-700 font-semibold">Website</label>
                <p className="text-gray-900">
                  {teacher.website ? (
                    <a href={teacher.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {teacher.website}
                    </a>
                  ) : 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-gray-700 font-semibold">Social Media</label>
                <p className="text-gray-900">
                  {teacher.socialMedia && (teacher.socialMedia.facebook || teacher.socialMedia.twitter || teacher.socialMedia.instagram || teacher.socialMedia.linkedin) ? (
                    <div className="space-y-1">
                      {teacher.socialMedia.facebook && (
                        <a href={teacher.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block">
                          Facebook
                        </a>
                      )}
                      {teacher.socialMedia.twitter && (
                        <a href={teacher.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block">
                          Twitter
                        </a>
                      )}
                      {teacher.socialMedia.instagram && (
                        <a href={teacher.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block">
                          Instagram
                        </a>
                      )}
                      {teacher.socialMedia.linkedin && (
                        <a href={teacher.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block">
                          LinkedIn
                        </a>
                      )}
                    </div>
                  ) : 'N/A'}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="text-gray-700 font-semibold">Google Maps</label>
                {teacher.googleMapsEmbedUrl ? (
                  <iframe
                    src={teacher.googleMapsEmbedUrl}
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    className="rounded-lg mt-2"
                  ></iframe>
                ) : (
                  <p className="text-gray-900">No map available</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
              Profile Image
            </h2>
            {teacher.profileImage ? (
              <motion.div
                className="relative aspect-square overflow-hidden rounded-xl mt-4 max-w-sm"
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={teacher.profileImage}
                  alt="Teacher Profile Image"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ) : (
              <p className="text-gray-900">No image available</p>
            )}
          </motion.div>

          {/* Teaching Process */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
              Teaching Process
            </h2>
            <div>
              <label className="text-gray-700 font-semibold">Teaching Process</label>
              <p className="text-gray-900 whitespace-pre-wrap">{teacher.teachingProcess || 'N/A'}</p>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <motion.button
              onClick={() => navigate('/admin/dashboard')}
              whileHover={{ scale: 1.03, boxShadow: '0 4px 15px rgba(249, 115, 22, 0.3)' }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white py-3 rounded-lg font-bold transition-all shadow-lg hover:from-orange-600 hover:to-amber-700"
            >
              Back 
            </motion.button>
            <motion.button
              onClick={() => navigate(`/admin/edit-teacher/${id}`)}
              whileHover={{ scale: 1.03, boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)' }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-bold transition-all shadow-lg hover:from-green-600 hover:to-emerald-700"
            >
              Edit Teacher
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ViewTeacher;