import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaSearch,
  FaFilter,
  FaStar,
  FaTrophy,
  FaMapMarkerAlt,
  FaSchool,
  FaUniversity,
  FaChalkboardTeacher,
  FaTimes,
  FaGraduationCap,
  FaBookOpen,
} from 'react-icons/fa';
import { BsFillCalendar2CheckFill } from 'react-icons/bs';
import { FaBookOpenReader } from 'react-icons/fa6';
import 'tailwindcss';
import bestSellersApi from '../services/Bestsellersapi';
import { collegeApi } from '../services/collegeApi';
import { schoolApi } from '../services/schoolApi';
import { puCollegeApi } from '../services/pucollegeApi';
import { TuitionCoachingApi } from '../services/TuitionCoachingApi';
import { teacherApi } from '../services/TeacherApi';
import StickyButton from '../components/StickyButton';

// 👇 Safe array helper
const safeArray = (value, fallback = []) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string' && value.trim()) {
    return value.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return fallback;
};

// 👇 Validation: only accept real http(s) URLs
const isValidUrl = (val) =>
  typeof val === 'string' &&
  val.trim().length > 0 &&
  val.trim().toLowerCase() !== 'null' &&
  val.trim().toLowerCase() !== 'undefined' &&
  val.trim().startsWith('http');

// 👇 Pick the first valid gallery photo from various array shapes
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

// 👇 Resolve image from the item alone (no extra fetch)
const resolveImage = (item) => {
  if (!item || typeof item !== 'object') return null;

  const fields = [
    item.image,
    item.imageUrl,
    item.schoolImage,
    item.collegeImage,
    item.centerImage,
    item.profileImage,
    item.thumbnail,
    item.logo,
    item.photo,
    item.coverImage,
    item.bannerImage,
    item.mainImage,
  ];
  for (const f of fields) {
    if (isValidUrl(f)) return f;
  }

  const fromPhotos =
    pickFirstPhoto(item.photos) ||
    pickFirstPhoto(item.images) ||
    pickFirstPhoto(item.gallery) ||
    pickFirstPhoto(item.photoGallery);
  if (fromPhotos) return fromPhotos;

  return null;
};

// 👇 Fetch the details for an institution and pull the first gallery photo
const fetchPhotoFromDetails = async (type, id) => {
  try {
    let response;
    if (type === 'School') {
      response = await schoolApi.getSchool(id);
    } else if (type === 'College') {
      response = await collegeApi.getCollege(id);
    } else if (type === 'PU College') {
      response = await puCollegeApi.getPUCollege(id);
    } else if (type === 'Coaching Center' || type === 'Tuition Center') {
      response = await TuitionCoachingApi.getTuitionCoaching(id);
    } else if (type === 'Professional Teacher') {
      response = await teacherApi.getProfessionalTeacherDetails(id);
    } else if (type === 'Personal Mentor') {
      response = await teacherApi.getPersonalMentorDetails(id);
    } else {
      return null;
    }

    const data = response?.data || {};

    // Try common photo array fields
    const candidates = [
      data.photos,
      data.facilities,
      data.gallery,
      data.images,
      data.basicInfo?.photos,
      data.basicInfo?.profileImage ? [data.basicInfo.profileImage] : null,
    ];

    for (const arr of candidates) {
      const hit = pickFirstPhoto(arr);
      if (hit) return hit;
    }

    // Last resort: profile image field nested anywhere
    const fallbackFields = [
      data.schoolImage,
      data.collegeImage,
      data.centerImage,
      data.profileImage,
      data.basicInfo?.profileImage,
    ];
    for (const f of fallbackFields) {
      if (isValidUrl(f)) return f;
    }

    return null;
  } catch (err) {
    console.warn(`Could not fetch details for ${type} ${id}:`, err);
    return null;
  }
};

