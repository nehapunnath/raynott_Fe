import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaChalkboardTeacher,
  FaSearch,
  FaStar,
  FaPhone,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaBook,
  FaClock,
  FaMoneyBillWave,
  FaLaptop,
  FaUserGraduate,
  FaCertificate,
  FaRegHeart,
  FaHeart,
} from 'react-icons/fa';
import { IoMdTime } from 'react-icons/io';
import { Link, useNavigate, useParams } from 'react-router-dom';
import StickyButton from '../components/StickyButton';

import { teacherApi } from '../services/TeacherApi';
import BasicInfo from '../components/PersonalTeachers/BasicInfo';
import Contact from '../components/PersonalTeachers/Contact';
import FeeStructure from '../components/PersonalTeachers/FeeStructure';
import Review from '../components/PersonalTeachers/Review';
import 'tailwindcss';

// 👇 Safe array helper
const safeArray = (value, fallback = []) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string' && value.trim()) {
    return value.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return fallback;
};

const PersonalDetails = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [heroIndex, setHeroIndex] = useState(0); // 👈 hero slideshow index
  const [isFavorite, setIsFavorite] = useState(false);
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const nav = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchMentorDetails();
  }, [id]);

  const fetchMentorDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await teacherApi.getPersonalMentorDetails(id);

      if (response.success && response.data) {
        const {
          basicInfo = {},
          teachingDetails = {},
          specialization = {},
          availability = {},
          facilities = [],
          about,
          contact = {},
        } = response.data;

        // 👇 Build valid photos array
        const facilitiesPhotos = safeArray(facilities);
        const photosArray =
          facilitiesPhotos.length > 0
            ? facilitiesPhotos
            : basicInfo.profileImage
            ? [basicInfo.profileImage]
            : [
                'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
                'https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
                'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
              ];

        const mentorData = {
          id: response.data.id || 'unknown',
          name: basicInfo.name || 'Not specified',
          // 👇 safe arrays everywhere
          subjects: safeArray(basicInfo.subjects, []),
          qualification: basicInfo.qualification || 'Not specified',
          experience: basicInfo.experience || 'Not specified',
          rating: basicInfo.rating ? parseFloat(basicInfo.rating) : 4.5,
          location:
            basicInfo.address && basicInfo.city
              ? `${basicInfo.address}, ${basicInfo.city}`
              : 'Not specified',
          fees: teachingDetails.hourlyRate || 'Not specified',
          teachingMode: safeArray(teachingDetails.teachingMode, ['Not specified']),
          demoAvailable: teachingDetails.demoFee?.toLowerCase() === 'free',
          image:
            basicInfo.profileImage ||
            'https://placehold.co/600x400?text=Mentor',
          about: about || 'No description available',
          specialization: safeArray(specialization.specialization, []),
          certifications: safeArray(specialization.certifications, []),
          availability: availability.availability || 'Not specified',
          languages: safeArray(specialization.languages, []),
          photos: photosArray,
          phone: contact.phone || 'Not specified',
        };
        setMentor(mentorData);
      } else {
        setError('Failed to fetch mentor details');
      }
    } catch (err) {
      console.error('Error fetching mentor details:', err);
      setError(err.message || 'Failed to load mentor details');
    } finally {
      setLoading(false);
    }
  };

  // 👇 Auto-rotate hero banner through all photos
  useEffect(() => {
    if (!mentor || mentor.photos.length <= 1) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % mentor.photos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [mentor]);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  const openImage = (image, index) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  const closeImage = () => setSelectedImage(null);

  const navigateImages = (direction) => {
    if (!mentor) return;
    let newIndex;
    if (direction === 'prev') {
      newIndex =
        currentImageIndex === 0 ? mentor.photos.length - 1 : currentImageIndex - 1;
    } else {
      newIndex =
        currentImageIndex === mentor.photos.length - 1 ? 0 : currentImageIndex + 1;
    }
    setSelectedImage(mentor.photos[newIndex]);
    setCurrentImageIndex(newIndex);
  };

  const nextHero = () => {
    if (!mentor) return;
    setHeroIndex((prev) => (prev + 1) % mentor.photos.length);
  };
  const prevHero = () => {
    if (!mentor) return;
    setHeroIndex((prev) => (prev - 1 + mentor.photos.length) % mentor.photos.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="text-lg text-gray-600 mt-4">Loading mentor details...</p>
        </div>
      </div>
    );
  }

  if (error || !mentor) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">{error || 'Mentor not found'}</p>
          <button
            onClick={() => nav('/personal-teachers')}
            className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
          >
            Back to Personal Mentors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <header className="bg-orange-600 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:py-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex w-full md:w-auto justify-between items-center mb-4 md:mb-0">
            <Link to="/" className="text-3xl font-extrabold text-white">
              <motion.span whileHover={{ scale: 1.05 }}>Raynott</motion.span>
            </Link>
          </div>
          <div className="hidden md:flex space-x-4 ml-8">
            <motion.button
              className="bg-white border border-white text-orange-600 hover:bg-orange-100 font-semibold py-2 px-4 rounded-full transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => nav('/bookdemo')}
            >
              Book A Demo
            </motion.button>
          </div>
        </div>
      </header>

      {/* Hero Banner — slideshow of all gallery photos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative max-w-7xl mx-auto mt-8 rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10 pointer-events-none"></div>

        <div className="relative w-full h-[32rem] bg-gray-900">
          <AnimatePresence mode="wait">
            <motion.img
              key={heroIndex}
              src={mentor.photos[heroIndex]}
              alt={`${mentor.name} - Photo ${heroIndex + 1}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/1200x600?text=Mentor';
              }}
              onClick={() => openImage(mentor.photos[heroIndex], heroIndex)}
              className="absolute inset-0 w-full h-full object-cover cursor-zoom-in"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            />
          </AnimatePresence>
        </div>

        {/* Arrows */}
        {mentor.photos.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevHero();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/70 text-white rounded-full p-3 transition"
              aria-label="Previous photo"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextHero();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/70 text-white rounded-full p-3 transition"
              aria-label="Next photo"
            >
              <FaChevronRight />
            </button>
          </>
        )}

        {/* Dots */}
        {mentor.photos.length > 1 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
            {mentor.photos.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setHeroIndex(i);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === heroIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to photo ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Text overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-8 text-white">
          <div className="flex justify-between items-start">
            <div className="pointer-events-none">
              <motion.h1
                className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {mentor.name}
              </motion.h1>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <FaGraduationCap className="mr-1 text-orange-300" />
                  <span>{mentor.qualification}</span>
                </div>
                <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <FaMapMarkerAlt className="mr-1 text-orange-300" />
                  <span>{mentor.location}</span>
                </div>
                <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <IoMdTime className="mr-1 text-orange-300" />
                  <span>{mentor.experience} experience</span>
                </div>
              </div>
            </div>
            <motion.button
              onClick={() => setIsFavorite(!isFavorite)}
              className="text-3xl text-white hover:text-amber-300 transition-colors pointer-events-auto"
              whileTap={{ scale: 0.9 }}
            >
              {isFavorite ? <FaHeart className="text-amber-300" /> : <FaRegHeart />}
            </motion.button>
          </div>
          <div className="flex flex-wrap items-center justify-end">
            <div className="flex space-x-4 pointer-events-auto">
              <motion.a
                href={`tel:${mentor.phone}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-full flex items-center transition-all duration-300 shadow-lg"
              >
                <FaPhone className="mr-2" /> Contact
              </motion.a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        className="max-w-7xl mx-auto mt-8 px-4 sticky top-[76px] z-40"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex overflow-x-auto scrollbar-hide justify-center bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-1 shadow-inner">
            {['Basic Info', 'Fee Structure', 'Contact', 'Reviews'].map((section) => (
              <motion.button
                key={section}
                onClick={() => scrollToSection(section.replace(/\s+/g, '').toLowerCase())}
                className="flex-shrink-0 px-8 py-4 relative group"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-2xl font-bold font-['Poppins'] bg-clip-text bg-gradient-to-r text-amber-900 transition-all duration-300">
                  {section}
                </span>
                <motion.div
                  className="absolute bottom-2 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                  initial={{ width: 0 }}
                  whileHover={{ width: '80%' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto mt-6 px-4 flex flex-col lg:flex-row gap-8 pb-12">
        <div className="w-full lg:w-2/3 space-y-8">
          <motion.div
            id="basicinfo"
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: '-100px' }}
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                About the Mentor
              </h2>
              <BasicInfo mentor={mentor} />
            </div>
          </motion.div>

          <motion.div
            id="mentoring"
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: '-100px' }}
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                Fee Structure
              </h2>
              <FeeStructure mentor={mentor} />
            </div>
          </motion.div>

          <motion.div
            id="contact"
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: '-100px' }}
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                Contact Details
              </h2>
              <Contact mentor={mentor} />
            </div>
          </motion.div>

          <motion.div
            id="reviews"
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: '-100px' }}
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                Reviews
              </h2>
              <Review teacherId={id} type="personal" />
            </div>
          </motion.div>
        </div>

        <motion.div
          className="w-full lg:w-1/3 lg:sticky lg:top-[140px] self-start pt-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="mt-6 bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Facts</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-full mr-3">
                    <FaBook className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Specialties</p>
                    <p className="font-medium">{mentor.subjects.join(', ')}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-full mr-3">
                    <FaClock className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-medium">{mentor.experience}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-full mr-3">
                    <FaMoneyBillWave className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fees</p>
                    <p className="font-medium">{mentor.fees}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-full mr-3">
                    <FaLaptop className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mentoring Mode</p>
                    <p className="font-medium">{mentor.teachingMode.join(', ')}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-full mr-3">
                    <FaUserGraduate className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Specialization</p>
                    <p className="font-medium">{mentor.specialization.join(', ')}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-full mr-3">
                    <FaCertificate className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Certifications</p>
                    <p className="font-medium">{mentor.certifications.join(', ')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && mentor.photos && mentor.photos.length > 0 && (
          <motion.div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              className="absolute top-4 right-4 text-white text-3xl"
              onClick={closeImage}
            >
              <FaTimes />
            </button>
            <button
              className="absolute left-4 text-white text-3xl bg-black/50 rounded-full p-2"
              onClick={() => navigateImages('prev')}
            >
              <FaChevronLeft />
            </button>
            <motion.img
              src={selectedImage}
              alt={`${mentor.name} - Photo ${currentImageIndex + 1}`}
              className="max-w-full max-h-screen object-contain"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/800x600?text=No+Image';
              }}
            />
            <button
              className="absolute right-4 text-white text-3xl bg-black/50 rounded-full p-2"
              onClick={() => navigateImages('next')}
            >
              <FaChevronRight />
            </button>
            <div className="absolute bottom-4 left-0 right-0 text-center text-white">
              Photo {currentImageIndex + 1} of {mentor.photos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* <StickyButton /> */}
    </div>
  );
};

export default PersonalDetails;