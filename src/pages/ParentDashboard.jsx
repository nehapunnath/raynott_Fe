// ParentDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, FiUser, FiSearch, FiBookOpen, FiMessageSquare, 
  FiHeart, FiStar, FiFilter, FiMapPin, FiClock, 
  FiBell, FiLogOut, FiMenu, FiX, FiEye, FiAward,
  FiTrendingUp, FiChevronRight, FiCalendar, FiCamera,
  FiInfo, FiSettings, FiArrowRight, FiLoader
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import schoolApi from '../services/schoolApi';
import collegeApi from '../services/collegeApi';
import puCollegeApi from '../services/puCollegeApi';
import TuitionCoachingApi from '../services/TuitionCoachingApi';
import teacherApi from '../services/teacherApi';

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
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
    totalViewed: 0,
    shortlisted: 0,
    inquiries: 0,
    recommendations: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);

  // Load parent data from localStorage on mount
  useEffect(() => {
    const loadParentData = () => {
      try {
        const storedData = localStorage.getItem('parentData');
        if (storedData) {
          const data = JSON.parse(storedData);
          setParentData({
            parentName: data.parentName || 'Parent',
            email: data.email || 'parent@email.com',
            institutionType: data.institutionType || 'Schools',
            studentName: data.studentName || '',
            studentClass: data.studentClass || ''
          });
        }
      } catch (error) {
        console.error('Error loading parent data:', error);
      }
    };
    loadParentData();
  }, []);

  // Helper function to safely extract data from API response
  const extractData = (response) => {
    // If response is an array, return it directly
    if (Array.isArray(response)) {
      return response;
    }
    
    // If response has a data property that is an array
    if (response && response.data && Array.isArray(response.data)) {
      return response.data;
    }
    
    // If response has a success property and data property
    if (response && response.success && response.data && Array.isArray(response.data)) {
      return response.data;
    }
    
    // If response has a results property
    if (response && response.results && Array.isArray(response.results)) {
      return response.results;
    }
    
    // If response has a items property
    if (response && response.items && Array.isArray(response.items)) {
      return response.items;
    }
    
    // If response is an object with values that might be arrays
    if (response && typeof response === 'object') {
      // Try to find any property that is an array
      for (const key in response) {
        if (Array.isArray(response[key])) {
          return response[key];
        }
      }
    }
    
    // Return empty array if nothing found
    return [];
  };

  // Fetch institutions based on parent's selected type
  const fetchInstitutions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let rawData = [];
      const type = parentData.institutionType;

      console.log('Fetching institutions for type:', type);

      switch(type) {
        case 'Schools':
          const schoolResponse = await schoolApi.getSchools();
          console.log('School API Response:', schoolResponse);
          rawData = extractData(schoolResponse);
          break;

        case 'Colleges':
          const collegeResponse = await collegeApi.getColleges();
          console.log('College API Response:', collegeResponse);
          rawData = extractData(collegeResponse);
          break;

        case 'PU College':
          const puResponse = await puCollegeApi.getPUColleges();
          console.log('PU College API Response:', puResponse);
          rawData = extractData(puResponse);
          break;

        case 'Coaching/Tuition':
          const coachingResponse = await TuitionCoachingApi.getTuitionCoachings();
          console.log('Coaching API Response:', coachingResponse);
          rawData = extractData(coachingResponse);
          break;

        case 'All Teachers':
          const teacherResponse = await teacherApi.getTeachers();
          console.log('Teacher API Response:', teacherResponse);
          rawData = extractData(teacherResponse);
          break;

        default:
          rawData = [];
      }

      // Transform data to consistent format
      const transformedData = rawData.map((item, index) => {
        // Try to find the name from various possible fields
        const name = item.schoolName || item.collegeName || item.centerName || 
                     item.teacherName || item.name || item.title || `Institution ${index + 1}`;
        
        // Try to find the location from various possible fields
        const location = item.city || item.location || item.address || item.place || 'N/A';
        
        // Try to find the image from various possible fields
        const image = item.schoolImage || item.collegeImage || item.centerImage || 
                      item.profileImage || item.image || item.photo || 
                      'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=200&fit=crop';
        
        // Try to find facilities
        const facilities = item.facilities || item.amenities || item.features || [];

        return {
          id: item.id || item._id || index + 1,
          name: name,
          type: type,
          rating: item.rating || item.averageRating || 4.5,
          reviews: item.reviews || item.reviewCount || item.totalReviews || 0,
          location: location,
          image: image,
          description: item.description || item.about || `${name} - Premier educational institution`,
          fees: item.fees || item.feeStructure || item.tuitionFees || 'Contact for details',
          facilities: Array.isArray(facilities) ? facilities : [],
          isNew: item.isNew || item.newlyAdded || false,
          isPopular: item.isPopular || item.featured || false,
          originalData: item
        };
      });

      console.log('Transformed data:', transformedData);
      setInstitutions(transformedData);
      setFilteredInstitutions(transformedData);
      
      // Update stats
      setStats({
        totalViewed: transformedData.length,
        shortlisted: Math.min(transformedData.length, Math.floor(transformedData.length * 0.3)),
        inquiries: Math.min(transformedData.length, Math.floor(transformedData.length * 0.2)),
        recommendations: Math.min(transformedData.length, Math.floor(transformedData.length * 0.4))
      });

      // Update recent activities
      setRecentActivities([
        { id: 1, action: `Viewed ${transformedData.length} ${type}`, time: 'Just now', icon: FiEye },
        { id: 2, action: 'Updated search preferences', time: '2 hours ago', icon: FiTrendingUp },
        { id: 3, action: 'Compared institutions', time: '1 day ago', icon: FiArrowRight },
      ]);

    } catch (error) {
      console.error('Error fetching institutions:', error);
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
    } catch (error) {
      console.error('Error saving bookmarks:', error);
    }
  }, [bookmarkedInstitutions]);

  // Fetch institutions on mount and when institution type changes
  useEffect(() => {
    fetchInstitutions();
  }, [fetchInstitutions]);

  // Filter institutions
  useEffect(() => {
    let filtered = [...institutions];

    if (showBookmarksOnly) {
      filtered = filtered.filter(inst => bookmarkedInstitutions.includes(inst.id));
    }

    if (filters.type) {
      filtered = filtered.filter(inst => inst.type === filters.type);
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
    { id: 'search', label: 'Search', icon: FiSearch },
    { id: 'bookmarks', label: 'Bookmarks', icon: FiHeart },
    { id: 'inquiries', label: 'Inquiries', icon: FiMessageSquare },
    // { id: 'profile', label: 'Profile', icon: FiUser },
  ];

  // Stats Card Component
  const StatsCard = ({ icon: Icon, label, value, color, bgColor, trend }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 hover:border-orange-500/30 transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
          {trend && (
            <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
              <FiTrendingUp className="w-3 h-3" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${bgColor}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </motion.div>
  );

  // Institution Card Component
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
              e.target.src = 'https://via.placeholder.com/400x200/FFA500/FFFFFF?text=Institution';
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
                <span className="text-white font-semibold text-sm">{institution.rating}</span>
                <span className="text-gray-300 text-xs">({institution.reviews})</span>
              </div>
              <span className="text-xs text-white/70 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                {institution.type}
              </span>
            </div>
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-orange-400 transition-colors">
            {institution.name}
          </h3>
          
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
            <FiMapPin className="w-4 h-4" />
            <span>{institution.location}</span>
          </div>

          <p className="text-gray-300 text-sm mb-4 line-clamp-2">
            {institution.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {institution.facilities && institution.facilities.slice(0, 3).map((facility, idx) => (
              <span key={idx} className="px-2.5 py-1 bg-white/5 rounded-full text-xs text-gray-300 border border-white/5">
                {facility}
              </span>
            ))}
            {institution.facilities && institution.facilities.length > 3 && (
              <span className="px-2.5 py-1 bg-white/5 rounded-full text-xs text-gray-400 border border-white/5">
                +{institution.facilities.length - 3}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div>
              <p className="text-xs text-gray-400">Fee Range</p>
              <p className="text-sm font-semibold text-orange-400">{institution.fees}</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white/10 text-white rounded-xl text-sm hover:bg-white/20 transition-all">
                Details
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-sm hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/20">
                Contact
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Loading Component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <FiLoader className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Loading institutions...</p>
      </div>
    </div>
  );

  // Error Component
  const ErrorDisplay = ({ message }) => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiInfo className="w-8 h-8 text-red-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Unable to load institutions</h3>
        <p className="text-gray-400 mb-4">{message || 'Please try again later'}</p>
        <button
          onClick={() => fetchInstitutions()}
          className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/20"
        >
          Retry
        </button>
      </div>
    </div>
  );

  // Dashboard Content
  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-transparent rounded-3xl p-8 border border-orange-500/20">
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
                  {institutions.length} institutions available
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          icon={FiEye}
          label="Viewed"
          value={stats.totalViewed}
          color="text-blue-400"
          bgColor="bg-blue-500/20"
          trend="+12% this week"
        />
        <StatsCard 
          icon={FiHeart}
          label="Shortlisted"
          value={stats.shortlisted}
          color="text-red-400"
          bgColor="bg-red-500/20"
          trend="+5 new"
        />
        <StatsCard 
          icon={FiMessageSquare}
          label="Inquiries"
          value={stats.inquiries}
          color="text-green-400"
          bgColor="bg-green-500/20"
          trend="2 pending"
        />
        <StatsCard 
          icon={FiAward}
          label="Recommendations"
          value={stats.recommendations}
          color="text-amber-400"
          bgColor="bg-amber-500/20"
          trend="+3 this month"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('search')}
              className="p-5 bg-gradient-to-br from-blue-600/20 to-blue-700/20 rounded-2xl border border-blue-500/20 text-left hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FiSearch className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="text-white font-semibold">Search {parentData.institutionType}</h4>
              <p className="text-sm text-gray-400">Find the best options</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('bookmarks')}
              className="p-5 bg-gradient-to-br from-red-600/20 to-red-700/20 rounded-2xl border border-red-500/20 text-left hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FiHeart className="w-6 h-6 text-red-400" />
              </div>
              <h4 className="text-white font-semibold">View Bookmarks</h4>
              <p className="text-sm text-gray-400">{bookmarkedInstitutions.length} saved items</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('inquiries')}
              className="p-5 bg-gradient-to-br from-green-600/20 to-green-700/20 rounded-2xl border border-green-500/20 text-left hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FiMessageSquare className="w-6 h-6 text-green-400" />
              </div>
              <h4 className="text-white font-semibold">My Inquiries</h4>
              <p className="text-sm text-gray-400">Track your inquiries</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-5 bg-gradient-to-br from-purple-600/20 to-purple-700/20 rounded-2xl border border-purple-500/20 text-left hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FiTrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="text-white font-semibold">Compare</h4>
              <p className="text-sm text-gray-400">Compare institutions</p>
            </motion.button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.slice(0, 4).map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="p-2 bg-white/5 rounded-lg">
                    <Icon className="w-4 h-4 text-orange-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium">{activity.action}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <button className="mt-4 text-sm text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1">
            View all activity
            <FiArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top Picks Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">Top Picks for You</h3>
            <p className="text-sm text-gray-400">Based on your preferences</p>
          </div>
          <button 
            onClick={() => setActiveTab('search')}
            className="text-orange-400 text-sm hover:text-orange-300 transition-colors flex items-center gap-1"
          >
            View All
            <FiArrowRight className="w-4 h-4" />
          </button>
        </div>
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorDisplay message={error} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {institutions.slice(0, 3).map((inst) => (
              <InstitutionCard key={inst.id} institution={inst} />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Search Content
  const renderSearch = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Discover {parentData.institutionType}</h2>
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

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm text-gray-400 block mb-2">Institution Type</label>
                <select
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                >
                  <option value="">All Types</option>
                  <option value="Schools">Schools</option>
                  <option value="Colleges">Colleges</option>
                  <option value="PU College">PU College</option>
                  <option value="Coaching/Tuition">Coaching/Tuition</option>
                  <option value="All Teachers">All Teachers</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-2">Minimum Rating</label>
                <select
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-2">Sort By</label>
                <select
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                onClick={() => setFilters({ type: '', rating: '', location: '', sortBy: 'rating' })}
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
        <span className="text-gray-400">Showing {filteredInstitutions.length} institutions</span>
        <span className="text-gray-400">{filteredInstitutions.length} results found</span>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorDisplay message={error} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstitutions.map((inst) => (
            <InstitutionCard key={inst.id} institution={inst} />
          ))}
        </div>
      )}

      {!isLoading && !error && filteredInstitutions.length === 0 && (
        <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
          <FiSearch className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white">No institutions found</h3>
          <p className="text-gray-400">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );

  // Bookmarks Content
  const renderBookmarks = () => {
    const bookmarkedItems = institutions.filter(inst => bookmarkedInstitutions.includes(inst.id));
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Your Bookmarks</h2>
          <p className="text-gray-400">Institutions you've shortlisted</p>
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
            <p className="text-gray-400">Start exploring and save institutions you like</p>
            <button
              onClick={() => setActiveTab('search')}
              className="mt-4 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/20"
            >
              Explore Institutions
            </button>
          </div>
        )}
      </div>
    );
  };

  // Inquiries Content
  const renderInquiries = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">My Inquiries</h2>
        <p className="text-gray-400">Track all your inquiries</p>
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: item * 0.1 }}
            className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 hover:border-orange-500/30 transition-all"
          >
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <FiMessageSquare className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Inquiry #{item}</h4>
                  <p className="text-gray-400 text-sm">Inquiry about {parentData.institutionType}</p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <FiCalendar className="w-3 h-3" />
                      Jan {15 + item}, 2024
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      item === 1 ? 'bg-green-500/20 text-green-300' : 
                      item === 2 ? 'bg-yellow-500/20 text-yellow-300' : 
                      'bg-blue-500/20 text-blue-300'
                    }`}>
                      {item === 1 ? '✓ Responded' : item === 2 ? '⏳ Pending' : '📋 Reviewed'}
                    </span>
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 bg-white/5 rounded-xl text-sm text-gray-300 hover:bg-white/10 transition-all border border-white/10">
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Profile Content
  const renderProfile = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Parent Profile</h2>
        <p className="text-gray-400">Manage your profile settings</p>
      </div>

      <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10">
        <div className="flex items-center gap-8 mb-8">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-4xl font-bold text-white">
              {parentData.parentName ? parentData.parentName[0].toUpperCase() : 'P'}
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-orange-500 rounded-full hover:bg-orange-600 transition-all">
              <FiCamera className="w-4 h-4 text-white" />
            </button>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{parentData.parentName}</h3>
            <p className="text-gray-400">{parentData.email}</p>
            <p className="text-sm text-orange-400 mt-1 flex items-center gap-1">
              <FiInfo className="w-4 h-4" />
              Looking for: {parentData.institutionType}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-xl">
            <p className="text-xs text-gray-400">Student Name</p>
            <p className="text-white font-medium mt-1">{parentData.studentName || 'Not specified'}</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl">
            <p className="text-xs text-gray-400">Student Class</p>
            <p className="text-white font-medium mt-1">{parentData.studentClass || 'Not specified'}</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl">
            <p className="text-xs text-gray-400">Institution Type Looking For</p>
            <p className="text-white font-medium mt-1">{parentData.institutionType}</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl">
            <p className="text-xs text-gray-400">Member Since</p>
            <p className="text-white font-medium mt-1">{new Date().getFullYear()}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/20">
            Edit Profile
          </button>
          <button className="px-6 py-2.5 bg-white/5 text-gray-300 rounded-xl hover:bg-white/10 transition-all border border-white/10">
            Change Password
          </button>
          <button className="px-6 py-2.5 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-all border border-red-500/20">
            Deactivate Account
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return renderDashboard();
      case 'search': return renderSearch();
      case 'bookmarks': return renderBookmarks();
      case 'inquiries': return renderInquiries();
      // case 'profile': return renderProfile();
      default: return null;
    }
  };

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