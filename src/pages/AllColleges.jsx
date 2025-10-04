import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaUniversity, FaSearch, FaFilter, FaBookOpen, FaTimes, FaHome, FaSpinner } from 'react-icons/fa';
import { IoLocationSharp } from 'react-icons/io5';
import { BsFillCalendar2CheckFill } from 'react-icons/bs';
import Footer from '../components/Footer';
import StickyButton from '../components/StickyButton';
import { collegeApi } from '../services/collegeApi';

function AllColleges() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    feesRange: [0, 300000],
    type: [],
    location: '',
    courses: [],
  });

  const typeOptions = ['Private', 'Government', 'Autonomous', 'Deemed University', 'Private University'];
  const courseOptions = ['Engineering', 'Medical', 'Arts', 'Commerce', 'Science', 'Law', 'Management'];

  const nav = useNavigate();

  // Fetch colleges on component mount
  useEffect(() => {
    fetchColleges();
  }, []);

  // Apply filters whenever filters or searchQuery change
  useEffect(() => {
    applyFilters();
  }, [filters, searchQuery, colleges]);

  const fetchColleges = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await collegeApi.getColleges();
      
      if (response.success) {
        // Convert object of colleges to array
        const collegesArray = response.data ? Object.values(response.data) : [];
        setColleges(collegesArray);
        setFilteredColleges(collegesArray);
      } else {
        setError('Failed to fetch colleges');
        setColleges([]);
        setFilteredColleges([]);
      }
    } catch (err) {
      console.error('Error fetching colleges:', err);
      setError('Failed to load colleges. Please try again later.');
      setColleges([]);
      setFilteredColleges([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => {
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

  const applyFilters = () => {
    let result = [...colleges];

    // Apply search filter
    if (searchQuery.trim()) {
      result = result.filter((college) =>
        college.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (college.city?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (college.coursesOffered?.some((course) =>
          course.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      );
    }

    // Apply fee range filter
    if (filters.feesRange[0] !== 0 || filters.feesRange[1] !== 300000) {
      result = result.filter(
        (college) =>
          college.totalAnnualFee >= filters.feesRange[0] &&
          college.totalAnnualFee <= filters.feesRange[1]
      );
    }

    // Apply type filter
    if (filters.type.length > 0) {
      result = result.filter((college) =>
        college.typeOfCollege && filters.type.includes(college.typeOfCollege)
      );
    }

    // Apply location filter
    if (filters.location) {
      result = result.filter((college) =>
        college.city?.toLowerCase() === filters.location.toLowerCase()
      );
    }

    // Apply course filter
    if (filters.courses.length > 0) {
      result = result.filter((college) =>
        college.coursesOffered?.some((course) => filters.courses.includes(course))
      );
    }

    setFilteredColleges(result);
    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    setFilters({
      feesRange: [0, 300000],
      type: [],
      location: '',
      courses: [],
    });
    setSearchQuery('');
  };

  const getUniqueCities = () => {
    const cities = colleges
      .map((college) => college.city)
      .filter((city) => city)
      .filter((city, index, self) => self.indexOf(city) === index);
    return cities.sort();
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-orange-600 mx-auto mb-4" />
          <p className="text-gray-700">Loading colleges...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchColleges}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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

          <div className="relative w-full max-w-2xl md:max-w-xl flex-grow md:ml-8">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400" />
            <input
              type="text"
              placeholder="Search Colleges by Name"
              value={searchQuery}
              onChange={handleSearch}
              className="pl-12 pr-10 py-3 rounded-full bg-white border border-transparent text-gray-800 focus:outline-none w-full focus:ring-2 focus:ring-orange-200 focus:border-transparent shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
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
        {/* Page Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <div className="text-sm text-gray-500 flex items-center">
              <Link to="/" className="flex items-center hover:text-orange-600">
                <FaHome className="mr-1 text-orange-500" />
                Home
              </Link>
              <span className="mx-2">»</span>
              <span className="text-orange-600">Colleges</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mt-2">
              Top Colleges in India 
            </h1>
            <p className="text-lg text-gray-600 flex items-center mt-1">
              <BsFillCalendar2CheckFill className="mr-2 text-orange-500" />
              {filteredColleges.length} Colleges 
            </p>
          </div>
          <motion.button
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300 mt-4 md:mt-0 flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFilterOpen(true)}
          >
            <FaFilter className="mr-2" />
            Filters ({filters.type.length + filters.courses.length + (filters.location ? 1 : 0)})
          </motion.button>
        </div>

        {/* College List */}
        {filteredColleges.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredColleges.map((college) => (
              <Link
                to={`/college-details/${college.id}`}
                key={college.id}
                className="group"
              >
                <motion.div
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col w-full h-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={college.collegeImage || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                      alt={college.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 flex items-center bg-white/90 text-orange-600 px-3 py-1 rounded-full shadow-lg backdrop-blur-sm">
                      <span className="font-bold mr-1">{college.rating || 'N/A'}</span>
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-grow h-64">
                    <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide">
                      {college.typeOfCollege || 'College'}
                    </p>
                    <h3 className="text-lg font-bold text-gray-900 mt-1 line-clamp-2 min-h-[4rem]">
                      {college.name}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center mt-2">
                      <IoLocationSharp className="mr-1 text-orange-400" />
                      <span className="line-clamp-1">
                        {college.city}, {college.state}
                      </span>
                    </p>
                    <div className="mt-3">
                      <p className="text-base font-bold text-gray-700">
                        ₹{college.totalAnnualFee ? college.totalAnnualFee.toLocaleString() : 'N/A'}
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
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FaUniversity className="text-5xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">
              {searchQuery ? `No colleges found matching "${searchQuery}"` : 'No colleges found'}
            </h3>
            <p className="text-gray-500 mt-2">
              Try adjusting your filters or search query
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
            >
              Reset Filters
            </button>
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
              transition={{ type: 'spring', damping: 25 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Filter Colleges</h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>

                {/* Fees Range Filter */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Fees Range (per year)</h3>
                  <div className="px-2">
                    <input
                      type="range"
                      min="0"
                      max="300000"
                      step="10000"
                      value={filters.feesRange[1]}
                      onChange={(e) => handleFilterChange('feesRange', [filters.feesRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between mt-2">
                      <span className="text-sm text-gray-600">₹0</span>
                      <span className="text-sm text-gray-600">₹3,00,000+</span>
                    </div>
                    <div className="mt-2 text-center font-medium text-orange-600">
                      ₹{filters.feesRange[0].toLocaleString()} - ₹{filters.feesRange[1].toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Type Filter */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">College Type</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {typeOptions.map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.type.includes(type)}
                          onChange={() => handleFilterChange('type', type)}
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Location Filter */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Location</h3>
                  <select
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">All Locations</option>
                    {getUniqueCities().map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Course Filter */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Courses Offered</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {courseOptions.map((course) => (
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

                {/* Action Buttons */}
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
      {/* <Footer /> */}
      <StickyButton />
    </div>
  );
}

export default AllColleges;