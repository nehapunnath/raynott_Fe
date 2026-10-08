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
import { Link, useParams, useNavigate } from 'react-router-dom';
import { puCollegeApi } from '../services/pucollegeApi';
import StickyButton from '../components/StickyButton';
import BasicInfo from '../components/PuColleges/BasicInfo';
import FeeStructure from '../components/PuColleges/FeeStructure';
import Contact from '../components/PuColleges/Contact';
import Review from '../components/PuColleges/Review';
import 'tailwindcss';

// City name normalization map
const cityNormalizationMap = {
  bangalore: 'Bengaluru',
  bengaluru: 'Bengaluru',
  mumbai: 'Mumbai',
  delhi: 'Delhi',
  chennai: 'Chennai',
  hyderabad: 'Hyderabad',
  kolkata: 'Kolkata',
  pune: 'Pune',
};

// 👇 SAFE ARRAY HELPER — prevents `.join is not a function` crashes
const safeArray = (value, fallback = []) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string' && value.trim()) {
    return value.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return fallback;
};

const PUCollegeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [puCollege, setPUCollege] = useState(null);
  const [similarPUColleges, setSimilarPUColleges] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [heroIndex, setHeroIndex] = useState(0); // 👈 hero slideshow index
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const normalizeCity = (city) => {
    if (!city) return 'Unknown';
    const cleanCity = city.trim().toLowerCase();
    return cityNormalizationMap[cleanCity] || city;
  };

  // Fetch college details
  useEffect(() => {
    const fetchCollegeDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const collegeResponse = await puCollegeApi.getPUCollege(id);
        if (!collegeResponse.success || !collegeResponse.data) {
          throw new Error('College not found');
        }

        const collegeData = collegeResponse.data;

        // 👇 Build valid photos array (never undefined)
        const photosArray = safeArray(collegeData.photos);
        const finalPhotos =
          photosArray.length > 0
            ? photosArray
            : collegeData.collegeImage
            ? [collegeData.collegeImage]
            : [
                'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
                'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
                'https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
              ];

        const mappedCollege = {
          id: collegeData.id || collegeData._id || id,
          name: collegeData.name || 'Unnamed College',
          address: collegeData.address || 'Unknown Location',
          city: normalizeCity(
            collegeData.city ||
              collegeData.addressCity ||
              collegeData.location ||
              'Unknown'
          ),
          fees: collegeData.totalAnnualFee
            ? `₹${Number(collegeData.totalAnnualFee).toLocaleString()}/year`
            : '₹30,000/year',
          rating: collegeData.rating || (Math.random() * (5 - 4) + 4).toFixed(1),
          board: collegeData.board || 'Karnataka PU Board',
          phone: collegeData.phone || '+91 9876543210',
          image: collegeData.collegeImage || finalPhotos[0],
          established: collegeData.established || 2010,
          // 👇 ALWAYS arrays
          streams: safeArray(collegeData.streams, ['Science', 'Commerce']),
          facilities: safeArray(collegeData.facilities, [
            'Smart Classes',
            'Laboratories',
            'Library',
          ]),
          courses: safeArray(
            collegeData.courses || collegeData.coursesOffered,
            ['Course 1', 'Course 2']
          ),
          photos: finalPhotos,
        };

        setPUCollege(mappedCollege);

        // Fetch similar colleges
        const allCollegesResponse = await puCollegeApi.getPUColleges();
        let collegesArray = [];
        if (allCollegesResponse.success && allCollegesResponse.data) {
          collegesArray = Array.isArray(allCollegesResponse.data)
            ? allCollegesResponse.data
            : Object.values(allCollegesResponse.data);
        }

        const similarColleges = collegesArray
          .filter(
            (college) =>
              college.id !== id &&
              (college.city === collegeData.city ||
                safeArray(college.streams).some((s) =>
                  mappedCollege.streams.includes(s)
                ))
          )
          .slice(0, 3)
          .map((college) => ({
            id: college.id || college._id || Math.random().toString(36).substr(2, 9),
            name: college.name || 'Unnamed College',
            address: college.address || 'Unknown Location',
            rating: college.rating || (Math.random() * (5 - 4) + 4).toFixed(1),
            image:
              college.collegeImage ||
              'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
            link: `/pucollege-details/${college.id || college._id}`,
          }));

        setSimilarPUColleges(similarColleges);
      } catch (err) {
        console.error('Error fetching PU College:', err);
        setError('Failed to load college details. Please try again later.');
        setPUCollege(null);
        setSimilarPUColleges([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCollegeDetails();
    window.scrollTo(0, 0);
  }, [id]);

  // 👇 Auto-rotate hero through all photos
  useEffect(() => {
    if (!puCollege || puCollege.photos.length <= 1) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % puCollege.photos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [puCollege]);

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
    if (!puCollege) return;
    let newIndex;
    if (direction === 'prev') {
      newIndex = currentImageIndex === 0 ? puCollege.photos.length - 1 : currentImageIndex - 1;
    } else {
      newIndex = currentImageIndex === puCollege.photos.length - 1 ? 0 : currentImageIndex + 1;
    }
    setSelectedImage(puCollege.photos[newIndex]);
    setCurrentImageIndex(newIndex);
  };

  const nextHero = () => {
    if (!puCollege) return;
    setHeroIndex((prev) => (prev + 1) % puCollege.photos.length);
  };
  const prevHero = () => {
    if (!puCollege) return;
    setHeroIndex((prev) => (prev - 1 + puCollege.photos.length) % puCollege.photos.length);
  };

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
              onClick={() => navigate('/bookdemo')}
            >
              Book A Demo
            </motion.button>
          </div>
        </div>
      </header>

      {/* Loading / Error */}
      {loading && (
        <div className="flex justify-center items-center h-64 max-w-7xl mx-auto mt-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      )}
      {error && !loading && (
        <div className="text-center text-red-600 font-medium p-8 max-w-7xl mx-auto mt-8">
          {error}
        </div>
      )}

      {/* Main Content */}
      {puCollege && !loading && !error && (
        <>
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
                  src={puCollege.photos[heroIndex]}
                  alt={`${puCollege.name} - Photo ${heroIndex + 1}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/1200x600?text=PU+College';
                  }}
                  onClick={() => openImage(puCollege.photos[heroIndex], heroIndex)}
                  className="absolute inset-0 w-full h-full object-cover cursor-zoom-in"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                />
              </AnimatePresence>
            </div>

            {/* Arrows */}
            {puCollege.photos.length > 1 && (
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
            {puCollege.photos.length > 1 && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
                {puCollege.photos.map((_, i) => (
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
                {puCollege.name}
              </motion.h1>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <FaMapMarkerAlt className="mr-1 text-orange-300" />
                  <span>{puCollege.address}, {puCollege.city}</span>
                </div>
                <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <FaGraduationCap className="mr-1 text-orange-300" />
                  <span>{puCollege.board}</span>
                </div>
                <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <IoMdTime className="mr-1 text-orange-300" />
                  <span>Est. {puCollege.established}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center text-amber-300 text-xl">
                    <FaStar className="mr-1" /> {puCollege.rating}
                  </div>
                  <p className="text-xl font-semibold text-white">{puCollege.fees}</p>
                </div>
                <motion.a
                  href={`tel:${puCollege.phone}`}
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
                {['Basic Info', 'Photos', 'Streams', 'Fee Structure', 'Contact'].map(
                  (section) => (
                    <motion.button
                      key={section}
                      onClick={() =>
                        scrollToSection(section.replace(/\s+/g, '').toLowerCase())
                      }
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
                    PU College Information
                  </h2>
                  <BasicInfo puCollege={puCollege} />
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
                    PU College Gallery
                  </h2>
                  {puCollege.photos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {puCollege.photos.map((photo, index) => (
                        <motion.div
                          key={index}
                          className="relative aspect-square overflow-hidden rounded-xl cursor-pointer group"
                          whileHover={{ scale: 1.02 }}
                          onClick={() => openImage(photo, index)}
                        >
                          <img
                            src={photo}
                            alt={`${puCollege.name} - Photo ${index + 1}`}
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
                      No photos available for this PU college.
                    </p>
                  )}
                  {puCollege.photos.length > 0 && (
                    <p className="text-sm text-gray-500 mt-4 text-center">
                      Click on any photo to view in full size
                    </p>
                  )}
                </div>
              </motion.div>

              <motion.div
                id="streams"
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, margin: '-100px' }}
              >
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                    Streams Offered
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {puCollege.streams.map((stream, index) => (
                      <div
                        key={index}
                        className="bg-orange-50 p-4 rounded-lg border border-orange-100"
                      >
                        <h3 className="font-bold text-lg text-orange-800">{stream}</h3>
                      </div>
                    ))}
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
                  <FeeStructure puCollege={puCollege} />
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
                  <Contact puCollege={puCollege} />
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
                  <Review puCollege={puCollege} />
                </div>
              </motion.div>
            </div>

            {/* Right Column */}
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
                        <p className="font-medium">{puCollege.board}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="p-2 bg-orange-100 rounded-full mr-3">
                        <IoMdTime className="text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Established</p>
                        <p className="font-medium">{puCollege.established}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="p-2 bg-orange-100 rounded-full mr-3">
                        <FaBookOpen className="text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Streams</p>
                        {/* 👇 safe join */}
                        <p className="font-medium">{puCollege.streams.join(', ')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Image Modal */}
          <AnimatePresence>
            {selectedImage && puCollege.photos && puCollege.photos.length > 0 && (
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
                  alt={`${puCollege.name} - Photo ${currentImageIndex + 1}`}
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
                  Photo {currentImageIndex + 1} of {puCollege.photos.length}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* <StickyButton /> */}
    </div>
  );
};

export default PUCollegeDetails;