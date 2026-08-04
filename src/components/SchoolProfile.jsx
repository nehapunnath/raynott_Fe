import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { schoolApi } from '../services/schoolApi';
import { 
  FiMapPin, FiPhone, FiMail, FiGlobe, FiCalendar, 
  FiBookOpen, FiAward, FiUsers, FiClock, FiInfo,
  FiChevronLeft, FiCheckCircle, FiHome, FiImage,
  FiExternalLink, FiBriefcase, FiCamera, FiStar,
  FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiLinkedin,
  FiAlertCircle, FiRefreshCw, FiEdit, FiMail as FiMailIcon
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import "tailwindcss";

const SchoolProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [school, setSchool] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    const [isRedirecting, setIsRedirecting] = useState(false);

    // Function to find school by email
    const findSchoolByEmail = async (email) => {
        try {
            console.log('🔍 Looking for school with email:', email);
            const response = await schoolApi.getSchools();
            console.log('📡 All schools response:', response);
            
            if (response.success && response.data) {
                let schools = [];
                if (Array.isArray(response.data)) {
                    schools = response.data;
                } else if (typeof response.data === 'object') {
                    schools = Object.keys(response.data).map(key => ({
                        id: key,
                        ...response.data[key]
                    }));
                }
                
                console.log('📚 Total schools found:', schools.length);
                
                const foundSchool = schools.find(s => 
                    s.email === email || 
                    s.email?.toLowerCase() === email?.toLowerCase()
                );
                
                if (foundSchool) {
                    console.log('✅ Found school by email:', foundSchool);
                    return foundSchool;
                } else {
                    console.log('❌ No school found with email:', email);
                }
            }
            return null;
        } catch (error) {
            console.error('Error finding school by email:', error);
            return null;
        }
    };

    // Function to fetch school by ID or email
    const fetchSchoolByIdOrEmail = async (schoolId, email) => {
        try {
            console.log('📡 Trying to fetch school by ID:', schoolId);
            const response = await schoolApi.getSchool(schoolId);
            console.log('📡 API Response:', response);
            
            if (response.success && response.data) {
                let schoolData = response.data;
                
                if (response.data[schoolId]) {
                    schoolData = response.data[schoolId];
                } else if (Array.isArray(response.data)) {
                    schoolData = response.data.find(s => s.id === schoolId || s.id === parseInt(schoolId));
                }
                
                if (schoolData) {
                    console.log('✅ School found by ID:', schoolData);
                    return schoolData;
                }
            }
            
            if (email) {
                console.log('⚠️ School not found by ID, trying to find by email:', email);
                const foundSchool = await findSchoolByEmail(email);
                
                if (foundSchool) {
                    const correctId = foundSchool.id || foundSchool._id;
                    if (correctId && correctId !== schoolId) {
                        console.log('🔄 Redirecting to correct school ID:', correctId);
                        setIsRedirecting(true);
                        navigate(`/school-profile/${correctId}`, { replace: true });
                        return null;
                    }
                    return foundSchool;
                }
            }
            
            return null;
        } catch (error) {
            console.error('Error in fetchSchoolByIdOrEmail:', error);
            return null;
        }
    };

    useEffect(() => {
        const fetchSchool = async () => {
            try {
                setIsLoading(true);
                setError('');
                setIsRedirecting(false);
                
                console.log('🔍 Fetching school with ID:', id);
                
                const userEmail = localStorage.getItem('userEmail');
                console.log('📧 User email from localStorage:', userEmail);
                
                const storedSchoolData = localStorage.getItem('schoolData');
                let schoolData = null;
                
                if (storedSchoolData) {
                    try {
                        const parsedData = JSON.parse(storedSchoolData);
                        if (parsedData && parsedData.id === id) {
                            console.log('📦 Using school data from localStorage');
                            schoolData = parsedData;
                        }
                    } catch (e) {
                        console.log('Error parsing stored school data:', e);
                    }
                }
                
                if (!schoolData) {
                    schoolData = await fetchSchoolByIdOrEmail(id, userEmail);
                }
                
                if (schoolData && !isRedirecting) {
                    console.log('✅ School found:', schoolData);
                    
                    localStorage.setItem('schoolData', JSON.stringify(schoolData));
                    
                    setSchool({
                        id: schoolData.id || id,
                        name: schoolData.name || '',
                        tagline: schoolData.tagline || '',
                        typeOfSchool: schoolData.typeOfSchool || '',
                        affiliation: schoolData.affiliation || '',
                        grade: schoolData.grade || '',
                        ageForAdmission: schoolData.ageForAdmission || '',
                        language: schoolData.language || '',
                        establishmentYear: schoolData.establishmentYear || '',
                        about: schoolData.about || '',
                        facilities: Array.isArray(schoolData.facilities) ? schoolData.facilities : [],
                        totalAnnualFee: schoolData.totalAnnualFee || '',
                        admissionFee: schoolData.admissionFee || '',
                        tuitionFee: schoolData.tuitionFee || '',
                        transportFee: schoolData.transportFee || '',
                        booksUniformsFee: schoolData.booksUniformsFee || '',
                        address: schoolData.address || '',
                        city: schoolData.city || '',
                        state: schoolData.state || '',
                        pincode: schoolData.pincode || '',
                        phone: schoolData.phone || '',
                        email: schoolData.email || '',
                        website: schoolData.website || '',
                        socialMedia: schoolData.socialMedia || { 
                            facebook: '', 
                            twitter: '', 
                            instagram: '',
                            youtube: '',
                            linkedin: ''
                        },
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
                        hostel: schoolData.hostel || '',
                        sports: schoolData.sports || '',
                        admissionLink: schoolData.admissionLink || '',
                        admissionProcess: schoolData.admissionProcess || '',
                        schoolImage: schoolData.schoolImage || '',
                        photos: Array.isArray(schoolData.photos) ? schoolData.photos : [],
                        studentStrength: schoolData.studentStrength || '',
                        teacherStrength: schoolData.teacherStrength || '',
                        studentTeacherRatio: schoolData.studentTeacherRatio || '',
                        principalName: schoolData.principalName || '',
                        contactPerson: schoolData.contactPerson || '',
                        alternatePhone: schoolData.alternatePhone || '',
                        officeHours: schoolData.officeHours || '',
                        rating: schoolData.rating || '',
                        reviews: schoolData.reviews || '',
                        viewCount: schoolData.viewCount || ''
                    });
                } else if (!isRedirecting) {
                    console.log('❌ No school data found');
                    setError('School profile not found. Please contact admin.');
                }
            } catch (error) {
                console.error('❌ Error fetching school:', error);
                setError('Failed to load school profile');
            } finally {
                setIsLoading(false);
            }
        };
        
        if (id) {
            fetchSchool();
        } else {
            setError('Invalid school ID');
            setIsLoading(false);
        }
    }, [id, retryCount]);

    // Function to go back to dashboard
    const goToDashboard = () => {
        navigate('/dashboard');
    };

    // Function to try again
    const retryFetch = () => {
        setRetryCount(prev => prev + 1);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading school profile...</p>
                </div>
            </div>
        );
    }

    if (isRedirecting) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Redirecting to correct profile...</p>
                </div>
            </div>
        );
    }

    if (error || !school) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                    <div className="text-6xl mb-4 flex justify-center">
                        <FiAlertCircle className="text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Not Found</h2>
                    <p className="text-gray-600 mb-2">{error || 'Your school profile could not be found.'}</p>
                    <p className="text-sm text-gray-400 mb-6 break-all">ID: {id}</p>
                    
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

    // Tabs configuration
    const tabs = [
        { id: 'overview', label: 'Overview', icon: FiInfo },
        { id: 'academics', label: 'Academics', icon: FiBookOpen },
        { id: 'infrastructure', label: 'Infrastructure', icon: FiHome },
        { id: 'gallery', label: 'Gallery', icon: FiImage },
        { id: 'admission', label: 'Admission', icon: FiCheckCircle },
    ];

    // Render Overview Tab
    const renderOverview = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Edit Note Banner */}
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

            {/* About Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FiInfo className="text-orange-500" />
                    About {school.name}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                    {school.about || `${school.name} is a premier educational institution established in ${school.establishmentYear}. 
                    The school is affiliated with ${school.affiliation} and offers education from ${school.grade}.`}
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {school.establishmentYear && (
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                        <div className="text-2xl font-bold text-orange-600">{school.establishmentYear}</div>
                        <div className="text-sm text-gray-500">Established</div>
                    </div>
                )}
                {school.studentStrength && (
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                        <div className="text-2xl font-bold text-orange-600">{school.studentStrength}</div>
                        <div className="text-sm text-gray-500">Students</div>
                    </div>
                )}
                {school.teacherStrength && (
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                        <div className="text-2xl font-bold text-orange-600">{school.teacherStrength}</div>
                        <div className="text-sm text-gray-500">Teachers</div>
                    </div>
                )}
                {school.studentTeacherRatio && (
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                        <div className="text-2xl font-bold text-orange-600">{school.studentTeacherRatio}</div>
                        <div className="text-sm text-gray-500">Student-Teacher Ratio</div>
                    </div>
                )}
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                        <FiMapPin className="text-orange-500 mt-1 flex-shrink-0" />
                        <div>
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="text-gray-800">
                                {school.address}, {school.city}, {school.state} - {school.pincode}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <FiPhone className="text-orange-500 mt-1 flex-shrink-0" />
                        <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="text-gray-800">{school.phone}</p>
                            {school.alternatePhone && (
                                <p className="text-gray-600 text-sm">{school.alternatePhone} (Alternate)</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <FiMail className="text-orange-500 mt-1 flex-shrink-0" />
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="text-gray-800">{school.email}</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <FiGlobe className="text-orange-500 mt-1 flex-shrink-0" />
                        <div>
                            <p className="text-sm text-gray-500">Website</p>
                            {school.website ? (
                                <a 
                                    href={school.website} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-blue-600 hover:underline flex items-center gap-1"
                                >
                                    {school.website}
                                    <FiExternalLink className="text-xs" />
                                </a>
                            ) : (
                                <p className="text-gray-800">N/A</p>
                            )}
                        </div>
                    </div>
                    {school.principalName && (
                        <div className="flex items-start space-x-3">
                            <FiUsers className="text-orange-500 mt-1 flex-shrink-0" />
                            <div>
                                <p className="text-sm text-gray-500">Principal</p>
                                <p className="text-gray-800">{school.principalName}</p>
                            </div>
                        </div>
                    )}
                    {school.officeHours && (
                        <div className="flex items-start space-x-3">
                            <FiClock className="text-orange-500 mt-1 flex-shrink-0" />
                            <div>
                                <p className="text-sm text-gray-500">Office Hours</p>
                                <p className="text-gray-800">{school.officeHours}</p>
                            </div>
                        </div>
                    )}
                    {school.contactPerson && (
                        <div className="flex items-start space-x-3">
                            <FiBriefcase className="text-orange-500 mt-1 flex-shrink-0" />
                            <div>
                                <p className="text-sm text-gray-500">Contact Person</p>
                                <p className="text-gray-800">{school.contactPerson}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Social Media */}
            {Object.values(school.socialMedia).some(v => v) && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Social Media</h3>
                    <div className="flex flex-wrap gap-3">
                        {school.socialMedia.facebook && (
                            <a 
                                href={school.socialMedia.facebook} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-center gap-2 px-4 py-2 bg-[#1877f2] text-white rounded-lg hover:opacity-90 transition"
                            >
                                <FiFacebook /> Facebook
                            </a>
                        )}
                        {school.socialMedia.twitter && (
                            <a 
                                href={school.socialMedia.twitter} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-center gap-2 px-4 py-2 bg-[#1da1f2] text-white rounded-lg hover:opacity-90 transition"
                            >
                                <FiTwitter /> Twitter
                            </a>
                        )}
                        {school.socialMedia.instagram && (
                            <a 
                                href={school.socialMedia.instagram} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white rounded-lg hover:opacity-90 transition"
                            >
                                <FiInstagram /> Instagram
                            </a>
                        )}
                        {school.socialMedia.youtube && (
                            <a 
                                href={school.socialMedia.youtube} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-center gap-2 px-4 py-2 bg-[#ff0000] text-white rounded-lg hover:opacity-90 transition"
                            >
                                <FiYoutube /> YouTube
                            </a>
                        )}
                        {school.socialMedia.linkedin && (
                            <a 
                                href={school.socialMedia.linkedin} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-center gap-2 px-4 py-2 bg-[#0a66c2] text-white rounded-lg hover:opacity-90 transition"
                            >
                                <FiLinkedin /> LinkedIn
                            </a>
                        )}
                    </div>
                </div>
            )}

            {/* Map */}
            {school.googleMapsEmbedUrl && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Location</h3>
                    <iframe
                        src={school.googleMapsEmbedUrl}
                        width="100%"
                        height="350"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        className="rounded-lg"
                        title="School Location"
                    ></iframe>
                </div>
            )}
        </motion.div>
    );

    // Render Academics Tab
    const renderAcademics = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FiBookOpen className="text-orange-500" />
                    Academic Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {school.typeOfSchool && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">Type of School</p>
                            <p className="text-gray-800 font-medium">{school.typeOfSchool}</p>
                        </div>
                    )}
                    {school.affiliation && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">Affiliation</p>
                            <p className="text-gray-800 font-medium">{school.affiliation}</p>
                        </div>
                    )}
                    {school.grade && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">Grades Offered</p>
                            <p className="text-gray-800 font-medium">{school.grade}</p>
                        </div>
                    )}
                    {school.ageForAdmission && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">Age for Admission</p>
                            <p className="text-gray-800 font-medium">{school.ageForAdmission}</p>
                        </div>
                    )}
                    {school.language && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">Medium of Instruction</p>
                            <p className="text-gray-800 font-medium">{school.language}</p>
                        </div>
                    )}
                    {school.studentTeacherRatio && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">Student-Teacher Ratio</p>
                            <p className="text-gray-800 font-medium">{school.studentTeacherRatio}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Facilities */}
            {school.facilities && school.facilities.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FiAward className="text-orange-500" />
                        Facilities
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {school.facilities.map((facility, index) => (
                            <div key={index} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                                <FiCheckCircle className="text-green-500 flex-shrink-0" />
                                <span className="text-gray-700">{facility}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Fee Structure */}
            {(school.totalAnnualFee || school.admissionFee || school.tuitionFee || school.transportFee || school.booksUniformsFee) && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Fee Structure</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {school.totalAnnualFee && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Total Annual Fee</p>
                                <p className="text-gray-800 font-medium text-lg text-orange-600">{school.totalAnnualFee}</p>
                            </div>
                        )}
                        {school.admissionFee && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Admission Fee</p>
                                <p className="text-gray-800 font-medium">{school.admissionFee}</p>
                            </div>
                        )}
                        {school.tuitionFee && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Tuition Fee</p>
                                <p className="text-gray-800 font-medium">{school.tuitionFee}</p>
                            </div>
                        )}
                        {school.transportFee && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Transport Fee</p>
                                <p className="text-gray-800 font-medium">{school.transportFee}</p>
                            </div>
                        )}
                        {school.booksUniformsFee && (
                            <div className="p-4 bg-gray-50 rounded-lg col-span-1 md:col-span-2">
                                <p className="text-sm text-gray-500">Books & Uniforms Fee</p>
                                <p className="text-gray-800 font-medium">{school.booksUniformsFee}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </motion.div>
    );

    // Render Infrastructure Tab
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

        const hasInfrastructure = infrastructureItems.some(item => school[item.key]);

        if (!hasInfrastructure) {
            return (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center"
                >
                    <p className="text-gray-500">No infrastructure details available</p>
                </motion.div>
            );
        }

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FiHome className="text-orange-500" />
                        Campus Infrastructure
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {infrastructureItems.map((item) => {
                            if (!school[item.key]) return null;
                            const value = school[item.key];
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

    // Render Gallery Tab
    const renderGallery = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Main Image */}
            {school.schoolImage && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FiCamera className="text-orange-500" />
                        School Image
                    </h3>
                    <div className="relative overflow-hidden rounded-lg max-w-2xl mx-auto">
                        <img
                            src={school.schoolImage}
                            alt={school.name}
                            className="w-full h-auto object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                            onClick={() => setSelectedPhoto(school.schoolImage)}
                        />
                    </div>
                </div>
            )}

            {/* Gallery Images */}
            {school.photos && school.photos.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FiImage className="text-orange-500" />
                        Gallery ({school.photos.length} photos)
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {school.photos.map((photo, index) => (
                            <motion.div
                                key={index}
                                className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
                                whileHover={{ scale: 1.05 }}
                                onClick={() => setSelectedPhoto(photo)}
                            >
                                <img
                                    src={photo}
                                    alt={`Gallery ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <FiCamera className="text-white text-2xl" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Lightbox */}
            {selectedPhoto && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedPhoto(null)}
                >
                    <img
                        src={selectedPhoto}
                        alt="Full size"
                        className="max-w-full max-h-full object-contain"
                    />
                    <button
                        className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors"
                        onClick={() => setSelectedPhoto(null)}
                    >
                        ×
                    </button>
                </div>
            )}
        </motion.div>
    );

    // Render Admission Tab
    const renderAdmission = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FiCheckCircle className="text-orange-500" />
                    Admission Information
                </h3>
                
                {school.admissionLink && (
                    <div className="mb-6">
                        <p className="text-sm text-gray-500">Application Link</p>
                        <p className="text-gray-800 break-all">{school.admissionLink}</p>
                    </div>
                )}

                {school.admissionProcess && (
                    <div>
                        <p className="text-sm text-gray-500 mb-2">Admission Process</p>
                        <div className="prose max-w-none">
                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                {school.admissionProcess}
                            </p>
                        </div>
                    </div>
                )}

                {/* Admission Contact Info */}
                {(school.phone || school.email || school.principalName || school.contactPerson || school.officeHours) && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-gray-800 mb-3">Admission Contact</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {school.principalName && (
                                <div>
                                    <p className="text-sm text-gray-500">Principal</p>
                                    <p className="text-gray-800 font-medium">{school.principalName}</p>
                                </div>
                            )}
                            {school.contactPerson && (
                                <div>
                                    <p className="text-sm text-gray-500">Contact Person</p>
                                    <p className="text-gray-800 font-medium">{school.contactPerson}</p>
                                </div>
                            )}
                            {(school.phone || school.alternatePhone) && (
                                <div>
                                    <p className="text-sm text-gray-500">Contact Number</p>
                                    <p className="text-gray-800 font-medium">{school.phone}</p>
                                    {school.alternatePhone && (
                                        <p className="text-gray-600 text-sm">{school.alternatePhone} (Alternate)</p>
                                    )}
                                </div>
                            )}
                            {school.email && (
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="text-gray-800 font-medium">{school.email}</p>
                                </div>
                            )}
                            {school.officeHours && (
                                <div>
                                    <p className="text-sm text-gray-500">Office Hours</p>
                                    <p className="text-gray-800 font-medium">{school.officeHours}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );

    const tabContent = {
        overview: renderOverview,
        academics: renderAcademics,
        infrastructure: renderInfrastructure,
        gallery: renderGallery,
        admission: renderAdmission,
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-30 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
                    >
                        <FiChevronLeft className="text-2xl" />
                        <span>Dashboard</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                            <FiEdit className="text-orange-500" />
                            View Only
                        </span>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative">
                <div className="relative h-[250px] md:h-[350px] w-full overflow-hidden">
                    {school.schoolImage ? (
                        <>
                            <img
                                src={school.schoolImage}
                                alt={school.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent"></div>
                        </>
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-orange-400 to-amber-500"></div>
                    )}
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="max-w-7xl mx-auto"
                        >
                            <h1 className="text-3xl md:text-5xl font-bold mb-2">{school.name}</h1>
                            {school.tagline && (
                                <p className="text-lg text-white/80 mb-3">{school.tagline}</p>
                            )}
                            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-white/80">
                                {school.city && (
                                    <span className="flex items-center gap-1">
                                        <FiMapPin className="text-orange-300" />
                                        {school.city}{school.state ? `, ${school.state}` : ''}
                                    </span>
                                )}
                                {school.establishmentYear && (
                                    <span className="flex items-center gap-1">
                                        <FiCalendar className="text-orange-300" />
                                        Est. {school.establishmentYear}
                                    </span>
                                )}
                                {school.affiliation && (
                                    <span className="flex items-center gap-1">
                                        <FiAward className="text-orange-300" />
                                        {school.affiliation}
                                    </span>
                                )}
                                {school.typeOfSchool && (
                                    <span className="flex items-center gap-1">
                                        <FiBookOpen className="text-orange-300" />
                                        {school.typeOfSchool}
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Tabs Navigation */}
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

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2">
                        {tabContent[activeTab] && tabContent[activeTab]()}
                    </div>

                    {/* Sidebar - Quick Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-[200px]">
                            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <FiInfo className="text-orange-500" />
                                Quick Info
                            </h4>
                            <div className="space-y-3">
                                {school.typeOfSchool && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Type</span>
                                        <span className="text-gray-800 font-medium">{school.typeOfSchool}</span>
                                    </div>
                                )}
                                {school.affiliation && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Affiliation</span>
                                        <span className="text-gray-800 font-medium">{school.affiliation}</span>
                                    </div>
                                )}
                                {school.grade && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Grades</span>
                                        <span className="text-gray-800 font-medium">{school.grade}</span>
                                    </div>
                                )}
                                {school.language && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Medium</span>
                                        <span className="text-gray-800 font-medium">{school.language}</span>
                                    </div>
                                )}
                                {school.studentStrength && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Students</span>
                                        <span className="text-gray-800 font-medium">{school.studentStrength}</span>
                                    </div>
                                )}
                                {school.teacherStrength && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Teachers</span>
                                        <span className="text-gray-800 font-medium">{school.teacherStrength}</span>
                                    </div>
                                )}
                                {school.studentTeacherRatio && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Student-Teacher</span>
                                        <span className="text-gray-800 font-medium">{school.studentTeacherRatio}</span>
                                    </div>
                                )}
                                {school.totalAnnualFee && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Annual Fee</span>
                                        <span className="text-gray-800 font-medium text-orange-600">{school.totalAnnualFee}</span>
                                    </div>
                                )}
                            </div>

                            <hr className="my-4" />

                            {/* Contact Admin Section */}
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                <p className="text-sm text-blue-800 font-medium mb-2">Need to update information?</p>
                                <p className="text-xs text-blue-600 mb-2">Contact admin to request changes to your profile.</p>
                                <a
                                    href="mailto:support@raynott.com"
                                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2"
                                >
                                    <FiMailIcon className="text-blue-500" />
                                    support@raynott.com
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-white border-t border-gray-200 mt-12 py-6">
                <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} {school.name}. All rights reserved.</p>
                    <p className="mt-1">This is a view-only profile. For updates, contact admin.</p>
                </div>
            </div>

            {/* CSS for hiding scrollbar */}
            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default SchoolProfile;