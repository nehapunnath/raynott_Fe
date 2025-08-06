import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaStar, FaTrophy, FaMapMarkerAlt, FaSchool, FaUniversity, FaChalkboardTeacher, FaTimes, FaGraduationCap, FaBookOpen } from 'react-icons/fa';
import { BsFillCalendar2CheckFill, BsCashStack } from 'react-icons/bs';
import StickyButton from '../components/StickyButton';
import { FaBookOpenReader } from 'react-icons/fa6';

const BestSellers = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    institutionType: [],
    minRating: 4.5,
    location: 'Bengaluru'
  });
  const navigate = useNavigate();

  const institutions = [
    {
      id: 1,
      name: "New Horizon International School",
      type: "School",
      location: "HSR Layout, Bengaluru",
      rating: 4.9,
      reviews: 245,
      features: ["CBSE Board", "Digital Classrooms", "Sports Academy"],
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      isFeatured: true,
      established: 1995,
      feeRange: "₹1,00,000 - ₹2,50,000/year",
      slug: "delhi-public-school",
      detailsLink: "/school-details"
    },
    {
      id: 2,
      name: "New Horizon College of Engineering",
      type: "College",
      location: "Hosur Road, Bengaluru",
      rating: 4.8,
      reviews: 312,
      features: ["NAAC A++", "Research Programs", "International Exchange"],
      image: "https://images.unsplash.com/photo-1549861833-c5932fd19229?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      isFeatured: true,
      established: 1969,
      feeRange: "₹2,50,000 - ₹5,00,000/year",
      slug: "christ-university",
      detailsLink: "/college-details"
    },
    {
      id: 3,
      name: "Narayana PU College",
      type: "PU College",
      location: "Jayanagar, Bengaluru",
      rating: 4.7,
      reviews: 187,
      features: ["Science Focus", "Competitive Exams", "Scholarships"],
      image: "https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      isFeatured: false,
      established: 1985,
      feeRange: "₹75,000 - ₹1,50,000/year",
      slug: "narayana-pu-college",
      detailsLink: "/pucollege-details"
    },
    {
      id: 4,
      name: "Brilliant Minds Coaching Center",
      type: "Coaching Center",
      location: "Koramangala, Bengaluru",
      rating: 4.6,
      reviews: 276,
      features: ["IIT-JEE Prep", "NEET Coaching", "Study Materials"],
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
      established: 1988,
      feeRange: "₹1,50,000 - ₹3,00,000/year",
      slug: "aakash-institute",
      detailsLink: "/coaching-details"
    },
    {
      id: 5,
      name: "Bright Minds Tuition Center",
      type: "Tuition Center",
      location: "Indiranagar, Bengaluru",
      rating: 4.5,
      reviews: 198,
      features: ["Olympiad Prep", "Test Series", "Doubt Clearing"],
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      isFeatured: false,
      established: 1992,
      feeRange: "₹1,20,000 - ₹2,80,000/year",
      slug: "fiitjee",
      detailsLink: "/coaching-details"
    },
    {
      id: 6,
      name: "Vibrant Academy",
      type: "Tuition Center",
      location: "Whitefield, Bengaluru",
      rating: 4.4,
      reviews: 132,
      features: ["Personalized Learning", "Small Batches", "Regular Tests"],
      image: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      isFeatured: true,
      established: 2005,
      feeRange: "₹50,000 - ₹1,00,000/year",
      slug: "vibrant-academy",
      detailsLink: "/teachers-details"
    },
    {
      id: 7,
      name: "Dr. Priya Sharma",
      type: "Teachers",
      subjects: ["Mathematics", "Physics"],
      qualification: "PhD in Mathematics, M.Ed",
      experience: "12 years",
      rating: 4.9,
      location: "HSR Layout, Bengaluru",
      fees: "₹800 - ₹1200/hr",
      teachingMode: ["Online", "Offline"],
      image: "https://cdn.eduadvisor.my/articles/2022/04/how-to-be-teacher-malaysia-feature.png",
      demoAvailable: true,
      slug: "dr-priya-sharma",
      detailsLink: "/teachers-details"
    },
  ];

  const institutionTypes = ["School", "College", "PU College", "Coaching Center", "Tuition Center", "Teachers"];
  const ratingOptions = [4.5, 4.0, 3.5, 3.0];
  const locationOptions = ["Bengaluru", "Delhi", "Mumbai", "Hyderabad", "Chennai"];

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
      minRating: 4.5,
      location: 'Bengaluru'
    });
  };

  const applyFilters = () => {
    setIsFilterOpen(false);
  };

  const filteredInstitutions = institutions.filter(institution => {
    if (searchQuery && !institution.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !institution.location.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (filters.institutionType.length > 0 && !filters.institutionType.includes(institution.type)) {
      return false;
    }
    
    if (institution.rating < filters.minRating) {
      return false;
    }
    
    if (filters.location && !institution.location.includes(filters.location)) {
      return false;
    }
    
    return true;
  });

  const getInstitutionIcon = (type) => {
    switch(type) {
      case 'School': return <FaSchool className="text-orange-500" />;
      case 'College': return <FaUniversity className="text-orange-500" />;
      case 'PU College': return <FaGraduationCap className="text-orange-500" />;
      case 'Coaching Center': return <FaChalkboardTeacher className="text-orange-500" />;
      case 'Tuition Center': return <FaBookOpenReader className="text-orange-500" />;
      default: return <FaSchool className="text-orange-500" />;
    }
  };

  const handleViewDetails = (institution) => {
    navigate(institution.detailsLink, { state: { institution } });
  };

  useEffect(() => {
              window.scrollTo(0, 0);
          }, []);

  return (
    <div className="bg-orange-50 min-h-screen font-sans">
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
              {filteredInstitutions.length} Institutions | Updated on Aug 1, 2025
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
                
                <div className="mt-2 flex items-center text-sm text-orange-600 font-medium">
                  {getInstitutionIcon(institution.type)}
                  <span className="ml-2">Est. {institution.established}</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {institution.features?.map((feature, index) => (
                    <span key={index} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <FaMapMarkerAlt className="mr-2 text-orange-500" />
                    <span>{institution.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <BsCashStack className="mr-2 text-orange-500" />
                    <span>{institution.feeRange || institution.fees}</span>
                  </div>
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
                    <motion.button
                      className="bg-transparent border border-orange-600 text-orange-600 hover:bg-orange-50 font-medium rounded-lg w-10 h-10 flex items-center justify-center transition duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaMapMarkerAlt />
                    </motion.button>
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