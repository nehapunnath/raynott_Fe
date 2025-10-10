import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaChalkboardTeacher, FaSearch, FaFilter, FaBookOpen, FaTimes, FaHome } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { BsFillCalendar2CheckFill } from "react-icons/bs";
import { TuitionCoachingApi } from '../services/TuitionCoachingApi';
import { useDebounce } from 'use-debounce';
import StickyButton from '../components/StickyButton';
import "tailwindcss";


// Memoized CoachingCard component to prevent unnecessary re-renders
const CoachingCard = React.memo(({ center }) => (
  <Link to={`/coaching-details/${center.id}`} className="group">
    <motion.div
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col w-full h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={center.centerImage || 'https://via.placeholder.com/800x400'}
          alt={center.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 flex items-center bg-white/90 text-orange-600 px-3 py-1 rounded-full shadow-lg backdrop-blur-sm">
          <span className="font-bold mr-1">{center.rating || 4.5}</span>
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow h-64">
        <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide">
          {center.subjects?.join(', ') || 'Various Courses'}
        </p>
        <h3 className="text-lg font-bold text-gray-900 mt-1 line-clamp-2 min-h-[4rem]">{center.name}</h3>
        <p className="text-sm text-gray-500 flex items-center mt-2">
          <IoLocationSharp className="mr-1 text-orange-400" />
          <span className="line-clamp-1">{center.address}, {center.city}</span>
        </p>
        <div className="mt-3">
          <p className="text-base font-bold text-gray-700">
            ₹{center.totalAnnualFee?.toLocaleString() || 'Contact for fees'}
          </p>
        </div>
        <div className="mt-auto pt-4">
          <div className="flex justify-between items-center space-x-2">
            <motion.button
              className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium py-2 px-3 rounded-lg w-full transition duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => e.preventDefault()}
            >
              Enquire Now
            </motion.button>
            <motion.button
              className="bg-transparent border border-orange-600 text-orange-600 hover:bg-orange-50 font-medium rounded-lg w-10 h-10 flex items-center justify-center transition duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => e.preventDefault()}
            >
              <i className="fas fa-phone-alt"></i>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  </Link>
));

