import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaStar, FaTrophy, FaMapMarkerAlt, FaSchool, FaUniversity, FaChalkboardTeacher, FaTimes, FaGraduationCap, FaBookOpen } from 'react-icons/fa';
import { BsFillCalendar2CheckFill, BsCashStack } from 'react-icons/bs';
import { FaBookOpenReader } from 'react-icons/fa6';
import "tailwindcss";
import bestSellersApi from '../services/Bestsellersapi';
import StickyButton from '../components/StickyButton';

const BestSellers = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    institutionType: [],
    minRating: 0, // Show all ratings by default
    location: '' // Show all locations by default
  });
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const institutionTypes = ["School", "College", "PU College", "Coaching Center", "Tuition Center", "Professional Teacher", "Personal Mentor"];
  const ratingOptions = [0, 3.0, 3.5, 4.0, 4.5];
  const locationOptions = ["Bengaluru", "Delhi", "Mumbai", "Hyderabad", "Chennai"];

  // Normalize city names to handle variations
  const normalizeCity = (city) => {
    const cityMap = {
      'bangalore': 'Bengaluru',
      'bangaluru': 'Bengaluru',
      'bengaluru urban': 'Bengaluru',
      'delhi': 'Delhi',
      'new delhi': 'Delhi',
      'mumbai': 'Mumbai',
      'bombay': 'Mumbai',
      'hyderabad': 'Hyderabad',
      'chennai': 'Chennai',
      'madras': 'Chennai'
    };
    return cityMap[city?.toLowerCase()] || city || 'Not specified';
  };

  // Fetch best sellers data on mount
  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setLoading(true);
        const response = await bestSellersApi.getBestSellers({ limit: 5 });
        console.log('API Response:', response); // Debug: Log raw API response
        const { schools, colleges, puColleges, tuitionCoaching, professionalTeachers, personalMentors } = response.data;

        // Map API data to match component's expected institution structure
        const mappedInstitutions = [
          ...schools.map(item => ({
            id: item.id,
            name: item.name || 'Unnamed School',
            type: 'School',
            location: normalizeCity(item.city),
            rating: parseFloat(item.rating) || 0,
            reviews: item.reviewCount || 0,
            image: item.image,
            isFeatured: (parseFloat(item.rating) || 0) >= 4.8,
            detailsLink: `/school-details/${item.id}`,
            slug: item.name ? item.name.toLowerCase().replace(/\s+/g, '-') : 'unnamed-school',
            established: item.established ,// Use API data if available
            feeRange: item.feeRange ,
            features: item.features 
          })),
          ...colleges.map(item => ({
            id: item.id,
            name: item.name || 'Unnamed College',
            type: 'College',
            location: normalizeCity(item.city),
            rating: parseFloat(item.rating) || 0,
            reviews: item.reviewCount || 0,
            image: item.image || 'https://images.unsplash.com/photo-1549861833-c5932fd19229?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
            isFeatured: (parseFloat(item.rating) || 0) >= 4.8,
            detailsLink: `/college-details/${item.id}`,
            slug: item.name ? item.name.toLowerCase().replace(/\s+/g, '-') : 'unnamed-college',
            established: item.established || 1969,
            feeRange: item.feeRange ,
            features: item.features || ['NAAC A++', 'Research Programs', 'International Exchange']
          })),
          ...puColleges.map(item => ({
            id: item.id,
            name: item.name || 'Unnamed PU College',
            type: 'PU College',
            location: normalizeCity(item.city),
            rating: parseFloat(item.rating) || 0,
            reviews: item.reviewCount || 0,
            image: item.image || 'https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            isFeatured: (parseFloat(item.rating) || 0) >= 4.8,
            detailsLink: `/pucollege-details/${item.id}`,
            slug: item.name ? item.name.toLowerCase().replace(/\s+/g, '-') : 'unnamed-pu-college',
            established: item.establishmentYear || 1985,
            feeRange: item.feeRange || '₹75,000 - ₹1,50,000/year',
            features: item.features || ['Science Focus', 'Competitive Exams', 'Scholarships']
          })),
          ...tuitionCoaching.map(item => ({
            id: item.id,
            name: item.name || 'Unnamed Center',
            type: item.type === 'tuitioncoaching' ? 'Tuition Center' : 'Coaching Center',
            location: normalizeCity(item.city),
            rating: parseFloat(item.rating) || 0,
            reviews: item.reviewCount || 0,
            image: item.image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            isFeatured: (parseFloat(item.rating) || 0) >= 4.8,
            detailsLink: item.type === 'tuitioncoaching' ? `/tuition-details/${item.id}` : `/coaching-details/${item.id}`,
            slug: item.name ? item.name.toLowerCase().replace(/\s+/g, '-') : 'unnamed-center',
            established: item.established || 1992,
            feeRange: item.feeRange || '₹1,20,000 - ₹2,80,000/year',
            features: item.features || ['Olympiad Prep', 'Test Series', 'Doubt Clearing']
          })),
          ...professionalTeachers.map(item => ({
            id: item.id,
            name: item.name || 'Unnamed Teacher',
            type: 'Professional Teacher',
            location: normalizeCity(item.city),
            rating: parseFloat(item.rating) || 0,
            reviews: item.reviewCount || 0,
            image: item.image || 'https://cdn.eduadvisor.my/articles/2022/04/how-to-be-teacher-malaysia-feature.png',
            isFeatured: (parseFloat(item.rating) || 0) >= 4.8,
            detailsLink: `/professional-teachers-details/${item.id}`,
            slug: item.name ? item.name.toLowerCase().replace(/\s+/g, '-') : 'unnamed-teacher',
            established: item.established || 2000,
            fees: item.fees || '₹800 - ₹1200/hr',
            features: item.features || ['Mathematics', 'Physics', 'PhD Qualified']
          })),
          ...personalMentors.map(item => ({
            id: item.id,
            name: item.name || 'Unnamed Mentor',
            type: 'Personal Mentor',
            location: normalizeCity(item.city),
            rating: parseFloat(item.rating) || 0,
            reviews: item.reviewCount || 0,
            image: item.image || 'https://cdn.eduadvisor.my/articles/2022/04/how-to-be-teacher-malaysia-feature.png',
            isFeatured: (parseFloat(item.rating) || 0) >= 4.8,
            detailsLink: `/personal-teachers-details/${item.id}`,
            slug: item.name ? item.name.toLowerCase().replace(/\s+/g, '-') : 'unnamed-mentor',
            established: item.established || 2000,
            fees: item.fees || '₹800 - ₹1200/hr',
            features: item.features || ['Personalized Learning', 'Career Guidance']
          }))
        ];

        console.log('Mapped Institutions:', mappedInstitutions); // Debug: Log mapped data
        setInstitutions(mappedInstitutions);
      } catch (err) {
        setError(err.message || 'Failed to fetch best sellers');
        console.error('API Error:', err); // Debug: Log error details
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
    window.scrollTo(0, 0);
  }, []);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      if (filterType === 'minRating' || filterType === 'location') {
        return { ...prev, [filterType]: value };
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

  const resetFilters = () => {
    setFilters({
      institutionType: [],
      minRating: 0,
      location: ''
    });
  };

  const applyFilters = () => {
    setIsFilterOpen(false);
  };

  const filteredInstitutions = institutions.filter(institution => {
    if (searchQuery && 
        !institution.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !institution.location.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filters.institutionType.length > 0 && !filters.institutionType.includes(institution.type)) {
      return false;
    }
    if (filters.minRating > 0 && institution.rating < filters.minRating) {
      return false;
    }
    if (filters.location && !institution.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getInstitutionIcon = (type) => {
    switch (type) {
      case 'School': return <FaSchool className="text-orange-500" />;
      case 'College': return <FaUniversity className="text-orange-500" />;
      case 'PU College': return <FaGraduationCap className="text-orange-500" />;
      case 'Coaching Center': return <FaChalkboardTeacher className="text-orange-500" />;
      case 'Tuition Center': return <FaBookOpenReader className="text-orange-500" />;
      case 'Professional Teacher': return <FaChalkboardTeacher className="text-orange-500" />;
      case 'Personal Mentor': return <FaBookOpen className="text-orange-500" />;
      default: return <FaSchool className="text-orange-500" />;
    }
  };

  const handleViewDetails = (institution) => {
    navigate(institution.detailsLink, { state: { institution } });
  };

  if (loading) {
    return (
      <div className="bg-orange-50 min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading best sellers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-orange-50 min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">
          {error}
          <button
            onClick={() => window.location.reload()}
            className="ml-4 bg-orange-600 hover:bg-orange-700 text-white font-medium py-1 px-4 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-orange-50 min-h-screen font-sans">
      {/* Debug Info */}
      <div className="text-gray-600 text-sm max-w-7xl mx-auto px-4 py-2">
        Debug: {institutions.length} total institutions, Filters: {JSON.stringify(filters)}
      </div>

      <header className="bg-orange-600 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex w-full md:w-auto justify-between items-center mb-4 md:mb-0">
            <Link to="/" className="text-3xl font-extrabold text-white">
              <motion.span whileHover={{ scale: 1.05 }}>
                Raynott
              </motion.span>
            </Link>
          </div>

          <div className="relative w-full max-w-2xl md:max-w-xl flex-grow md:ml-8">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400" />
            <input
              type="text"
              placeholder="Search institutions, locations..."
              className="pl-12 pr-4 py-3 rounded-full bg-white border border-transparent text-gray-800 focus:outline-none w-full focus:ring-2 focus:ring-orange-200 focus:border-transparent shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <div className="text-sm text-gray-500 flex items-center">
              <Link to="/" className="flex items-center hover:text-orange-600">
                <FaSchool className="mr-1 text-orange-500" />
                Home
              </Link>
              <span className="mx-2">»</span>
              <span className="text-orange-600">Best Sellers</span>
            </div>
            <div className="flex items-center mt-2">
              <FaTrophy className="text-3xl text-amber-500 mr-3" />
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
                Top Rated Institutions
              </h1>
            </div>
            <p className="text-lg text-gray-600 flex items-center mt-1">
              <BsFillCalendar2CheckFill className="mr-2 text-orange-500" />
              {filteredInstitutions.length} Institutions | Updated on Oct 10, 2025
            </p>
          </div>
          <motion.button
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300 mt-4 md:mt-0 flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFilterOpen(true)}
          >
            <FaFilter className="mr-2" />
            Filters
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstitutions.map((institution) => (
            <motion.div
              key={institution.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={institution.image}
                  alt={institution.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                {institution.isFeatured && (
                  <div className="absolute top-4 left-4 bg-yellow-500 text-dark text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    Featured
                  </div>
                )}
                <div className="absolute top-4 right-4 flex items-center bg-white/90 text-orange-600 px-3 py-1 rounded-full shadow-lg backdrop-blur-sm">
                  <span className="font-bold mr-1">{institution.rating}</span>
                  <FaStar className="w-4 h-4 fill-current" />
                </div>
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-gray-900">{institution.name}</h3>
                  <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                    {institution.type}
                  </span>
                </div>
                
                {/* <div className="mt-2 flex items-center text-sm text-orange-600 font-medium">
                  {getInstitutionIcon(institution.type)}
                  <span className="ml-2">Est. {institution.established}</span>
                </div> */}

                {/* <div className="mt-3 flex flex-wrap gap-2">
                  {institution.features?.map((feature, index) => (
                    <span key={index} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                      {feature}
                    </span>
                  ))}
                </div> */}

                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <FaMapMarkerAlt className="mr-2 text-orange-500" />
                    <span>{institution.location}</span>
                  </div>
                  {/* <div className="flex items-center text-sm text-gray-600">
                    <BsCashStack className="mr-2 text-orange-500" />
                    <span>{institution.feeRange || institution.fees}</span>
                  </div> */}
                  <div className="flex items-center text-sm text-gray-600">
                    <FaStar className="mr-2 text-orange-500" />
                    <span>{institution.rating} ({institution.reviews} reviews)</span>
                  </div>
                </div>

                <div className="mt-auto pt-4">
                  <div className="flex justify-between items-center space-x-2">
                    <Link 
                      to={institution.detailsLink}
                      state={{ institution }}
                      className="w-full"
                    >
                      <motion.button
                        className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium py-2 px-3 rounded-lg w-full transition duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        View Details
                      </motion.button>
                    </Link>
                    {/* <motion.button
                      className="bg-transparent border border-orange-600 text-orange-600 hover:bg-orange-50 font-medium rounded-lg w-10 h-10 flex items-center justify-center transition duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaMapMarkerAlt />
                    </motion.button> */}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredInstitutions.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No institutions found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or search query</p>
            <button
              onClick={resetFilters}
              className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

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
                  <h2 className="text-2xl font-bold text-gray-800">Filter Institutions</h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Minimum Rating</h3>
                  <div className="flex flex-wrap gap-3">
                    {ratingOptions.map((rating) => (
                      <button
                        key={rating}
                        onClick={() => handleFilterChange('minRating', rating)}
                        className={`px-4 py-2 rounded-full ${filters.minRating === rating ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        {rating === 0 ? 'Any' : `${rating}+`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Institution Type</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {institutionTypes.map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.institutionType.includes(type)}
                          onChange={() => handleFilterChange('institutionType', type)}
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Location</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="location"
                        checked={filters.location === ''}
                        onChange={() => handleFilterChange('location', '')}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">Any</span>
                    </label>
                    {locationOptions.map((location) => (
                      <label key={location} className="flex items-center">
                        <input
                          type="radio"
                          name="location"
                          checked={filters.location === location}
                          onChange={() => handleFilterChange('location', location)}
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">{location}</span>
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
};

export default BestSellers;