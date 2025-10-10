import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft, FaFileAlt, FaSchool, FaUniversity, FaGraduationCap, 
  FaChalkboardTeacher, FaMapMarkerAlt, FaPhone, FaEnvelope, 
  FaGlobe, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaRupeeSign, 
  FaInfoCircle, FaSpinner
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
          <p>Error: Something went wrong while rendering the component.</p>
          <p>{this.state.error?.message}</p>
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

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        const response = await registerApi.getRegistrationById(id);

        if (response.success && response.data) {
          const registrationData = response.data;

          // Get the first image from photos array to use as main image if mainImage is not available
          const photosArray = Array.isArray(registrationData.photos) ? registrationData.photos : [];
          const mainImage = registrationData.mainImage || (photosArray.length > 0 ? photosArray[0] : '');

          // Normalize arrays and objects
          setRegistration({
            id,
            name: registrationData.name || '',
            teacherName: registrationData.teacherName || '',
            institutionType: registrationData.institutionType || '',
            tagline: registrationData.tagline || '',
            establishmentYear: registrationData.establishmentYear || '',
            about: registrationData.about || '',
            status: registrationData.status || '',
            createdAt: registrationData.createdAt || '',
            adminNotes: registrationData.adminNotes || '',
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
            coursesOffered: Array.isArray(registrationData.coursesOffered) ? registrationData.coursesOffered : [],
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
            totalAnnualFee: registrationData.totalAnnualFee || '',
            admissionFee: registrationData.admissionFee || '',
            tuitionFee: registrationData.tuitionFee || '',
            transportFee: registrationData.transportFee || '',
            booksUniformsFee: registrationData.booksUniformsFee || '',
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
            socialMedia: registrationData.socialMedia || { facebook: '', twitter: '', instagram: '', linkedin: '' },
            facilities: Array.isArray(registrationData.facilities) ? registrationData.facilities : [],
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
            admissionLink: registrationData.admissionLink || '',
            admissionProcess: registrationData.admissionProcess || '',
            registrationCertificate: registrationData.registrationCertificate || '',
            qualificationCertificates: Array.isArray(registrationData.qualificationCertificates) ? registrationData.qualificationCertificates : [],
            idProof: registrationData.idProof || '',
            profileImage: registrationData.profileImage || '',
            mainImage: mainImage, // Use the first gallery image if mainImage is not available
            photos: photosArray,
            otherDocuments: Array.isArray(registrationData.otherDocuments) ? registrationData.otherDocuments : [],
          });
        } else {
          setError(response.message || 'Failed to fetch registration details');
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600" />
      </div>
    );
  }

  if (error || !registration) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-2xl mx-auto mt-8">
        <p>Error: {error || 'No registration data available'}</p>
        <button
          onClick={() => navigate('/admin/registrations')}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Back
        </button>
      </div>
    );
  }

  const renderInstitutionSpecificFields = () => {
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

  return (
    <ErrorBoundary>
      <div className="min-h-screen w-full bg-gradient-to-b from-orange-50 to-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl mx-auto px-6 py-8"
        >
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Registration Details</h1>
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
                  <p className="text-gray-900">{registration.name || registration.teacherName || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-gray-700 font-semibold">Type</label>
                  <p className="text-gray-900">{registration.institutionType || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-gray-700 font-semibold">Tagline</label>
                  <p className="text-gray-900">{registration.tagline || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-gray-700 font-semibold">Establishment Year</label>
                  <p className="text-gray-900">{registration.establishmentYear || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-gray-700 font-semibold">About</label>
                  <p className="text-gray-900">{registration.about || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-gray-700 font-semibold">Status</label>
                  <p className="text-gray-900">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      registration.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      registration.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {registration.status || 'N/A'}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-gray-700 font-semibold">Submitted On</label>
                  <p className="text-gray-900">{registration.createdAt ? new Date(registration.createdAt).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <label className="text-gray-700 font-semibold">Admin Notes</label>
                  <p className="text-gray-900">{registration.adminNotes || 'N/A'}</p>
                </div>
              </div>
            </motion.div>

            {/* Main Image (for Institutions) - Now shows first gallery image if mainImage is not available */}
            {registration.institutionType !== 'teacher' && (registration.mainImage || registration.photos.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                  Main Image
                </h2>
                <div className="flex items-center gap-4 mb-2">
                  {!registration.mainImage && registration.photos.length > 0 && (
                    <span className="text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                      Using first image from gallery
                    </span>
                  )}
                </div>
                <motion.div
                  className="relative aspect-video overflow-hidden rounded-xl mt-4 max-w-2xl mx-auto"
                  whileHover={{ scale: 1.02 }}
                >
                  <img
                    src={registration.mainImage || registration.photos[0]}
                    alt="Main Image"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </motion.div>
            )}

            {/* Profile Image (for Teachers) */}
            {registration.institutionType === 'teacher' && registration.profileImage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                  Profile Image
                </h2>
                <motion.div
                  className="relative aspect-square overflow-hidden rounded-xl mt-4 max-w-sm"
                  whileHover={{ scale: 1.02 }}
                >
                  <img
                    src={registration.profileImage}
                    alt="Profile Image"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </motion.div>
            )}

            {/* Institution-Specific Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                {registration.institutionType === 'teacher' ? 'Teaching Details' : 'Institution Details'}
              </h2>
              {renderInstitutionSpecificFields()}
            </motion.div>

            {/* Fee Structure */}
            {registration.institutionType !== 'teacher' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                  Fee Structure
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-gray-700 font-semibold">Total Annual Fee</label>
                    <p className="text-gray-900">{registration.totalAnnualFee || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-gray-700 font-semibold">Admission Fee</label>
                    <p className="text-gray-900">{registration.admissionFee || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-gray-700 font-semibold">Tuition Fee</label>
                    <p className="text-gray-900">{registration.tuitionFee || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-gray-700 font-semibold">Transport Fee</label>
                    <p className="text-gray-900">{registration.transportFee || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-gray-700 font-semibold">Books & Uniforms Fee</label>
                    <p className="text-gray-900">{registration.booksUniformsFee || 'N/A'}</p>
                  </div>
                </div>
              </motion.div>
            )}

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
                {registration.institutionType !== 'teacher' && (
                  <>
                    <div>
                      <label className="text-gray-700 font-semibold">Principal/Director Name</label>
                      <p className="text-gray-900">{registration.principalName || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-gray-700 font-semibold">Contact Person</label>
                      <p className="text-gray-900">{registration.contactPerson || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-gray-700 font-semibold">Address</label>
                      <p className="text-gray-900">{registration.address || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-gray-700 font-semibold">City</label>
                      <p className="text-gray-900">{registration.city || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-gray-700 font-semibold">State</label>
                      <p className="text-gray-900">{registration.state || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-gray-700 font-semibold">Pincode</label>
                      <p className="text-gray-900">{registration.pincode || 'N/A'}</p>
                    </div>
                  </>
                )}
                <div>
                  <label className="text-gray-700 font-semibold">Email</label>
                  <p className="text-gray-900">{registration.email || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-gray-700 font-semibold">Phone</label>
                  <p className="text-gray-900">{registration.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-gray-700 font-semibold">Alternate Phone</label>
                  <p className="text-gray-900">{registration.alternatePhone || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-gray-700 font-semibold">Website</label>
                  <p className="text-gray-900">
                    {registration.website ? (
                      <a href={registration.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {registration.website}
                      </a>
                    ) : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-gray-700 font-semibold">Office Hours/Availability</label>
                  <p className="text-gray-900">{registration.officeHours || registration.availability || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-gray-700 font-semibold">Social Media</label>
                  <p className="text-gray-900">
                    {registration.socialMedia && (registration.socialMedia.facebook || registration.socialMedia.twitter || registration.socialMedia.instagram || registration.socialMedia.linkedin) ? (
                      <div className="space-y-1">
                        {registration.socialMedia.facebook && (
                          <a href={registration.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block">
                            Facebook
                          </a>
                        )}
                        {registration.socialMedia.twitter && (
                          <a href={registration.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block">
                            Twitter
                          </a>
                        )}
                        {registration.socialMedia.instagram && (
                          <a href={registration.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block">
                            Instagram
                          </a>
                        )}
                        {registration.socialMedia.linkedin && (
                          <a href={registration.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block">
                            LinkedIn
                          </a>
                        )}
                      </div>
                    ) : 'N/A'}
                  </p>
                </div>
                {registration.institutionType !== 'teacher' && (
                  <div className="col-span-2">
                    <label className="text-gray-700 font-semibold">Google Maps</label>
                    {registration.googleMapsEmbedUrl ? (
                      <iframe
                        src={registration.googleMapsEmbedUrl}
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
                )}
              </div>
            </motion.div>

            {/* Facilities */}
            {registration.institutionType !== 'teacher' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                  Facilities
                </h2>
                <div>
                  <label className="text-gray-700 font-semibold">Facilities</label>
                  <p className="text-gray-900">{registration.facilities.length > 0 ? registration.facilities.join(', ') : 'N/A'}</p>
                </div>
              </motion.div>
            )}

            {/* Infrastructure */}
            {registration.institutionType !== 'teacher' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                  Infrastructure
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {['campusSize', 'classrooms', 'laboratories', 'library', 'playground', 'auditorium', 'smartBoards', 'cctv', 'medicalRoom', 'wifi', 'hostel', 'sports'].map(field => (
                    <div key={field}>
                      <label className="text-gray-700 font-semibold capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                      <p className="text-gray-900">{registration[field] || 'N/A'}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Admission Details */}
            {registration.institutionType !== 'teacher' && (
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
                    {registration.admissionLink ? (
                      <a href={registration.admissionLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {registration.admissionLink}
                      </a>
                    ) : 'N/A'}
                  </p>
                </div>
                <div className="mt-4">
                  <label className="text-gray-700 font-semibold">Admission Process</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{registration.admissionProcess || 'N/A'}</p>
                </div>
              </motion.div>
            )}

            {/* Gallery (for Institutions) - Now starts from second image if first is used as main */}
            {registration.institutionType !== 'teacher' && registration.photos.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                  Gallery
                </h2>
                {/* Show indicator if first image is being used as main image */}
                {!registration.mainImage && registration.photos.length > 0 && (
                  <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-orange-700 text-sm">
                      <FaInfoCircle className="inline mr-2" />
                      First image from gallery is displayed as the main image above
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {/* If mainImage is not available and we're using first gallery image, start from index 1 */}
                  {registration.photos
                    .filter((_, index) => registration.mainImage || index > 0) // Skip first image if it's being used as main
                    .map((photo, index) => (
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
              </motion.div>
            )}

            {/* Documents */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                Documents
              </h2>
              {registration.institutionType === 'teacher' ? (
                <div className="grid grid-cols-1 gap-4">
                  {registration.qualificationCertificates.length > 0 && (
                    <div>
                      <label className="text-gray-700 font-semibold">Qualification Certificates</label>
                      <div className="space-y-1">
                        {registration.qualificationCertificates.map((file, index) => (
                          <a
                            key={index}
                            href={file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline block"
                          >
                            Certificate {index + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  {registration.idProof && (
                    <div>
                      <label className="text-gray-700 font-semibold">ID Proof</label>
                      <a
                        href={registration.idProof}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline block"
                      >
                        ID Proof
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {registration.registrationCertificate && (
                    <div>
                      <label className="text-gray-700 font-semibold">Registration Certificate</label>
                      <a
                        href={registration.registrationCertificate}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline block"
                      >
                        Registration Certificate
                      </a>
                    </div>
                  )}
                  {registration.otherDocuments.length > 0 && (
                    <div>
                      <label className="text-gray-700 font-semibold">Other Documents</label>
                      <div className="space-y-1">
                        {registration.otherDocuments.map((doc, index) => (
                          <a
                            key={index}
                            href={doc}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline block"
                          >
                            Document {index + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
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
            </div>
          </div>
        </motion.div>
      </div>
    </ErrorBoundary>
  );
};

export default RegistrationDetails;