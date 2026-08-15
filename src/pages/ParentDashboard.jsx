// ParentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, FiUser, FiSearch, FiBookOpen, FiMessageSquare, 
  FiHeart, FiStar, FiFilter, FiMapPin, FiClock, 
  FiBell, FiLogOut, FiMenu, FiX, FiEye, FiAward,
  FiTrendingUp, FiChevronRight, FiCalendar, FiPhone,
  FiMail, FiGlobe, FiShare2, FiBookmark, FiCheckCircle,
  FiAlertCircle, FiInfo, FiUsers, FiBriefcase, FiSettings,
  FiArrowRight, FiThumbsUp, FiFacebook, FiTwitter, FiLinkedin,
  FiCamera
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    rating: '',
    location: '',
    sortBy: 'rating'
  });

  // Sample data
  const [institutions, setInstitutions] = useState([
    {
      id: 1,
      name: 'Delhi Public School',
      type: 'Schools',
      rating: 4.8,
      reviews: 127,
      location: 'New Delhi',
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=200&fit=crop',
      description: 'Premier educational institution with excellent academic record and state-of-the-art facilities.',
      fees: '₹1.5L - ₹2.5L',
      facilities: ['Library', 'Sports', 'Computer Lab', 'Science Lab'],
      isNew: true,
      isPopular: true
    },
    {
      id: 2,
      name: 'St. Xavier\'s College',
      type: 'Colleges',
      rating: 4.6,
      reviews: 98,
      location: 'Mumbai',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=200&fit=crop',
      description: 'Renowned college offering diverse courses with excellent placement record.',
      fees: '₹2L - ₹3.5L',
      facilities: ['Library', 'Sports', 'Computer Lab', 'Science Lab', 'Hostel'],
      isNew: false,
      isPopular: true
    },
    {
      id: 3,
      name: 'Expert Coaching Center',
      type: 'Coaching/Tuition',
      rating: 4.9,
      reviews: 156,
      location: 'Bangalore',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=400&h=200&fit=crop',
      description: 'Top-rated coaching center for competitive exams with proven track record.',
      fees: '₹80K - ₹1.5L',
      facilities: ['Smart Classrooms', 'Mock Tests', 'Study Materials', 'Doubt Sessions'],
      isNew: true,
      isPopular: false
    },
    {
      id: 4,
      name: 'Little Flower School',
      type: 'Schools',
      rating: 4.7,
      reviews: 89,
      location: 'Chennai',
      image: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=400&h=200&fit=crop',
      description: 'Holistic education with focus on academics and extracurricular activities.',
      fees: '₹1L - ₹2L',
      facilities: ['Playground', 'Music Room', 'Art Studio', 'Computer Lab'],
      isNew: false,
      isPopular: false
    },
    {
      id: 5,
      name: 'National Institute of Technology',
      type: 'Colleges',
      rating: 4.8,
      reviews: 210,
      location: 'Hyderabad',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=200&fit=crop',
      description: 'Premier technical institute with excellent placement and research facilities.',
      fees: '₹2.5L - ₹4L',
      facilities: ['Research Labs', 'Library', 'Sports Complex', 'Hostel', 'Cafeteria'],
      isNew: false,
      isPopular: true
    },
    {
      id: 6,
      name: 'Saraswati PU College',
      type: 'PU College',
      rating: 4.5,
      reviews: 67,
      location: 'Pune',
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=200&fit=crop',
      description: 'Top-rated PU college with excellent results in board examinations.',
      fees: '₹1L - ₹1.8L',
      facilities: ['Science Labs', 'Library', 'Sports', 'Career Counseling'],
      isNew: false,
      isPopular: false
    }
  ]);

  const [filteredInstitutions, setFilteredInstitutions] = useState(institutions);
  const [bookmarkedInstitutions, setBookmarkedInstitutions] = useState([1, 3, 5]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState(null);

  // Parent stats
  const parentStats = {
    totalViewed: 24,
    shortlisted: 8,
    inquiries: 5,
    recommendations: 12
  };

  // Recent activities
  const recentActivities = [
    { id: 1, action: 'Viewed Delhi Public School', time: '2 hours ago', icon: FiEye },
    { id: 2, action: 'Bookmarked Expert Coaching Center', time: '5 hours ago', icon: FiHeart },
    { id: 3, action: 'Inquired about St. Xavier\'s College', time: '1 day ago', icon: FiMessageSquare },
    { id: 4, action: 'Compared 3 institutions', time: '2 days ago', icon: FiTrendingUp },
  ];

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
    navigate('/');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome },
    { id: 'search', label: 'Search', icon: FiSearch },
    { id: 'bookmarks', label: 'Bookmarks', icon: FiHeart },
    { id: 'inquiries', label: 'Inquiries', icon: FiMessageSquare },
    { id: 'profile', label: 'Profile', icon: FiUser },
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
                Welcome back, Parent! 
              </h2>
              <p className="text-gray-300 mt-2 text-lg">
                Find the best educational institutions for your child
              </p>
              <div className="flex items-center gap-4 mt-4">
                <span className="px-3 py-1 bg-orange-500/20 rounded-full text-xs text-orange-300">
                  Looking for: Schools
                </span>
                <span className="px-3 py-1 bg-green-500/20 rounded-full text-xs text-green-300">
                  24 institutions viewed
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all relative border border-white/10">
                <FiBell className="w-5 h-5 text-gray-300" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
                  3
                </span>
              </button>
              <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-white/10">
                <FiSettings className="w-5 h-5 text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          icon={FiEye}
          label="Viewed"
          value={parentStats.totalViewed}
          color="text-blue-400"
          bgColor="bg-blue-500/20"
          trend="+12% this week"
        />
        <StatsCard 
          icon={FiHeart}
          label="Shortlisted"
          value={parentStats.shortlisted}
          color="text-red-400"
          bgColor="bg-red-500/20"
          trend="+5 new"
        />
        <StatsCard 
          icon={FiMessageSquare}
          label="Inquiries"
          value={parentStats.inquiries}
          color="text-green-400"
          bgColor="bg-green-500/20"
          trend="2 pending"
        />
        <StatsCard 
          icon={FiAward}
          label="Recommendations"
          value={parentStats.recommendations}
          color="text-amber-400"
          bgColor="bg-amber-500/20"
          trend="+3 this month"
        />
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
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
              <h4 className="text-white font-semibold">Search Institutions</h4>
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
            {recentActivities.map((activity) => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {institutions.slice(0, 3).map((inst) => (
            <InstitutionCard key={inst.id} institution={inst} />
          ))}
        </div>
      </div>
    </div>
  );

  // Search Content
  const renderSearch = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Discover Institutions</h2>
          <p className="text-gray-400">Find the perfect institution for your child</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInstitutions.map((inst) => (
          <InstitutionCard key={inst.id} institution={inst} />
        ))}
      </div>

      {filteredInstitutions.length === 0 && (
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

        {bookmarkedItems.length > 0 ? (
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
                  <p className="text-gray-400 text-sm">Delhi Public School - New Delhi</p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <FiCalendar className="w-3 h-3" />
                      Jan 15, 2024
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
              P
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-orange-500 rounded-full hover:bg-orange-600 transition-all">
              <FiCamera className="w-4 h-4 text-white" />
            </button>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Parent Name</h3>
            <p className="text-gray-400">parent@email.com</p>
            <p className="text-sm text-orange-400 mt-1 flex items-center gap-1">
              <FiInfo className="w-4 h-4" />
              Looking for: Schools
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-xl">
            <p className="text-xs text-gray-400">Student Name</p>
            <p className="text-white font-medium mt-1">Student Name</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl">
            <p className="text-xs text-gray-400">Student Class</p>
            <p className="text-white font-medium mt-1">Class 10</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl">
            <p className="text-xs text-gray-400">Institution Type Looking For</p>
            <p className="text-white font-medium mt-1">Schools</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl">
            <p className="text-xs text-gray-400">Member Since</p>
            <p className="text-white font-medium mt-1">January 2024</p>
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
      case 'profile': return renderProfile();
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

      {/* Sidebar */}
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

        {/* Navigation */}
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

        {/* User Profile */}
        <div className="flex-shrink-0 p-6 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
              P
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Parent</p>
              <p className="text-xs text-gray-400 truncate">parent@email.com</p>
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

      {/* Mobile Sidebar  */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden fixed inset-y-0 left-0 w-72 bg-gray-900/95 backdrop-blur-xl border-r border-white/10 z-50 flex flex-col"
          >
            {/* Logo */}
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

            {/* Navigation */}
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

            {/* User Profile */}
            <div className="flex-shrink-0 p-6 border-t border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                  P
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">Parent</p>
                  <p className="text-xs text-gray-400 truncate">parent@email.com</p>
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