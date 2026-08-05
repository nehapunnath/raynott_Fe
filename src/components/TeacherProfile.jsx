import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { teacherApi } from '../services/teacherApi';
import { 
  FiMapPin, FiPhone, FiMail, FiGlobe, FiCalendar, 
  FiBookOpen, FiAward, FiUsers, FiClock, FiInfo,
  FiChevronLeft, FiCheckCircle, FiHome, FiImage,
  FiExternalLink, FiCamera, FiStar,
  FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiLinkedin,
  FiAlertCircle, FiEdit, FiMail as FiMailIcon,
  FiUser, FiUserPlus, FiUserCheck, FiBook, FiFileText,
  FiRefreshCw, FiBriefcase, FiDollarSign
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import "tailwindcss";

const TeacherProfile = () => {
    const navigate = useNavigate();
    const [institution, setInstitution] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        const fetchTeacherData = async () => {
            try {
                setIsLoading(true);
                setError('');
                
                const userEmail = localStorage.getItem('userEmail');
                console.log('🔍 Fetching teacher profile for:', userEmail);
                
                const storedData = localStorage.getItem('teacherData');
                if (storedData) {
                    try {
                        const parsedData = JSON.parse(storedData);
                        if (parsedData && parsedData.email === userEmail) {
                            console.log('📦 Using stored teacher data');
                            setInstitution(parsedData);
                            setIsLoading(false);
                            return;
                        }
                    } catch (e) {
                        console.log('Error parsing stored data:', e);
                    }
                }
                
                if (userEmail) {
                    console.log('📡 Searching teachers by email:', userEmail);
                    const response = await teacherApi.getTeachers();
                    console.log('📡 All teachers response:', response);
                    
                    if (response && response.success && response.data) {
                        let teachers = [];
                        if (Array.isArray(response.data)) {
                            teachers = response.data;
                        } else if (typeof response.data === 'object') {
                            teachers = Object.keys(response.data).map(key => ({
                                id: key,
                                ...response.data[key]
                            }));
                        }
                        
                        const foundTeacher = teachers.find(t => 
                            t.email === userEmail || 
                            t.email?.toLowerCase() === userEmail.toLowerCase()
                        );
                        
                        if (foundTeacher) {
                            console.log('✅ Found teacher by email:', foundTeacher);
                            foundTeacher.institutionType = 'teacher';
                            localStorage.setItem('teacherData', JSON.stringify(foundTeacher));
                            setInstitution(foundTeacher);
                            setIsLoading(false);
                            return;
                        }
                    }
                }
                
                console.log('❌ No teacher found');
                setError('Teacher profile not found. Please contact support.');
                toast.error('Teacher profile not found. Please contact support.');
                setIsLoading(false);
                
            } catch (error) {
                console.error('❌ Error fetching teacher:', error);
                setError('Failed to load profile');
                setIsLoading(false);
                toast.error('Failed to load profile. Please try again.');
            }
        };
        
        fetchTeacherData();
    }, [retryCount]);

    const goToDashboard = () => navigate('/dashboard');
    const retryFetch = () => {
        setRetryCount(prev => prev + 1);
        localStorage.removeItem('teacherData');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading teacher profile...</p>
                </div>
            </div>
        );
    }

    if (error || !institution) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                    <div className="text-6xl mb-4 flex justify-center">
                        <FiAlertCircle className="text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Teacher Profile Not Found</h2>
                    <p className="text-gray-600 mb-2">{error || 'Your teacher profile could not be found.'}</p>
                    
                    <div className="space-y-3">
                        <button onClick={goToDashboard} className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
                            <FiChevronLeft /> Go to Dashboard
                        </button>
                        <button onClick={retryFetch} className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                            <FiRefreshCw /> Try Again
                        </button>
                    </div>
                    
                    <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-left">
                        <p className="text-sm text-yellow-800">
                            <strong>Need help?</strong> Please contact admin at{' '}
                            <a href="mailto:support@raynott.com" className="text-blue-600 hover:underline">support@raynott.com</a>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const typeLabel = 'Teacher';
    const icon = '👨‍🏫';

    const tabs = [
        { id: 'overview', label: 'Overview', icon: FiInfo },
        { id: 'academics', label: 'Academics', icon: FiBookOpen },
        { id: 'gallery', label: 'Gallery', icon: FiImage },
    ];

    const renderOverview = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <FiEdit className="text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                        <p className="text-sm text-blue-800">
                            <strong>Need to update your information?</strong> Please contact the admin team to request changes to your profile.
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                            <FiMailIcon className="text-blue-500" />
                            <a href="mailto:support@raynott.com" className="text-sm text-blue-600 hover:underline">support@raynott.com</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FiInfo className="text-orange-500" />
                    About {institution.teacherName || institution.name}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                    {institution.about || `${institution.teacherName || institution.name} is a dedicated teacher with ${institution.experience || 'years of'} experience.`}
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {institution.experience && (
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                        <div className="text-2xl font-bold text-orange-600">{institution.experience}</div>
                        <div className="text-sm text-gray-500">Experience</div>
                    </div>
                )}
                {institution.qualifications && (
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                        <div className="text-2xl font-bold text-orange-600">✓</div>
                        <div className="text-sm text-gray-500">Qualified</div>
                    </div>
                )}
                {institution.hourlyRate && (
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                        <div className="text-2xl font-bold text-orange-600">{institution.hourlyRate}</div>
                        <div className="text-sm text-gray-500">Hourly Rate</div>
                    </div>
                )}
                {institution.monthlyPackage && (
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                        <div className="text-2xl font-bold text-orange-600">{institution.monthlyPackage}</div>
                        <div className="text-sm text-gray-500">Monthly Package</div>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {institution.address && (
                        <div className="flex items-start space-x-3">
                            <FiMapPin className="text-orange-500 mt-1 flex-shrink-0" />
                            <div>
                                <p className="text-sm text-gray-500">Address</p>
                                <p className="text-gray-800">
                                    {institution.address}, {institution.city}, {institution.state} - {institution.pincode}
                                </p>
                            </div>
                        </div>
                    )}
                    {institution.phone && (
                        <div className="flex items-start space-x-3">
                            <FiPhone className="text-orange-500 mt-1 flex-shrink-0" />
                            <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="text-gray-800">{institution.phone}</p>
                            </div>
                        </div>
                    )}
                    {institution.email && (
                        <div className="flex items-start space-x-3">
                            <FiMail className="text-orange-500 mt-1 flex-shrink-0" />
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="text-gray-800">{institution.email}</p>
                            </div>
                        </div>
                    )}
                    {institution.availability && (
                        <div className="flex items-start space-x-3">
                            <FiClock className="text-orange-500 mt-1 flex-shrink-0" />
                            <div>
                                <p className="text-sm text-gray-500">Availability</p>
                                <p className="text-gray-800">{institution.availability}</p>
                            </div>
                        </div>
                    )}
                    {institution.teachingMode && (
                        <div className="flex items-start space-x-3">
                            <FiBookOpen className="text-orange-500 mt-1 flex-shrink-0" />
                            <div>
                                <p className="text-sm text-gray-500">Teaching Mode</p>
                                <p className="text-gray-800">{institution.teachingMode}</p>
                            </div>
                        </div>
                    )}
                    {institution.institutionName && (
                        <div className="flex items-start space-x-3">
                            <FiBriefcase className="text-orange-500 mt-1 flex-shrink-0" />
                            <div>
                                <p className="text-sm text-gray-500">Institution</p>
                                <p className="text-gray-800">{institution.institutionName}</p>
                            </div>
                        </div>
                    )}
                    {institution.institutionPosition && (
                        <div className="flex items-start space-x-3">
                            <FiUserPlus className="text-orange-500 mt-1 flex-shrink-0" />
                            <div>
                                <p className="text-sm text-gray-500">Position</p>
                                <p className="text-gray-800">{institution.institutionPosition}</p>
                            </div>
                        </div>
                    )}
                    {institution.institutionExperience && (
                        <div className="flex items-start space-x-3">
                            <FiClock className="text-orange-500 mt-1 flex-shrink-0" />
                            <div>
                                <p className="text-sm text-gray-500">Institution Experience</p>
                                <p className="text-gray-800">{institution.institutionExperience}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {institution.socialMedia && Object.values(institution.socialMedia).some(v => v) && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Social Media</h3>
                    <div className="flex flex-wrap gap-3">
                        {institution.socialMedia?.facebook && (
                            <a href={institution.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-[#1877f2] text-white rounded-lg hover:opacity-90 transition">
                                <FiFacebook /> Facebook
                            </a>
                        )}
                        {institution.socialMedia?.twitter && (
                            <a href={institution.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-[#1da1f2] text-white rounded-lg hover:opacity-90 transition">
                                <FiTwitter /> Twitter
                            </a>
                        )}
                        {institution.socialMedia?.instagram && (
                            <a href={institution.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white rounded-lg hover:opacity-90 transition">
                                <FiInstagram /> Instagram
                            </a>
                        )}
                        {institution.socialMedia?.youtube && (
                            <a href={institution.socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-[#ff0000] text-white rounded-lg hover:opacity-90 transition">
                                <FiYoutube /> YouTube
                            </a>
                        )}
                        {institution.socialMedia?.linkedin && (
                            <a href={institution.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-[#0a66c2] text-white rounded-lg hover:opacity-90 transition">
                                <FiLinkedin /> LinkedIn
                            </a>
                        )}
                    </div>
                </div>
            )}
        </motion.div>
    );

    const renderAcademics = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FiBookOpen className="text-orange-500" />
                    Academic & Professional Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {institution.teacherName && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">Teacher Name</p>
                            <p className="text-gray-800 font-medium">{institution.teacherName}</p>
                        </div>
                    )}
                    {institution.qualifications && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">Qualifications</p>
                            <p className="text-gray-800 font-medium">{institution.qualifications}</p>
                        </div>
                    )}
                    {institution.experience && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">Experience</p>
                            <p className="text-gray-800 font-medium">{institution.experience}</p>
                        </div>
                    )}
                    {institution.specialization && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">Specialization</p>
                            <p className="text-gray-800 font-medium">{institution.specialization}</p>
                        </div>
                    )}
                    {institution.certifications && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">Certifications</p>
                            <p className="text-gray-800 font-medium">{institution.certifications}</p>
                        </div>
                    )}
                    {institution.languages && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">Languages</p>
                            <p className="text-gray-800 font-medium">{institution.languages}</p>
                        </div>
                    )}
                    {institution.hourlyRate && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">Hourly Rate</p>
                            <p className="text-gray-800 font-medium text-orange-600">{institution.hourlyRate}</p>
                        </div>
                    )}
                    {institution.monthlyPackage && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">Monthly Package</p>
                            <p className="text-gray-800 font-medium text-orange-600">{institution.monthlyPackage}</p>
                        </div>
                    )}
                </div>
            </div>

            {institution.teachingApproach && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Teaching Approach</h3>
                    <p className="text-gray-700">{institution.teachingApproach}</p>
                </div>
            )}

            {institution.teachingProcess && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Teaching Process</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{institution.teachingProcess}</p>
                </div>
            )}

            {institution.studyMaterials && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Study Materials</h3>
                    <p className="text-gray-700">{institution.studyMaterials}</p>
                </div>
            )}

            {(institution.sessionDuration || institution.studentLevel || institution.classSize || institution.onlinePlatform) && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Session Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {institution.sessionDuration && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Session Duration</p>
                                <p className="text-gray-800 font-medium">{institution.sessionDuration}</p>
                            </div>
                        )}
                        {institution.studentLevel && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Student Level</p>
                                <p className="text-gray-800 font-medium">{institution.studentLevel}</p>
                            </div>
                        )}
                        {institution.classSize && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Class Size</p>
                                <p className="text-gray-800 font-medium">{institution.classSize}</p>
                            </div>
                        )}
                        {institution.onlinePlatform && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Online Platform</p>
                                <p className="text-gray-800 font-medium">{institution.onlinePlatform}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {(institution.progressReports || institution.performanceTracking) && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Student Support</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {institution.progressReports && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Progress Reports</p>
                                <p className="text-gray-800 font-medium">{institution.progressReports}</p>
                            </div>
                        )}
                        {institution.performanceTracking && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Performance Tracking</p>
                                <p className="text-gray-800 font-medium">{institution.performanceTracking}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </motion.div>
    );

    const renderGallery = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {institution.profileImage && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FiCamera className="text-orange-500" />
                        Profile Photo
                    </h3>
                    <div className="relative overflow-hidden rounded-lg max-w-xs mx-auto">
                        <img
                            src={institution.profileImage}
                            alt={institution.teacherName || institution.name}
                            className="w-full h-auto object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                            onClick={() => setSelectedPhoto(institution.profileImage)}
                        />
                    </div>
                </div>
            )}

            {institution.schoolImage && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FiImage className="text-orange-500" />
                        Institution Image
                    </h3>
                    <div className="relative overflow-hidden rounded-lg max-w-2xl mx-auto">
                        <img
                            src={institution.schoolImage}
                            alt={institution.institutionName || 'Institution'}
                            className="w-full h-auto object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                            onClick={() => setSelectedPhoto(institution.schoolImage)}
                        />
                    </div>
                </div>
            )}

            {institution.qualificationCertificates && institution.qualificationCertificates.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FiAward className="text-orange-500" />
                        Certificates & Documents
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {institution.qualificationCertificates.map((doc, index) => (
                            <a
                                key={index}
                                href={doc}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                            >
                                <FiFileText className="text-orange-500" />
                                <span className="text-sm text-gray-700 truncate">Document {index + 1}</span>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {institution.idProof && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FiUserCheck className="text-orange-500" />
                        ID Proof
                    </h3>
                    <a
                        href={institution.idProof}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                        <FiFileText className="text-orange-500" />
                        <span className="text-sm text-gray-700">View ID Proof</span>
                    </a>
                </div>
            )}

            {selectedPhoto && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setSelectedPhoto(null)}>
                    <img src={selectedPhoto} alt="Full size" className="max-w-full max-h-full object-contain" />
                    <button className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors" onClick={() => setSelectedPhoto(null)}>×</button>
                </div>
            )}
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="bg-white shadow-sm sticky top-0 z-30 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors">
                        <FiChevronLeft className="text-2xl" />
                        <span>Dashboard</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                            {/* <span className="text-lg">{icon}</span> */}
                            {typeLabel}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                            <FiEdit className="text-orange-500" />
                            View Only
                        </span>
                    </div>
                </div>
            </div>

            <div className="relative">
                <div className="relative h-[250px] md:h-[350px] w-full overflow-hidden">
                    {institution.profileImage ? (
                        <>
                            <img src={institution.profileImage} alt={institution.teacherName || institution.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent"></div>
                        </>
                    ) : institution.schoolImage ? (
                        <>
                            <img src={institution.schoolImage} alt={institution.institutionName || 'Institution'} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent"></div>
                        </>
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-orange-400 to-amber-500"></div>
                    )}
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-7xl mx-auto">
                            <div className="flex items-center gap-3">
                                <span className="text-4xl">{icon}</span>
                                <h1 className="text-3xl md:text-5xl font-bold">
                                    {institution.teacherName || institution.name}
                                </h1>
                            </div>
                            {institution.tagline && <p className="text-lg text-white/80 mb-3">{institution.tagline}</p>}
                            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-white/80">
                                <span className="flex items-center gap-1">
                                    {/* <FiBookOpen className="text-orange-300" /> */}
                                    {typeLabel}
                                </span>
                                {institution.city && (
                                    <span className="flex items-center gap-1">
                                        <FiMapPin className="text-orange-300" />
                                        {institution.city}{institution.state ? `, ${institution.state}` : ''}
                                    </span>
                                )}
                                {institution.experience && (
                                    <span className="flex items-center gap-1">
                                        <FiBriefcase className="text-orange-300" />
                                        {institution.experience} experience
                                    </span>
                                )}
                                {institution.specialization && (
                                    <span className="flex items-center gap-1">
                                        <FiStar className="text-orange-300" />
                                        {institution.specialization}
                                    </span>
                                )}
                                {institution.teachingMode && (
                                    <span className="flex items-center gap-1">
                                        <FiBook className="text-orange-300" />
                                        {institution.teachingMode}
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="bg-white border-b border-gray-200 sticky top-[73px] z-20">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex overflow-x-auto hide-scrollbar gap-1">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                                            activeTab === tab.id
                                                ? 'text-orange-600 border-orange-600'
                                                : 'text-gray-500 border-transparent hover:text-gray-700'
                                        }`}
                                    >
                                        <Icon className="text-lg" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        {activeTab === 'overview' && renderOverview()}
                        {activeTab === 'academics' && renderAcademics()}
                        {activeTab === 'gallery' && renderGallery()}
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-[200px]">
                            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <FiInfo className="text-orange-500" />
                                Quick Info
                            </h4>
                            <div className="space-y-3">
                                {institution.qualifications && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Qualifications</span>
                                        <span className="text-gray-800 font-medium">{institution.qualifications}</span>
                                    </div>
                                )}
                                {institution.experience && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Experience</span>
                                        <span className="text-gray-800 font-medium">{institution.experience}</span>
                                    </div>
                                )}
                                {institution.specialization && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Specialization</span>
                                        <span className="text-gray-800 font-medium">{institution.specialization}</span>
                                    </div>
                                )}
                                {institution.teachingMode && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Teaching Mode</span>
                                        <span className="text-gray-800 font-medium">{institution.teachingMode}</span>
                                    </div>
                                )}
                                {institution.languages && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Languages</span>
                                        <span className="text-gray-800 font-medium">{institution.languages}</span>
                                    </div>
                                )}
                                {institution.hourlyRate && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Hourly Rate</span>
                                        <span className="text-gray-800 font-medium text-orange-600">{institution.hourlyRate}</span>
                                    </div>
                                )}
                                {institution.monthlyPackage && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Monthly Package</span>
                                        <span className="text-gray-800 font-medium text-orange-600">{institution.monthlyPackage}</span>
                                    </div>
                                )}
                            </div>

                            <hr className="my-4" />

                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                <p className="text-sm text-blue-800 font-medium mb-2">Need to update information?</p>
                                <p className="text-xs text-blue-600 mb-2">Contact admin to request changes to your profile.</p>
                                <a href="mailto:support@raynott.com" className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2">
                                    <FiMailIcon className="text-blue-500" />
                                    support@raynott.com
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white border-t border-gray-200 mt-12 py-6">
                <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} {institution.teacherName || institution.name}. All rights reserved.</p>
                    <p className="mt-1">This is a view-only profile. For updates, contact admin.</p>
                </div>
            </div>

            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export default TeacherProfile;