// InstitutionDetails.jsx - Fixed version
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowLeft, FiStar, FiMapPin, FiPhone, FiMail, FiGlobe,
  FiCalendar, FiDollarSign, FiUsers, FiBookOpen, FiAward,
  FiCheckCircle, FiClock, FiInfo, FiHeart, FiShare2,
  FiExternalLink, FiLoader, FiMessageSquare, FiThumbsUp,
  FiThumbsDown, FiUser, FiTrendingUp, FiCamera, FiX,
  FiGrid, FiList, FiImage, FiVideo, FiFileText, FiLink
} from 'react-icons/fi';
import schoolApi from '../services/schoolApi';
import collegeApi from '../services/collegeApi';
import puCollegeApi from '../services/pucollegeApi';
import TuitionCoachingApi from '../services/TuitionCoachingApi';
import teacherApi from '../services/TeacherApi';

const InstitutionDetails = () => {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const [institution, setInstitution] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, text: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Load bookmarks from localStorage
  useEffect(() => {
    const loadBookmarks = () => {
      try {
        const stored = localStorage.getItem('parentBookmarks');
        if (stored) {
          const bookmarks = JSON.parse(stored);
          setIsBookmarked(bookmarks.includes(id));
        }
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      }
    };
    loadBookmarks();
  }, [id]);

  // Fetch institution details
  const fetchInstitutionDetails = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let response = null;
      console.log(`🔍 Fetching ${type} details for ID: ${id}`);

      // Fetch data based on institution type
      switch(type) {
        case 'Schools':
          response = await schoolApi.getSchool(id);
          break;
        case 'Colleges':
          response = await collegeApi.getCollege(id);
          break;
        case 'PU College':
          response = await puCollegeApi.getPUCollege(id);
          break;
        case 'Coaching/Tuition':
          response = await TuitionCoachingApi.getTuitionCoaching(id);
          break;
        case 'All Teachers':
          response = await teacherApi.getTeacher(id);
          break;
        default:
          throw new Error('Invalid institution type');
      }

      console.log(`📦 ${type} details response:`, response);

      // Extract data from response
      let data = null;
      if (response && response.data) {
        data = response.data;
      } else if (response && response.success) {
        data = response.data || response;
      } else {
        data = response;
      }

      if (!data) {
        throw new Error('No data found');
      }

      // Transform data based on type
      const transformedData = transformDetailsData(data, type);
      setInstitution(transformedData);

      // Fetch reviews if available
      await fetchReviews(type, id);

    } catch (error) {
      console.error('❌ Error fetching institution details:', error);
      setError(error.message || 'Failed to load institution details');
    } finally {
      setIsLoading(false);
    }
  }, [id, type]);

  // Transform details data
  const transformDetailsData = (data, type) => {
    // Helper function to ensure data is array
    const ensureArray = (value) => {
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') {
        // Try to parse if it's a JSON string
        try {
          const parsed = JSON.parse(value);
          return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          // If it's a comma-separated string, split it
          if (value.includes(',')) {
            return value.split(',').map(item => item.trim()).filter(item => item);
          }
          return [];
        }
      }
      return [];
    };

    // Helper function to ensure string
    const ensureString = (value) => {
      if (typeof value === 'string') return value;
      if (typeof value === 'number') return String(value);
      if (Array.isArray(value)) return value.join(', ');
      if (value && typeof value === 'object') {
        try {
          return JSON.stringify(value);
        } catch (e) {
          return String(value);
        }
      }
      return 'Not specified';
    };

    // Common fields
    const baseData = {
      id: data.id || data._id || id,
      name: data.name || data.schoolName || data.collegeName || data.centerName || data.teacherName || 'Institution',
      type: type,
      description: data.description || data.about || data.overview || '',
      rating: parseFloat(data.rating) || 4.5,
      reviewCount: parseInt(data.reviewCount) || 0,
      location: data.city || data.location || data.address || 'Location not specified',
      fullAddress: data.address || data.location || '',
      phone: data.phone || data.contactNumber || '',
      email: data.email || data.contactEmail || '',
      website: data.website || '',
      image: data.schoolImage || data.collegeImage || data.centerImage || data.profileImage || data.image || '',
      facilities: ensureArray(data.facilities || data.amenities || data.features),
      established: data.establishmentYear || data.established || '',
      createdAt: data.createdAt || '',
      updatedAt: data.updatedAt || '',
      socialMedia: data.socialMedia || {},
      googleMapsEmbedUrl: data.googleMapsEmbedUrl || '',
      photos: ensureArray(data.photos || []),
    };

    // Type-specific fields with array safety
    let typeSpecificData = {};

    switch(type) {
      case 'Schools':
        typeSpecificData = {
          typeOfSchool: ensureString(data.typeOfSchool),
          affiliation: ensureString(data.affiliation),
          affiliationNumber: ensureString(data.affiliationNumber),
          grade: ensureString(data.grade),
          ageForAdmission: ensureString(data.ageForAdmission),
          language: ensureString(data.language),
          totalAnnualFee: ensureString(data.totalAnnualFee),
          admissionFee: ensureString(data.admissionFee),
          tuitionFee: ensureString(data.tuitionFee),
          transportFee: ensureString(data.transportFee),
          booksUniformsFee: ensureString(data.booksUniformsFee),
          campusSize: ensureString(data.campusSize),
          classrooms: ensureString(data.classrooms),
          laboratories: ensureString(data.laboratories),
          library: ensureString(data.library),
          playground: ensureString(data.playground),
          auditorium: ensureString(data.auditorium),
          smartBoards: ensureString(data.smartBoards),
          cctv: ensureString(data.cctv),
          medicalRoom: ensureString(data.medicalRoom),
          wifi: ensureString(data.wifi),
          admissionLink: ensureString(data.admissionLink),
          admissionProcess: ensureString(data.admissionProcess),
        };
        break;

      case 'Colleges':
        typeSpecificData = {
          typeOfCollege: ensureString(data.typeOfCollege),
          affiliation: ensureString(data.affiliation),
          affiliationNumber: ensureString(data.affiliationNumber),
          accreditation: ensureString(data.accreditation),
          coursesOffered: ensureArray(data.coursesOffered),
          duration: ensureString(data.duration),
          eligibilityCriteria: ensureString(data.eligibilityCriteria),
          entranceExams: ensureArray(data.entranceExams),
          language: ensureString(data.language),
          totalAnnualFee: ensureString(data.totalAnnualFee),
          admissionFee: ensureString(data.admissionFee),
          tuitionFee: ensureString(data.tuitionFee),
          hostelFee: ensureString(data.hostelFee),
          libraryFee: ensureString(data.libraryFee),
          laboratoryFee: ensureString(data.laboratoryFee),
          otherFees: ensureString(data.otherFees),
          campusSize: ensureString(data.campusSize),
          classrooms: ensureString(data.classrooms),
          laboratories: ensureString(data.laboratories),
          library: ensureString(data.library),
          hostel: ensureString(data.hostel),
          playground: ensureString(data.playground),
          auditorium: ensureString(data.auditorium),
          smartBoards: ensureString(data.smartBoards),
          cctv: ensureString(data.cctv),
          medicalRoom: ensureString(data.medicalRoom),
          wifi: ensureString(data.wifi),
          admissionLink: ensureString(data.admissionLink),
          admissionProcess: ensureString(data.admissionProcess),
          placementStatistics: data.placementStatistics || {},
          topRecruiters: ensureArray(data.topRecruiters),
        };
        break;

      case 'PU College':
        typeSpecificData = {
          typeOfCollege: ensureString(data.typeOfCollege),
          affiliationNumber: ensureString(data.affiliationNumber),
          board: ensureString(data.board),
          streams: ensureArray(data.streams),
          subjects: ensureArray(data.subjects),
          programDuration: ensureString(data.programDuration),
          language: ensureString(data.language),
          accreditation: ensureString(data.accreditation),
          studentTeacherRatio: ensureString(data.studentTeacherRatio),
          competitiveExamPrep: ensureString(data.competitiveExamPrep),
          totalAnnualFee: ensureString(data.totalAnnualFee),
          admissionFee: ensureString(data.admissionFee),
          tuitionFee: ensureString(data.tuitionFee),
          transportFee: ensureString(data.transportFee),
          booksUniformsFee: ensureString(data.booksUniformsFee),
          campusSize: ensureString(data.campusSize),
          classrooms: ensureString(data.classrooms),
          laboratories: ensureString(data.laboratories),
          library: ensureString(data.library),
          hostel: ensureString(data.hostel),
          playground: ensureString(data.playground),
          auditorium: ensureString(data.auditorium),
          smartBoards: ensureString(data.smartBoards),
          cctv: ensureString(data.cctv),
          medicalRoom: ensureString(data.medicalRoom),
          wifi: ensureString(data.wifi),
          admissionLink: ensureString(data.admissionLink),
          admissionProcess: ensureString(data.admissionProcess),
        };
        break;

      case 'Coaching/Tuition':
        typeSpecificData = {
          typeOfCoaching: ensureString(data.typeOfCoaching),
          classes: ensureArray(data.classes),
          subjects: ensureArray(data.subjects),
          batchSize: ensureString(data.batchSize),
          classDuration: ensureString(data.classDuration),
          language: ensureString(data.language),
          establishmentYear: ensureString(data.establishmentYear),
          faculty: ensureString(data.faculty),
          studyMaterial: ensureString(data.studyMaterial),
          tests: ensureString(data.tests),
          doubtSessions: ensureString(data.doubtSessions),
          infrastructure: ensureString(data.infrastructure),
          demoClass: ensureString(data.demoClass),
          flexibleTimings: ensureString(data.flexibleTimings),
          totalAnnualFee: ensureString(data.totalAnnualFee),
          admissionFee: ensureString(data.admissionFee),
          tuitionFee: ensureString(data.tuitionFee),
          transportFee: ensureString(data.transportFee),
          booksUniformsFee: ensureString(data.booksUniformsFee),
          classrooms: ensureString(data.classrooms),
          laboratories: ensureString(data.laboratories),
          library: ensureString(data.library),
          smartBoards: ensureString(data.smartBoards),
          cctv: ensureString(data.cctv),
          medicalRoom: ensureString(data.medicalRoom),
          wifi: ensureString(data.wifi),
          admissionLink: ensureString(data.admissionLink),
          admissionProcess: ensureString(data.admissionProcess),
        };
        break;

      case 'All Teachers':
        typeSpecificData = {
          institutionType: ensureString(data.institutionType),
          subjects: ensureString(data.subjects),
          qualification: ensureString(data.qualification),
          experience: ensureString(data.experience),
          teachingMode: ensureString(data.teachingMode),
          languages: ensureString(data.languages),
          specialization: ensureString(data.specialization),
          certifications: ensureString(data.certifications),
          about: ensureString(data.about),
          availability: ensureString(data.availability),
          hourlyRate: ensureString(data.hourlyRate),
          monthlyPackage: ensureString(data.monthlyPackage),
          examPreparation: ensureString(data.examPreparation),
          demoFee: ensureString(data.demoFee),
          teachingApproach: ensureString(data.teachingApproach),
          studyMaterials: ensureString(data.studyMaterials),
          sessionDuration: ensureString(data.sessionDuration),
          studentLevel: ensureString(data.studentLevel),
          classSize: ensureString(data.classSize),
          onlinePlatform: ensureString(data.onlinePlatform),
          progressReports: ensureString(data.progressReports),
          performanceTracking: ensureString(data.performanceTracking),
          teachingProcess: ensureString(data.teachingProcess),
        };
        break;

      default:
        typeSpecificData = {};
    }

    return { ...baseData, ...typeSpecificData };
  };

  // Fetch reviews
  const fetchReviews = async (type, id) => {
    setIsLoadingReviews(true);
    try {
      let response = null;
      
      switch(type) {
        case 'Schools':
          response = await schoolApi.getReviews(id);
          break;
        case 'Colleges':
          response = await collegeApi.getReviews(id);
          break;
        case 'PU College':
          response = await puCollegeApi.getReviews(id);
          break;
        case 'Coaching/Tuition':
          response = await TuitionCoachingApi.getReviews(id);
          break;
        case 'All Teachers':
          // Teachers have separate endpoints for professional and personal
          break;
        default:
          break;
      }

      if (response && response.success) {
        setReviews(Array.isArray(response.data) ? response.data : []);
      } else if (response && response.data) {
        setReviews(Array.isArray(response.data) ? response.data : []);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  // Toggle bookmark
  const toggleBookmark = () => {
    try {
      const stored = localStorage.getItem('parentBookmarks');
      let bookmarks = stored ? JSON.parse(stored) : [];
      
      if (isBookmarked) {
        bookmarks = bookmarks.filter(b => b !== id);
      } else {
        bookmarks.push(id);
      }
      
      localStorage.setItem('parentBookmarks', JSON.stringify(bookmarks));
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  // Submit review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (newReview.rating === 0 || !newReview.text.trim()) {
      alert('Please provide both rating and review text');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const reviewData = {
        rating: newReview.rating,
        text: newReview.text,
        author: 'Parent',
      };

      let response = null;
      
      switch(type) {
        case 'Schools':
          response = await schoolApi.addReview(id, reviewData);
          break;
        case 'Colleges':
          response = await collegeApi.addReview(id, reviewData);
          break;
        case 'PU College':
          response = await puCollegeApi.addReview(id, reviewData);
          break;
        case 'Coaching/Tuition':
          response = await TuitionCoachingApi.addReview(id, reviewData);
          break;
        default:
          break;
      }

      if (response && response.success) {
        alert('Review submitted successfully!');
        setNewReview({ rating: 0, text: '' });
        await fetchReviews(type, id);
      } else {
        alert('Failed to submit review. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchInstitutionDetails();
  }, [fetchInstitutionDetails]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !institution) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiInfo className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Unable to load details</h3>
          <p className="text-gray-400 mb-4">{error || 'Institution not found'}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/20"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Render stars
  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={`w-4 h-4 ${
              star <= Math.floor(rating)
                ? 'text-yellow-400 fill-yellow-400'
                : star - 0.5 <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  // Render star selector for review
  const renderStarSelector = () => {
    return (
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setNewReview({ ...newReview, rating: star })}
            className="focus:outline-none"
          >
            <FiStar
              className={`w-8 h-8 ${
                star <= newReview.rating
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-600 hover:text-gray-400'
              } transition-colors`}
            />
          </button>
        ))}
      </div>
    );
  };

  // Overview Tab - FIXED with safe array checking
  const renderOverview = () => {
    // Ensure facilities is an array
    const facilities = Array.isArray(institution.facilities) ? institution.facilities : [];
    const hasFacilities = facilities.length > 0;

    return (
      <div className="space-y-6">
        {/* Description */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">About</h3>
          <p className="text-gray-300 leading-relaxed">
            {institution.description || 'No description available'}
          </p>
        </div>

        {/* Key Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-xs text-gray-400">Established</p>
            <p className="text-white font-medium">{institution.established || 'Not specified'}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-xs text-gray-400">Rating</p>
            <div className="flex items-center gap-2">
              <span className="text-white font-medium">{institution.rating.toFixed(1)}</span>
              {renderStars(institution.rating)}
              <span className="text-xs text-gray-400">({institution.reviewCount} reviews)</span>
            </div>
          </div>
        </div>

        {/* Facilities - FIXED with safe check */}
        {hasFacilities && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Facilities & Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {facilities.map((facility, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-white/5 rounded-full text-xs text-gray-300 border border-white/10"
                >
                  <FiCheckCircle className="inline w-3 h-3 text-green-400 mr-1.5" />
                  {facility}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Fee Structure */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Fee Structure</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {institution.totalAnnualFee && institution.totalAnnualFee !== 'Not specified' && (
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-xs text-gray-400">Total Annual Fee</p>
                <p className="text-xl font-bold text-orange-400">{institution.totalAnnualFee}</p>
              </div>
            )}
            {institution.admissionFee && institution.admissionFee !== 'Not specified' && (
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-xs text-gray-400">Admission Fee</p>
                <p className="text-white font-medium">{institution.admissionFee}</p>
              </div>
            )}
            {institution.tuitionFee && institution.tuitionFee !== 'Not specified' && (
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-xs text-gray-400">Tuition Fee</p>
                <p className="text-white font-medium">{institution.tuitionFee}</p>
              </div>
            )}
            {institution.transportFee && institution.transportFee !== 'Not specified' && (
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-xs text-gray-400">Transport Fee</p>
                <p className="text-white font-medium">{institution.transportFee}</p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Contact Information</h3>
          <div className="space-y-3">
            {institution.phone && (
              <div className="flex items-center gap-3 text-gray-300">
                <FiPhone className="w-5 h-5 text-orange-400" />
                <a href={`tel:${institution.phone}`} className="hover:text-orange-400 transition-colors">
                  {institution.phone}
                </a>
              </div>
            )}
            {institution.email && (
              <div className="flex items-center gap-3 text-gray-300">
                <FiMail className="w-5 h-5 text-orange-400" />
                <a href={`mailto:${institution.email}`} className="hover:text-orange-400 transition-colors">
                  {institution.email}
                </a>
              </div>
            )}
            {institution.website && (
              <div className="flex items-center gap-3 text-gray-300">
                <FiGlobe className="w-5 h-5 text-orange-400" />
                <a href={institution.website} target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">
                  {institution.website}
                </a>
              </div>
            )}
            {institution.fullAddress && (
              <div className="flex items-start gap-3 text-gray-300">
                <FiMapPin className="w-5 h-5 text-orange-400 mt-1" />
                <span>{institution.fullAddress}, {institution.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Google Maps */}
        {institution.googleMapsEmbedUrl && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Location</h3>
            <div className="rounded-xl overflow-hidden border border-white/10">
              <iframe
                src={institution.googleMapsEmbedUrl}
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location Map"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  // Type-specific details renderer with safe array checking
  const renderTypeSpecificDetails = () => {
    const details = [];
    
    switch(type) {
      case 'Schools':
        details.push(
          { label: 'Type of School', value: institution.typeOfSchool },
          { label: 'Affiliation', value: institution.affiliation },
          { label: 'Affiliation Number', value: institution.affiliationNumber },
          { label: 'Grades', value: institution.grade },
          { label: 'Age for Admission', value: institution.ageForAdmission },
          { label: 'Medium of Instruction', value: institution.language },
          { label: 'Campus Size', value: institution.campusSize },
          { label: 'Classrooms', value: institution.classrooms },
          { label: 'Laboratories', value: institution.laboratories },
          { label: 'Library', value: institution.library },
          { label: 'Playground', value: institution.playground },
          { label: 'Auditorium', value: institution.auditorium },
          { label: 'Smart Boards', value: institution.smartBoards },
          { label: 'CCTV', value: institution.cctv },
          { label: 'Medical Room', value: institution.medicalRoom },
          { label: 'WiFi', value: institution.wifi },
        );
        break;

      case 'Colleges':
        const courses = Array.isArray(institution.coursesOffered) ? institution.coursesOffered : [];
        const exams = Array.isArray(institution.entranceExams) ? institution.entranceExams : [];
        const recruiters = Array.isArray(institution.topRecruiters) ? institution.topRecruiters : [];
        
        details.push(
          { label: 'Type of College', value: institution.typeOfCollege },
          { label: 'Affiliation', value: institution.affiliation },
          { label: 'Accreditation', value: institution.accreditation },
          { label: 'Courses Offered', value: courses.length > 0 ? courses.join(', ') : 'Not specified' },
          { label: 'Duration', value: institution.duration },
          { label: 'Eligibility Criteria', value: institution.eligibilityCriteria },
          { label: 'Entrance Exams', value: exams.length > 0 ? exams.join(', ') : 'Not specified' },
          { label: 'Campus Size', value: institution.campusSize },
          { label: 'Hostel', value: institution.hostel },
          { label: 'Placement Statistics', value: institution.placementStatistics?.percentage || 'Not specified' },
          { label: 'Top Recruiters', value: recruiters.length > 0 ? recruiters.join(', ') : 'Not specified' },
        );
        break;

      case 'PU College':
        const streams = Array.isArray(institution.streams) ? institution.streams : [];
        const subjects = Array.isArray(institution.subjects) ? institution.subjects : [];
        
        details.push(
          { label: 'Type of College', value: institution.typeOfCollege },
          { label: 'Board', value: institution.board },
          { label: 'Streams', value: streams.length > 0 ? streams.join(', ') : 'Not specified' },
          { label: 'Subjects', value: subjects.length > 0 ? subjects.join(', ') : 'Not specified' },
          { label: 'Program Duration', value: institution.programDuration },
          { label: 'Accreditation', value: institution.accreditation },
          { label: 'Student-Teacher Ratio', value: institution.studentTeacherRatio },
          { label: 'Competitive Exam Prep', value: institution.competitiveExamPrep },
          { label: 'Campus Size', value: institution.campusSize },
        );
        break;

      case 'Coaching/Tuition':
        const classes = Array.isArray(institution.classes) ? institution.classes : [];
        const coachingSubjects = Array.isArray(institution.subjects) ? institution.subjects : [];
        
        details.push(
          { label: 'Type of Coaching', value: institution.typeOfCoaching },
          { label: 'Classes', value: classes.length > 0 ? classes.join(', ') : 'Not specified' },
          { label: 'Subjects', value: coachingSubjects.length > 0 ? coachingSubjects.join(', ') : 'Not specified' },
          { label: 'Batch Size', value: institution.batchSize },
          { label: 'Class Duration', value: institution.classDuration },
          { label: 'Faculty', value: institution.faculty },
          { label: 'Study Material', value: institution.studyMaterial },
          { label: 'Tests', value: institution.tests },
          { label: 'Doubt Sessions', value: institution.doubtSessions },
          { label: 'Demo Class', value: institution.demoClass },
          { label: 'Flexible Timings', value: institution.flexibleTimings },
        );
        break;

      case 'All Teachers':
        details.push(
          { label: 'Institution Type', value: institution.institutionType },
          { label: 'Subjects', value: institution.subjects },
          { label: 'Qualification', value: institution.qualification },
          { label: 'Experience', value: institution.experience },
          { label: 'Teaching Mode', value: institution.teachingMode },
          { label: 'Languages', value: institution.languages },
          { label: 'Specialization', value: institution.specialization },
          { label: 'Availability', value: institution.availability },
          { label: 'Hourly Rate', value: institution.hourlyRate },
          { label: 'Monthly Package', value: institution.monthlyPackage },
          { label: 'Session Duration', value: institution.sessionDuration },
          { label: 'Student Level', value: institution.studentLevel },
        );
        break;

      default:
        break;
    }

    const validDetails = details.filter(detail => 
      detail.value && 
      detail.value !== 'Not specified' && 
      detail.value !== '' &&
      detail.value !== '[]' &&
      !(Array.isArray(detail.value) && detail.value.length === 0)
    );

    if (validDetails.length === 0) {
      return (
        <div className="text-center py-8 text-gray-400">
          <FiInfo className="w-12 h-12 mx-auto mb-3 text-gray-600" />
          <p>No additional details available</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">Additional Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {validDetails.map((detail, index) => (
            <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-xs text-gray-400">{detail.label}</p>
              <p className="text-white font-medium mt-1">{detail.value}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Reviews Tab
  const renderReviews = () => (
    <div className="space-y-6">
      {/* Review Summary */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="text-center">
            <p className="text-4xl font-bold text-white">{institution.rating.toFixed(1)}</p>
            <div className="flex items-center justify-center mt-1">{renderStars(institution.rating)}</div>
            <p className="text-xs text-gray-400 mt-1">{institution.reviewCount} reviews</p>
          </div>
          <div className="flex-1">
            <p className="text-gray-300 text-sm">Overall rating based on {institution.reviewCount} reviews</p>
          </div>
        </div>
      </div>

      {/* Write a Review */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Write a Review</h3>
        <form onSubmit={handleSubmitReview}>
          <div className="mb-4">
            <label className="text-sm text-gray-400 block mb-2">Your Rating</label>
            {renderStarSelector()}
          </div>
          <div className="mb-4">
            <label className="text-sm text-gray-400 block mb-2">Your Review</label>
            <textarea
              value={newReview.text}
              onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
              placeholder="Share your experience..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              rows="4"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmittingReview}
            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmittingReview ? (
              <>
                <FiLoader className="inline w-4 h-4 animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              'Submit Review'
            )}
          </button>
        </form>
      </div>

      {/* Reviews List */}
      {isLoadingReviews ? (
        <div className="text-center py-8">
          <FiLoader className="w-8 h-8 text-orange-500 animate-spin mx-auto" />
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/5 rounded-xl p-5 border border-white/10"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white font-semibold text-sm">
                    {review.author?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-white font-medium">{review.author || 'Anonymous'}</p>
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                      <span className="text-xs text-gray-400">
                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recently'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 mt-3">{review.text}</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <FiMessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-600" />
          <p>No reviews yet. Be the first to review!</p>
        </div>
      )}
    </div>
  );

  // Photos Tab
  const renderPhotos = () => {
    const allPhotos = Array.isArray(institution.photos) ? [...institution.photos] : [];
    if (institution.image && !allPhotos.includes(institution.image)) {
      allPhotos.unshift(institution.image);
    }

    if (allPhotos.length === 0) {
      return (
        <div className="text-center py-12 text-gray-400">
          <FiImage className="w-12 h-12 mx-auto mb-3 text-gray-600" />
          <p>No photos available</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {allPhotos.map((photo, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedPhoto(photo)}
              className="relative aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-orange-500/30 transition-all"
            >
              <img
                src={photo}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=Photo+${index + 1}&background=FFA500&color=fff&size=400x400`;
                }}
              />
            </motion.button>
          ))}
        </div>
      </div>
    );
  };

  // Photo Modal
  const PhotoModal = ({ photo, onClose }) => {
    if (!photo) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all"
        >
          <FiX className="w-6 h-6 text-white" />
        </button>
        <motion.img
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          src={photo}
          alt="Full size"
          className="max-w-full max-h-[90vh] object-contain rounded-xl"
          onClick={(e) => e.stopPropagation()}
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=Photo&background=FFA500&color=fff&size=800x800`;
          }}
        />
      </motion.div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Header Image */}
        <div className="relative h-72 md:h-96">
          <img
            src={institution.image || (Array.isArray(institution.photos) && institution.photos.length > 0 ? institution.photos[0] : null) || `https://ui-avatars.com/api/?name=${encodeURIComponent(institution.name)}&background=FFA500&color=fff&size=800x400`}
            alt={institution.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(institution.name)}&background=FFA500&color=fff&size=800x400`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
          
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 p-2 bg-black/50 backdrop-blur-sm rounded-xl hover:bg-black/70 transition-all text-white"
          >
            <FiArrowLeft className="w-6 h-6" />
          </button>

          {/* Bookmark Button */}
          <button
            onClick={toggleBookmark}
            className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-xl hover:bg-black/70 transition-all"
          >
            <FiHeart className={`w-6 h-6 ${isBookmarked ? 'text-red-500 fill-red-500' : 'text-white'}`} />
          </button>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-10">
          <div className="bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
            {/* Header */}
            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <span className="text-xs text-orange-400 font-medium bg-orange-500/20 px-3 py-1 rounded-full">
                    {institution.type}
                  </span>
                  <h1 className="text-2xl md:text-3xl font-bold text-white mt-2">
                    {institution.name}
                  </h1>
                  <div className="flex items-center gap-4 mt-2 flex-wrap">
                    <div className="flex items-center gap-1">
                      <FiStar className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="text-white font-semibold">{institution.rating.toFixed(1)}</span>
                      <span className="text-gray-400 text-sm">({institution.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      <FiMapPin className="w-4 h-4" />
                      <span>{institution.location}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (institution.phone) {
                      window.location.href = `tel:${institution.phone}`;
                    }
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/20"
                >
                  Contact Now
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-white/10 px-6 md:px-8">
              <div className="flex gap-1 overflow-x-auto">
                {['overview', 'details', 'reviews', 'photos'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${
                      activeTab === tab
                        ? 'border-orange-500 text-white'
                        : 'border-transparent text-gray-400 hover:text-white hover:border-white/10'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6 md:p-8">
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'details' && renderTypeSpecificDetails()}
              {activeTab === 'reviews' && renderReviews()}
              {activeTab === 'photos' && renderPhotos()}
            </div>
          </div>
        </div>
      </div>

      {/* Photo Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <PhotoModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default InstitutionDetails;