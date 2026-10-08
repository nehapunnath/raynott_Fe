import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBookOpen,
  FaSearch,
  FaStar,
  FaPhone,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaHome,
} from 'react-icons/fa';
import { IoMdTime } from 'react-icons/io';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { TuitionCoachingApi } from '../services/TuitionCoachingApi';
import BasicInfo from '../components/Coaching/BasicInfo';
import FeeStructure from '../components/Coaching/FeeStructure';
import Contact from '../components/Coaching/Contact';
import Review from '../components/Coaching/Review';
import Footer from '../components/Footer';
import StickyButton from '../components/StickyButton';
import 'tailwindcss';

// 👇 Safe array helper — prevents .join / .map crashes
const safeArray = (value, fallback = []) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string' && value.trim()) {
    return value.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return fallback;
};

const CoachingDetail = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [heroIndex, setHeroIndex] = useState(0); // 👈 hero slideshow index
  const [coachingCenter, setCoachingCenter] = useState(null);
  const [similarCoachingCenters, setSimilarCoachingCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const nav = useNavigate();

  useEffect(() => {
    const fetchCoachingDetails = async () => {
      try {
        setLoading(true);
        const response = await TuitionCoachingApi.getTuitionCoaching(id);
        if (response.success && response.data) {
          const data = response.data;

          // Build valid photos array
          const photosArray = safeArray(data.photos);
          const finalPhotos =
            photosArray.length > 0
              ? photosArray
              : data.centerImage
              ? [data.centerImage]
              : [
                  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
                  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
                ];

          const formattedCoaching = {
            ...data,
            // 👇 safe arrays everywhere
            subjects: safeArray(data.subjects, ['JEE', 'NEET']),
            classes: safeArray(data.classes),
            courses: safeArray(data.courses || data.subjects, ['JEE', 'NEET']),
            facilities: safeArray(data.facilities),
            batchSize: data.batchSize || 'Regular, Weekend',
            photos: finalPhotos,
          };
          setCoachingCenter(formattedCoaching);
        } else {
          setError('Coaching center not found');
        }
      } catch (err) {
        console.error('Error fetching coaching details:', err);
        setError(
          err.response?.data?.message || err.message || 'Failed to fetch coaching details'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCoachingDetails();
    window.scrollTo(0, 0);
  }, [id]);

  // 👇 Auto-rotate hero banner through all photos
  useEffect(() => {
    if (!coachingCenter || coachingCenter.photos.length <= 1) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % coachingCenter.photos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [coachingCenter]);

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
    if (!coachingCenter || !coachingCenter.photos) return;
    let newIndex =
      direction === 'prev'
        ? currentImageIndex === 0
          ? coachingCenter.photos.length - 1
          : currentImageIndex - 1
        : currentImageIndex === coachingCenter.photos.length - 1
        ? 0
        : currentImageIndex + 1;
    setSelectedImage(coachingCenter.photos[newIndex]);
    setCurrentImageIndex(newIndex);
  };

  // Hero nav
  const nextHero = () => {
    if (!coachingCenter) return;
    setHeroIndex((prev) => (prev + 1) % coachingCenter.photos.length);
  };
  const prevHero = () => {
    if (!coachingCenter) return;
    setHeroIndex(
      (prev) => (prev - 1 + coachingCenter.photos.length) % coachingCenter.photos.length
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading coaching details...</p>
        </div>
      </div>
    );
  }

  if (error || !coachingCenter) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Coaching center not found'}</p>
          <button
            onClick={() => nav('/coaching')}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
          >
            Browse All Coaching Centers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="bg-orange-600 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex w-full md:w-auto justify-between items-center mb-4 md:mb-0">
            <Link to="/" className="text-3xl font-extrabold text-white">
              <motion.span whileHover={{ scale: 1.05 }}>Raynott</motion.span>
            </Link>
            <div className="md:hidden flex space-x-2">
              <motion.button
                className="bg-white text-orange-600 font-semibold py-2 px-4 rounded-full transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => nav('/bookdemo')}
              >
                Demo
              </motion.button>
              <motion.button
                className="bg-white text-orange-600 font-semibold py-2 px-4 rounded-full transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaBookOpen />
              </motion.button>
            </div>
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
              src={coachingCenter.photos[heroIndex]}
              alt={`${coachingCenter.name} - Photo ${heroIndex + 1}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/1200x600?text=Coaching+Center';
              }}
              onClick={() => openImage(coachingCenter.photos[heroIndex], heroIndex)}
              className="absolute inset-0 w-full h-full object-cover cursor-zoom-in"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            />
          </AnimatePresence>
        </div>

        {/* Arrows */}
        {coachingCenter.photos.length > 1 && (
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
        {coachingCenter.photos.length > 1 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
            {coachingCenter.photos.map((_, i) => (
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
        <div className="absolute bottom-0 left-0 right-0 z-20 p-8 text-white pointer-events-none">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {coachingCenter.name}
          </motion.h1>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <FaMapMarkerAlt className="mr-1 text-orange-300" />
              <span>
                {coachingCenter.address}, {coachingCenter.city}
              </span>
            </div>
            <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <IoMdTime className="mr-1 text-orange-300" />
              <span>Est. {coachingCenter.establishmentYear || 'N/A'}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-amber-300 text-xl">
                <FaStar className="mr-1" /> {coachingCenter.rating || 4.5}
              </div>
              <p className="text-xl font-semibold text-white">
                ₹{coachingCenter.totalAnnualFee?.toLocaleString() || 'Contact for fees'}
              </p>
            </div>
            <motion.a
              href={`tel:${coachingCenter.phone}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-3 px-8 rounded-full flex items-center transition-all duration-300 shadow-lg pointer-events-auto"
            >
              <FaPhone className="mr-2" /> Call Now
            </motion.a>
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
            {['Basic Info', 'Photos', 'Courses', 'Fee Structure', 'Contact', 'Reviews'].map(
              (section) => (
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
              )
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto mt-6 px-4 flex flex-col lg:flex-row gap-8 pb-12">
        {/* Left Column */}
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
                Coaching Center Information
              </h2>
              <BasicInfo coachingCenter={coachingCenter} />
            </div>
          </motion.div>

          <motion.div
            id="photos"
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: '-100px' }}
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                Coaching Gallery
              </h2>
              {coachingCenter.photos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {coachingCenter.photos.map((photo, index) => (
                    <motion.div
                      key={index}
                      className="relative aspect-square overflow-hidden rounded-xl cursor-pointer group"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => openImage(photo, index)}
                    >
                      <img
                        src={photo}
                        alt={`${coachingCenter.name} - Photo ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/600x600?text=No+Image';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center">
                  No photos available for this coaching center.
                </p>
              )}
              {coachingCenter.photos.length > 0 && (
                <p className="text-sm text-gray-500 mt-4 text-center">
                  Click on any photo to view in full size
                </p>
              )}
            </div>
          </motion.div>

          <motion.div
            id="courses"
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: '-100px' }}
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                Courses & Batches
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg text-gray-700 mb-3">Courses Offered</h3>
                  <ul className="space-y-2">
                    {coachingCenter.subjects.map((course, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                        {course}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-700 mb-3">Batch Types</h3>
                  <ul className="space-y-2">
                    {/* 👇 safe split */}
                    {safeArray(coachingCenter.batchSize, ['Regular', 'Weekend']).map(
                      (batch, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                          {batch}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            id="feestructure"
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
              <FeeStructure coachingCenter={coachingCenter} />
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
              <Contact coachingCenter={coachingCenter} />
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
              <Review coachingCenter={coachingCenter} />
            </div>
          </motion.div>
        </div>

        {/* Right Column — Quick Facts */}
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
                    <IoMdTime className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Established</p>
                    <p className="font-medium">
                      {coachingCenter.establishmentYear || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-full mr-3">
                    <FaBookOpen className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Courses</p>
                    <p className="font-medium">
                      {/* 👇 safe join */}
                      {coachingCenter.subjects.join(', ') || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-full mr-3">
                    <FaGraduationCap className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Batch Types</p>
                    <p className="font-medium">{coachingCenter.batchSize || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && coachingCenter.photos && coachingCenter.photos.length > 0 && (
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
              alt={`${coachingCenter.name} - Photo ${currentImageIndex + 1}`}
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
              Photo {currentImageIndex + 1} of {coachingCenter.photos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* <Footer /> */}
      {/* <StickyButton /> */}
    </div>
  );
};

export default CoachingDetail;