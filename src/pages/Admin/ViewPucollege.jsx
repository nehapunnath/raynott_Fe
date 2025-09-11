import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { puCollegeApi } from '../../services/pucollegeApi';

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

const ViewPucollege = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [puCollege, setPUCollege] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPUCollege = async () => {
            try {
                setIsLoading(true);
                const response = await puCollegeApi.getPUCollege(id);

                console.log('API Response:', response);

                if (response.success && response.data) {
                    // Firebase returns data as an object with PU college ID as key
                    const puCollegeData = response.data[id] || response.data;

                    console.log('Processed PU college data:', puCollegeData);

                    setPUCollege({
                        id: id,
                        name: puCollegeData.name || '',
                        typeOfCollege: puCollegeData.typeOfCollege || '',
                        board: puCollegeData.board || '',
                        streams: Array.isArray(puCollegeData.streams) ? puCollegeData.streams : [],
                        subjects: Array.isArray(puCollegeData.subjects) ? puCollegeData.subjects : [],
                        programDuration: puCollegeData.programDuration || '',
                        language: puCollegeData.language || '',
                        establishmentYear: puCollegeData.establishmentYear || '',
                        accreditation: puCollegeData.accreditation || '',
                        studentTeacherRatio: puCollegeData.studentTeacherRatio || '',
                        competitiveExamPrep: puCollegeData.competitiveExamPrep || '',
                        facilities: Array.isArray(puCollegeData.facilities) ? puCollegeData.facilities : [],
                        totalAnnualFee: puCollegeData.totalAnnualFee || '',
                        admissionFee: puCollegeData.admissionFee || '',
                        tuitionFee: puCollegeData.tuitionFee || '',
                        transportFee: puCollegeData.transportFee || '',
                        booksUniformsFee: puCollegeData.booksUniformsFee || '',
                        address: puCollegeData.address || '',
                        city: puCollegeData.city || '',
                        state: puCollegeData.state || '',
                        pincode: puCollegeData.pincode || '',
                        phone: puCollegeData.phone || '',
                        email: puCollegeData.email || '',
                        website: puCollegeData.website || '',
                        socialMedia: puCollegeData.socialMedia || { facebook: '', twitter: '', instagram: '' },
                        googleMapsEmbedUrl: puCollegeData.googleMapsEmbedUrl || '',
                        campusSize: puCollegeData.campusSize || '',
                        classrooms: puCollegeData.classrooms || '',
                        laboratories: puCollegeData.laboratories || '',
                        library: puCollegeData.library || '',
                        playground: puCollegeData.playground || '',
                        auditorium: puCollegeData.auditorium || '',
                        smartBoards: puCollegeData.smartBoards || '',
                        cctv: puCollegeData.cctv || '',
                        medicalRoom: puCollegeData.medicalRoom || '',
                        wifi: puCollegeData.wifi || '',
                        hostel: puCollegeData.hostel || '',
                        admissionLink: puCollegeData.admissionLink || '',
                        admissionProcess: puCollegeData.admissionProcess || '',
                        collegeImage: puCollegeData.collegeImage || '',
                        photos: Array.isArray(puCollegeData.photos) ? puCollegeData.photos : []
                    });
                } else {
                    setError(response.message || 'Failed to fetch PU college details');
                }
            } catch (error) {
                console.error('Error fetching PU college:', error);
                setError(error.response?.status === 404 ? 'PU College not found' : error.message || 'Failed to fetch PU college details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPUCollege();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    if (error || !puCollege) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-2xl mx-auto mt-8">
                <p>Error: {error || 'No PU college data available'}</p>
                <button
                    onClick={() => navigate('/admin/dashboard')}
                    className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Back to PU Colleges
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
                    <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">PU College Details</h1>
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
                                    <label className="text-gray-700 font-semibold">PU College Name</label>
                                    <p className="text-gray-900">{puCollege.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Type of PU College</label>
                                    <p className="text-gray-900">{puCollege.typeOfCollege || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Board</label>
                                    <p className="text-gray-900">{puCollege.board || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Streams</label>
                                    <p className="text-gray-900">
                                        {puCollege.streams.length > 0 ? puCollege.streams.join(', ') : 'None'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Subjects</label>
                                    <p className="text-gray-900">
                                        {puCollege.subjects.length > 0 ? puCollege.subjects.join(', ') : 'None'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Program Duration</label>
                                    <p className="text-gray-900">{puCollege.programDuration || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Language</label>
                                    <p className="text-gray-900">{puCollege.language || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Establishment Year</label>
                                    <p className="text-gray-900">{puCollege.establishmentYear || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Accreditation</label>
                                    <p className="text-gray-900">{puCollege.accreditation || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Student Teacher Ratio</label>
                                    <p className="text-gray-900">{puCollege.studentTeacherRatio || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Competitive Exam Preparation</label>
                                    <p className="text-gray-900">{puCollege.competitiveExamPrep || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Facilities</label>
                                    <p className="text-gray-900">
                                        {puCollege.facilities.length > 0 ? puCollege.facilities.join(', ') : 'None'}
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
                                    <p className="text-gray-900">{puCollege.totalAnnualFee || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Admission Fee</label>
                                    <p className="text-gray-900">{puCollege.admissionFee || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Tuition Fee</label>
                                    <p className="text-gray-900">{puCollege.tuitionFee || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Transport Fee</label>
                                    <p className="text-gray-900">{puCollege.transportFee || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Books & Uniforms Fee</label>
                                    <p className="text-gray-900">{puCollege.booksUniformsFee || 'N/A'}</p>
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
                                    <p className="text-gray-900">{puCollege.address || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">City</label>
                                    <p className="text-gray-900">{puCollege.city || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">State</label>
                                    <p className="text-gray-900">{puCollege.state || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Pincode</label>
                                    <p className="text-gray-900">{puCollege.pincode || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Phone</label>
                                    <p className="text-gray-900">{puCollege.phone || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Email</label>
                                    <p className="text-gray-900">{puCollege.email || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Website</label>
                                    <p className="text-gray-900">
                                        {puCollege.website ? (
                                            <a href={puCollege.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                {puCollege.website}
                                            </a>
                                        ) : 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Social Media</label>
                                    <p className="text-gray-900">
                                        {puCollege.socialMedia && (puCollege.socialMedia.facebook || puCollege.socialMedia.twitter || puCollege.socialMedia.instagram) ? (
                                            <div className="space-y-1">
                                                {puCollege.socialMedia.facebook && (
                                                    <a href={puCollege.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block">
                                                        Facebook
                                                    </a>
                                                )}
                                                {puCollege.socialMedia.twitter && (
                                                    <a href={puCollege.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block">
                                                        Twitter
                                                    </a>
                                                )}
                                                {puCollege.socialMedia.instagram && (
                                                    <a href={puCollege.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block">
                                                        Instagram
                                                    </a>
                                                )}
                                            </div>
                                        ) : 'N/A'}
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-gray-700 font-semibold">Google Maps</label>
                                    {puCollege.googleMapsEmbedUrl ? (
                                        <iframe
                                            src={puCollege.googleMapsEmbedUrl}
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

                        {/* PU College Image */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                                PU College Image
                            </h2>
                            {puCollege.collegeImage ? (
                                <motion.div
                                    className="relative aspect-square overflow-hidden rounded-xl mt-4 max-w-sm"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <img
                                        src={puCollege.collegeImage}
                                        alt="PU College Image"
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                            ) : (
                                <p className="text-gray-900">No image available</p>
                            )}
                        </motion.div>

                        {/* PU College Gallery */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                                PU College Gallery
                            </h2>
                            {puCollege.photos.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                    {puCollege.photos.map((photo, index) => (
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
                                PU College Infrastructure
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-gray-700 font-semibold">Campus Size</label>
                                    <p className="text-gray-900">{puCollege.campusSize || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-gray-700 font-semibold">Classrooms</label>
                                    <p className="text-gray-900">{puCollege.classrooms || 'N/A'}</p>
                                </div>
                                {['laboratories', 'library', 'playground', 'auditorium', 'smartBoards', 'cctv', 'medicalRoom', 'wifi', 'hostel'].map(field => (
                                    <div key={field}>
                                        <label className="text-gray-700 font-semibold capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                                        <p className="text-gray-900">{puCollege[field] || 'N/A'}</p>
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
                                    {puCollege.admissionLink ? (
                                        <a href={puCollege.admissionLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                            {puCollege.admissionLink}
                                        </a>
                                    ) : 'N/A'}
                                </p>
                            </div>
                            <div className="mt-4">
                                <label className="text-gray-700 font-semibold">Admission Process</label>
                                <p className="text-gray-900 whitespace-pre-wrap">{puCollege.admissionProcess || 'N/A'}</p>
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
                                Back to PU Colleges
                            </motion.button>
                            <motion.button
                                onClick={() => navigate(`/admin/edit-pucollege/${id}`)}
                                whileHover={{ scale: 1.03, boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)' }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-bold transition-all shadow-lg hover:from-green-600 hover:to-emerald-700"
                            >
                                Edit PU College
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </ErrorBoundary>
    );
};

export default ViewPucollege;