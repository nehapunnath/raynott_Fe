import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaChalkboardTeacher,
  FaSearch,
  FaFilter,
  FaBookOpen,
  FaTimes,
  FaHome,
  FaUserLock,
} from 'react-icons/fa';
import { IoLocationSharp } from 'react-icons/io5';
import { BsFillCalendar2CheckFill } from 'react-icons/bs';
import { TuitionCoachingApi } from '../services/TuitionCoachingApi';
import StickyButton from '../components/StickyButton';
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

// 👇 Validation: only accept real http(s) URLs
const isValidUrl = (val) =>
  typeof val === 'string' &&
  val.trim().length > 0 &&
  val.trim().toLowerCase() !== 'null' &&
  val.trim().toLowerCase() !== 'undefined' &&
  val.trim().startsWith('http');

// 👇 Pick first valid photo from array (handles string or { url } shapes)
const pickFirstPhoto = (photos) => {
  if (!Array.isArray(photos)) return null;
  for (const p of photos) {
    if (isValidUrl(p)) return p;
    if (p && typeof p === 'object') {
      if (isValidUrl(p.url)) return p.url;
      if (isValidUrl(p.image)) return p.image;
      if (isValidUrl(p.src)) return p.src;
    }
  }
  return null;
};

// 👇 Resolve image with fallback chain
const getCenterImage = (center) => {
  if (isValidUrl(center.centerImage)) return center.centerImage;
  if (isValidUrl(center.image)) return center.image;

  const fromPhotos =
    pickFirstPhoto(center.photos) ||
    pickFirstPhoto(center.images) ||
    pickFirstPhoto(center.gallery) ||
    pickFirstPhoto(center.photoGallery);
  if (fromPhotos) return fromPhotos;

  return null;
};

// 👇 Safe array (handles strings, null, undefined)
const safeArray = (value, fallback = []) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string' && value.trim()) {
    return value.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return fallback;
};

// 👇 Parse a fees string like "₹50,000 - ₹60,000" into [min, max]
const parseFeesRange = (feesString) => {
  if (typeof feesString !== 'string') return [0, 150000];
  const nums = feesString
    .replace(/[₹,]/g, '')
    .split('-')
    .map((n) => parseInt(n.trim(), 10))
    .filter((n) => !isNaN(n));
  if (nums.length === 0) return [0, 150000];
  if (nums.length === 1) return [nums[0], nums[0]];
  return [nums[0], nums[1]];
};

