// ParentDashboard.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, FiUser, FiSearch, FiBookOpen, FiMessageSquare, 
  FiHeart, FiStar, FiFilter, FiMapPin, FiClock, 
  FiBell, FiLogOut, FiMenu, FiX, FiEye, FiAward,
  FiTrendingUp, FiChevronRight, FiCalendar, FiCamera,
  FiInfo, FiSettings, FiArrowRight, FiLoader, FiMail, FiPhone,
  FiShare2, FiExternalLink, FiAlertCircle
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

  // Parent data from localStorage - initialize with null to track loading state
  const [parentData, setParentData] = useState(null);
  const [isParentDataLoaded, setIsParentDataLoaded] = useState(false);

  const [institutions, setInstitutions] = useState([]);
  const [filteredInstitutions, setFilteredInstitutions] = useState([]);
  const [bookmarkedInstitutions, setBookmarkedInstitutions] = useState([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [stats, setStats] = useState({
    totalAvailable: 0,
    bookmarksCount: 0
  });

  // Add ref to prevent duplicate API calls
  const fetchCalledRef = useRef(false);
  const currentTypeRef = useRef('');
  const isDataLoadedRef = useRef(false);
  const initialFetchDoneRef = useRef(false);

  // Load parent data from localStorage on mount - ONLY ONCE
  useEffect(() => {
    const loadParentData = () => {
      try {
        const storedData = localStorage.getItem('parentData');
        console.log('📋 Stored parent data:', storedData);
        
        if (storedData) {
          const data = JSON.parse(storedData);
          console.log('📋 Parsed parent data:', data);
          console.log('📋 Institution Type from storage:', data.institutionType);
          
          // Ensure institutionType is properly set
          let institutionType = data.institutionType || 'Schools';
          
          // Normalize the type
          if (typeof institutionType === 'string') {
            const trimmed = institutionType.trim();
            if (trimmed.toLowerCase() === 'all teachers' || 
                trimmed.includes('Teacher') || 
                trimmed.includes('teacher')) {
              institutionType = 'All Teachers';
            }
          }
          
          const newParentData = {
            parentName: data.parentName || data.name || 'Parent',
            email: data.email || '',
            institutionType: institutionType,
            studentName: data.studentName || '',
            studentClass: data.studentClass || '',
            uid: data.uid || '',
            role: data.role || 'parent'
          };
          
          console.log('📋 Setting parent data:', newParentData);
          setParentData(newParentData);
        } else {
          console.warn('⚠️ No parent data found in localStorage');
          setParentData({
            parentName: 'Parent',
            email: '',
            institutionType: 'Schools',
            studentName: '',
            studentClass: '',
            uid: '',
            role: 'parent'
          });
        }
      } catch (error) {
        console.error('Error loading parent data:', error);
        setParentData({
          parentName: 'Parent',
          email: '',
          institutionType: 'Schools',
          studentName: '',
          studentClass: '',
          uid: '',
          role: 'parent'
        });
      } finally {
        setIsParentDataLoaded(true);
      }
    };
    loadParentData();
  }, []); // Empty dependency array - runs only once

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

    // Check if response has success property
    if (response.success === true) {
      console.log('🔍 Response has success: true');
      
      // Check common data keys
      const possibleDataKeys = ['data', 'teachers', 'users', 'items', 'results', 'records'];
      
      for (const key of possibleDataKeys) {
        if (response[key]) {
          console.log(`🔍 Found response.${key}:`, response[key]);
          
          // If it's an array
          if (Array.isArray(response[key])) {
            console.log(`✅ response.${key} is an array with ${response[key].length} items`);
            return response[key];
          }
          
          // If it's an object (Firebase style)
          if (typeof response[key] === 'object' && response[key] !== null) {
            const keys = Object.keys(response[key]);
            if (keys.length > 0) {
              const firstItem = response[key][keys[0]];
              if (typeof firstItem === 'object' && firstItem !== null) {
                console.log(`✅ Converting Firebase object to array with ${keys.length} items`);
                return keys.map(k => ({
                  id: k,
                  ...response[key][k]
                }));
              }
            }
          }
        }
      }
    }

    // If response has data property directly
    if (response.data) {
      console.log('🔍 Found response.data:', response.data);
      
      if (Array.isArray(response.data)) {
        console.log(`✅ response.data is an array with ${response.data.length} items`);
        return response.data;
      }
      
      if (typeof response.data === 'object' && response.data !== null) {
        const keys = Object.keys(response.data);
        if (keys.length > 0) {
          const firstItem = response.data[keys[0]];
          if (typeof firstItem === 'object' && firstItem !== null) {
            console.log(`✅ Converting response.data Firebase object to array with ${keys.length} items`);
            return keys.map(k => ({
              id: k,
              ...response.data[k]
            }));
          }
        }
      }
    }

    // For teacher API specifically - check for teachers array
    if (type === 'All Teachers' && response.teachers) {
      console.log('🔍 Found response.teachers:', response.teachers);
      if (Array.isArray(response.teachers)) {
        console.log(`✅ response.teachers is an array with ${response.teachers.length} items`);
        return response.teachers;
      }
      if (typeof response.teachers === 'object' && response.teachers !== null) {
        const keys = Object.keys(response.teachers);
        if (keys.length > 0) {
          console.log(`✅ Converting response.teachers Firebase object to array with ${keys.length} items`);
          return keys.map(k => ({
            id: k,
            ...response.teachers[k]
          }));
        }
      }
    }

    console.warn('⚠️ No data array found in response');
    return [];
  };

  // ============ IMPROVED DATA TRANSFORMATION ============
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
        name: ['teacherName', 'name', 'fullName', 'username', 'displayName', 'title'],
        location: ['city', 'location', 'address', 'place', 'teachingCity', 'preferredLocation'],
        image: ['profileImage', 'profilePhoto', 'image', 'photo', 'avatar', 'profilePicture'],
        rating: ['rating', 'averageRating', 'avgRating', 'ratingValue', 'teacherRating'],
        reviews: ['reviews', 'reviewCount', 'totalReviews', 'reviewCount'],
        facilities: ['subjects', 'specializations', 'expertise', 'skills', 'subjectsTaught'],
        fees: ['hourlyRate', 'rate', 'fees', 'charges', 'price', 'fee'],
        description: ['description', 'about', 'bio', 'introduction', 'profileDescription']
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
    let facilities = getValue(fields.facilities, []);
    
    if (typeof facilities === 'string') {
      try {
        facilities = JSON.parse(facilities);
      } catch {
        facilities = facilities.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    
    let fees = getValue(fields.fees, 'Contact for details');
    
    if (typeof fees === 'object' && fees !== null) {
      fees = fees.hourlyRate || fees.totalAnnualFee || fees.feeRange || fees.tuitionFees || 'Contact for details';
    }
    
    const description = getValue(fields.description, `${name} - Premier educational institution`);
    const displayId = item.id || item._id || `temp-${index}`;

    let subjects = getValue(['subjects', 'subjectsTaught', 'specializations'], []);
    if (!Array.isArray(subjects)) {
      if (typeof subjects === 'string') {
        try {
          subjects = JSON.parse(subjects);
        } catch {
          subjects = subjects.split(',').map(s => s.trim()).filter(Boolean);
        }
      } else {
        subjects = [];
      }
    }
    
    const experience = getValue(['experience', 'yearsExperience', 'teachingExperience'], '');
    const qualification = getValue(['qualification', 'qualifications', 'education'], '');

    return {
      id: displayId,
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
      subjects: subjects,
      experience: experience,
      qualification: qualification,
      originalData: item
    };
  };

  // ============ FETCH INSTITUTIONS ============
  const fetchInstitutions = useCallback(async (forceType = null) => {
    // Use forceType if provided, otherwise use parentData.institutionType
    let type = forceType || parentData?.institutionType;
    
    // Trim and clean the type
    type = type?.trim() || '';
    
    console.log(`🔍 Fetching institutions for type: "${type}"`);
    console.log(`🔍 Force type: ${forceType || 'none'}`);
    console.log(`🔍 Current parentData:`, parentData);
    
    // If no type is set, default to Schools
    if (!type || type === '') {
      console.warn('⚠️ No institution type found, defaulting to Schools');
      type = 'Schools';
    }

    // Prevent duplicate calls for the same type
    if (fetchCalledRef.current && currentTypeRef.current === type && !forceType) {
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
      if (type === 'Schools') {
        console.log('🏫 Calling schoolApi.getSchools()');
        response = await schoolApi.getSchools();
      } else if (type === 'Colleges') {
        console.log('🎓 Calling collegeApi.getColleges()');
        response = await collegeApi.getColleges();
      } else if (type === 'PU College') {
        console.log('📚 Calling puCollegeApi.getPUColleges()');
        response = await puCollegeApi.getPUColleges();
      } else if (type === 'Coaching/Tuition') {
        console.log('📖 Calling TuitionCoachingApi.getTuitionCoachings()');
        response = await TuitionCoachingApi.getTuitionCoachings();
      } else if (type === 'All Teachers') {
        console.log('👨‍🏫 Calling teacherApi.getTeachers()');
        try {
          response = await teacherApi.getTeachers();
          console.log('👨‍🏫 Teacher API Response:', response);
          console.log('👨‍🏫 Response keys:', Object.keys(response || {}));
        } catch (teacherError) {
          console.error('❌ Teacher API error:', teacherError);
          throw teacherError;
        }
      } else {
        console.warn(`⚠️ Unknown institution type: "${type}", defaulting to Schools`);
        response = await schoolApi.getSchools();
      }

      console.log(`📦 ${type} API Response:`, response);
      
      if (!response) {
        console.error(`❌ No response from ${type} API`);
        setError(`Failed to fetch ${type} data`);
        setIsLoading(false);
        return;
      }
      
      rawData = extractDataFromResponse(response, type);
      
      console.log(`🔄 Transforming ${rawData.length} items for ${type}...`);
      
      const transformedData = rawData.map((item, index) => 
        transformInstitutionData(item, index, type)
      );
      
      console.log(`✅ Transformed ${transformedData.length} items for ${type}`);
      
      if (transformedData.length > 0) {
        console.log('📋 First transformed item:', transformedData[0]);
      } else {
        console.warn(`⚠️ No data transformed for ${type}!`);
      }

      setInstitutions(transformedData);
      setFilteredInstitutions(transformedData);
      
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
  }, [parentData]); // Add parentData as dependency

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
    // Only fetch if parent data is loaded and has a valid institution type
    if (isParentDataLoaded && parentData && parentData.institutionType) {
      console.log(`📋 Parent data loaded with type: ${parentData.institutionType}`);
      console.log(`📋 Initial fetch done: ${initialFetchDoneRef.current}`);
      
      // Reset fetch flag to allow new fetch
      fetchCalledRef.current = false;
      currentTypeRef.current = '';
      
      // Fetch institutions for the selected type
      if (!initialFetchDoneRef.current) {
        initialFetchDoneRef.current = true;
        fetchInstitutions();
      }
    } else if (isParentDataLoaded) {
      console.warn('⚠️ Parent data loaded but no institution type set');
    }
  }, [isParentDataLoaded, parentData]); // Depend on both flags

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

  // Show loading while parent data is being loaded
  if (!isParentDataLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome },
    { id: 'search', label: `Browse ${parentData?.institutionType || 'Schools'}`, icon: FiSearch },
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
    const subjects = Array.isArray(institution.subjects) ? institution.subjects : [];
    const facilities = Array.isArray(institution.facilities) ? institution.facilities : [];

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
          
          <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
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
            {institution.type === 'All Teachers' && institution.experience && (
              <span className="px-3 py-1 bg-blue-500/90 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
                {institution.experience} yrs exp
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

          {institution.type === 'All Teachers' && subjects.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-1.5">
                {subjects.slice(0, 3).map((subject, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-orange-500/20 text-orange-300 rounded-full text-xs border border-orange-500/20">
                    {subject}
                  </span>
                ))}
                {subjects.length > 3 && (
                  <span className="px-2 py-0.5 bg-white/5 text-gray-400 rounded-full text-xs border border-white/10">
                    +{subjects.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {facilities.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {facilities.slice(0, 3).map((facility, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-white/5 rounded-full text-xs text-gray-300 border border-white/5">
                  {facility}
                </span>
              ))}
              {facilities.length > 3 && (
                <span className="px-2.5 py-1 bg-white/5 rounded-full text-xs text-gray-400 border border-white/5">
                  +{facilities.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div>
              <p className="text-xs text-gray-400">{institution.type === 'All Teachers' ? 'Hourly Rate' : 'Fee Range'}</p>
              <p className="text-sm font-semibold text-orange-400 line-clamp-1">
                {institution.type === 'All Teachers' ? `₹${institution.fees}/hr` : institution.fees}
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => navigate(`/institution/${institution.type}/${institution.id}`)}
                className="px-4 py-2 bg-white/10 text-white rounded-xl text-sm hover:bg-white/20 transition-all"
              >
                Details
              </button>
              <button 
                onClick={() => {
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
        <p className="text-gray-400">Loading {parentData?.institutionType || 'institutions'}...</p>
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
        <h3 className="text-xl font-semibold text-white mb-2">Unable to load {parentData?.institutionType || 'institutions'}</h3>
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
      <h3 className="text-xl font-semibold text-white">No {parentData?.institutionType || 'institutions'} Found</h3>
      <p className="text-gray-400">We couldn't find any {parentData?.institutionType?.toLowerCase() || 'institutions'} matching your criteria.</p>
    </div>
  );

  // ============ DASHBOARD ============
  const renderDashboard = () => (
    <div className="space-y-8">
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
                Welcome back, {parentData?.parentName || 'Parent'}! 
              </h2>
              <p className="text-gray-300 mt-2 text-lg">
                Find the best {parentData?.institutionType || 'Schools'} for your child
              </p>
              <div className="flex items-center gap-4 mt-4 flex-wrap">
                <span className="px-3 py-1 bg-orange-500/20 rounded-full text-xs text-orange-300">
                  Looking for: {parentData?.institutionType || 'Schools'}
                </span>
                <span className="px-3 py-1 bg-green-500/20 rounded-full text-xs text-green-300">
                  {institutions.length} {parentData?.institutionType || 'Schools'} available
                </span>
                {parentData?.studentName && (
                  <span className="px-3 py-1 bg-blue-500/20 rounded-full text-xs text-blue-300">
                    Student: {parentData.studentName}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Debug Section */}
      {/* <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
        <h4 className="text-yellow-300 text-sm font-semibold mb-2 flex items-center gap-2">
          <FiAlertCircle className="w-4 h-4" />
          Debug Info
        </h4>
        <div className="flex flex-wrap gap-4 text-xs">
          <div>
            <span className="text-gray-400">Type:</span>
            <span className="text-white ml-1">"{parentData?.institutionType}"</span>
          </div>
          <div>
            <span className="text-gray-400">Is "All Teachers":</span>
            <span className="text-white ml-1">{parentData?.institutionType === 'All Teachers' ? '✅' : '❌'}</span>
          </div>
          <div>
            <span className="text-gray-400">Institutions:</span>
            <span className="text-white ml-1">{institutions.length}</span>
          </div>
          <button
            onClick={() => {
              console.log('🔄 Force fetching teachers...');
              fetchCalledRef.current = false;
              currentTypeRef.current = '';
              fetchInstitutions('All Teachers');
            }}
            className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-lg hover:bg-orange-500/30 transition-all"
          >
            Force Fetch Teachers
          </button>
          <button
            onClick={() => {
              console.log('📊 Current state:', {
                parentData,
                institutions: institutions.length,
                filteredInstitutions: filteredInstitutions.length,
                bookmarks: bookmarkedInstitutions.length
              });
            }}
            className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all"
          >
            Log State
          </button>
        </div>
      </div> */}

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 gap-4"
      >
        <StatsCard 
          icon={FiBookOpen}
          label={`Available ${parentData?.institutionType || 'Schools'}`}
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

      {/* Top Picks Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white">Top {parentData?.institutionType || 'Schools'} Picks</h3>
            <p className="text-sm text-gray-400">Highest rated {parentData?.institutionType?.toLowerCase() || 'schools'} for your child</p>
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
          <h2 className="text-2xl font-bold text-white">Browse {parentData?.institutionType || 'Schools'}</h2>
          <p className="text-gray-400">Find the perfect {parentData?.institutionType?.toLowerCase() || 'schools'} for your child</p>
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

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">Showing {filteredInstitutions.length} {parentData?.institutionType || 'Schools'}</span>
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
          <p className="text-gray-400">{parentData?.institutionType || 'Schools'} you've shortlisted</p>
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
            <p className="text-gray-400">Start exploring and save {parentData?.institutionType || 'Schools'} you like</p>
            <button
              onClick={() => setActiveTab('search')}
              className="mt-4 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/20"
            >
              Explore {parentData?.institutionType || 'Schools'}
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
              {parentData?.parentName ? parentData.parentName[0].toUpperCase() : 'P'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{parentData?.parentName || 'Parent'}</p>
              <p className="text-xs text-gray-400 truncate">{parentData?.email || ''}</p>
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
                  {parentData?.parentName ? parentData.parentName[0].toUpperCase() : 'P'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{parentData?.parentName || 'Parent'}</p>
                  <p className="text-xs text-gray-400 truncate">{parentData?.email || ''}</p>
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