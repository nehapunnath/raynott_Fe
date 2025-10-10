import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { TuitionCoachingApi } from '../../services/TuitionCoachingApi';
import "tailwindcss";


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

const ViewCoaching = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [coaching, setCoaching] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCoaching = async () => {
            try {
                setIsLoading(true);
                const response = await TuitionCoachingApi.getTuitionCoaching(id);

                console.log('API Response:', response);

                if (response.success && response.data) {
                    // Firebase returns data as an object with coaching ID as key
                    const coachingData = response.data[id] || response.data;

                    console.log('Processed coaching data:', coachingData);

                    setCoaching({
                        id: id,
                        name: coachingData.name || '',
                        typeOfCoaching: coachingData.typeOfCoaching || '',
                        classes: coachingData.classes || '',
                        subjects: coachingData.subjects || '',
                        batchSize: coachingData.batchSize || '',
                        classDuration: coachingData.classDuration || '',
                        language: coachingData.language || '',
                        establishmentYear: coachingData.establishmentYear || '',
                        faculty: coachingData.faculty || '',
                        studyMaterial: coachingData.studyMaterial || '',
                        tests: coachingData.tests || '',
                        doubtSessions: coachingData.doubtSessions || '',
                        infrastructure: coachingData.infrastructure || '',
                        demoClass: coachingData.demoClass || '',
                        flexibleTimings: coachingData.flexibleTimings || '',
                        facilities: Array.isArray(coachingData.facilities) ? coachingData.facilities : [],
                        totalAnnualFee: coachingData.totalAnnualFee || '',
                        admissionFee: coachingData.admissionFee || '',
                        tuitionFee: coachingData.tuitionFee || '',
                        transportFee: coachingData.transportFee || '',
                        booksUniformsFee: coachingData.booksUniformsFee || '',
                        address: coachingData.address || '',
                        city: coachingData.city || '',
                        phone: coachingData.phone || '',
                        email: coachingData.email || '',
                        website: coachingData.website || '',
                        socialMedia: coachingData.socialMedia || { facebook: '', twitter: '', instagram: '' },
                        googleMapsEmbedUrl: coachingData.googleMapsEmbedUrl || '',
                        classrooms: coachingData.classrooms || '',
                        laboratories: coachingData.laboratories || '',
                        library: coachingData.library || '',
                        smartBoards: coachingData.smartBoards || '',
                        cctv: coachingData.cctv || '',
                        medicalRoom: coachingData.medicalRoom || '',
                        wifi: coachingData.wifi || '',
                        admissionLink: coachingData.admissionLink || '',
                        admissionProcess: coachingData.admissionProcess || '',
                        centerImage: coachingData.centerImage || '',
                        photos: Array.isArray(coachingData.photos) ? coachingData.photos : []
                    });
                } else {
                    setError(response.message || 'Failed to fetch tuition/coaching center details');
                }
            } catch (error) {
                console.error('Error fetching tuition/coaching center:', error);
                setError(error.response?.status === 404 ? 'Tuition/Coaching Center not found' : error.message || 'Failed to fetch tuition/coaching center details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCoaching();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    if (error || !coaching) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-2xl mx-auto mt-8">
                <p>Error: {error || 'No tuition/coaching center data available'}</p>
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
        <ErrorBoundary>
            <div className="min-h-screen w-full bg-gradient-to-b from-orange-50 to-white">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-4xl mx-auto px-6 py-8"
                >
                    <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Tuition/Coaching Center Details</h1>
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
                                    <label className="text-gray-700 font-semibold">Center Name</label>
                                    <p className="text-gray-900">{coaching.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Type of Coaching</label>
                                    <p className="text-gray-900">{coaching.typeOfCoaching || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Classes</label>
                                    <p className="text-gray-900">{coaching.classes || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Subjects</label>
                                    <p className="text-gray-900">{coaching.subjects || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Batch Size</label>
                                    <p className="text-gray-900">{coaching.batchSize || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Class Duration</label>
                                    <p className="text-gray-900">{coaching.classDuration || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Language</label>
                                    <p className="text-gray-900">{coaching.language || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Establishment Year</label>
                                    <p className="text-gray-900">{coaching.establishmentYear || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Faculty</label>
                                    <p className="text-gray-900">{coaching.faculty || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Study Material</label>
                                    <p className="text-gray-900">{coaching.studyMaterial || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Tests</label>
                                    <p className="text-gray-900">{coaching.tests || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Doubt Sessions</label>
                                    <p className="text-gray-900">{coaching.doubtSessions || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Infrastructure</label>
                                    <p className="text-gray-900">{coaching.infrastructure || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Demo Class</label>
                                    <p className="text-gray-900">{coaching.demoClass || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Flexible Timings</label>
                                    <p className="text-gray-900">{coaching.flexibleTimings || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Facilities</label>
                                    <p className="text-gray-900">
                                        {coaching.facilities.length > 0 ? coaching.facilities.join(', ') : 'None'}
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
                                    <p className="text-gray-900">{coaching.totalAnnualFee || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Admission Fee</label>
                                    <p className="text-gray-900">{coaching.admissionFee || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Tuition Fee</label>
                                    <p className="text-gray-900">{coaching.tuitionFee || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Transport Fee</label>
                                    <p className="text-gray-900">{coaching.transportFee || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Books & Materials Fee</label>
                                    <p className="text-gray-900">{coaching.booksUniformsFee || 'N/A'}</p>
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
                                    <p className="text-gray-900">{coaching.address || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">City</label>
                                    <p className="text-gray-900">{coaching.city || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Phone</label>
                                    <p className="text-gray-900">{coaching.phone || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Email</label>
                                    <p className="text-gray-900">{coaching.email || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Website</label>
                                    <p className="text-gray-900">
                                        {coaching.website ? (
                                            <a href={coaching.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                {coaching.website}
                                            </a>
                                        ) : 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Social Media</label>
                                    <p className="text-gray-900">
                                        {coaching.socialMedia && (coaching.socialMedia.facebook || coaching.socialMedia.twitter || coaching.socialMedia.instagram) ? (
                                            <div className="space-y-1">
                                                {coaching.socialMedia.facebook && (
                                                    <a href={coaching.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block">
                                                        Facebook
                                                    </a>
                                                )}
                                                {coaching.socialMedia.twitter && (
                                                    <a href={coaching.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block">
                                                        Twitter
                                                    </a>
                                                )}
                                                {coaching.socialMedia.instagram && (
                                                    <a href={coaching.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block">
                                                        Instagram
                                                    </a>
                                                )}
                                            </div>
                                        ) : 'N/A'}
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-gray-700 font-semibold">Google Maps</label>
                                    {coaching.googleMapsEmbedUrl ? (
                                        <iframe
                                            src={coaching.googleMapsEmbedUrl}
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

                        {/* Center Image */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                                Tuition/Coaching Center Image
                            </h2>
                            {coaching.centerImage ? (
                                <motion.div
                                    className="relative aspect-square overflow-hidden rounded-xl mt-4 max-w-sm"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <img
                                        src={coaching.centerImage}
                                        alt="Tuition/Coaching Center Image"
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                            ) : (
                                <p className="text-gray-900">No image available</p>
                            )}
                        </motion.div>

                        {/* Center Gallery */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                                Tuition/Coaching Center Gallery
                            </h2>
                            {coaching.photos.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                    {coaching.photos.map((photo, index) => (
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
                                Tuition/Coaching Center Infrastructure
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-gray-700 font-semibold">Classrooms</label>
                                    <p className="text-gray-900">{coaching.classrooms || 'N/A'}</p>
                                </div>
                                {['laboratories', 'library', 'smartBoards', 'cctv', 'medicalRoom', 'wifi', 'studyMaterial', 'tests', 'doubtSessions', 'demoClass', 'flexibleTimings'].map(field => (
                                    <div key={field}>
                                        <label className="text-gray-700 font-semibold capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                                        <p className="text-gray-900">{coaching[field] || 'N/A'}</p>
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
                                    {coaching.admissionLink ? (
                                        <a href={coaching.admissionLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                            {coaching.admissionLink}
                                        </a>
                                    ) : 'N/A'}
                                </p>
                            </div>
                            <div className="mt-4">
                                <label className="text-gray-700 font-semibold">Admission Process</label>
                                <p className="text-gray-900 whitespace-pre-wrap">{coaching.admissionProcess || 'N/A'}</p>
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
                                onClick={() => navigate(`/admin/edit-tuition-coaching/${id}`)}
                                whileHover={{ scale: 1.03, boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)' }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-bold transition-all shadow-lg hover:from-green-600 hover:to-emerald-700"
                            >
                                Edit Tuition/Coaching Center
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </ErrorBoundary>
    );
};

export default ViewCoaching;