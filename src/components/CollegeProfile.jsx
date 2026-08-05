import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { collegeApi } from '../services/collegeApi';
import { 
  FiMapPin, FiPhone, FiMail, FiGlobe, FiCalendar, 
  FiBookOpen, FiAward, FiUsers, FiClock, FiInfo,
  FiChevronLeft, FiCheckCircle, FiHome, FiImage,
  FiExternalLink, FiCamera, FiStar,
  FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiLinkedin,
  FiAlertCircle, FiEdit, FiMail as FiMailIcon,
  FiUser, FiUserPlus, FiUserCheck, FiBook, FiFileText,
  FiRefreshCw
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import "tailwindcss";

const CollegeProfile = () => {
    const navigate = useNavigate();
    const [institution, setInstitution] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        const fetchCollegeData = async () => {
            try {
                setIsLoading(true);
                setError('');
                
                const userEmail = localStorage.getItem('userEmail');
                const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                
                console.log('🔍 Fetching college profile for:', userEmail);
                
                // Check if we have stored data
                const storedData = localStorage.getItem('collegeData');
                if (storedData) {
                    try {
                        const parsedData = JSON.parse(storedData);
                        if (parsedData && parsedData.email === userEmail) {
                            console.log('📦 Using stored college data');
                            setInstitution(parsedData);
                            setIsLoading(false);
                            return;
                        }
                    } catch (e) {
                        console.log('Error parsing stored data:', e);
                    }
                }
                
                // Try to find by email
                if (userEmail) {
                    console.log('📡 Searching colleges by email:', userEmail);
                    const response = await collegeApi.getColleges();
                    console.log('📡 All colleges response:', response);
                    
                    if (response && response.success && response.data) {
                        let colleges = [];
                        if (Array.isArray(response.data)) {
                            colleges = response.data;
                        } else if (typeof response.data === 'object') {
                            colleges = Object.keys(response.data).map(key => ({
                                id: key,
                                ...response.data[key]
                            }));
                        }
                        
                        const foundCollege = colleges.find(c => 
                            c.email === userEmail || 
                            c.email?.toLowerCase() === userEmail.toLowerCase()
                        );
                        
                        if (foundCollege) {
                            console.log('✅ Found college by email:', foundCollege);
                            foundCollege.institutionType = 'college';
                            localStorage.setItem('collegeData', JSON.stringify(foundCollege));
                            if (foundCollege.id) {
                                localStorage.setItem('collegeId', foundCollege.id);
                            }
                            setInstitution(foundCollege);
                            setIsLoading(false);
                            return;
                        }
                    }
                }
                
                // If all fails, show error
                console.log('❌ No college found');
                setError('College profile not found. Please contact support.');
                toast.error('College profile not found. Please contact support.');
                setIsLoading(false);
                
            } catch (error) {
                console.error('❌ Error fetching college:', error);
                setError('Failed to load profile');
                setIsLoading(false);
                toast.error('Failed to load profile. Please try again.');
            }
        };
        
        fetchCollegeData();
    }, [retryCount]);

    const goToDashboard = () => {
        navigate('/dashboard');
    };

    const retryFetch = () => {
        setRetryCount(prev => prev + 1);
        localStorage.removeItem('collegeData');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading college profile...</p>
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
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">College Profile Not Found</h2>
                    <p className="text-gray-600 mb-2">{error || 'Your college profile could not be found.'}</p>
                    
                    <div className="space-y-3">
                        <button
                            onClick={goToDashboard}
                            className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <FiChevronLeft /> Go to Dashboard
                        </button>
                        
                        <button
                            onClick={retryFetch}
                            className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <FiRefreshCw /> Try Again
                        </button>
                    </div>
                    
                    <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-left">
                        <p className="text-sm text-yellow-800">
                            <strong>Need help?</strong> Please contact admin at{' '}
                            <a href="mailto:support@raynott.com" className="text-blue-600 hover:underline">
                                support@raynott.com
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const typeLabel = 'College';
    const icon = '🎓';

    const tabs = [
        { id: 'overview', label: 'Overview', icon: FiInfo },
        { id: 'academics', label: 'Academics', icon: FiBookOpen },
        { id: 'infrastructure', label: 'Infrastructure', icon: FiHome },
        { id: 'gallery', label: 'Gallery', icon: FiImage },
        { id: 'admission', label: 'Admission', icon: FiCheckCircle },
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
                            <a href="mailto:support@raynott.com" className="text-sm text-blue-600 hover:underline">
                                support@raynott.com
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FiInfo className="text-orange-500" />
                    About {institution.name}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                    {institution.about || `${institution.name} is a premier college established in ${institution.establishmentYear}.`}
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {institution.establishmentYear && (
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                        <div className="text-2xl font-bold text-orange-600">{institution.establishmentYear}</div>
                        <div className="text-sm text-gray-500">Established</div>
                    </div>
                )}
                {institution.studentStrength && (
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                        <div className="text-2xl font-bold text-orange-600">{institution.studentStrength}</div>
                        <div className="text-sm text-gray-500">Students</div>
                    </div>
                )}
                {institution.teacherStrength && (
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                        <div className="text-2xl font-bold text-orange-600">{institution.teacherStrength}</div>
                        <div className="text-sm text-gray-500">Teachers</div>
                    </div>
                )}
                {institution.studentTeacherRatio && (
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                        <div className="text-2xl font-bold text-orange-600">{institution.studentTeacherRatio}</div>
                        <div className="text-sm text-gray-500">Student-Teacher Ratio</div>
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
                                {institution.alternatePhone && (
                                    <p className="text-gray-600 text-sm">{institution.alternatePhone} (Alternate)</p>
                                )}
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
                    {institution.website && (
                        <div className="flex items-start space-x-3">
                            <FiGlobe className="text-orange-500 mt-1 flex-shrink-0" />
                            <div>
                                <p className="text-sm text-gray-500">Website</p>
                                <a href={institution.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                    {institution.website}
                                    <FiExternalLink className="text-xs" />
                                </a>
                            </div>
                        </div>
                    )}
                    {institution.principalName && (
                        <div className="flex items-start space-x-3">
                            <FiUser className="text-orange-500 mt-1 flex-shrink-0" />
                            <div>
                                <p className="text-sm text-gray-500">Principal</p>
                                <p className="text-gray-800">{institution.principalName}</p>
                            </div>
                        </div>
                    )}
                    {institution.contactPerson && (
                        <div className="flex items-start space-x-3">
                            <FiUserPlus className="text-orange-500 mt-1 flex-shrink-0" />
                            <div>
                                <p className="text-sm text-gray-500">Contact Person</p>
                                <p className="text-gray-800">{institution.contactPerson}</p>
                             </div>
                        </div>
                    )}
                    {institution.officeHours && (
                        <div className="flex items-start space-x-3">
                            <FiClock className="text-orange-500 mt-1 flex-shrink-0" />
                            <div>
                                <p className="text-sm text-gray-500">Office Hours</p>
                                <p className="text-gray-800">{institution.officeHours}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {Object.values(institution.socialMedia || {}).some(v => v) && (
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

            {institution.googleMapsEmbedUrl && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Location</h3>
                    <iframe
                        src={institution.googleMapsEmbedUrl}
                        width="100%"
                        height="350"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        className="rounded-lg"
                        title="Location"
                    ></iframe>
                </div>
            )}
        </motion.div>
    );

    const renderAcademics = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FiBookOpen className="text-orange-500" />
                    Academic Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {institution.typeOfCollege && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">College Type</p>
                            <p className="text-gray-800 font-medium">{institution.typeOfCollege}</p>
                        </div>
                    )}
                    {institution.universityAffiliation && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">University Affiliation</p>
                            <p className="text-gray-800 font-medium">{institution.universityAffiliation}</p>
                        </div>
                    )}
                    {institution.coursesOffered && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">Courses Offered</p>
                            <p className="text-gray-800 font-medium">{institution.coursesOffered}</p>
                        </div>
                    )}
                    {institution.duration && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">Duration</p>
                            <p className="text-gray-800 font-medium">{institution.duration}</p>
                        </div>
                    )}
                    {institution.accreditation && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">Accreditation</p>
                            <p className="text-gray-800 font-medium">{institution.accreditation}</p>
                        </div>
                    )}
                    {institution.placementStatistics && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">Placement Statistics</p>
                            <p className="text-gray-800 font-medium">{institution.placementStatistics}</p>
                        </div>
                    )}
                    {institution.departments && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">Departments</p>
                            <p className="text-gray-800 font-medium">{institution.departments}</p>
                        </div>
                    )}
                    {institution.language && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">Medium of Instruction</p>
                            <p className="text-gray-800 font-medium">{institution.language}</p>
                        </div>
                    )}
                </div>
            </div>

            {institution.facilities && institution.facilities.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FiAward className="text-orange-500" />
                        Facilities
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {institution.facilities.map((facility, index) => (
                            <div key={index} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                                <FiCheckCircle className="text-green-500 flex-shrink-0" />
                                <span className="text-gray-700">{facility}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {(institution.totalAnnualFee || institution.admissionFee || institution.tuitionFee || institution.transportFee || institution.booksUniformsFee) && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Fee Structure</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {institution.totalAnnualFee && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Total Annual Fee</p>
                                <p className="text-gray-800 font-medium text-lg text-orange-600">{institution.totalAnnualFee}</p>
                            </div>
                        )}
                        {institution.admissionFee && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Admission Fee</p>
                                <p className="text-gray-800 font-medium">{institution.admissionFee}</p>
                            </div>
                        )}
                        {institution.tuitionFee && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Tuition Fee</p>
                                <p className="text-gray-800 font-medium">{institution.tuitionFee}</p>
                            </div>
                        )}
                        {institution.transportFee && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Transport Fee</p>
                                <p className="text-gray-800 font-medium">{institution.transportFee}</p>
                            </div>
                        )}
                        {institution.booksUniformsFee && (
                            <div className="p-4 bg-gray-50 rounded-lg col-span-1 md:col-span-2">
                                <p className="text-sm text-gray-500">Books & Uniforms Fee</p>
                                <p className="text-gray-800 font-medium">{institution.booksUniformsFee}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </motion.div>
    );

    const renderInfrastructure = () => {
        const infrastructureItems = [
            { key: 'campusSize', label: 'Campus Size' },
            { key: 'classrooms', label: 'Classrooms' },
            { key: 'laboratories', label: 'Laboratories' },
            { key: 'library', label: 'Library' },
            { key: 'playground', label: 'Playground' },
            { key: 'auditorium', label: 'Auditorium' },
            { key: 'smartBoards', label: 'Smart Boards' },
            { key: 'cctv', label: 'CCTV' },
            { key: 'medicalRoom', label: 'Medical Room' },
            { key: 'wifi', label: 'WiFi' },
            { key: 'hostel', label: 'Hostel' },
            { key: 'sports', label: 'Sports' },
        ];

        const hasInfrastructure = infrastructureItems.some(item => institution[item.key]);

        if (!hasInfrastructure) {
            return (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                    <p className="text-gray-500">No infrastructure details available</p>
                </motion.div>
            );
        }

        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FiHome className="text-orange-500" />
                        Infrastructure
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {infrastructureItems.map((item) => {
                            if (!institution[item.key]) return null;
                            const value = institution[item.key];
                            const displayValue = typeof value === 'boolean' ? (value ? '✓ Available' : '✗ Not Available') : value;
                            return (
                                <div key={item.key} className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">{item.label}</p>
                                    <p className="text-gray-800 font-medium mt-1">{displayValue}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </motion.div>
        );
    };

    const renderGallery = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {institution.schoolImage && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FiCamera className="text-orange-500" />
                        Main Image
                    </h3>
                    <div className="relative overflow-hidden rounded-lg max-w-2xl mx-auto">
                        <img
                            src={institution.schoolImage}
                            alt={institution.name}
                            className="w-full h-auto object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                            onClick={() => setSelectedPhoto(institution.schoolImage)}
                        />
                    </div>
                </div>
            )}

            {institution.photos && institution.photos.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FiImage className="text-orange-500" />
                        Gallery ({institution.photos.length} photos)
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {institution.photos.map((photo, index) => (
                            <motion.div
                                key={index}
                                className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
                                whileHover={{ scale: 1.05 }}
                                onClick={() => setSelectedPhoto(photo)}
                            >
                                <img src={photo} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <FiCamera className="text-white text-2xl" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
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

    const renderAdmission = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FiCheckCircle className="text-orange-500" />
                    Admission Information
                </h3>
                
                {institution.admissionLink && (
                    <div className="mb-6">
                        <p className="text-sm text-gray-500">Application Link</p>
                        <p className="text-gray-800 break-all">{institution.admissionLink}</p>
                    </div>
                )}

                {institution.admissionProcess && (
                    <div>
                        <p className="text-sm text-gray-500 mb-2">Admission Process</p>
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{institution.admissionProcess}</p>
                    </div>
                )}

                {(institution.phone || institution.email || institution.principalName || institution.contactPerson || institution.officeHours) && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-gray-800 mb-3">Admission Contact</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {institution.principalName && (
                                <div>
                                    <p className="text-sm text-gray-500">Principal</p>
                                    <p className="text-gray-800 font-medium">{institution.principalName}</p>
                                </div>
                            )}
                            {institution.contactPerson && (
                                <div>
                                    <p className="text-sm text-gray-500">Contact Person</p>
                                    <p className="text-gray-800 font-medium">{institution.contactPerson}</p>
                                </div>
                            )}
                            {institution.phone && (
                                <div>
                                    <p className="text-sm text-gray-500">Contact Number</p>
                                    <p className="text-gray-800 font-medium">{institution.phone}</p>
                                    {institution.alternatePhone && (
                                        <p className="text-gray-600 text-sm">{institution.alternatePhone} (Alternate)</p>
                                    )}
                                </div>
                            )}
                            {institution.email && (
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="text-gray-800 font-medium">{institution.email}</p>
                                </div>
                            )}
                            {institution.officeHours && (
                                <div>
                                    <p className="text-sm text-gray-500">Office Hours</p>
                                    <p className="text-gray-800 font-medium">{institution.officeHours}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
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
                    {institution.schoolImage ? (
                        <>
                            <img src={institution.schoolImage} alt={institution.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent"></div>
                        </>
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-orange-400 to-amber-500"></div>
                    )}
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-7xl mx-auto">
                            <div className="flex items-center gap-3">
                                {/* <span className="text-4xl">{icon}</span> */}
                                <h1 className="text-3xl md:text-5xl font-bold">{institution.name}</h1>
                            </div>
                            {institution.tagline && <p className="text-lg text-white/80 mb-3">{institution.tagline}</p>}
                            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-white/80">
                                <span className="flex items-center gap-1">
                                    <FiBookOpen className="text-orange-300" />
                                    {typeLabel}
                                </span>
                                {institution.city && (
                                    <span className="flex items-center gap-1">
                                        <FiMapPin className="text-orange-300" />
                                        {institution.city}{institution.state ? `, ${institution.state}` : ''}
                                    </span>
                                )}
                                {institution.establishmentYear && (
                                    <span className="flex items-center gap-1">
                                        <FiCalendar className="text-orange-300" />
                                        Est. {institution.establishmentYear}
                                    </span>
                                )}
                                {institution.typeOfCollege && (
                                    <span className="flex items-center gap-1">
                                        <FiBook className="text-orange-300" />
                                        {institution.typeOfCollege}
                                    </span>
                                )}
                                {institution.accreditation && (
                                    <span className="flex items-center gap-1">
                                        <FiAward className="text-orange-300" />
                                        {institution.accreditation}
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
                        {activeTab === 'infrastructure' && renderInfrastructure()}
                        {activeTab === 'gallery' && renderGallery()}
                        {activeTab === 'admission' && renderAdmission()}
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-[200px]">
                            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <FiInfo className="text-orange-500" />
                                Quick Info
                            </h4>
                            <div className="space-y-3">
                                {institution.typeOfCollege && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Type</span>
                                        <span className="text-gray-800 font-medium">{institution.typeOfCollege}</span>
                                    </div>
                                )}
                                {institution.universityAffiliation && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">University</span>
                                        <span className="text-gray-800 font-medium">{institution.universityAffiliation}</span>
                                    </div>
                                )}
                                {institution.accreditation && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Accreditation</span>
                                        <span className="text-gray-800 font-medium">{institution.accreditation}</span>
                                    </div>
                                )}
                                {institution.coursesOffered && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Courses</span>
                                        <span className="text-gray-800 font-medium">{institution.coursesOffered}</span>
                                    </div>
                                )}
                                {institution.studentStrength && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Students</span>
                                        <span className="text-gray-800 font-medium">{institution.studentStrength}</span>
                                    </div>
                                )}
                                {institution.teacherStrength && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Teachers</span>
                                        <span className="text-gray-800 font-medium">{institution.teacherStrength}</span>
                                    </div>
                                )}
                                {institution.totalAnnualFee && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Annual Fee</span>
                                        <span className="text-gray-800 font-medium text-orange-600">{institution.totalAnnualFee}</span>
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
                    <p>© {new Date().getFullYear()} {institution.name}. All rights reserved.</p>
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

export default CollegeProfile;