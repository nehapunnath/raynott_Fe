// ParentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, 
  FiUser, 
  FiSearch, 
  FiBookOpen, 
  FiCalendar, 
  FiMessageSquare, 
  FiHeart, 
  FiStar, 
  FiTrendingUp, 
  FiAward,
  FiFilter,
  FiMapPin,
  FiClock,
  FiPhone,
  FiMail,
  FiGlobe,
  FiArrowRight,
  FiChevronDown,
  FiChevronUp,
  FiBell,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiThumbsUp,
  FiShare2,
  FiBookmark,
  FiEye,
  FiUsers,
  FiBriefcase,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { motion as framerMotion } from 'framer-motion';

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    rating: '',
    location: '',
    sortBy: 'rating'
  });

  // Sample data - will be replaced with API data
  const [institutions, setInstitutions] = useState([
    {
      id: 1,
      name: 'Delhi Public School',
      type: 'Schools',
      rating: 4.8,
      reviews: 127,
      location: 'New Delhi',
      image: 'https://via.placeholder.com/400x200/FFA500/FFFFFF?text=School',
      description: 'Premier educational institution with excellent academic record and state-of-the-art facilities.',
      fees: '₹1.5L - ₹2.5L',
      facilities: ['Library', 'Sports', 'Computer Lab', 'Science Lab'],
      reviewsList: [
        { user: 'Rajesh K.', rating: 5, comment: 'Excellent school with great faculty', date: '2024-01-15' },
        { user: 'Priya M.', rating: 4, comment: 'Good infrastructure but high fees', date: '2024-01-10' }
      ]
    },
    {
      id: 2,
      name: 'St. Xavier\'s College',
      type: 'Colleges',
      rating: 4.6,
      reviews: 98,
      location: 'Mumbai',
      image: 'https://via.placeholder.com/400x200/FF8C00/FFFFFF?text=College',
      description: 'Renowned college offering diverse courses with excellent placement record.',
      fees: '₹2L - ₹3.5L',
      facilities: ['Library', 'Sports', 'Computer Lab', 'Science Lab', 'Hostel'],
      reviewsList: [
        { user: 'Amit S.', rating: 5, comment: 'Best college for engineering', date: '2024-01-12' },
        { user: 'Neha R.', rating: 4, comment: 'Good faculty but strict rules', date: '2024-01-08' }
      ]
    },
    {
      id: 3,
      name: 'Expert Coaching Center',
      type: 'Coaching/Tuition',
      rating: 4.9,
      reviews: 156,
      location: 'Bangalore',
      image: 'https://via.placeholder.com/400x200/FF4500/FFFFFF?text=Coaching',
      description: 'Top-rated coaching center for competitive exams with proven track record.',
      fees: '₹80K - ₹1.5L',
      facilities: ['Smart Classrooms', 'Mock Tests', 'Study Materials', 'Doubt Sessions'],
      reviewsList: [
        { user: 'Suresh P.', rating: 5, comment: 'Helped my son crack IIT', date: '2024-01-14' },
        { user: 'Deepa K.', rating: 5, comment: 'Excellent faculty', date: '2024-01-11' }
      ]
    },
    {
      id: 4,
      name: 'Little Flower School',
      type: 'Schools',
      rating: 4.7,
      reviews: 89,
      location: 'Chennai',
      image: 'https://via.placeholder.com/400x200/FF6347/FFFFFF?text=School',
      description: 'Holistic education with focus on academics and extracurricular activities.',
      fees: '₹1L - ₹2L',
      facilities: ['Playground', 'Music Room', 'Art Studio', 'Computer Lab'],
      reviewsList: [
        { user: 'Mohan R.', rating: 4, comment: 'Good school but crowded', date: '2024-01-09' },
        { user: 'Lakshmi N.', rating: 5, comment: 'Excellent teachers', date: '2024-01-05' }
      ]
    },
    {
      id: 5,
      name: 'National Institute of Technology',
      type: 'Colleges',
      rating: 4.8,
      reviews: 210,
      location: 'Hyderabad',
      image: 'https://via.placeholder.com/400x200/FFD700/FFFFFF?text=NIT',
      description: 'Premier technical institute with excellent placement and research facilities.',
      fees: '₹2.5L - ₹4L',
      facilities: ['Research Labs', 'Library', 'Sports Complex', 'Hostel', 'Cafeteria'],
      reviewsList: [
        { user: 'Vikram S.', rating: 5, comment: 'One of the best NITs', date: '2024-01-13' },
        { user: 'Sneha P.', rating: 4, comment: 'Good but location is remote', date: '2024-01-07' }
      ]
    },
    {
      id: 6,
      name: 'Saraswati PU College',
      type: 'PU College',
      rating: 4.5,
      reviews: 67,
      location: 'Pune',
      image: 'https://via.placeholder.com/400x200/FFA07A/FFFFFF?text=PU+College',
      description: 'Top-rated PU college with excellent results in board examinations.',
      fees: '₹1L - ₹1.8L',
      facilities: ['Science Labs', 'Library', 'Sports', 'Career Counseling'],
      reviewsList: [
        { user: 'Ravi K.', rating: 4, comment: 'Good for science stream', date: '2024-01-06' },
        { user: 'Anita M.', rating: 5, comment: 'Excellent teachers', date: '2024-01-03' }
      ]
    },
    {
      id: 7,
      name: 'Global Language Academy',
      type: 'All Teachers',
      rating: 4.6,
      reviews: 45,
      location: 'Kolkata',
      image: 'https://via.placeholder.com/400x200/FF8C00/FFFFFF?text=Academy',
      description: 'Specialized language training and personality development center.',
      fees: '₹50K - ₹1L',
      facilities: ['Language Labs', 'Study Materials', 'Online Classes', 'Workshops'],
      reviewsList: [
        { user: 'Divya R.', rating: 5, comment: 'Great for language learning', date: '2024-01-04' },
        { user: 'Arjun S.', rating: 4, comment: 'Good but expensive', date: '2024-01-02' }
      ]
    }
  ]);

  const [filteredInstitutions, setFilteredInstitutions] = useState(institutions);
  const [bookmarkedInstitutions, setBookmarkedInstitutions] = useState([1, 3, 5]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  // Parent stats
  const parentStats = {
    totalViewed: 24,
    shortlisted: 8,
    inquiries: 5,
    recommendations: 12
  };

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

    // Sort
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
    // Clear user data and logout
    navigate('/');
  };

  // Sidebar Navigation Items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome },
    { id: 'search', label: 'Search Institutions', icon: FiSearch },
    { id: 'bookmarks', label: 'Bookmarks', icon: FiHeart },
    { id: 'inquiries', label: 'My Inquiries', icon: FiMessageSquare },
    { id: 'profile', label: 'Profile', icon: FiUser },
  ];

  // Stats Cards
  const StatsCard = ({ icon: Icon, label, value, color, bgColor }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-gray-800/70 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{label}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </motion.div>
  );

  // Institution Card Component
  const InstitutionCard = ({ institution }) => {
    const isBookmarked = bookmarkedInstitutions.includes(institution.id);
    const [showFullDescription, setShowFullDescription] = useState(false);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        className="bg-gray-800/70 backdrop-blur-lg rounded-xl border border-gray-700/50 overflow-hidden hover:shadow-2xl transition-all duration-300"
      >
        <div className="relative h-48 bg-gradient-to-r from-orange-500/20 to-amber-500/20">
          <img 
            src={institution.image} 
            alt={institution.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={() => toggleBookmark(institution.id)}
              className="p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-all"
            >
              <FiHeart className={`w-5 h-5 ${isBookmarked ? 'text-red-500 fill-red-500' : 'text-white'}`} />
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center gap-2">
              <div className="bg-orange-500/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-orange-300">
                {institution.type}
              </div>
              <div className="flex items-center gap-1 text-yellow-400">
                <FiStar className="w-4 h-4 fill-yellow-400" />
                <span className="text-white font-medium">{institution.rating}</span>
                <span className="text-gray-400 text-xs">({institution.reviews} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-xl font-bold text-white mb-1">{institution.name}</h3>
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
            <FiMapPin className="w-4 h-4" />
            <span>{institution.location}</span>
          </div>

          <p className="text-gray-300 text-sm mb-3 line-clamp-2">
            {institution.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-3">
            {institution.facilities.slice(0, 3).map((facility, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-700/50 rounded-full text-xs text-gray-300">
                {facility}
              </span>
            ))}
            {institution.facilities.length > 3 && (
              <span className="px-2 py-1 bg-gray-700/50 rounded-full text-xs text-gray-400">
                +{institution.facilities.length - 3} more
              </span>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
            <div>
              <p className="text-xs text-gray-400">Fee Range</p>
              <p className="text-sm font-semibold text-amber-400">{institution.fees}</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-orange-500/20 text-orange-300 rounded-lg text-sm hover:bg-orange-500/30 transition-all">
                View Details
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-500 text-white rounded-lg text-sm hover:from-orange-500 hover:to-amber-400 transition-all">
                Contact
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Main Content Area
  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Welcome back, Parent!</h2>
                <p className="text-gray-400">Find the best educational institutions for your child</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-all relative">
                  <FiBell className="w-5 h-5 text-gray-300" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">3</span>
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatsCard 
                icon={FiEye}
                label="Institutions Viewed"
                value={parentStats.totalViewed}
                color="text-blue-400"
                bgColor="bg-blue-500/20"
              />
              <StatsCard 
                icon={FiHeart}
                label="Shortlisted"
                value={parentStats.shortlisted}
                color="text-red-400"
                bgColor="bg-red-500/20"
              />
              <StatsCard 
                icon={FiMessageSquare}
                label="Inquiries Made"
                value={parentStats.inquiries}
                color="text-green-400"
                bgColor="bg-green-500/20"
              />
              <StatsCard 
                icon={FiAward}
                label="Recommendations"
                value={parentStats.recommendations}
                color="text-amber-400"
                bgColor="bg-amber-500/20"
              />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('search')}
                className="p-4 bg-gradient-to-r from-blue-600/20 to-blue-700/20 rounded-xl border border-blue-500/30 text-left hover:shadow-lg transition-all"
              >
                <FiSearch className="w-8 h-8 text-blue-400 mb-2" />
                <h4 className="text-white font-semibold">Search Institutions</h4>
                <p className="text-sm text-gray-400">Find the best options for your child</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('bookmarks')}
                className="p-4 bg-gradient-to-r from-red-600/20 to-red-700/20 rounded-xl border border-red-500/30 text-left hover:shadow-lg transition-all"
              >
                <FiHeart className="w-8 h-8 text-red-400 mb-2" />
                <h4 className="text-white font-semibold">View Bookmarks</h4>
                <p className="text-sm text-gray-400">Your shortlisted institutions</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('inquiries')}
                className="p-4 bg-gradient-to-r from-green-600/20 to-green-700/20 rounded-xl border border-green-500/30 text-left hover:shadow-lg transition-all"
              >
                <FiMessageSquare className="w-8 h-8 text-green-400 mb-2" />
                <h4 className="text-white font-semibold">My Inquiries</h4>
                <p className="text-sm text-gray-400">Track your inquiries</p>
              </motion.button>
            </div>

            {/* Recent Institutions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Recently Viewed</h3>
                <button 
                  onClick={() => setActiveTab('search')}
                  className="text-amber-400 text-sm hover:text-amber-300 transition-colors"
                >
                  View All 
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

      case 'search':
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Search Institutions</h2>
                <p className="text-gray-400">Find the perfect institution for your child</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    showBookmarksOnly 
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <FiHeart className="inline w-4 h-4 mr-2" />
                  {showBookmarksOnly ? 'Show All' : 'Show Bookmarks'}
                </button>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 bg-gray-700/50 rounded-lg text-gray-300 hover:bg-gray-700 transition-all flex items-center gap-2"
                >
                  <FiFilter className="w-4 h-4" />
                  Filters
                  {showFilters ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
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
                  className="bg-gray-800/70 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm text-gray-400 block mb-2">Institution Type</label>
                      <select
                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={filters.location}
                        onChange={(e) => setFilters({...filters, location: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 block mb-2">Sort By</label>
                      <select
                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                      className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results Count */}
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>Showing {filteredInstitutions.length} institutions</span>
              <span>Found {filteredInstitutions.length} results</span>
            </div>

            {/* Institution Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInstitutions.map((inst) => (
                <InstitutionCard key={inst.id} institution={inst} />
              ))}
            </div>

            {filteredInstitutions.length === 0 && (
              <div className="text-center py-12">
                <FiSearch className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white">No institutions found</h3>
                <p className="text-gray-400">Try adjusting your filters</p>
              </div>
            )}
          </div>
        );

      case 'bookmarks':
        const bookmarkedItems = institutions.filter(inst => bookmarkedInstitutions.includes(inst.id));
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Bookmarked Institutions</h2>
              <p className="text-gray-400">Your shortlisted institutions</p>
            </div>

            {bookmarkedItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarkedItems.map((inst) => (
                  <InstitutionCard key={inst.id} institution={inst} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <FiHeart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white">No bookmarks yet</h3>
                <p className="text-gray-400">Start exploring and save institutions you like</p>
                <button
                  onClick={() => setActiveTab('search')}
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-orange-600 to-amber-500 text-white rounded-lg hover:from-orange-500 hover:to-amber-400 transition-all"
                >
                  Explore Institutions
                </button>
              </div>
            )}
          </div>
        );

      case 'inquiries':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">My Inquiries</h2>
              <p className="text-gray-400">Track all your inquiries</p>
            </div>

            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-gray-800/70 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-white font-semibold">Inquiry #{item}</h4>
                      <p className="text-gray-400 text-sm mt-1">Delhi Public School - New Delhi</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-gray-400">Submitted: Jan 15, 2024</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item === 1 ? 'bg-green-500/20 text-green-300' : 
                          item === 2 ? 'bg-yellow-500/20 text-yellow-300' : 
                          'bg-blue-500/20 text-blue-300'
                        }`}>
                          {item === 1 ? 'Responded' : item === 2 ? 'Pending' : 'Reviewed'}
                        </span>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-gray-700/50 rounded-lg text-sm text-gray-300 hover:bg-gray-700 transition-all">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Parent Profile</h2>
              <p className="text-gray-400">Manage your profile settings</p>
            </div>

            <div className="bg-gray-800/70 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-3xl font-bold text-white">
                  P
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Parent Name</h3>
                  <p className="text-gray-400">parent@email.com</p>
                  <p className="text-sm text-amber-400 mt-1">Looking for: Schools</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-700/30 rounded-lg">
                  <p className="text-xs text-gray-400">Student Name</p>
                  <p className="text-white font-medium">Student Name</p>
                </div>
                <div className="p-4 bg-gray-700/30 rounded-lg">
                  <p className="text-xs text-gray-400">Student Class</p>
                  <p className="text-white font-medium">Class 10</p>
                </div>
                <div className="p-4 bg-gray-700/30 rounded-lg">
                  <p className="text-xs text-gray-400">Institution Type Looking For</p>
                  <p className="text-white font-medium">Schools</p>
                </div>
                <div className="p-4 bg-gray-700/30 rounded-lg">
                  <p className="text-xs text-gray-400">Member Since</p>
                  <p className="text-white font-medium">January 2024</p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-500 text-white rounded-lg hover:from-orange-500 hover:to-amber-400 transition-all">
                  Edit Profile
                </button>
                <button className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-all">
                  Change Password
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800/80 backdrop-blur-lg rounded-lg border border-gray-700/50"
      >
        {isSidebarOpen ? <FiX className="w-6 h-6 text-white" /> : <FiMenu className="w-6 h-6 text-white" />}
      </button>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`lg:translate-x-0 fixed lg:static w-72 h-full bg-gray-900/95 backdrop-blur-xl border-r border-gray-700/50 z-40 flex flex-col transition-transform duration-300 ease-in-out`}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-600 to-amber-500 flex items-center justify-center">
              <FiBookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Parent Portal</h1>
              <p className="text-xs text-gray-400">Find the best for your child</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ x: 4 }}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-orange-600/20 to-amber-500/20 text-orange-300 border border-orange-500/30' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-1 h-6 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full"
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-gray-700/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white font-semibold">
              P
            </div>
            <div>
              <p className="text-sm font-medium text-white">Parent</p>
              <p className="text-xs text-gray-400">parent@email.com</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
          >
            <FiLogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default ParentDashboard;