function CoachingList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false); // 👈 popup state
  const [filters, setFilters] = useState({
    feesRange: [0, 150000],
    courses: [],
    centerType: [],
    classRange: [],
    location: 'Bengaluru',
  });
  const [coachingCenters, setCoachingCenters] = useState([]);
  const [allCoachingCenters, setAllCoachingCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const coursesOptions = [
    'JEE',
    'NEET',
    'CAT',
    'GMAT',
    'KVPY',
    'CBSE',
    'ICSE',
    'State Board',
  ];
  const centerTypeOptions = [
    'Coaching Center',
    'Tuition Center',
    'Online Classes',
    'Home Tutors',
  ];
  const classRangeOptions = ['1-5', '6-8', '9-10', '11-12', 'College'];

  const normalizeCity = (city) => {
    if (!city) return 'Bengaluru';
    const cleanCity = city.trim().toLowerCase();
    return cityNormalizationMap[cleanCity] || city;
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const city = normalizeCity(queryParams.get('city'));
    setFilters((prev) => ({ ...prev, location: city }));
    fetchCoachingCenters(city);
  }, [location.search]);

  const fetchCoachingCenters = async (city) => {
    try {
      setLoading(true);
      setError(null);
      const response = await TuitionCoachingApi.getTuitionCoachings();
      console.log('Coaching Centers API response:', response);

      let centersArray = [];
      if (response.success && response.data) {
        centersArray = Array.isArray(response.data)
          ? response.data
          : Object.values(response.data);
      }

      const normalizedCity = normalizeCity(city);
      const filteredCenters = centersArray
        .filter((center) => {
          const centerCity =
            center.city || center.addressCity || center.location || 'Unknown';
          return (
            normalizeCity(centerCity).toLowerCase() ===
            normalizedCity.toLowerCase()
          );
        })
        .map((center) => {
          const subjectsArr = safeArray(center.subjects, ['JEE', 'NEET']);
          return {
            id:
              center.id ||
              center._id ||
              Math.random().toString(36).substr(2, 9),
            name: center.name || 'Unnamed Coaching Center',
            location: center.address || 'Unknown Location',
            fees: center.totalAnnualFee
              ? `₹${Number(center.totalAnnualFee).toLocaleString()} - ₹${(
                  Number(center.totalAnnualFee) + 10000
                ).toLocaleString()}`
              : '₹8,000 - ₹150,000',
            views: `${Math.floor(Math.random() * 5000 + 5000)} Views`,
            courses: subjectsArr.join(', '),
            rating: center.rating || (Math.random() * (5 - 4) + 4).toFixed(1),
            image: getCenterImage(center),
            typeOfCoaching: center.typeOfCoaching || 'Coaching Center',
            originalData: center,
          };
        });

      setCoachingCenters(filteredCenters);
      setAllCoachingCenters(filteredCenters);
    } catch (err) {
      console.error('Error fetching Coaching Centers:', err);
      setError(
        `Failed to load Coaching Centers for ${normalizeCity(
          city
        )}. Please try again later.`
      );
      setCoachingCenters([]);
      setAllCoachingCenters([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const clearSearch = () => setSearchQuery('');

  // 👇 Enquire Now → login popup
  const handleEnquireNow = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowLoginPrompt(true);
  }, []);

  const goToLogin = () => {
    setShowLoginPrompt(false);
    navigate('/login');
  };

  const getSearchedCenters = () => {
    if (!searchQuery.trim()) return coachingCenters;
    return coachingCenters.filter((center) =>
      center.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const searchedCenters = getSearchedCenters();

  const getFinalFilteredCenters = () => {
    return searchedCenters.filter((center) => {
      const [feeMin, feeMax] = parseFeesRange(center.fees);
      const centerCourses = center.courses
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const isFeeInRange =
        feeMin >= filters.feesRange[0] && feeMax <= filters.feesRange[1];
      const isCourseMatch =
        filters.courses.length === 0 ||
        filters.courses.some((course) => centerCourses.includes(course));
      const isTypeMatch =
        filters.centerType.length === 0 ||
        filters.centerType.includes(center.typeOfCoaching);

      return isFeeInRange && isCourseMatch && isTypeMatch;
    });
  };

  const finalFilteredCenters = getFinalFilteredCenters();

  const groupedCenters = finalFilteredCenters.reduce((acc, center) => {
    const type = center.typeOfCoaching || 'Coaching Center';
    if (!acc[type]) acc[type] = [];
    acc[type].push(center);
    return acc;
  }, {});

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => {
      if (filterType === 'feesRange') {
        return { ...prev, feesRange: value };
      } else {
        const currentValues = [...prev[filterType]];
        const index = currentValues.indexOf(value);
        if (index === -1) currentValues.push(value);
        else currentValues.splice(index, 1);
        return { ...prev, [filterType]: currentValues };
      }
    });
  };

  const resetFilters = () => {
    setFilters({
      feesRange: [0, 150000],
      courses: [],
      centerType: [],
      classRange: [],
      location: filters.location,
    });
    setSearchQuery('');
  };

  const applyFilters = () => setIsFilterOpen(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-orange-50 min-h-screen font-sans">
      {/* Header */}
      <header className="bg-orange-600 shadow-md sticky top-0 z-50">
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

          <div className="relative w-full max-w-2xl md:max-w-xl flex-grow md:ml-8">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400" />
            <input
              type="text"
              placeholder={`Search Coaching Centers, Tuitions in ${filters.location}...`}
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-12 pr-10 py-3 rounded-full bg-white border border-transparent text-gray-800 focus:outline-none w-full focus:ring-2 focus:ring-orange-200 focus:border-transparent shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            )}
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <div className="text-sm text-gray-500 flex items-center">
              <Link to="/" className="flex items-center hover:text-orange-600">
                <FaHome className="mr-1 text-orange-500" />
                Home
              </Link>
              <span className="mx-2">»</span>
              <span className="text-orange-600">{filters.location}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mt-2">
              Coaching & Tuition Centers In {filters.location}
            </h1>
            <p className="text-lg text-gray-600 flex items-center mt-1">
              <BsFillCalendar2CheckFill className="mr-2 text-orange-500" />
              {finalFilteredCenters.length} Centers
            </p>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        )}

        {error && !loading && (
          <div className="text-center text-red-600 font-medium p-4">{error}</div>
        )}

        {!loading && !error && searchQuery && finalFilteredCenters.length === 0 && (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600">
              No coaching centers found in {filters.location} matching "
              {searchQuery}".
            </p>
            <button
              onClick={clearSearch}
              className="mt-4 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
            >
              Clear Search
            </button>
          </div>
        )}

        {!loading && !error && !searchQuery && finalFilteredCenters.length === 0 && (
          <div className="text-center text-gray-600 font-medium p-8">
            No Coaching Centers found in {filters.location}. Please select a
            different city from the menu or check back later.
          </div>
        )}

        {!loading &&
          !error &&
          Object.keys(groupedCenters).length > 0 &&
          Object.keys(groupedCenters).map((type, index) => (
            <div key={index} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="p-2 bg-orange-600 rounded-full mr-3">
                  <FaChalkboardTeacher className="text-white" />
                </span>
                <span className="ml-2">
                  {type} in {filters.location}
                </span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {groupedCenters[type].map((center) => (
                  <Link
                    to={`/coaching-details/${center.id}`}
                    key={center.id}
                    className="group"
                  >
                    <motion.div
                      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col w-full h-full"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      whileHover={{ y: -5 }}
                    >
                      {/* 👇 Only render image block if there's a valid photo */}
                      {center.image && (
                        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                          <img
                            src={center.image}
                            alt={center.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                            }}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute top-4 right-4 flex items-center bg-white/90 text-orange-600 px-3 py-1 rounded-full shadow-lg backdrop-blur-sm">
                            <span className="font-bold mr-1">
                              {center.rating}
                            </span>
                            <svg
                              className="w-4 h-4 fill-current"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                        </div>
                      )}

                      <div className="p-4 flex flex-col flex-grow h-64">
                        <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide">
                          {center.courses}
                        </p>
                        <h3 className="text-lg font-bold text-gray-900 mt-1 line-clamp-2 min-h-[4rem]">
                          {center.name}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center mt-2">
                          <IoLocationSharp className="mr-1 text-orange-400" />
                          <span className="line-clamp-1">{center.location}</span>
                        </p>

                        <div className="mt-3">
                          <p className="text-base font-bold text-gray-700">
                            {center.fees}
                          </p>
                        </div>

                        <div className="mt-auto pt-4">
                          <div className="flex justify-between items-center space-x-2">
                            {/* 👇 Enquire Now triggers popup */}
                            <motion.button
                              className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium py-2 px-3 rounded-lg w-full transition duration-300"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={handleEnquireNow}
                            >
                              Enquire Now
                            </motion.button>
                            <motion.button
                              className="bg-transparent border border-orange-600 text-orange-600 hover:bg-orange-50 font-medium rounded-lg w-10 h-10 flex items-center justify-center transition duration-300"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={handleEnquireNow}
                              aria-label="Enquire"
                            >
                              <i className="fas fa-phone-alt"></i>
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
      </main>

      {/* Filter Modal */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Filter Coaching Centers
                  </h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">
                    Fees Range (per year)
                  </h3>
                  <div className="px-2">
                    <input
                      type="range"
                      min="0"
                      max="150000"
                      step="10000"
                      value={filters.feesRange[1]}
                      onChange={(e) =>
                        handleFilterChange('feesRange', [
                          filters.feesRange[0],
                          parseInt(e.target.value),
                        ])
                      }
                      className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between mt-2">
                      <span className="text-sm text-gray-600">₹0</span>
                      <span className="text-sm text-gray-600">₹1,50,000+</span>
                    </div>
                    <div className="mt-2 text-center font-medium text-orange-600">
                      ₹{filters.feesRange[0].toLocaleString()} - ₹
                      {filters.feesRange[1].toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">
                    Courses Offered
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {coursesOptions.map((course) => (
                      <label key={course} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.courses.includes(course)}
                          onChange={() => handleFilterChange('courses', course)}
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-gray-700">{course}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">
                    Center Type
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {centerTypeOptions.map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.centerType.includes(type)}
                          onChange={() =>
                            handleFilterChange('centerType', type)
                          }
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">
                    Class Range
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {classRangeOptions.map((range) => (
                      <label key={range} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.classRange.includes(range)}
                          onChange={() =>
                            handleFilterChange('classRange', range)
                          }
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-gray-700">{range}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between border-t pt-4">
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 text-orange-600 font-medium hover:bg-orange-50 rounded-lg"
                  >
                    Reset All
                  </button>
                  <div className="space-x-3">
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={applyFilters}
                      className="px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 👇 Login Prompt Popup */}
      <AnimatePresence>
        {showLoginPrompt && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLoginPrompt(false)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: 'spring', damping: 22 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                <FaTimes className="text-lg" />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center mb-4 shadow-lg">
                  <FaUserLock className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Login Required
                </h3>
                <p className="text-gray-600 mb-6">
                  Dear Parents, please login to enquire about this coaching
                  center. It only takes a few seconds!
                </p>

                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <button
                    onClick={() => setShowLoginPrompt(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={goToLogin}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-amber-700 transition shadow-md"
                  >
                    Login Now
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* <Footer /> */}
      {/* <StickyButton /> */}
    </div>
  );
}

export default CoachingList;