function AllCoaching() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    feesRange: [0, 150000],
    courses: [],
    centerType: [],
    classRange: []
  });
  const [rawCoachingCenters, setRawCoachingCenters] = useState([]);
  const [coachingCenters, setCoachingCenters] = useState([]);
  const [allCoachingCenters, setAllCoachingCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  const coursesOptions = ['JEE', 'NEET', 'CAT', 'GMAT', 'KVPY', 'CBSE', 'ICSE', 'State Board'];
  const centerTypeOptions = ['Coaching Center', 'Tuition Center', 'Online Classes', 'Home Tutors'];
  const classRangeOptions = ['1-5', '6-8', '9-10', '11-12', 'College'];

  const nav = useNavigate();

  // Fetch all coaching centers
  useEffect(() => {
    const fetchCoachingCenters = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await TuitionCoachingApi.getTuitionCoachings();
        console.log('API Response:', response);
        if (response.success && response.data) {
          const centersArray = Object.keys(response.data).map(key => ({
            id: key,
            name: response.data[key].name || 'Unnamed Coaching Center',
            address: response.data[key].address || 'Unknown Location',
            city: response.data[key].city || 'Unknown',
            totalAnnualFee: response.data[key].totalAnnualFee 
              ? Number(response.data[key].totalAnnualFee)
              : 0,
            subjects: Array.isArray(response.data[key].subjects)
              ? response.data[key].subjects
              : (typeof response.data[key].subjects === 'string'
                ? response.data[key].subjects.split(',').map(s => s.trim())
                : ['JEE', 'NEET']),
            rating: response.data[key].rating || (Math.random() * (5 - 4) + 4).toFixed(1),
            centerImage: response.data[key].centerImage || 
                         'https://via.placeholder.com/800x400',
            typeOfCoaching: response.data[key].typeOfCoaching || 'Coaching Center',
            classes: response.data[key].classes || []
          }));
          console.log('Processed Centers:', centersArray);
          setRawCoachingCenters(centersArray);
          setCoachingCenters(centersArray);
          setAllCoachingCenters(centersArray);
        } else {
          setError('Failed to fetch coaching centers');
        }
      } catch (err) {
        console.error('Error fetching coaching centers:', err);
        setError(err.message || 'An error occurred while fetching coaching centers');
      } finally {
        setLoading(false);
      }
    };

    fetchCoachingCenters();
    window.scrollTo(0, 0);
  }, []);

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  // Search filtering
  const getSearchedCenters = useCallback(() => {
    if (!debouncedSearchQuery.trim()) {
      return rawCoachingCenters;
    }
    return rawCoachingCenters.filter((center) =>
      center.name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [debouncedSearchQuery, rawCoachingCenters]);

  // Client-side filtering
  const getFinalFilteredCenters = useCallback(() => {
    return getSearchedCenters().filter(center => {
      const centerFee = center.totalAnnualFee || 0;
      const centerCourses = center.subjects || [];
      const centerType = center.typeOfCoaching || '';
      const centerClasses = center.classes || [];
      
      const isFeeInRange = centerFee >= filters.feesRange[0] && centerFee <= filters.feesRange[1];
      const isCourseMatch = filters.courses.length === 0 || 
                           filters.courses.some(course => 
                             centerCourses.some(centerCourse => 
                               centerCourse.toLowerCase().includes(course.toLowerCase())
                             )
                           );
      const isTypeMatch = filters.centerType.length === 0 || 
                         filters.centerType.includes(centerType);
      const isClassMatch = filters.classRange.length === 0 || 
                          filters.classRange.some(range => 
                            centerClasses.some(cls => cls.includes(range))
                          );
      
      return isFeeInRange && isCourseMatch && isTypeMatch && isClassMatch;
    });
  }, [filters, getSearchedCenters]);

  const finalFilteredCenters = getFinalFilteredCenters();

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      if (filterType === 'feesRange') {
        return { ...prev, feesRange: value };
      } else {
        const currentValues = [...prev[filterType]];
        const index = currentValues.indexOf(value);
        if (index === -1) {
          currentValues.push(value);
        } else {
          currentValues.splice(index, 1);
        }
        return { ...prev, [filterType]: currentValues };
      }
    });
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      feesRange: [0, 150000],
      courses: [],
      centerType: [],
      classRange: []
    });
    setSearchQuery('');
    setCoachingCenters(rawCoachingCenters);
    setAllCoachingCenters(rawCoachingCenters);
  };

  // Apply filters via API
  const applyFilters = async () => {
    try {
      setLoading(true);
      setError(null);
      const filterParams = {
        typeOfCoaching: filters.centerType.join(','),
        subjects: filters.courses.join(','),
        maxFee: filters.feesRange[1]
      };
      console.log('Applying filters with params:', filterParams);
      const response = await TuitionCoachingApi.searchTuitionCoachings(filterParams);
      console.log('Filter API Response:', response);
      if (response.success && response.data) {
        const centersArray = Object.keys(response.data).map(key => ({
          id: key,
          name: response.data[key].name || 'Unnamed Coaching Center',
          address: response.data[key].address || 'Unknown Location',
          city: response.data[key].city || 'Unknown',
          totalAnnualFee: response.data[key].totalAnnualFee 
            ? Number(response.data[key].totalAnnualFee)
            : 0,
          subjects: Array.isArray(response.data[key].subjects)
            ? response.data[key].subjects
            : (typeof response.data[key].subjects === 'string'
              ? response.data[key].subjects.split(',').map(s => s.trim())
              : ['JEE', 'NEET']),
          rating: response.data[key].rating || (Math.random() * (5 - 4) + 4).toFixed(1),
          centerImage: response.data[key].centerImage || 
                       'https://via.placeholder.com/800x400',
          typeOfCoaching: response.data[key].typeOfCoaching || 'Coaching Center',
          classes: response.data[key].classes || []
        }));
        console.log('Filtered Centers:', centersArray);
        setCoachingCenters(centersArray);
        setAllCoachingCenters(centersArray);
      } else {
        setError('No coaching centers found for the selected filters');
        setCoachingCenters(rawCoachingCenters);
        setAllCoachingCenters(rawCoachingCenters);
      }
    } catch (err) {
      console.error('Error applying filters:', err);
      setError(err.message || 'An error occurred while applying filters');
      setCoachingCenters(rawCoachingCenters);
      setAllCoachingCenters(rawCoachingCenters);
    } finally {
      setLoading(false);
      setIsFilterOpen(false);
    }
  };

  return (
    <div className="bg-orange-50 min-h-screen font-sans">
      {/* Header */}
      <header className="bg-orange-600 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex w-full md:w-auto justify-between items-center mb-4 md:mb-0">
            <Link to="/" className="text-3xl font-extrabold text-white">
              <motion.span whileHover={{ scale: 1.05 }}>
                Raynott
              </motion.span>
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
              placeholder="Search All Coaching Centers..."
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
              onClick={() => nav('/bookdemo')}
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
              <span className="text-orange-600">All Coaching Centers</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mt-2">
              All Coaching Centers in India -
            </h1>
            <p className="text-lg text-gray-600 flex items-center mt-1">
              <BsFillCalendar2CheckFill className="mr-2 text-orange-500" />
              {finalFilteredCenters.length} Centers  
            </p>
          </div>
          <motion.button
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300 mt-4 md:mt-0 flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFilterOpen(true)}
          >
            <FaFilter className="mr-2" />
            Filters ({filters.courses.length + filters.centerType.length + filters.classRange.length + (filters.feesRange[0] !== 0 || filters.feesRange[1] !== 150000 ? 1 : 0)})
          </motion.button>
        </div>

        {loading && (
          <div className="text-center text-gray-600">Loading coaching centers...</div>
        )}
        {error && (
          <div className="text-center text-red-500">{error}</div>
        )}
        {!loading && !error && searchQuery && finalFilteredCenters.length === 0 && (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600">
              No coaching centers found matching "{searchQuery}".
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
            No coaching centers found. Please try different filters or check back later.
          </div>
        )}
        {!loading && !error && finalFilteredCenters.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="p-2 bg-orange-600 rounded-full mr-3">
                <FaChalkboardTeacher className="text-white" />
              </span>
              <span className="ml-2">All Coaching Centers</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {finalFilteredCenters.map((center) => (
                <CoachingCard key={center.id} center={center} />
              ))}
            </div>
          </div>
        )}
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
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Filter Coaching Centers</h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Fees Range (per year)</h3>
                  <div className="px-2">
                    <input
                      type="range"
                      min="0"
                      max="150000"
                      step="10000"
                      value={filters.feesRange[1]}
                      onChange={(e) => handleFilterChange('feesRange', [filters.feesRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between mt-2">
                      <span className="text-sm text-gray-600">₹0</span>
                      <span className="text-sm text-gray-600">₹1,50,000+</span>
                    </div>
                    <div className="mt-2 text-center font-medium text-orange-600">
                      ₹{filters.feesRange[0].toLocaleString()} - ₹{filters.feesRange[1].toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Courses Offered</h3>
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
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Center Type</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {centerTypeOptions.map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.centerType.includes(type)}
                          onChange={() => handleFilterChange('centerType', type)}
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Class Range</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {classRangeOptions.map((range) => (
                      <label key={range} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.classRange.includes(range)}
                          onChange={() => handleFilterChange('classRange', range)}
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
      <StickyButton />
    </div>
  );
}

export default AllCoaching;