const BestSellers = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    institutionType: [],
    minRating: 0,
    location: '',
  });
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const institutionTypes = [
    'School',
    'College',
    'PU College',
    'Coaching Center',
    'Tuition Center',
    'Professional Teacher',
    'Personal Mentor',
  ];
  const ratingOptions = [0, 3.0, 3.5, 4.0, 4.5];
  const locationOptions = ['Bangalore', 'Delhi', 'Mumbai', 'Hyderabad', 'Chennai'];

  const normalizeCity = (city) => {
    const cityMap = {
      bangalore: 'Bangalore',
      bangaluru: 'Bangalore',
      'bengaluru urban': 'Bangalore',
      delhi: 'Delhi',
      'new delhi': 'Delhi',
      mumbai: 'Mumbai',
      bombay: 'Mumbai',
      hyderabad: 'Hyderabad',
      chennai: 'Chennai',
      madras: 'Chennai',
    };
    return cityMap[city?.toLowerCase()] || city || 'Not specified';
  };

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setLoading(true);
        const response = await bestSellersApi.getBestSellers({ limit: 5 });
        console.log('API Response:', response);

        const {
          schools = [],
          colleges = [],
          puColleges = [],
          tuitionCoaching = [],
          professionalTeachers = [],
          personalMentors = [],
        } = response.data || {};

        // 👇 Step 1: map everything, with the image resolved from the item alone
        const mappedInstitutions = [
          ...safeArray(schools).map((item) => ({
            id: item.id,
            name: item.name || 'Unnamed School',
            type: 'School',
            location: normalizeCity(item.city),
            rating: parseFloat(item.rating) || 0,
            reviews: item.reviewCount || 0,
            image: resolveImage(item),
            isFeatured: (parseFloat(item.rating) || 0) >= 4.8,
            detailsLink: `/school-details/${item.id}`,
          })),
          ...safeArray(colleges).map((item) => ({
            id: item.id,
            name: item.name || 'Unnamed College',
            type: 'College',
            location: normalizeCity(item.city),
            rating: parseFloat(item.rating) || 0,
            reviews: item.reviewCount || 0,
            image: resolveImage(item),
            isFeatured: (parseFloat(item.rating) || 0) >= 4.8,
            detailsLink: `/college-details/${item.id}`,
          })),
          ...safeArray(puColleges).map((item) => ({
            id: item.id,
            name: item.name || 'Unnamed PU College',
            type: 'PU College',
            location: normalizeCity(item.city),
            rating: parseFloat(item.rating) || 0,
            reviews: item.reviewCount || 0,
            image: resolveImage(item),
            isFeatured: (parseFloat(item.rating) || 0) >= 4.8,
            detailsLink: `/pucollege-details/${item.id}`,
          })),
          ...safeArray(tuitionCoaching).map((item) => ({
            id: item.id,
            name: item.name || 'Unnamed Center',
            type:
              item.type === 'tuitioncoaching'
                ? 'Tuition Center'
                : 'Coaching Center',
            location: normalizeCity(item.city),
            rating: parseFloat(item.rating) || 0,
            reviews: item.reviewCount || 0,
            image: resolveImage(item),
            isFeatured: (parseFloat(item.rating) || 0) >= 4.8,
            detailsLink:
              item.type === 'tuitioncoaching'
                ? `/tuition-details/${item.id}`
                : `/coaching-details/${item.id}`,
          })),
          ...safeArray(professionalTeachers).map((item) => ({
            id: item.id,
            name: item.name || 'Unnamed Teacher',
            type: 'Professional Teacher',
            location: normalizeCity(item.city),
            rating: parseFloat(item.rating) || 0,
            reviews: item.reviewCount || 0,
            image: resolveImage(item),
            isFeatured: (parseFloat(item.rating) || 0) >= 4.8,
            detailsLink: `/professional-teachers-details/${item.id}`,
          })),
          ...safeArray(personalMentors).map((item) => ({
            id: item.id,
            name: item.name || 'Unnamed Mentor',
            type: 'Personal Mentor',
            location: normalizeCity(item.city),
            rating: parseFloat(item.rating) || 0,
            reviews: item.reviewCount || 0,
            image: resolveImage(item),
            isFeatured: (parseFloat(item.rating) || 0) >= 4.8,
            detailsLink: `/personal-teachers-details/${item.id}`,
          })),
        ];

        // 👇 Step 2: for items with no image, fetch details to grab the first gallery photo
        const enrichedInstitutions = await Promise.all(
          mappedInstitutions.map(async (inst) => {
            if (inst.image) return inst; // already has an image
            const photo = await fetchPhotoFromDetails(inst.type, inst.id);
            return { ...inst, image: photo };
          })
        );

        console.log('Mapped Institutions:', enrichedInstitutions);
        setInstitutions(enrichedInstitutions);
      } catch (err) {
        setError(err.message || 'Failed to fetch best sellers');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
    window.scrollTo(0, 0);
  }, []);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => {
      if (filterType === 'minRating' || filterType === 'location') {
        return { ...prev, [filterType]: value };
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
    setFilters({ institutionType: [], minRating: 0, location: '' });
  };

  const applyFilters = () => setIsFilterOpen(false);

  const filteredInstitutions = institutions.filter((institution) => {
    if (
      searchQuery &&
      !institution.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !institution.location.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (
      filters.institutionType.length > 0 &&
      !filters.institutionType.includes(institution.type)
    ) {
      return false;
    }
    if (filters.minRating > 0 && institution.rating < filters.minRating) {
      return false;
    }
    if (
      filters.location &&
      !institution.location.toLowerCase().includes(filters.location.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

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
      <header className="bg-orange-600 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex w-full md:w-auto justify-between items-center mb-4 md:mb-0">
            <Link to="/" className="text-3xl font-extrabold text-white">
              <motion.span whileHover={{ scale: 1.05 }}>Raynott</motion.span>
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
              key={`${institution.type}-${institution.id}`}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5 }}
            >
              {institution.image && (
                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                  <img
                    src={institution.image}
                    alt={institution.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                    }}
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
              )}

              <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                    {institution.name}
                  </h3>
                  <div className="flex flex-col items-end gap-1">
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                      {institution.type}
                    </span>
                    {!institution.image && (
                      <span className="flex items-center text-xs text-orange-600 font-semibold">
                        <FaStar className="mr-1 w-3 h-3" />
                        {institution.rating}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <FaMapMarkerAlt className="mr-2 text-orange-500" />
                    <span>{institution.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FaStar className="mr-2 text-orange-500" />
                    <span>
                      {institution.rating} ({institution.reviews} reviews)
                    </span>
                  </div>
                </div>

                <div className="mt-auto pt-4">
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
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredInstitutions.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No institutions found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search query
            </p>
            <button
              onClick={resetFilters}
              className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
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
                  <h2 className="text-2xl font-bold text-gray-800">
                    Filter Institutions
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
                    Minimum Rating
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {ratingOptions.map((rating) => (
                      <button
                        key={rating}
                        onClick={() => handleFilterChange('minRating', rating)}
                        className={`px-4 py-2 rounded-full ${
                          filters.minRating === rating
                            ? 'bg-orange-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {rating === 0 ? 'Any' : `${rating}+`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">
                    Institution Type
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {institutionTypes.map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.institutionType.includes(type)}
                          onChange={() =>
                            handleFilterChange('institutionType', type)
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
                    Location
                  </h3>
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
                          onChange={() =>
                            handleFilterChange('location', location)
                          }
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

      {/* <StickyButton /> */}
    </div>
  );
};

export default BestSellers;