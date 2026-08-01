import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft, FaFileAlt, FaSchool, FaUniversity, FaGraduationCap, 
  FaChalkboardTeacher, FaMapMarkerAlt, FaPhone, FaEnvelope, 
  FaGlobe, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaRupeeSign, 
  FaInfoCircle, FaSpinner, FaCheck, FaTimes, FaDownload, FaImage
} from 'react-icons/fa';
import { registerApi } from '../../services/RegisterApi';

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
          <h3 className="font-bold mb-2">Something went wrong</h3>
          <p>{this.state.error?.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const RegistrationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [registration, setRegistration] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        const response = await registerApi.getRegistrationById(id);

        // Handle different response formats
        let registrationData;
        if (response.success && response.data) {
          registrationData = response.data;
        } else if (response.data) {
          registrationData = response.data;
        } else if (response.registration) {
          registrationData = response.registration;
        } else {
          registrationData = response;
        }

        if (registrationData) {
          // Get the first image from photos array to use as main image if mainImage is not available
          const photosArray = Array.isArray(registrationData.photos) ? registrationData.photos : [];
          const mainImage = registrationData.mainImage || (photosArray.length > 0 ? photosArray[0] : '');

          // Parse JSON strings if needed
          const parseJsonField = (field) => {
            if (!field) return [];
            if (Array.isArray(field)) return field;
            if (typeof field === 'string') {
              try {
                const parsed = JSON.parse(field);
                return Array.isArray(parsed) ? parsed : [];
              } catch (e) {
                return [];
              }
            }
            return [];
          };

          const parseSocialMedia = (socialMedia) => {
            if (!socialMedia) return { facebook: '', twitter: '', instagram: '', linkedin: '' };
            if (typeof socialMedia === 'object') return socialMedia;
            if (typeof socialMedia === 'string') {
              try {
                return JSON.parse(socialMedia);
              } catch (e) {
                return { facebook: '', twitter: '', instagram: '', linkedin: '' };
              }
            }
            return { facebook: '', twitter: '', instagram: '', linkedin: '' };
          };

          // Normalize arrays and objects
          setRegistration({
            id: registrationData.id || id,
            name: registrationData.name || '',
            teacherName: registrationData.teacherName || '',
            institutionType: registrationData.institutionType || '',
            tagline: registrationData.tagline || '',
            establishmentYear: registrationData.establishmentYear || '',
            about: registrationData.about || '',
            status: registrationData.status || 'pending',
            submittedAt: registrationData.submittedAt || registrationData.createdAt || '',
            approvedAt: registrationData.approvedAt || '',
            rejectedAt: registrationData.rejectedAt || '',
            rejectionReason: registrationData.rejectionReason || '',
            adminNotes: registrationData.adminNotes || '',
            
            // Institution specific
            typeOfSchool: registrationData.typeOfSchool || '',
            affiliation: registrationData.affiliation || '',
            grade: registrationData.grade || '',
            ageForAdmission: registrationData.ageForAdmission || '',
            language: registrationData.language || '',
            studentStrength: registrationData.studentStrength || '',
            teacherStrength: registrationData.teacherStrength || '',
            studentTeacherRatio: registrationData.studentTeacherRatio || '',
            typeOfCollege: registrationData.typeOfCollege || '',
            universityAffiliation: registrationData.universityAffiliation || '',
            coursesOffered: parseJsonField(registrationData.coursesOffered),
            duration: registrationData.duration || '',
            accreditation: registrationData.accreditation || '',
            placementStatistics: registrationData.placementStatistics || '',
            departments: registrationData.departments || '',
            board: registrationData.board || '',
            streams: registrationData.streams || '',
            subjects: registrationData.subjects || '',
            programDuration: registrationData.programDuration || '',
            competitiveExamPrep: registrationData.competitiveExamPrep || '',
            typeOfCoaching: registrationData.typeOfCoaching || '',
            classes: registrationData.classes || '',
            batchSize: registrationData.batchSize || '',
            classDuration: registrationData.classDuration || '',
            faculty: registrationData.faculty || '',
            studyMaterial: registrationData.studyMaterial || '',
            tests: registrationData.tests || '',
            doubtSessions: registrationData.doubtSessions || '',
            infrastructure: registrationData.infrastructure || '',
            demoClass: registrationData.demoClass || '',
            flexibleTimings: registrationData.flexibleTimings || '',
            
            // Teacher specific
            teacherType: registrationData.teacherType || '',
            institutionName: registrationData.institutionName || '',
            institutionPosition: registrationData.institutionPosition || '',
            institutionExperience: registrationData.institutionExperience || '',
            qualifications: registrationData.qualifications || '',
            experience: registrationData.experience || '',
            teachingMode: registrationData.teachingMode || '',
            languages: registrationData.languages || '',
            specialization: registrationData.specialization || '',
            certifications: registrationData.certifications || '',
            availability: registrationData.availability || '',
            hourlyRate: registrationData.hourlyRate || '',
            monthlyPackage: registrationData.monthlyPackage || '',
            examPreparation: registrationData.examPreparation || '',
            demoFee: registrationData.demoFee || '',
            teachingApproach: registrationData.teachingApproach || '',
            studyMaterials: registrationData.studyMaterials || '',
            sessionDuration: registrationData.sessionDuration || '',
            studentLevel: registrationData.studentLevel || '',
            classSize: registrationData.classSize || '',
            onlinePlatform: registrationData.onlinePlatform || '',
            progressReports: registrationData.progressReports || '',
            performanceTracking: registrationData.performanceTracking || '',
            teachingProcess: registrationData.teachingProcess || '',
            
            // Fee Structure
            totalAnnualFee: registrationData.totalAnnualFee || '',
            admissionFee: registrationData.admissionFee || '',
            tuitionFee: registrationData.tuitionFee || '',
            transportFee: registrationData.transportFee || '',
            booksUniformsFee: registrationData.booksUniformsFee || '',
            
            // Contact Information
            address: registrationData.address || '',
            city: registrationData.city || '',
            state: registrationData.state || '',
            pincode: registrationData.pincode || '',
            googleMapsEmbedUrl: registrationData.googleMapsEmbedUrl || '',
            principalName: registrationData.principalName || '',
            contactPerson: registrationData.contactPerson || '',
            email: registrationData.email || '',
            phone: registrationData.phone || '',
            alternatePhone: registrationData.alternatePhone || '',
            website: registrationData.website || '',
            officeHours: registrationData.officeHours || '',
            socialMedia: parseSocialMedia(registrationData.socialMedia),
            
            // Facilities & Infrastructure
            facilities: parseJsonField(registrationData.facilities),
            affiliationNumber: registrationData.affiliationNumber || '',
            campusSize: registrationData.campusSize || '',
            classrooms: registrationData.classrooms || '',
            laboratories: registrationData.laboratories || '',
            library: registrationData.library || '',
            playground: registrationData.playground || '',
            auditorium: registrationData.auditorium || '',
            smartBoards: registrationData.smartBoards || '',
            cctv: registrationData.cctv || '',
            medicalRoom: registrationData.medicalRoom || '',
            wifi: registrationData.wifi || '',
            hostel: registrationData.hostel || '',
            sports: registrationData.sports || '',
            
            // Admission
            admissionLink: registrationData.admissionLink || '',
            admissionProcess: registrationData.admissionProcess || '',
            
            // Documents
            registrationCertificate: registrationData.registrationCertificate || '',
            qualificationCertificates: parseJsonField(registrationData.qualificationCertificates),
            idProof: registrationData.idProof || '',
            profileImage: registrationData.profileImage || '',
            mainImage: mainImage,
            photos: photosArray,
            otherDocuments: parseJsonField(registrationData.otherDocuments),
          });
        } else {
          setError('No registration data found');
        }
      } catch (error) {
        console.error('Error fetching registration:', error);
        setError(error.response?.status === 404 ? 'Registration not found' : error.message || 'Failed to fetch registration details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleApprove = async () => {
    if (!window.confirm('Are you sure you want to approve this registration?')) return;
    
    setProcessing(true);
    try {
      await registerApi.approveRegistration(id, 'Approved by admin');
      // Update local state
      setRegistration(prev => ({ ...prev, status: 'approved', approvedAt: new Date().toISOString() }));
      alert('Registration approved successfully!');
    } catch (err) {
      alert('Failed to approve registration: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    
    setProcessing(true);
    try {
      await registerApi.rejectRegistration(id, rejectReason, 'Rejected by admin');
      setRegistration(prev => ({ 
        ...prev, 
        status: 'rejected', 
        rejectedAt: new Date().toISOString(),
        rejectionReason: rejectReason 
      }));
      setShowRejectModal(false);
      setRejectReason('');
      alert('Registration rejected successfully!');
    } catch (err) {
      alert('Failed to reject registration: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = () => {
    const status = registration?.status;
    switch (status) {
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-800', icon: <FaSpinner className="mr-2 animate-spin" />, text: 'Pending Approval' };
      case 'approved':
        return { color: 'bg-green-100 text-green-800', icon: <FaCheck className="mr-2" />, text: 'Approved' };
      case 'rejected':
        return { color: 'bg-red-100 text-red-800', icon: <FaTimes className="mr-2" />, text: 'Rejected' };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: null, text: status || 'Unknown' };
    }
  };

  const renderInstitutionSpecificFields = () => {
    if (!registration) return null;
    
    switch (registration.institutionType) {
      case 'school':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="text-gray-700 font-semibold">School Type</label><p className="text-gray-900">{registration.typeOfSchool || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Affiliation</label><p className="text-gray-900">{registration.affiliation || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Grades Offered</label><p className="text-gray-900">{registration.grade || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Age for Admission</label><p className="text-gray-900">{registration.ageForAdmission || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Language of Instruction</label><p className="text-gray-900">{registration.language || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Student Strength</label><p className="text-gray-900">{registration.studentStrength || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Teacher Strength</label><p className="text-gray-900">{registration.teacherStrength || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Student-Teacher Ratio</label><p className="text-gray-900">{registration.studentTeacherRatio || 'N/A'}</p></div>
          </div>
        );
      case 'college':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="text-gray-700 font-semibold">College Type</label><p className="text-gray-900">{registration.typeOfCollege || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">University Affiliation</label><p className="text-gray-900">{registration.universityAffiliation || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Courses Offered</label><p className="text-gray-900">{registration.coursesOffered.length > 0 ? registration.coursesOffered.join(', ') : 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Duration</label><p className="text-gray-900">{registration.duration || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Accreditation</label><p className="text-gray-900">{registration.accreditation || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Placement Statistics</label><p className="text-gray-900">{registration.placementStatistics || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Number of Departments</label><p className="text-gray-900">{registration.departments || 'N/A'}</p></div>
          </div>
        );
      case 'pu_college':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="text-gray-700 font-semibold">Board</label><p className="text-gray-900">{registration.board || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Streams Offered</label><p className="text-gray-900">{registration.streams || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Subjects Offered</label><p className="text-gray-900">{registration.subjects || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Program Duration</label><p className="text-gray-900">{registration.programDuration || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Competitive Exam Prep</label><p className="text-gray-900">{registration.competitiveExamPrep || 'N/A'}</p></div>
          </div>
        );
      case 'coaching':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="text-gray-700 font-semibold">Coaching Type</label><p className="text-gray-900">{registration.typeOfCoaching || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Classes Covered</label><p className="text-gray-900">{registration.classes || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Batch Size</label><p className="text-gray-900">{registration.batchSize || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Class Duration</label><p className="text-gray-900">{registration.classDuration || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Faculty</label><p className="text-gray-900">{registration.faculty || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Study Material</label><p className="text-gray-900">{registration.studyMaterial || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Tests</label><p className="text-gray-900">{registration.tests || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Doubt Sessions</label><p className="text-gray-900">{registration.doubtSessions || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Infrastructure</label><p className="text-gray-900">{registration.infrastructure || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Demo Class</label><p className="text-gray-900">{registration.demoClass || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Flexible Timings</label><p className="text-gray-900">{registration.flexibleTimings || 'N/A'}</p></div>
          </div>
        );
      case 'teacher':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="text-gray-700 font-semibold">Teacher Type</label><p className="text-gray-900">{registration.teacherType || 'N/A'}</p></div>
            {registration.teacherType === 'institutional' && (
              <>
                <div><label className="text-gray-700 font-semibold">Institution Name</label><p className="text-gray-900">{registration.institutionName || 'N/A'}</p></div>
                <div><label className="text-gray-700 font-semibold">Position/Role</label><p className="text-gray-900">{registration.institutionPosition || 'N/A'}</p></div>
                <div><label className="text-gray-700 font-semibold">Institution Experience</label><p className="text-gray-900">{registration.institutionExperience || 'N/A'}</p></div>
              </>
            )}
            <div><label className="text-gray-700 font-semibold">Full Name</label><p className="text-gray-900">{registration.teacherName || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Qualifications</label><p className="text-gray-900">{registration.qualifications || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Experience</label><p className="text-gray-900">{registration.experience || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Teaching Mode</label><p className="text-gray-900">{registration.teachingMode || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Languages</label><p className="text-gray-900">{registration.languages || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Specialization</label><p className="text-gray-900">{registration.specialization || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Certifications</label><p className="text-gray-900">{registration.certifications || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Availability</label><p className="text-gray-900">{registration.availability || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Hourly Rate</label><p className="text-gray-900">{registration.hourlyRate || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Monthly Package</label><p className="text-gray-900">{registration.monthlyPackage || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Exam Preparation Fee</label><p className="text-gray-900">{registration.examPreparation || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Demo Class Fee</label><p className="text-gray-900">{registration.demoFee || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Teaching Approach</label><p className="text-gray-900">{registration.teachingApproach || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Study Materials</label><p className="text-gray-900">{registration.studyMaterials || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Session Duration</label><p className="text-gray-900">{registration.sessionDuration || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Student Level</label><p className="text-gray-900">{registration.studentLevel || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Class Size</label><p className="text-gray-900">{registration.classSize || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Online Platform</label><p className="text-gray-900">{registration.onlinePlatform || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Progress Reports</label><p className="text-gray-900">{registration.progressReports || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Performance Tracking</label><p className="text-gray-900">{registration.performanceTracking || 'N/A'}</p></div>
            <div><label className="text-gray-700 font-semibold">Teaching Process</label><p className="text-gray-900">{registration.teachingProcess || 'N/A'}</p></div>
          </div>
        );
      default:
        return <p className="text-gray-900">No specific details available</p>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600" />
      </div>
    );
  }

  if (error || !registration) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>Error: {error || 'No registration data available'}</p>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Back to Registrations
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge();

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-8">
        <div className="max-w-5xl mx-auto px-4">
          {/* Back Button */}
          <motion.button
            onClick={() => navigate('/admin/dashboard')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition mb-6"
          >
            <FaArrowLeft className="text-xl" />
            <span className="font-medium">Back to Registrations</span>
          </motion.button>

          {/* Header Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 px-8 py-6">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {registration.name || registration.teacherName || 'Unnamed'}
                  </h1>
                  <p className="text-white/90 capitalize mt-1">
                    {registration.institutionType?.replace('_', ' ') || 'Unknown Type'}
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-full ${statusBadge.color} flex items-center shadow-md`}>
                  {statusBadge.icon}
                  <span className="font-medium">{statusBadge.text}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Basic Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-gray-700 font-semibold">Name</label>
                  <p className="text-gray-900">{registration.name || registration.teacherName || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-gray-700 font-semibold">Type</label>
                  <p className="text-gray-900 capitalize">{registration.institutionType?.replace('_', ' ') || 'N/A'}</p>
                </div>
                {registration.tagline && (
                  <div>
                    <label className="text-gray-700 font-semibold">Tagline</label>
                    <p className="text-gray-900">{registration.tagline}</p>
                  </div>
                )}
                {registration.establishmentYear && (
                  <div>
                    <label className="text-gray-700 font-semibold">Establishment Year</label>
                    <p className="text-gray-900">{registration.establishmentYear}</p>
                  </div>
                )}
                <div>
                  <label className="text-gray-700 font-semibold">Submitted On</label>
                  <p className="text-gray-900">{registration.submittedAt ? new Date(registration.submittedAt).toLocaleString() : 'N/A'}</p>
                </div>
                {registration.approvedAt && (
                  <div>
                    <label className="text-gray-700 font-semibold">Approved On</label>
                    <p className="text-gray-900 text-green-600">{new Date(registration.approvedAt).toLocaleString()}</p>
                  </div>
                )}
                {registration.rejectedAt && (
                  <div>
                    <label className="text-gray-700 font-semibold">Rejected On</label>
                    <p className="text-gray-900 text-red-600">{new Date(registration.rejectedAt).toLocaleString()}</p>
                  </div>
                )}
                {registration.rejectionReason && (
                  <div className="md:col-span-2">
                    <label className="text-gray-700 font-semibold">Rejection Reason</label>
                    <p className="text-red-600 bg-red-50 p-2 rounded">{registration.rejectionReason}</p>
                  </div>
                )}
                {registration.about && (
                  <div className="md:col-span-2">
                    <label className="text-gray-700 font-semibold">About</label>
                    <p className="text-gray-900 whitespace-pre-wrap">{registration.about}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Main Image */}
            {registration.institutionType !== 'teacher' && (registration.mainImage || registration.photos.length > 0) && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                  Main Image
                </h2>
                {!registration.mainImage && registration.photos.length > 0 && (
                  <div className="mb-3 p-2 bg-orange-50 rounded-lg">
                    <p className="text-orange-700 text-sm flex items-center">
                      <FaInfoCircle className="mr-2" />
                      Using first image from gallery as main image
                    </p>
                  </div>
                )}
                <div className="relative aspect-video overflow-hidden rounded-xl max-w-2xl">
                  <img
                    src={registration.mainImage || registration.photos[0]}
                    alt="Main Image"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Profile Image for Teachers */}
            {registration.institutionType === 'teacher' && registration.profileImage && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                  Profile Image
                </h2>
                <div className="relative aspect-square overflow-hidden rounded-xl max-w-sm">
                  <img src={registration.profileImage} alt="Profile" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            {/* Institution Specific Details */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                {registration.institutionType === 'teacher' ? 'Teaching Details' : 'Institution Details'}
              </h2>
              {renderInstitutionSpecificFields()}
            </div>

            {/* Contact Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {registration.email && (
                  <div className="flex items-center space-x-3">
                    <FaEnvelope className="text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <a href={`mailto:${registration.email}`} className="text-blue-600 hover:underline">{registration.email}</a>
                    </div>
                  </div>
                )}
                {registration.phone && (
                  <div className="flex items-center space-x-3">
                    <FaPhone className="text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <a href={`tel:${registration.phone}`} className="text-blue-600 hover:underline">{registration.phone}</a>
                    </div>
                  </div>
                )}
                {registration.alternatePhone && (
                  <div className="flex items-center space-x-3">
                    <FaPhone className="text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-500">Alternate Phone</p>
                      <p>{registration.alternatePhone}</p>
                    </div>
                  </div>
                )}
                {registration.website && (
                  <div className="flex items-center space-x-3">
                    <FaGlobe className="text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-500">Website</p>
                      <a href={registration.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{registration.website}</a>
                    </div>
                  </div>
                )}
                {registration.address && (
                  <div className="flex items-center space-x-3 md:col-span-2">
                    <FaMapMarkerAlt className="text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p>{registration.address}, {registration.city}, {registration.state} - {registration.pincode}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons for Pending Status */}
            {registration.status === 'pending' && (
              <div className="flex space-x-4 mt-8 pt-6 border-t">
                <motion.button
                  onClick={handleApprove}
                  disabled={processing}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {processing ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                  <span>Approve Registration</span>
                </motion.button>
                <motion.button
                  onClick={() => setShowRejectModal(true)}
                  disabled={processing}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <FaTimes />
                  <span>Reject Registration</span>
                </motion.button>
              </div>
            )}

            {/* Back Button for Non-Pending */}
            {registration.status !== 'pending' && (
              <div className="mt-8 pt-6 border-t">
                <motion.button
                  onClick={() => navigate('/admin/dashboard')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white py-3 rounded-lg font-bold hover:from-orange-600 hover:to-amber-700 transition"
                >
                  Back to Registrations
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Reject Registration</h3>
            <p className="text-gray-600 mb-4">Please provide a reason for rejecting this registration:</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
              rows="4"
              placeholder="Enter rejection reason..."
            />
            <div className="flex space-x-3">
              <button
                onClick={handleReject}
                disabled={processing}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {processing ? <FaSpinner className="animate-spin mx-auto" /> : 'Confirm Reject'}
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </ErrorBoundary>
  );
};

export default RegistrationDetails;