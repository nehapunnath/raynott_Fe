// ParentDashboard.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, FiUser, FiSearch, FiBookOpen, FiMessageSquare, 
  FiHeart, FiStar, FiFilter, FiMapPin, FiClock, 
  FiBell, FiLogOut, FiMenu, FiX, FiEye, FiAward,
  FiTrendingUp, FiChevronRight, FiCalendar, FiCamera,
  FiInfo, FiSettings, FiArrowRight, FiLoader, FiMail, FiPhone,
  FiShare2, FiExternalLink
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import schoolApi from '../services/schoolApi';
import collegeApi from '../services/collegeApi';
import puCollegeApi from '../services/pucollegeApi';
import TuitionCoachingApi from '../services/TuitionCoachingApi';
import teacherApi from '../services/TeacherApi';

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    rating: '',
    location: '',
    sortBy: 'rating'
  });

  // Parent data from localStorage
  const [parentData, setParentData] = useState({
    parentName: '',
    email: '',
    institutionType: 'Schools',
    studentName: '',
    studentClass: ''
  });

  const [institutions, setInstitutions] = useState([]);
  const [filteredInstitutions, setFilteredInstitutions] = useState([]);
  const [bookmarkedInstitutions, setBookmarkedInstitutions] = useState([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [stats, setStats] = useState({
    totalAvailable: 0,
    bookmarksCount: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);

  // Add ref to prevent duplicate API calls
  const fetchCalledRef = useRef(false);
  const currentTypeRef = useRef('');
  const isDataLoadedRef = useRef(false);

  // Load parent data from localStorage on mount
  useEffect(() => {
    const loadParentData = () => {
      try {
        const storedData = localStorage.getItem('parentData');
        console.log('📋 Stored parent data:', storedData);
        
        if (storedData) {
          const data = JSON.parse(storedData);
          console.log('📋 Parsed parent data:', data);
          
          setParentData({
            parentName: data.parentName || 'Parent',
            email: data.email || '',
            institutionType: data.institutionType || 'N/A',
            studentName: data.studentName || '',
            studentClass: data.studentClass || ''
          });
        } else {
          console.warn('⚠️ No parent data found in localStorage');
        }
      } catch (error) {
        console.error('Error loading parent data:', error);
      }
    };
    loadParentData();
  }, []);

  // ============ FIXED DATA EXTRACTION ============
  const extractDataFromResponse = (response, type) => {
    console.log(`📥 Extracting ${type} data from response:`, response);
    
    if (!response) {
      console.warn('⚠️ No response received');
      return [];
    }

    // If response is already an array
    if (Array.isArray(response)) {
      console.log(`✅ Response is already an array with ${response.length} items`);
      return response;
    }

    if (response.success === true && response.data) {
      console.log('🔍 Response.data type:', typeof response.data);
      console.log('🔍 Response.data keys:', Object.keys(response.data || {}));
      
      // If response.data is an array
      if (Array.isArray(response.data)) {
        console.log(`✅ response.data is an array with ${response.data.length} items`);
        return response.data;
      }

      if (typeof response.data === 'object' && response.data !== null) {
        const keys = Object.keys(response.data);
        
        // If there are keys and the first value is an object (institution data)
        if (keys.length > 0 && typeof response.data[keys[0]] === 'object' && response.data[keys[0]] !== null) {
          console.log(`✅ Converting Firebase object to array with ${keys.length} items`);
          
          // Convert object to array with IDs included
          const arrayData = keys.map(key => ({
            id: key,
            ...response.data[key]
          }));
          
          console.log('📋 First item:', arrayData[0]);
          return arrayData;
        }
        
        // Check for nested arrays (like response.data.schools)
        for (const key in response.data) {
          if (Array.isArray(response.data[key])) {
            console.log(`✅ Found array in response.data.${key} with ${response.data[key].length} items`);
            return response.data[key];
          }
          
          // Check for nested Firebase objects
          if (response.data[key] && typeof response.data[key] === 'object' && response.data[key] !== null) {
            const subKeys = Object.keys(response.data[key]);
            if (subKeys.length > 0 && typeof response.data[key][subKeys[0]] === 'object' && response.data[key][subKeys[0]] !== null) {
              console.log(`✅ Converting nested Firebase object ${key} to array with ${subKeys.length} items`);
              const arrayData = subKeys.map(subKey => ({
                id: subKey,
                ...response.data[key][subKey]
              }));
              return arrayData;
            }
          }
        }
      }
    }

    if (typeof response === 'object' && response !== null) {
      const keys = Object.keys(response);
      if (keys.length > 0 && typeof response[keys[0]] === 'object' && response[keys[0]] !== null) {
        console.log(` Converting direct Firebase object to array with ${keys.length} items`);
        const arrayData = keys.map(key => ({
          id: key,
          ...response[key]
        }));
        return arrayData;
      }
    }

    console.warn(' No data array found in response');
    return [];
  };

  // ============ DATA TRANSFORMATION ============
  const transformInstitutionData = (item, index, type) => {
    // Common field mappings for different institution types
    const fieldMappings = {
      'Schools': {
        name: ['schoolName', 'name', 'title', 'institutionName'],
        location: ['city', 'location', 'address', 'place', 'district'],
        image: ['schoolImage', 'image', 'photo', 'logo', 'profileImage'],
        rating: ['rating', 'averageRating', 'avgRating', 'ratingValue'],
        reviews: ['reviews', 'reviewCount', 'totalReviews', 'reviewCount'],
        facilities: ['facilities', 'amenities', 'features', 'services'],
        fees: ['fees', 'feeStructure', 'tuitionFees', 'feeRange', 'totalAnnualFee'],
        description: ['description', 'about', 'overview', 'introduction']
      },
      'Colleges': {
        name: ['collegeName', 'name', 'title', 'institutionName'],
        location: ['city', 'location', 'address', 'place', 'district'],
        image: ['collegeImage', 'image', 'photo', 'logo', 'profileImage'],
        rating: ['rating', 'averageRating', 'avgRating', 'ratingValue'],
        reviews: ['reviews', 'reviewCount', 'totalReviews', 'reviewCount'],
        facilities: ['facilities', 'amenities', 'features', 'services'],
        fees: ['fees', 'feeStructure', 'tuitionFees', 'feeRange', 'totalAnnualFee'],
        description: ['description', 'about', 'overview', 'introduction']
      },
      'PU College': {
        name: ['puCollegeName', 'collegeName', 'name', 'title', 'institutionName'],
        location: ['city', 'location', 'address', 'place', 'district'],
        image: ['puCollegeImage', 'collegeImage', 'image', 'photo', 'logo'],
        rating: ['rating', 'averageRating', 'avgRating', 'ratingValue'],
        reviews: ['reviews', 'reviewCount', 'totalReviews', 'reviewCount'],
        facilities: ['facilities', 'amenities', 'features', 'services'],
        fees: ['fees', 'feeStructure', 'tuitionFees', 'feeRange', 'totalAnnualFee'],
        description: ['description', 'about', 'overview', 'introduction']
      },
      'Coaching/Tuition': {
        name: ['centerName', 'name', 'title', 'coachingName', 'institutionName'],
        location: ['city', 'location', 'address', 'place', 'district'],
        image: ['centerImage', 'image', 'photo', 'logo', 'profileImage'],
        rating: ['rating', 'averageRating', 'avgRating', 'ratingValue'],
        reviews: ['reviews', 'reviewCount', 'totalReviews', 'reviewCount'],
        facilities: ['facilities', 'amenities', 'features', 'subjects', 'courses'],
        fees: ['fees', 'feeStructure', 'tuitionFees', 'courseFees', 'feeRange', 'totalAnnualFee'],
        description: ['description', 'about', 'overview', 'introduction']
      },
      'All Teachers': {
        name: ['teacherName', 'name', 'fullName', 'title'],
        location: ['city', 'location', 'address', 'place'],
        image: ['profileImage', 'image', 'photo', 'avatar'],
        rating: ['rating', 'averageRating', 'avgRating', 'ratingValue'],
        reviews: ['reviews', 'reviewCount', 'totalReviews'],
        facilities: ['subjects', 'specializations', 'expertise', 'skills'],
        fees: ['hourlyRate', 'fees', 'rate', 'charges'],
        description: ['description', 'about', 'bio', 'introduction']
      }
    };

    const fields = fieldMappings[type] || fieldMappings['Schools'];

    // Helper to get value from multiple possible fields
    const getValue = (mappings, fallback = '') => {
      for (const key of mappings) {
        if (item[key] !== undefined && item[key] !== null && item[key] !== '') {
          return item[key];
        }
      }
      return fallback;
    };

    const name = getValue(fields.name, `Institution ${index + 1}`);
    const location = getValue(fields.location, 'Location not specified');
    const image = getValue(fields.image) || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FFA500&color=fff&size=400x200`;
    const rating = parseFloat(getValue(fields.rating, 4.0));
    const reviews = parseInt(getValue(fields.reviews, 0));
    const facilities = getValue(fields.facilities, []);
    let fees = getValue(fields.fees, 'Contact for details');
    
    // If fees is an object, try to get the totalAnnualFee or convert to string
    if (typeof fees === 'object' && fees !== null) {
      fees = fees.totalAnnualFee || fees.feeRange || fees.tuitionFees || 'Contact for details';
    }
    
    const description = getValue(fields.description, `${name} - Premier educational institution`);

    return {
      id: item.id || item._id || `temp-${index}`,
      name: name,
      type: type,
      rating: Math.min(5, Math.max(0, rating)),
      reviews: reviews,
      location: location,
      image: image,
      description: description,
      fees: typeof fees === 'object' ? JSON.stringify(fees) : String(fees),
      facilities: Array.isArray(facilities) ? facilities : [],
      isNew: item.isNew || item.newlyAdded || false,
      isPopular: item.isPopular || item.featured || false,
      email: item.email || item.contactEmail || null,
      phone: item.phone || item.contactNumber || null,
      website: item.website || item.webUrl || null,
      originalData: item
    };
  };

  // ============ FETCH INSTITUTIONS ============
  const fetchInstitutions = useCallback(async () => {
    // Get the current institution type from parentData
    const type = parentData.institutionType;
    
    console.log(`🔍 Fetching institutions for type: "${type}"`);
    
    // If no type is set, default to Schools
    if (!type || type === '') {
      console.warn('⚠️ No institution type found, defaulting to Schools');
    }

    // Prevent duplicate calls for the same type
    if (fetchCalledRef.current && currentTypeRef.current === type) {
      console.log(`⏭️ Skipping duplicate fetch for ${type}`);
      return;
    }

    fetchCalledRef.current = true;
    currentTypeRef.current = type;
    setIsLoading(true);
    setError(null);
    
    try {
      let response = null;
      let rawData = [];

      console.log(`📡 Fetching ${type}...`);

      // Fetch data based on institution type
      switch(type) {
        case 'Schools':
          console.log('🏫 Calling schoolApi.getSchools()');
          response = await schoolApi.getSchools();
          break;

        case 'Colleges':
          console.log('🎓 Calling collegeApi.getColleges()');
          response = await collegeApi.getColleges();
          break;

        case 'PU College':
          console.log('📚 Calling puCollegeApi.getPUColleges()');
          response = await puCollegeApi.getPUColleges();
          break;

        case 'Coaching/Tuition':
          console.log('📖 Calling TuitionCoachingApi.getTuitionCoachings()');
          response = await TuitionCoachingApi.getTuitionCoachings();
          break;

        case 'All Teachers':
          console.log('👨‍🏫 Calling teacherApi.getTeachers()');
          response = await teacherApi.getTeachers();
          break;

        default:
          console.warn('⚠️ Unknown institution type:', type);
          rawData = [];
      }

      console.log(`📦 ${type} API Response:`, response);
      
      // Extract data from response
      rawData = extractDataFromResponse(response, type);
      
      console.log(`🔄 Transforming ${rawData.length} items for ${type}...`);
      
      // Transform each item
      const transformedData = rawData.map((item, index) => 
        transformInstitutionData(item, index, type)
      );
      
      console.log(`✅ Transformed ${transformedData.length} items for ${type}`);
      
      // Log the actual data to verify
      if (transformedData.length > 0) {
        console.log('📋 First 3 transformed items:', transformedData.slice(0, 3));
      } else {
        console.warn(`⚠️ No data transformed for ${type}!`);
      }

      // Set the data
      setInstitutions(transformedData);
      setFilteredInstitutions(transformedData);
      
      // Update stats
      setStats({
        totalAvailable: transformedData.length,
        bookmarksCount: bookmarkedInstitutions.length
      });

      isDataLoadedRef.current = true;

    } catch (error) {
      console.error('❌ Error fetching institutions:', error);
      setError(error.message || 'Failed to load institutions');
      setInstitutions([]);
      setFilteredInstitutions([]);
    } finally {
      setIsLoading(false);
    }
  }, [parentData.institutionType]);

  // Load bookmarks from localStorage
  useEffect(() => {
    const loadBookmarks = () => {
      try {
        const stored = localStorage.getItem('parentBookmarks');
        if (stored) {
          setBookmarkedInstitutions(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      }
    };
    loadBookmarks();
  }, []);

  // Save bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('parentBookmarks', JSON.stringify(bookmarkedInstitutions));
      // Update bookmarks count in stats
      setStats(prev => ({
        ...prev,
        bookmarksCount: bookmarkedInstitutions.length
      }));
    } catch (error) {
      console.error('Error saving bookmarks:', error);
    }
  }, [bookmarkedInstitutions]);

  // ============ FETCH WHEN PARENT DATA IS READY ============
  useEffect(() => {
    // Only fetch if we have parent data with a valid institution type
    if (parentData.institutionType && parentData.institutionType !== '') {
      console.log(`📋 Parent data loaded with type: ${parentData.institutionType}`);
      
      // Reset fetch flag to allow new fetch
      fetchCalledRef.current = false;
      currentTypeRef.current = '';
      
      // Fetch institutions for the selected type
      fetchInstitutions();
    } else {
      console.warn('⚠️ Parent data not ready or institution type not set');
    }
  }, [parentData.institutionType]);

  // Filter institutions
  useEffect(() => {
    let filtered = [...institutions];

    if (showBookmarksOnly) {
      filtered = filtered.filter(inst => bookmarkedInstitutions.includes(inst.id));
    }

    if (filters.rating) {
      const minRating = parseFloat(filters.rating);
      filtered = filtered.filter(inst => inst.rating >= minRating);
    }

    if (filters.location) {
      filtered = filtered.filter(inst => 
        inst.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === 'reviews') {
      filtered.sort((a, b) => b.reviews - a.reviews);
    } else if (filters.sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredInstitutions(filtered);
  }, [filters, institutions, bookmarkedInstitutions, showBookmarksOnly]);

  const toggleBookmark = (id) => {
    setBookmarkedInstitutions(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('parentToken');
    localStorage.removeItem('parentData');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('parentBookmarks');
    navigate('/');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome },
    { id: 'search', label: `Browse ${parentData.institutionType}`, icon: FiSearch },
    { id: 'bookmarks', label: 'Bookmarks', icon: FiHeart },
  ];

  // ============ STATS CARD ============
  const StatsCard = ({ icon: Icon, label, value, color, bgColor }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 hover:border-orange-500/30 transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${bgColor}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </motion.div>
  );

  // ============ INSTITUTION CARD ============
  const InstitutionCard = ({ institution }) => {
    const isBookmarked = bookmarkedInstitutions.includes(institution.id);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        className="group bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-orange-500/30 overflow-hidden transition-all duration-300"
      >
        <div className="relative h-56 overflow-hidden">
          <img 
            src={institution.image} 
            alt={institution.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(institution.name)}&background=FFA500&color=fff&size=400x200`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
          
          <div className="absolute top-4 left-4 flex gap-2">
            {institution.isNew && (
              <span className="px-3 py-1 bg-green-500/90 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
                New
              </span>
            )}
            {institution.isPopular && (
              <span className="px-3 py-1 bg-orange-500/90 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
                Popular
              </span>
            )}
          </div>

          <button
            onClick={() => toggleBookmark(institution.id)}
            className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-all"
          >
            <FiHeart className={`w-5 h-5 ${isBookmarked ? 'text-red-500 fill-red-500' : 'text-white'}`} />
          </button>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                <FiStar className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-white font-semibold text-sm">{institution.rating.toFixed(1)}</span>
                <span className="text-gray-300 text-xs">({institution.reviews})</span>
              </div>
              <span className="text-xs text-white/70 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                {institution.type}
              </span>
            </div>
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-orange-400 transition-colors line-clamp-1">
            {institution.name}
          </h3>
          
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
            <FiMapPin className="w-4 h-4 flex-shrink-0" />
            <span className="line-clamp-1">{institution.location}</span>
          </div>

          <p className="text-gray-300 text-sm mb-4 line-clamp-2">
            {institution.description}
          </p>

          {institution.facilities && institution.facilities.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {institution.facilities.slice(0, 3).map((facility, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-white/5 rounded-full text-xs text-gray-300 border border-white/5">
                  {facility}
                </span>
              ))}
              {institution.facilities.length > 3 && (
                <span className="px-2.5 py-1 bg-white/5 rounded-full text-xs text-gray-400 border border-white/5">
                  +{institution.facilities.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div>
              <p className="text-xs text-gray-400">Fee Range</p>
              <p className="text-sm font-semibold text-orange-400 line-clamp-1">{institution.fees}</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  console.log('View details for:', institution.id);
                  navigate(`/institution/${institution.type}/${institution.id}`)
                }}
                className="px-4 py-2 bg-white/10 text-white rounded-xl text-sm hover:bg-white/20 transition-all"
              >
                Details
              </button>
              <button 
                onClick={() => {
                  console.log('Contact institution:', institution.id);
                  if (institution.phone) {
                    window.location.href = `tel:${institution.phone}`;
                  }
                }}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-sm hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/20"
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // ============ LOADING ============
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <FiLoader className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Loading {parentData.institutionType}...</p>
      </div>
    </div>
  );

  // ============ ERROR ============
  const ErrorDisplay = ({ message }) => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiInfo className="w-8 h-8 text-red-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Unable to load {parentData.institutionType}</h3>
        <p className="text-gray-400 mb-4">{message || 'Please try again later'}</p>
        <button
          onClick={() => {
            fetchCalledRef.current = false;
            fetchInstitutions();
          }}
          className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/20"
        >
          Retry
        </button>
      </div>
    </div>
  );

  // ============ EMPTY STATE ============
  const EmptyState = () => (
    <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
      <FiBookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-white">No {parentData.institutionType} Found</h3>
      <p className="text-gray-400">We couldn't find any {parentData.institutionType.toLowerCase()} matching your criteria.</p>
    </div>
  );

  // ============ DASHBOARD ============
  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-transparent rounded-3xl p-8 border border-orange-500/20"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-3xl font-bold text-white">
                Welcome back, {parentData.parentName}! 
              </h2>
              <p className="text-gray-300 mt-2 text-lg">
                Find the best {parentData.institutionType} for your child
              </p>
              <div className="flex items-center gap-4 mt-4 flex-wrap">
                <span className="px-3 py-1 bg-orange-500/20 rounded-full text-xs text-orange-300">
                  Looking for: {parentData.institutionType}
                </span>
                <span className="px-3 py-1 bg-green-500/20 rounded-full text-xs text-green-300">
                  {institutions.length} {parentData.institutionType} available
                </span>
                {parentData.studentName && (
                  <span className="px-3 py-1 bg-blue-500/20 rounded-full text-xs text-blue-300">
                    Student: {parentData.studentName}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid - Updated */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 gap-4"
      >
        <StatsCard 
          icon={FiBookOpen}
          label={`Available ${parentData.institutionType}`}
          value={stats.totalAvailable}
          color="text-blue-400"
          bgColor="bg-blue-500/20"
        />
        <StatsCard 
          icon={FiHeart}
          label="Bookmarks"
          value={stats.bookmarksCount}
          color="text-red-400"
          bgColor="bg-red-500/20"
        />
      </motion.div>

      {/* Top Picks Section - Shows top 3 rated institutions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white">Top {parentData.institutionType} Picks</h3>
            <p className="text-sm text-gray-400">Highest rated {parentData.institutionType.toLowerCase()} for your child</p>
          </div>
          <button 
            onClick={() => setActiveTab('search')}
            className="text-orange-400 text-sm hover:text-orange-300 transition-colors flex items-center gap-1 bg-orange-500/10 px-4 py-2 rounded-xl"
          >
            View All
            <FiArrowRight className="w-4 h-4" />
          </button>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorDisplay message={error} />
        ) : institutions.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sort by rating and take top 3 */}
            {[...institutions]
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 3)
              .map((inst, index) => (
                <motion.div
                  key={inst.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <InstitutionCard institution={inst} />
                </motion.div>
              ))}
          </div>
        )}
      </motion.div>
    </div>
  );

  // ============ SEARCH ============
  const renderSearch = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Browse {parentData.institutionType}</h2>
          <p className="text-gray-400">Find the perfect {parentData.institutionType.toLowerCase()} for your child</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              showBookmarksOnly 
                ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            <FiHeart className="inline w-4 h-4 mr-2" />
            {showBookmarksOnly ? 'Show All' : 'Bookmarks'}
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-white/5 rounded-xl text-gray-300 hover:bg-white/10 transition-all flex items-center gap-2 border border-white/10"
          >
            <FiFilter className="w-4 h-4" />
            Filters
            <span className={`transition-transform ${showFilters ? 'rotate-180' : ''}`}>
              <FiChevronRight className="w-4 h-4" />
            </span>
          </button>
        </div>
      </div>

      {/* Filters - Updated with dark background */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-white/10 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-400 block mb-2">Minimum Rating</label>
                <select
                  className="w-full px-4 py-2.5 bg-gray-800/80 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={filters.rating}
                  onChange={(e) => setFilters({...filters, rating: e.target.value})}
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5+</option>
                  <option value="4.0">4.0+</option>
                  <option value="3.5">3.5+</option>
                  <option value="3.0">3.0+</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-2">Location</label>
                <input
                  type="text"
                  placeholder="Search location..."
                  className="w-full px-4 py-2.5 bg-gray-800/80 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-2">Sort By</label>
                <select
                  className="w-full px-4 py-2.5 bg-gray-800/80 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={filters.sortBy}
                  onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                >
                  <option value="rating">Top Rated</option>
                  <option value="reviews">Most Reviewed</option>
                  <option value="name">Alphabetical</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setFilters({ rating: '', location: '', sortBy: 'rating' })}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm"
              >
                Clear All
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">Showing {filteredInstitutions.length} {parentData.institutionType}</span>
        <span className="text-gray-400">{filteredInstitutions.length} results found</span>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorDisplay message={error} />
      ) : filteredInstitutions.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstitutions.map((inst) => (
            <InstitutionCard key={inst.id} institution={inst} />
          ))}
        </div>
      )}
    </div>
  );

  // ============ BOOKMARKS ============
  const renderBookmarks = () => {
    const bookmarkedItems = institutions.filter(inst => bookmarkedInstitutions.includes(inst.id));
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Your Bookmarks</h2>
          <p className="text-gray-400">{parentData.institutionType} you've shortlisted</p>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorDisplay message={error} />
        ) : bookmarkedItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedItems.map((inst) => (
              <InstitutionCard key={inst.id} institution={inst} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
            <FiHeart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white">No bookmarks yet</h3>
            <p className="text-gray-400">Start exploring and save {parentData.institutionType} you like</p>
            <button
              onClick={() => setActiveTab('search')}
              className="mt-4 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/20"
            >
              Explore {parentData.institutionType}
            </button>
          </div>
        )}
      </div>
    );
  };

  // ============ RENDER CONTENT ============
  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return renderDashboard();
      case 'search': return renderSearch();
      case 'bookmarks': return renderBookmarks();
      default: return renderDashboard();
    }
  };

  // ============ MAIN RENDER ============
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10"
      >
        {isSidebarOpen ? <FiX className="w-6 h-6 text-white" /> : <FiMenu className="w-6 h-6 text-white" />}
      </button>

      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:min-h-screen lg:bg-gray-900/95 lg:border-r lg:border-white/10 lg:backdrop-blur-xl lg:fixed lg:inset-y-0 lg:left-0">
        <div className="flex-shrink-0 p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <FiBookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Parent Portal</h1>
              <p className="text-xs text-gray-400">Find the best for your child</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                whileHover={{ x: 4 }}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-300 border border-orange-500/30 shadow-lg shadow-orange-500/5' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="w-1.5 h-8 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full flex-shrink-0"
                  />
                )}
                {item.id === 'bookmarks' && bookmarkedInstitutions.length > 0 && (
                  <span className="px-2 py-0.5 bg-orange-500/20 text-orange-300 text-xs rounded-full flex-shrink-0">
                    {bookmarkedInstitutions.length}
                  </span>
                )}
              </motion.button>
            );
          })}
        </nav>

        <div className="flex-shrink-0 p-6 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
              {parentData.parentName ? parentData.parentName[0].toUpperCase() : 'P'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{parentData.parentName}</p>
              <p className="text-xs text-gray-400 truncate">{parentData.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-red-500/10"
          >
            <FiLogOut className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden fixed inset-y-0 left-0 w-72 bg-gray-900/95 backdrop-blur-xl border-r border-white/10 z-50 flex flex-col"
          >
            <div className="flex-shrink-0 p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <FiBookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Parent Portal</h1>
                  <p className="text-xs text-gray-400">Find the best for your child</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-300 border border-orange-500/30 shadow-lg shadow-orange-500/5' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                    {isActive && (
                      <div className="w-1.5 h-8 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full flex-shrink-0" />
                    )}
                    {item.id === 'bookmarks' && bookmarkedInstitutions.length > 0 && (
                      <span className="px-2 py-0.5 bg-orange-500/20 text-orange-300 text-xs rounded-full flex-shrink-0">
                        {bookmarkedInstitutions.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="flex-shrink-0 p-6 border-t border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {parentData.parentName ? parentData.parentName[0].toUpperCase() : 'P'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{parentData.parentName}</p>
                  <p className="text-xs text-gray-400 truncate">{parentData.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-red-500/10"
              >
                <FiLogOut className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 p-4 lg:p-8 overflow-y-auto min-h-screen">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default ParentDashboard;