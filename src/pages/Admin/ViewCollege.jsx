import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { collegeApi } from '../../services/collegeApi';

// Error Boundary Component
class ErrorBoundary extends React.Component {
    state = { hasError: false, error: null };

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-2xl mx-auto mt-8">
                    <p>Error: Something went wrong while rendering the component.</p>
                    <p>{this.state.error?.message}</p>
                </div>
            );
        }
        return this.props.children;
    }
}

const ViewCollege = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [college, setCollege] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCollege = async () => {
            try {
                setIsLoading(true);
                const response = await collegeApi.getCollege(id);

                console.log('API Response:', response);

                if (response.success && response.data) {
                    // Firebase returns data as an object with college ID as key
                    const collegeData = response.data[id] || response.data;

                    console.log('Processed college data:', collegeData);
                    console.log('Raw placementStatistics:', collegeData.placementStatistics);

                    // Normalize placementStatistics to a string
                    let normalizedPlacementStatistics = '';
                    if (typeof collegeData.placementStatistics === 'object' && collegeData.placementStatistics !== null) {
                        const percentage = collegeData.placementStatistics.percentage;
                        normalizedPlacementStatistics = percentage != null ? `${percentage}%` : '';
                    } else if (typeof collegeData.placementStatistics === 'string') {
                        normalizedPlacementStatistics = collegeData.placementStatistics;
                    }

                    setCollege({
                        id: id,
                        name: collegeData.name || '',
                        typeOfCollege: collegeData.typeOfCollege || '',
                        affiliation: collegeData.affiliation || '',
                        coursesOffered: Array.isArray(collegeData.coursesOffered) ? collegeData.coursesOffered : [],
                        duration: collegeData.duration || '',
                        language: collegeData.language || '',
                        establishmentYear: collegeData.establishmentYear || '',
                        accreditation: collegeData.accreditation || '',
                        studentTeacherRatio: collegeData.studentTeacherRatio || '',
                        transportation: collegeData.transportation || '',
                        placementStatistics: normalizedPlacementStatistics,
                        facilities: Array.isArray(collegeData.facilities) ? collegeData.facilities : [],
                        totalAnnualFee: collegeData.totalAnnualFee || '',
                        admissionFee: collegeData.admissionFee || '',
                        tuitionFee: collegeData.tuitionFee || '',
                        transportFee: collegeData.transportFee || '',
                        booksUniformsFee: collegeData.booksUniformsFee || '',
                        address: collegeData.address || '',
                        city: collegeData.city || '',
                        state: collegeData.state || '',
                        phone: collegeData.phone || '',
                        email: collegeData.email || '',
                        website: collegeData.website || '',
                        socialMedia: collegeData.socialMedia || { facebook: '', twitter: '', instagram: '' },
                        googleMapsEmbedUrl: collegeData.googleMapsEmbedUrl || '',
                        campusSize: collegeData.campusSize || '',
                        classrooms: collegeData.classrooms || '',
                        laboratories: collegeData.laboratories || '',
                        library: collegeData.library || '',
                        playground: collegeData.playground || '',
                        auditorium: collegeData.auditorium || '',
                        smartBoards: collegeData.smartBoards || '',
                        cctv: collegeData.cctv || '',
                        medicalRoom: collegeData.medicalRoom || '',
                        wifi: collegeData.wifi || '',
                        hostel: collegeData.hostel || '',
                        sports: collegeData.sports || '',
                        admissionLink: collegeData.admissionLink || '',
                        admissionProcess: collegeData.admissionProcess || '',
                        collegeImage: collegeData.collegeImage || '',
                        photos: Array.isArray(collegeData.photos) ? collegeData.photos : [],
                        eligibilityCriteria: collegeData.eligibilityCriteria || '',
                        entranceExams: Array.isArray(collegeData.entranceExams) ? collegeData.entranceExams : [],
                        topRecruiters: Array.isArray(collegeData.topRecruiters) ? collegeData.topRecruiters : []
                    });

                    console.log('Normalized placementStatistics:', normalizedPlacementStatistics);
                } else {
                    setError(response.message || 'Failed to fetch college details');
                }
            } catch (error) {
                console.error('Error fetching college:', error);
                setError(error.response?.status === 404 ? 'College not found' : error.message || 'Failed to fetch college details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCollege();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    if (error || !college) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-2xl mx-auto mt-8">
                <p>Error: {error || 'No college data available'}</p>
                <button
                    onClick={() => navigate('/admin/colleges')}
                    className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Back to Colleges
                </button>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <div className="min-h-screen w-full bg-gradient-to-b from-orange-50 to-white">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-4xl mx-auto px-6 py-8"
                >
                    <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">College Details</h1>
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
                                    <label className="text-gray-700 font-semibold">College Name</label>
                                    <p className="text-gray-900">{college.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Type of College</label>
                                    <p className="text-gray-900">{college.typeOfCollege || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Affiliation</label>
                                    <p className="text-gray-900">{college.affiliation || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Courses Offered</label>
                                    <p className="text-gray-900">
                                        {college.coursesOffered.length > 0 ? college.coursesOffered.join(', ') : 'None'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Duration</label>
                                    <p className="text-gray-900">{college.duration || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Language</label>
                                    <p className="text-gray-900">{college.language || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Establishment Year</label>
                                    <p className="text-gray-900">{college.establishmentYear || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Accreditation</label>
                                    <p className="text-gray-900">{college.accreditation || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Student Teacher Ratio</label>
                                    <p className="text-gray-900">{college.studentTeacherRatio || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Transportation</label>
                                    <p className="text-gray-900">{college.transportation || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Placement Statistics</label>
                                    <p className="text-gray-900">{college.placementStatistics || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Facilities</label>
                                    <p className="text-gray-900">
                                        {college.facilities.length > 0 ? college.facilities.join(', ') : 'None'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Eligibility Criteria</label>
                                    <p className="text-gray-900">{college.eligibilityCriteria || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Entrance Exams</label>
                                    <p className="text-gray-900">
                                        {college.entranceExams.length > 0 ? college.entranceExams.join(', ') : 'None'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Top Recruiters</label>
                                    <p className="text-gray-900">
                                        {college.topRecruiters.length > 0 ? college.topRecruiters.join(', ') : 'None'}
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
                                    <p className="text-gray-900">{college.totalAnnualFee || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Admission Fee</label>
                                    <p className="text-gray-900">{college.admissionFee || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Tuition Fee</label>
                                    <p className="text-gray-900">{college.tuitionFee || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Transport Fee</label>
                                    <p className="text-gray-900">{college.transportFee || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Books & Uniforms Fee</label>
                                    <p className="text-gray-900">{college.booksUniformsFee || 'N/A'}</p>
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
                                    <p className="text-gray-900">{college.address || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">City</label>
                                    <p className="text-gray-900">{college.city || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">State</label>
                                    <p className="text-gray-900">{college.state || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Phone</label>
                                    <p className="text-gray-900">{college.phone || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Email</label>
                                    <p className="text-gray-900">{college.email || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Website</label>
                                    <p className="text-gray-900">
                                        {college.website ? (
                                            <a href={college.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                {college.website}
                                            </a>
                                        ) : 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Social Media</label>
                                    <p className="text-gray-900">
                                        {college.socialMedia && (college.socialMedia.facebook || college.socialMedia.twitter || college.socialMedia.instagram) ? (
                                            <div className="space-y-1">
                                                {college.socialMedia.facebook && (
                                                    <a href={college.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block">
                                                        Facebook
                                                    </a>
                                                )}
                                                {college.socialMedia.twitter && (
                                                    <a href={college.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block">
                                                        Twitter
                                                    </a>
                                                )}
                                                {college.socialMedia.instagram && (
                                                    <a href={college.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block">
                                                        Instagram
                                                    </a>
                                                )}
                                            </div>
                                        ) : 'N/A'}
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-gray-700 font-semibold">Google Maps</label>
                                    {college.googleMapsEmbedUrl ? (
                                        <iframe
                                            src={college.googleMapsEmbedUrl}
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

                        {/* College Image */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                                College Image
                            </h2>
                            {college.collegeImage ? (
                                <motion.div
                                    className="relative aspect-square overflow-hidden rounded-xl mt-4 max-w-sm"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <img
                                        src={college.collegeImage}
                                        alt="College Image"
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                            ) : (
                                <p className="text-gray-900">No image available</p>
                            )}
                        </motion.div>

                        {/* College Gallery */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                                College Gallery
                            </h2>
                            {college.photos.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                    {college.photos.map((photo, index) => (
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
                                College Infrastructure
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-gray-700 font-semibold">Campus Size</label>
                                    <p className="text-gray-900">{college.campusSize || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Classrooms</label>
                                    <p className="text-gray-900">{college.classrooms || 'N/A'}</p>
                                </div>
                                {['laboratories', 'library', 'playground', 'auditorium', 'smartBoards', 'cctv', 'medicalRoom', 'wifi', 'hostel', 'sports'].map(field => (
                                    <div key={field}>
                                        <label className="text-gray-700 font-semibold capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                                        <p className="text-gray-900">{college[field] || 'N/A'}</p>
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
                                    {college.admissionLink ? (
                                        <a href={college.admissionLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                            {college.admissionLink}
                                        </a>
                                    ) : 'N/A'}
                                </p>
                            </div>
                            <div className="mt-4">
                                <label className="text-gray-700 font-semibold">Admission Process</label>
                                <p className="text-gray-900 whitespace-pre-wrap">{college.admissionProcess || 'N/A'}</p>
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
                                Back to Colleges
                            </motion.button>
                            <motion.button
                                onClick={() => navigate(`/admin/edit-college/${id}`)}
                                whileHover={{ scale: 1.03, boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)' }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-bold transition-all shadow-lg hover:from-green-600 hover:to-emerald-700"
                            >
                                Edit College
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </ErrorBoundary>
    );
};

export default ViewCollege;