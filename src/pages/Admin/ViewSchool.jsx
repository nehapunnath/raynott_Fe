import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { schoolApi } from '../../services/schoolApi';

const ViewSchool = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [school, setSchool] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSchool = async () => {
            try {
                setIsLoading(true);
                const response = await schoolApi.getSchool(id);
                
                console.log('API Response:', response);
                
                if (response.success && response.data) {
                    // Firebase returns data as an object with school ID as key
                    const schoolData = response.data[id] || response.data;
                    
                    console.log('Processed school data:', schoolData);
                    
                    setSchool({
                        id: id,
                        name: schoolData.name || '',
                        typeOfSchool: schoolData.typeOfSchool || '',
                        affiliation: schoolData.affiliation || '',
                        grade: schoolData.grade || '',
                        ageForAdmission: schoolData.ageForAdmission || '',
                        language: schoolData.language || '',
                        establishmentYear: schoolData.establishmentYear || '',
                        facilities: Array.isArray(schoolData.facilities) ? schoolData.facilities : [],
                        totalAnnualFee: schoolData.totalAnnualFee || '',
                        admissionFee: schoolData.admissionFee || '',
                        tuitionFee: schoolData.tuitionFee || '',
                        transportFee: schoolData.transportFee || '',
                        booksUniformsFee: schoolData.booksUniformsFee || '',
                        address: schoolData.address || '',
                        city: schoolData.city || '',
                        phone: schoolData.phone || '',
                        email: schoolData.email || '',
                        website: schoolData.website || '',
                        socialMedia: schoolData.socialMedia || { facebook: '', twitter: '', instagram: '' },
                        googleMapsEmbedUrl: schoolData.googleMapsEmbedUrl || '',
                        campusSize: schoolData.campusSize || '',
                        classrooms: schoolData.classrooms || '',
                        laboratories: schoolData.laboratories || '',
                        library: schoolData.library || '',
                        playground: schoolData.playground || '',
                        auditorium: schoolData.auditorium || '',
                        smartBoards: schoolData.smartBoards || '',
                        cctv: schoolData.cctv || '',
                        medicalRoom: schoolData.medicalRoom || '',
                        wifi: schoolData.wifi || '',
                        admissionLink: schoolData.admissionLink || '',
                        admissionProcess: schoolData.admissionProcess || '',
                        schoolImage: schoolData.schoolImage || '',
                        photos: Array.isArray(schoolData.photos) ? schoolData.photos : []
                    });
                } else {
                    setError(response.message || 'Failed to fetch school details');
                }
            } catch (error) {
                console.error('Error fetching school:', error);
                setError(error.response?.status === 404 ? 'School not found' : error.message || 'Failed to fetch school details');
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchSchool();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    if (error || !school) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-2xl mx-auto mt-8">
                <p>Error: {error || 'No school data available'}</p>
                <button
                    onClick={() => navigate('/admin/schools')}
                    className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Back to Schools
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
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">School Details</h1>
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
                                <label className="text-gray-700 font-semibold">School Name</label>
                                <p className="text-gray-900">{school.name || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-gray-700 font-semibold">Type of School</label>
                                <p className="text-gray-900">{school.typeOfSchool || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-gray-700 font-semibold">Affiliation</label>
                                <p className="text-gray-900">{school.affiliation || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-gray-700 font-semibold">Grade</label>
                                <p className="text-gray-900">{school.grade || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-gray-700 font-semibold">Age for Admission</label>
                                <p className="text-gray-900">{school.ageForAdmission || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-gray-700 font-semibold">Language</label>
                                <p className="text-gray-900">{school.language || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-gray-700 font-semibold">Establishment Year</label>
                                <p className="text-gray-900">{school.establishmentYear || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-gray-700 font-semibold">Facilities</label>
                                <p className="text-gray-900">
                                    {school.facilities.length > 0 ? school.facilities.join(', ') : 'None'}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Fees Structure */}
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
                                <label className="text-gray-700 font-semibold">Total Annual Fee</label>
                                <p className="text-gray-900">{school.totalAnnualFee || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-gray-700 font-semibold">Admission Fee</label>
                                <p className="text-gray-900">{school.admissionFee || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-gray-700 font-semibold">Tuition Fee</label>
                                <p className="text-gray-900">{school.tuitionFee || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-gray-700 font-semibold">Transport Fee</label>
                                <p className="text-gray-900">{school.transportFee || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-gray-700 font-semibold">Books & Uniforms Fee</label>
                                <p className="text-gray-900">{school.booksUniformsFee || 'N/A'}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mb-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                            <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                            Contact Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-gray-700 font-semibold">Address</label>
                                <p className="text-gray-900">{school.address || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-gray-700 font-semibold">City</label>
                                <p className="text-gray-900">{school.city || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-gray-700 font-semibold">Phone</label>
                                <p className="text-gray-900">{school.phone || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-gray-700 font-semibold">Email</label>
                                <p className="text-gray-900">{school.email || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-gray-700 font-semibold">Website</label>
                                <p className="text-gray-900">
                                    {school.website ? (
                                        <a href={school.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                            {school.website}
                                        </a>
                                    ) : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <label className="text-gray-700 font-semibold">Social Media</label>
                                <p className="text-gray-900">
                                    {school.socialMedia && (school.socialMedia.facebook || school.socialMedia.twitter || school.socialMedia.instagram) ? (
                                        <div className="space-y-1">
                                            {school.socialMedia.facebook && (
                                                <a href={school.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block">
                                                    Facebook
                                                </a>
                                            )}
                                            {school.socialMedia.twitter && (
                                                <a href={school.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block">
                                                    Twitter
                                                </a>
                                            )}
                                            {school.socialMedia.instagram && (
                                                <a href={school.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block">
                                                    Instagram
                                                </a>
                                            )}
                                        </div>
                                    ) : 'N/A'}
                                </p>
                            </div>
                            <div className="col-span-2">
                                <label className="text-gray-700 font-semibold">Google Maps</label>
                                {school.googleMapsEmbedUrl ? (
                                    <iframe
                                        src={school.googleMapsEmbedUrl}
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

                    {/* School Image */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mb-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                            <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                            School Image
                        </h2>
                        {school.schoolImage ? (
                            <motion.div
                                className="relative aspect-square overflow-hidden rounded-xl mt-4 max-w-sm"
                                whileHover={{ scale: 1.02 }}
                            >
                                <img
                                    src={school.schoolImage}
                                    alt="School Image"
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                        ) : (
                            <p className="text-gray-900">No image available</p>
                        )}
                    </motion.div>

                    {/* School Gallery */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mb-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                            <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                            School Gallery
                        </h2>
                        {school.photos.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                {school.photos.map((photo, index) => (
                                    <motion.div
                                        key={index}
                                        className="relative aspect-square overflow-hidden rounded-xl"
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <img
                                            src={photo}
                                            alt={`Gallery Photo ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-900">No gallery images available</p>
                        )}
                    </motion.div>

                    {/* Infrastructure */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="mb-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                            <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                            School Infrastructure
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-gray-700 font-semibold">Campus Size</label>
                                <p className="text-gray-900">{school.campusSize || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-gray-700 font-semibold">Classrooms</label>
                                <p className="text-gray-900">{school.classrooms || 'N/A'}</p>
                            </div>
                            {['laboratories', 'library', 'playground', 'auditorium', 'smartBoards', 'cctv', 'medicalRoom', 'wifi'].map(field => (
                                <div key={field}>
                                    <label className="text-gray-700 font-semibold capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                                    <p className="text-gray-900">{school[field] || 'N/A'}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Admission Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="mb-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                            <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                            Admission Details
                        </h2>
                        <div>
                            <label className="text-gray-700 font-semibold">Admission Link</label>
                            <p className="text-gray-900">
                                {school.admissionLink ? (
                                    <a href={school.admissionLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                        {school.admissionLink}
                                    </a>
                                ) : 'N/A'}
                            </p>
                        </div>
                        <div className="mt-4">
                            <label className="text-gray-700 font-semibold">Admission Process</label>
                            <p className="text-gray-900 whitespace-pre-wrap">{school.admissionProcess || 'N/A'}</p>
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
                            onClick={() => navigate(`/admin/edit-school/${id}`)}
                            whileHover={{ scale: 1.03, boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)' }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-bold transition-all shadow-lg hover:from-green-600 hover:to-emerald-700"
                        >
                            Edit School
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ViewSchool;