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
} from 'react-icons/fa';
import { IoMdTime } from 'react-icons/io';
import { Link, useNavigate, useParams } from 'react-router-dom';
import BasicInfo from '../components/School/BasicInfo';
import FeesStructure from '../components/School/FeesStructure';
import Contact from '../components/School/Contact';
import Review from '../components/School/Review';
import StickyButton from '../components/StickyButton';
import Footer from '../components/Footer';
import { schoolApi } from '../services/schoolApi';
import "tailwindcss";

const SchoolDetails = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [heroIndex, setHeroIndex] = useState(0); // 👈 hero banner index
  const [school, setSchool] = useState(null);
  const [similarSchools, setSimilarSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const nav = useNavigate();

  // Fetch school details and similar schools
  useEffect(() => {
    const fetchSchoolDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log(`Fetching school with ID: ${id}`);
        const response = await schoolApi.getSchool(id);
        console.log('School API response:', response);
        const schoolData = response.data || {};

        // Build a valid photos array
        const photosArray =
          Array.isArray(schoolData.photos) && schoolData.photos.length > 0
            ? schoolData.photos.filter(Boolean)
            : schoolData.schoolImage
            ? [schoolData.schoolImage]
            : [
                'https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
                'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
              ];

        const formattedSchool = {
          id: schoolData.id || id,
          name: schoolData.name || 'Unnamed School',
          address: schoolData.address || schoolData.city || 'Unknown Location',
          fees: schoolData.totalAnnualFee
            ? `₹${schoolData.totalAnnualFee.toLocaleString()}/year`
            : 'Fees not available',
          rating: schoolData.rating || 4.0,
          affiliation: schoolData.affiliation || 'N/A',
          phone: schoolData.phone || '+91 9876543210',
          image: schoolData.schoolImage || photosArray[0],
          established: schoolData.established || 2000,
          medium: schoolData.medium || 'English',
          grades: schoolData.grades || 'Nursery to 12th',
          board: schoolData.board || 'N/A',
          facilities: schoolData.facilities || ['Smart Classes', 'Library'],
          photos: photosArray,
        };
        setSchool(formattedSchool);

        // Fetch similar schools
        console.log(`Fetching similar schools for city: ${schoolData.city}`);
        const similarResponse = await schoolApi.getSchoolsWithFilters({ city: schoolData.city });
        console.log('Similar schools API response:', similarResponse);
        const similarSchoolsData = Object.values(similarResponse.data || {})
          .filter((s) => s.id !== id)
          .slice(0, 5)
          .map((s) => ({
            name: s.name || 'Unnamed School',
            address: s.address || s.city || 'Unknown Location',
            rating: s.rating || 4.0,
            image: s.schoolImage || 'https://placehold.co/800x400?text=No+Image',
            link: `/school-details/${s.id}`,
          }));
        setSimilarSchools(similarSchoolsData);
      } catch (err) {
        console.error('Error fetching school details:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch school details');
        setSchool(null);
        setSimilarSchools([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolDetails();
    window.scrollTo(0, 0);
  }, [id]);

  // Auto-rotate hero banner through all photos
  useEffect(() => {
    if (!school || school.photos.length <= 1) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % school.photos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [school]);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openImage = (image, index) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  const navigateImages = (direction) => {
    if (!school) return;
    let newIndex =
      direction === 'prev'
        ? currentImageIndex === 0
          ? school.photos.length - 1
          : currentImageIndex - 1
        : currentImageIndex === school.photos.length - 1
        ? 0
        : currentImageIndex + 1;
    setSelectedImage(school.photos[newIndex]);
    setCurrentImageIndex(newIndex);
  };

  // Hero banner navigation
  const nextHero = () => {
    if (!school) return;
    setHeroIndex((prev) => (prev + 1) % school.photos.length);
  };

  const prevHero = () => {
    if (!school) return;
    setHeroIndex((prev) => (prev - 1 + school.photos.length) % school.photos.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading school details...</p>
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <p className="text-lg text-red-600">{error || 'School not found'}</p>
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

        {/* Slideshow image */}
        <div className="relative w-full h-[32rem] bg-gray-900">
          <AnimatePresence mode="wait">
            <motion.img
              key={heroIndex}
              src={school.photos[heroIndex]}
              alt={`${school.name} - Photo ${heroIndex + 1}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/1200x600?text=School+Image';
              }}
              onClick={() => openImage(school.photos[heroIndex], heroIndex)}
              className="absolute inset-0 w-full h-full object-cover cursor-zoom-in"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            />
          </AnimatePresence>
        </div>

        {/* Prev / Next arrows (only if more than 1 photo) */}
        {school.photos.length > 1 && (
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

        {/* Dots indicator */}
        {school.photos.length > 1 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
            {school.photos.map((_, i) => (
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
            {school.name}
          </motion.h1>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <FaMapMarkerAlt className="mr-1 text-orange-300" />
              <span>{school.address}</span>
            </div>
            <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <FaGraduationCap className="mr-1 text-orange-300" />
              <span>{school.affiliation}</span>
            </div>
            <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <IoMdTime className="mr-1 text-orange-300" />
              <span>Est. {school.established}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-amber-300 text-xl">
                <FaStar className="mr-1" /> {school.rating}
              </div>
              <p className="text-xl font-semibold text-white">{school.fees}</p>
            </div>
            <motion.a
              href={`tel:${school.phone}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-3 px-8 rounded-full flex items-center transition-all duration-300 shadow-lg pointer-events-auto"
            >
              <FaPhone className="mr-2" /> Call Now
            </motion.a>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        className="max-w-7xl mx-auto mt-8 px-4 sticky top-[76px] z-40"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex overflow-x-auto scrollbar-hide justify-center bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-1 shadow-inner">
            {['Basic Info', 'Photos', 'Fee Structure', 'Contact'].map((section) => (
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto mt-6 px-4 flex flex-col lg:flex-row gap-8">
        {/* Left Column - Scrollable */}
        <div className="w-full lg:w-2/3 space-y-8">
          {/* Basic Info */}
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
                Basic Information
              </h2>
              <BasicInfo />
            </div>
          </motion.div>

          {/* Photos Section */}
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
                School Gallery
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {school.photos.map((photo, index) => (
                  <motion.div
                    key={index}
                    className="relative aspect-square overflow-hidden rounded-xl cursor-pointer group"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => openImage(photo, index)}
                  >
                    <img
                      src={photo}
                      alt={`${school.name} - Photo ${index + 1}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/600x600?text=No+Image';
                      }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-4 text-center">
                Click on any photo to view in full size
              </p>
            </div>
          </motion.div>

          {/* Fee Structure */}
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
              <FeesStructure />
            </div>
          </motion.div>

          {/* Contact */}
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
              <Contact />
            </div>
          </motion.div>

          {/* Reviews */}
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
              <Review />
            </div>
          </motion.div>
        </div>

        {/* Right Column - Fixed Form */}
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
                    <FaGraduationCap className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Board</p>
                    <p className="font-medium">{school.board}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-full mr-3">
                    <IoMdTime className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Established</p>
                    <p className="font-medium">{school.established}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-full mr-3">
                    <FaBookOpen className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Medium</p>
                    <p className="font-medium">{school.medium}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-full mr-3">
                    <FaStar className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Grades</p>
                    <p className="font-medium">{school.grades}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
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
              alt={`${school.name} - Photo ${currentImageIndex + 1}`}
              className="max-w-full max-h-screen object-contain"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            />
            <button
              className="absolute right-4 text-white text-3xl bg-black/50 rounded-full p-2"
              onClick={() => navigateImages('next')}
            >
              <FaChevronRight />
            </button>
            <div className="absolute bottom-4 left-0 right-0 text-center text-white">
              Photo {currentImageIndex + 1} of {school.photos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* <StickyButton /> */}
    </div>
  );
};

export default SchoolDetails;