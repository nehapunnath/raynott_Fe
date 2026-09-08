import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, FiUser, FiSearch, FiBookOpen, FiMessageSquare, 
  FiHeart, FiStar, FiFilter, FiMapPin, FiClock, 
  FiBell, FiLogOut, FiMenu, FiX, FiEye, FiAward,
  FiTrendingUp, FiChevronRight, FiCalendar, FiCamera,
  FiInfo, FiSettings, FiArrowRight, FiLoader, FiMail, FiPhone,
  FiShare2, FiExternalLink, FiAlertCircle, FiSend, FiCheckCircle,
  FiClock as FiClockIcon, FiXCircle, FiMessageCircle, FiAtSign
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import schoolApi from '../services/schoolApi';
import collegeApi from '../services/collegeApi';
import puCollegeApi from '../services/pucollegeApi';
import TuitionCoachingApi from '../services/TuitionCoachingApi';
import teacherApi from '../services/TeacherApi';
import enquiryApi from '../services/EnquiryApi';

// ============ STATS CARD COMPONENT (Memoized) ============
const StatsCard = memo(({ icon: Icon, label, value, color, bgColor }) => (
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
));

StatsCard.displayName = 'StatsCard';

// ============ LOADING SPINNER ============
const LoadingSpinner = memo(({ message }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <FiLoader className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
      <p className="text-gray-400">{message || 'Loading...'}</p>
    </div>
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

// ============ ERROR DISPLAY ============
const ErrorDisplay = memo(({ message, onRetry }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center max-w-md">
      <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <FiInfo className="w-8 h-8 text-red-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">Unable to load data</h3>
      <p className="text-gray-400 mb-4">{message || 'Please try again later'}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/20"
        >
          Retry
        </button>
      )}
    </div>
  </div>
));

ErrorDisplay.displayName = 'ErrorDisplay';

// ============ EMPTY STATE ============
const EmptyState = memo(({ type }) => (
  <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
    <FiBookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-white">No {type || 'institutions'} Found</h3>
    <p className="text-gray-400">We couldn't find any {type?.toLowerCase() || 'institutions'} matching your criteria.</p>
  </div>
));

EmptyState.displayName = 'EmptyState';

// ============ INSTITUTION CARD COMPONENT (Memoized) ============
const InstitutionCard = memo(({ 
  institution, 
  isBookmarked, 
  hasEnquired, 
  onToggleBookmark, 
  onOpenEnquiry,
  onNavigate 
}) => {
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
          {hasEnquired && (
            <span className="px-3 py-1 bg-purple-500/90 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
              Enquired
            </span>
          )}
        </div>

        <button
          onClick={() => onToggleBookmark(institution.id)}
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
              onClick={() => onNavigate(`/institution/${institution.type}/${institution.id}`)}
              className="px-4 py-2 bg-white/10 text-white rounded-xl text-sm hover:bg-white/20 transition-all"
            >
              Details
            </button>
            <button 
              onClick={() => onOpenEnquiry(institution)}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/20 flex items-center gap-1"
            >
              <FiMessageCircle className="w-3 h-3" />
              Enquire
            </button>
          </div>
        </div>

        {(institution.email || institution.phone) && (
          <div className="mt-3 pt-3 border-t border-white/5">
            <div className="flex flex-wrap gap-3 text-xs">
              {institution.email && (
                <a href={`mailto:${institution.email}`} className="text-gray-400 hover:text-orange-400 transition-colors flex items-center gap-1">
                  <FiMail className="w-3 h-3" />
                  {institution.email}
                </a>
              )}
              {institution.phone && (
                <a href={`tel:${institution.phone}`} className="text-gray-400 hover:text-orange-400 transition-colors flex items-center gap-1">
                  <FiPhone className="w-3 h-3" />
                  {institution.phone}
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
});

InstitutionCard.displayName = 'InstitutionCard';

// ============ ENQUIRY MODAL COMPONENT (Memoized) ============
const EnquiryModalComponent = memo(({
  isOpen,
  institution,
  formData,
  isSubmitting,
  isSuccess,
  error,
  onClose,
  onSubmit,
  onFormChange,
}) => {
  if (!isOpen || !institution) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => !isSubmitting && onClose()}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-lg bg-gray-900 rounded-3xl border border-white/10 shadow-2xl overflow-hidden max-h-[100vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-white/10 sticky top-0 bg-gray-900 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Send Enquiry</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    To: <span className="text-orange-300">{institution.name}</span>
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                  disabled={isSubmitting}
                >
                  <FiX className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {isSuccess ? (
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCheckCircle className="w-10 h-10 text-green-400" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Enquiry Sent!</h4>
                <p className="text-gray-400">
                  Your enquiry has been sent to {institution.name}. 
                  They will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="p-6 space-y-4">
                {error && (
                  <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
                    <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <div>
                  <label className="text-sm text-gray-400 block mb-1.5">Subject <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-gray-800/80 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={formData.subject}
                    onChange={(e) => onFormChange('subject', e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 block mb-1.5">Message <span className="text-red-400">*</span></label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2.5 bg-gray-800/80 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    placeholder="Write your enquiry details here..."
                    value={formData.message}
                    onChange={(e) => onFormChange('message', e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 block mb-1.5">Student Name <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-gray-800/80 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={formData.studentName}
                      onChange={(e) => onFormChange('studentName', e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 block mb-1.5">Student Class <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-gray-800/80 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={formData.studentClass}
                      onChange={(e) => onFormChange('studentClass', e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 block mb-1.5">
                      <FiMail className="inline w-3 h-3 mr-1" />
                      Your Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2.5 bg-gray-800/80 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="your@email.com"
                      value={formData.parentEmail}
                      onChange={(e) => onFormChange('parentEmail', e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 block mb-1.5">
                      <FiPhone className="inline w-3 h-3 mr-1" />
                      Your Phone
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2.5 bg-gray-800/80 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="+91 9876543210"
                      value={formData.parentPhone}
                      onChange={(e) => onFormChange('parentPhone', e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 block mb-1.5">Preferred Contact <span className="text-red-400">*</span></label>
                  <div className="flex gap-4 flex-wrap">
                    <label className="flex items-center gap-2 text-white cursor-pointer">
                      <input
                        type="radio"
                        value="email"
                        checked={formData.preferredContact === 'email'}
                        onChange={(e) => onFormChange('preferredContact', e.target.value)}
                        disabled={isSubmitting}
                        className="text-purple-500 focus:ring-purple-500"
                      />
                      <FiMail className="w-3 h-3" />
                      Email
                    </label>
                    <label className="flex items-center gap-2 text-white cursor-pointer">
                      <input
                        type="radio"
                        value="phone"
                        checked={formData.preferredContact === 'phone'}
                        onChange={(e) => onFormChange('preferredContact', e.target.value)}
                        disabled={isSubmitting}
                        className="text-purple-500 focus:ring-purple-500"
                      />
                      <FiPhone className="w-3 h-3" />
                      Phone
                    </label>
                    <label className="flex items-center gap-2 text-white cursor-pointer">
                      <input
                        type="radio"
                        value="both"
                        checked={formData.preferredContact === 'both'}
                        onChange={(e) => onFormChange('preferredContact', e.target.value)}
                        disabled={isSubmitting}
                        className="text-purple-500 focus:ring-purple-500"
                      />
                      Both
                    </label>
                  </div>
                </div>

                {(institution.email || institution.phone) && (
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-xs text-gray-400 mb-1">Institution Contact:</p>
                    <div className="flex flex-wrap gap-3 text-sm">
                      {institution.email && (
                        <span className="text-gray-300 flex items-center gap-1">
                          <FiMail className="w-3 h-3 text-orange-400" />
                          {institution.email}
                        </span>
                      )}
                      {institution.phone && (
                        <span className="text-gray-300 flex items-center gap-1">
                          <FiPhone className="w-3 h-3 text-orange-400" />
                          {institution.phone}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <FiLoader className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend className="w-4 h-4" />
                      Send Enquiry
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

EnquiryModalComponent.displayName = 'EnquiryModalComponent';

const ParentDashboard = () => {
  const navigate = useNavigate();
  
  // ============ ALL HOOKS AT TOP LEVEL ============
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

  const [enquiries, setEnquiries] = useState([]);
  const [isLoadingEnquiries, setIsLoadingEnquiries] = useState(false);
  
  // Modal state
  const [modalState, setModalState] = useState({
    isOpen: false,
    institution: null,
    isSubmitting: false,
    isSuccess: false,
    error: null
  });

  // Form state - using ref to avoid re-renders on keystroke
  const formDataRef = useRef({
    subject: '',
    message: '',
    studentName: '',
    studentClass: '',
    parentEmail: '',
    parentPhone: '',
    preferredContact: 'email'
  });

  // Force update for form fields 
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    studentName: '',
    studentClass: '',
    parentEmail: '',
    parentPhone: '',
    preferredContact: 'email'
  });

  // ============ REFS ============
  const fetchCalledRef = useRef(false);
  const currentTypeRef = useRef('');
  const isDataLoadedRef = useRef(false);
  const initialFetchDoneRef = useRef(false);

  // ============ EFFECTS ============
  useEffect(() => {
    const loadParentData = () => {
      try {
        const storedData = localStorage.getItem('parentData');
        console.log('📋 Stored parent data:', storedData);
        
        if (storedData) {
          const data = JSON.parse(storedData);
          let institutionType = data.institutionType || 'Schools';
          
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
            phone: data.phone || data.mobile || '',
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
            phone: '',
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
          phone: '',
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
  }, []);

  // In ParentDashboard.jsx - The loadEnquiries useEffect

useEffect(() => {
  const loadEnquiries = async () => {
    if (!isParentDataLoaded) {
      return;
    }
    
    console.log('🔍 Loading enquiries');
    
    try {
      setIsLoadingEnquiries(true);
      
      // First, try to load from localStorage immediately (for speed)
      let localEnquiries = [];
      try {
        const stored = localStorage.getItem('parentEnquiries');
        if (stored) {
          localEnquiries = JSON.parse(stored);
          if (Array.isArray(localEnquiries) && localEnquiries.length > 0) {
            console.log(`📋 Loaded ${localEnquiries.length} enquiries from localStorage (initial)`);
            setEnquiries(localEnquiries);
          }
        }
      } catch (e) {
        console.error('Error parsing stored enquiries:', e);
      }
      
      // Check if we have a valid token
      const token = localStorage.getItem('parentToken');
      if (!token) {
        console.warn('⚠️ No parent token found, using localStorage only');
        setIsLoadingEnquiries(false);
        return;
      }
      
      // Try to fetch from API
      console.log('📡 Attempting to fetch enquiries from API...');
      const response = await enquiryApi.getParentEnquiries();
      console.log('✅ API Response:', response);
      
      let enquiriesData = [];
      
      // Handle different response formats
      if (response && response.success) {
        enquiriesData = response.data || [];
      } else if (response && Array.isArray(response)) {
        enquiriesData = response;
      } else if (response && response.enquiries) {
        enquiriesData = response.enquiries;
      } else if (response && response.data && Array.isArray(response.data)) {
        enquiriesData = response.data;
      }
      
      if (!Array.isArray(enquiriesData)) {
        enquiriesData = [];
      }
      
      // If we got data from API, use it
      if (enquiriesData.length > 0) {
        console.log(`📋 Setting ${enquiriesData.length} enquiries from API`);
        setEnquiries(enquiriesData);
        // Update localStorage with API data
        localStorage.setItem('parentEnquiries', JSON.stringify(enquiriesData));
      } else if (localEnquiries.length > 0) {
        // If API returned empty but we have local data, keep local data
        console.log(`📋 Keeping ${localEnquiries.length} enquiries from localStorage`);
        // Already set above
      }
      
    } catch (error) {
      console.error('❌ Error loading enquiries:', error);
      
      // If 401, clear the token
      if (error.response?.status === 401 || error.message?.includes('401')) {
        console.warn('⚠️ 401 error - clearing invalid token');
        localStorage.removeItem('parentToken');
      }
      
      // Keep whatever we have in localStorage
      try {
        const stored = localStorage.getItem('parentEnquiries');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            console.log(`📋 Keeping ${parsed.length} enquiries from localStorage (fallback)`);
            setEnquiries(parsed);
          }
        }
      } catch (localError) {
        console.error('Error loading enquiries from localStorage:', localError);
      }
    } finally {
      setIsLoadingEnquiries(false);
    }
  };
  
  loadEnquiries();
}, [isParentDataLoaded]);

  useEffect(() => {
    if (enquiries.length > 0) {
      try {
        localStorage.setItem('parentEnquiries', JSON.stringify(enquiries));
      } catch (error) {
        console.error('Error saving enquiries:', error);
      }
    }
  }, [enquiries]);

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

  useEffect(() => {
    if (isParentDataLoaded && parentData && parentData.institutionType) {
      console.log(`📋 Parent data loaded with type: ${parentData.institutionType}`);
      
      fetchCalledRef.current = false;
      currentTypeRef.current = '';
      
      if (!initialFetchDoneRef.current) {
        initialFetchDoneRef.current = true;
        fetchInstitutions();
      }
    } else if (isParentDataLoaded) {
      console.warn('⚠️ Parent data loaded but no institution type set');
    }
  }, [isParentDataLoaded, parentData]);

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

  // ============ CALLBACKS ============
  const fetchInstitutions = useCallback(async (forceType = null) => {
    let type = forceType || parentData?.institutionType;
    type = type?.trim() || '';
    
    console.log(`🔍 Fetching institutions for type: "${type}"`);
    
    if (!type || type === '') {
      console.warn('⚠️ No institution type found, defaulting to Schools');
      type = 'Schools';
    }

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
  }, [parentData]);

  const toggleBookmark = useCallback((id) => {
    setBookmarkedInstitutions(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  }, []);

  // ============ MODAL FUNCTIONS ============
  const openEnquiryModal = useCallback((institution) => {
    const initialFormData = {
      subject: `Enquiry about ${institution.name}`,
      message: '',
      studentName: parentData?.studentName || '',
      studentClass: parentData?.studentClass || '',
      parentEmail: parentData?.email || '',
      parentPhone: parentData?.phone || '',
      preferredContact: 'email'
    };
    
    // Update ref and state
    formDataRef.current = { ...initialFormData };
    setFormData(initialFormData);
    
    setModalState({
      isOpen: true,
      institution: institution,
      isSubmitting: false,
      isSuccess: false,
      error: null
    });
  }, [parentData]);

  const closeEnquiryModal = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      isOpen: false
    }));
  }, []);

  const handleFormChange = useCallback((field, value) => {
    // Update ref immediately
    formDataRef.current[field] = value;
    // Update state - but only for controlled inputs
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleEnquirySubmit = useCallback(async (e) => {
    e.preventDefault();
    
    setModalState(prev => ({
      ...prev,
      isSubmitting: true,
      error: null
    }));

    const currentForm = formDataRef.current;
    const institution = modalState.institution;

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (currentForm.parentEmail && !emailRegex.test(currentForm.parentEmail)) {
      setModalState(prev => ({
        ...prev,
        isSubmitting: false,
        error: 'Please enter a valid email address'
      }));
      return;
    }

    // Validate phone 
    const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
    if (currentForm.parentPhone && !phoneRegex.test(currentForm.parentPhone)) {
      setModalState(prev => ({
        ...prev,
        isSubmitting: false,
        error: 'Please enter a valid phone number (10-15 digits)'
      }));
      return;
    }

    try {
      const enquiryData = {
        institutionId: institution.id,
        institutionName: institution.name,
        institutionType: institution.type,
        institutionEmail: institution.email || null,
        institutionPhone: institution.phone || null,
        subject: currentForm.subject,
        message: currentForm.message,
        studentName: currentForm.studentName,
        studentClass: currentForm.studentClass,
        parentEmail: currentForm.parentEmail || parentData?.email || '',
        parentPhone: currentForm.parentPhone || parentData?.phone || '',
        preferredContact: currentForm.preferredContact,
        parentName: parentData?.parentName || 'Parent'
      };

      let response;
      try {
        response = await enquiryApi.submitEnquiry(enquiryData);
        console.log('✅ Enquiry submitted successfully:', response);
      } catch (apiError) {
        console.warn('⚠️ API submission failed, saving locally:', apiError);
        response = {
          success: true,
          enquiryId: `enq_${Date.now()}`,
          message: 'Enquiry saved locally'
        };
      }

      const newEnquiry = {
        id: response.enquiryId || `enq_${Date.now()}`,
        ...enquiryData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        responses: []
      };

      setEnquiries(prev => [newEnquiry, ...prev]);
      
      const updatedEnquiries = [newEnquiry, ...enquiries];
      localStorage.setItem('parentEnquiries', JSON.stringify(updatedEnquiries));
      
      setModalState(prev => ({
        ...prev,
        isSubmitting: false,
        isSuccess: true
      }));
      
      setTimeout(() => {
        setModalState(prev => ({
          ...prev,
          isOpen: false,
          isSuccess: false
        }));
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      setModalState(prev => ({
        ...prev,
        isSubmitting: false,
        error: error.message || 'Failed to send enquiry. Please try again.'
      }));
    }
  }, [modalState.institution, parentData, enquiries]);

  const updateEnquiryStatus = useCallback(async (enquiryId, newStatus) => {
    try {
      const response = await enquiryApi.updateEnquiryStatus(enquiryId, newStatus);
      console.log('✅ Enquiry status updated:', response);
      
      setEnquiries(prev => 
        prev.map(enq => 
          enq.id === enquiryId 
            ? { ...enq, status: newStatus, updatedAt: new Date().toISOString() }
            : enq
        )
      );
      
    } catch (error) {
      console.error('Error updating enquiry status:', error);
      setEnquiries(prev => 
        prev.map(enq => 
          enq.id === enquiryId 
            ? { ...enq, status: newStatus, updatedAt: new Date().toISOString() }
            : enq
        )
      );
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('parentToken');
    localStorage.removeItem('parentData');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('parentBookmarks');
    localStorage.removeItem('parentEnquiries');
    navigate('/');
  }, [navigate]);

  const navigateToInstitution = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  // ============ HELPER FUNCTIONS ============
  const extractDataFromResponse = (response, type) => {
    console.log(`📥 Extracting ${type} data from response:`, response);
    
    if (!response) {
      console.warn('⚠️ No response received');
      return [];
    }

    if (Array.isArray(response)) {
      console.log(`✅ Response is already an array with ${response.length} items`);
      return response;
    }

    if (response.success === true) {
      console.log('🔍 Response has success: true');
      
      const possibleDataKeys = ['data', 'teachers', 'users', 'items', 'results', 'records'];
      
      for (const key of possibleDataKeys) {
        if (response[key]) {
          console.log(`🔍 Found response.${key}:`, response[key]);
          
          if (Array.isArray(response[key])) {
            console.log(`✅ response.${key} is an array with ${response[key].length} items`);
            return response[key];
          }
          
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

  const transformInstitutionData = (item, index, type) => {
    const fieldMappings = {
      'Schools': {
        name: ['schoolName', 'name', 'title', 'institutionName'],
        location: ['city', 'location', 'address', 'place', 'district'],
        image: ['schoolImage', 'image', 'photo', 'logo', 'profileImage'],
        rating: ['rating', 'averageRating', 'avgRating', 'ratingValue'],
        reviews: ['reviews', 'reviewCount', 'totalReviews', 'reviewCount'],
        facilities: ['facilities', 'amenities', 'features', 'services'],
        fees: ['fees', 'feeStructure', 'tuitionFees', 'feeRange', 'totalAnnualFee'],
        description: ['description', 'about', 'overview', 'introduction'],
        email: ['email', 'contactEmail', 'schoolEmail'],
        phone: ['phone', 'contactNumber', 'schoolPhone', 'mobile']
      },
      'Colleges': {
        name: ['collegeName', 'name', 'title', 'institutionName'],
        location: ['city', 'location', 'address', 'place', 'district'],
        image: ['collegeImage', 'image', 'photo', 'logo', 'profileImage'],
        rating: ['rating', 'averageRating', 'avgRating', 'ratingValue'],
        reviews: ['reviews', 'reviewCount', 'totalReviews', 'reviewCount'],
        facilities: ['facilities', 'amenities', 'features', 'services'],
        fees: ['fees', 'feeStructure', 'tuitionFees', 'feeRange', 'totalAnnualFee'],
        description: ['description', 'about', 'overview', 'introduction'],
        email: ['email', 'contactEmail', 'collegeEmail'],
        phone: ['phone', 'contactNumber', 'collegePhone', 'mobile']
      },
      'PU College': {
        name: ['puCollegeName', 'collegeName', 'name', 'title', 'institutionName'],
        location: ['city', 'location', 'address', 'place', 'district'],
        image: ['puCollegeImage', 'collegeImage', 'image', 'photo', 'logo'],
        rating: ['rating', 'averageRating', 'avgRating', 'ratingValue'],
        reviews: ['reviews', 'reviewCount', 'totalReviews', 'reviewCount'],
        facilities: ['facilities', 'amenities', 'features', 'services'],
        fees: ['fees', 'feeStructure', 'tuitionFees', 'feeRange', 'totalAnnualFee'],
        description: ['description', 'about', 'overview', 'introduction'],
        email: ['email', 'contactEmail', 'puCollegeEmail'],
        phone: ['phone', 'contactNumber', 'puCollegePhone','mobile']
      },
      'Coaching/Tuition': {
        name: ['centerName', 'name', 'title', 'coachingName', 'institutionName'],
        location: ['city', 'location', 'address', 'place', 'district'],
        image: ['centerImage', 'image', 'photo', 'logo', 'profileImage'],
        rating: ['rating', 'averageRating', 'avgRating', 'ratingValue'],
        reviews: ['reviews', 'reviewCount', 'totalReviews', 'reviewCount'],
        facilities: ['facilities', 'amenities', 'features', 'subjects', 'courses'],
        fees: ['fees', 'feeStructure', 'tuitionFees', 'courseFees', 'feeRange', 'totalAnnualFee'],
        description: ['description', 'about', 'overview', 'introduction'],
        email: ['email', 'contactEmail', 'centerEmail'],
        phone: ['phone', 'contactNumber', 'centerPhone', 'mobile']
      },
      'All Teachers': {
        name: ['teacherName', 'name', 'fullName', 'username', 'displayName', 'title'],
        location: ['city', 'location', 'address', 'place', 'teachingCity', 'preferredLocation'],
        image: ['profileImage', 'profilePhoto', 'image', 'photo', 'avatar', 'profilePicture'],
        rating: ['rating', 'averageRating', 'avgRating', 'ratingValue', 'teacherRating'],
        reviews: ['reviews', 'reviewCount', 'totalReviews', 'reviewCount'],
        facilities: ['subjects', 'specializations', 'expertise', 'skills', 'subjectsTaught'],
        fees: ['hourlyRate', 'rate', 'fees', 'charges', 'price', 'fee'],
        description: ['description', 'about', 'bio', 'introduction', 'profileDescription'],
        email: ['email', 'teacherEmail', 'contactEmail'],
        phone: ['phone', 'teacherPhone', 'contactNumber', 'mobile']
      }
    };

    const fields = fieldMappings[type] || fieldMappings['Schools'];

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
    const email = getValue(fields.email, null);
    const phone = getValue(fields.phone, null);

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
      email: email,
      phone: phone,
      website: item.website || item.webUrl || null,
      subjects: subjects,
      experience: experience,
      qualification: qualification,
      originalData: item
    };
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'text-yellow-400 bg-yellow-500/20';
      case 'responded': return 'text-green-400 bg-green-500/20';
      case 'closed': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return FiClockIcon;
      case 'responded': return FiCheckCircle;
      case 'closed': return FiXCircle;
      default: return FiClockIcon;
    }
  };

  // ============ RENDER FUNCTIONS ============
  const renderDashboard = () => {
    const pendingEnquiries = enquiries.filter(enq => enq.status === 'pending').length;
    const respondedEnquiries = enquiries.filter(enq => enq.status === 'responded').length;

    return (
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
                  {enquiries.length > 0 && (
                    <span className="px-3 py-1 bg-purple-500/20 rounded-full text-xs text-purple-300">
                      {enquiries.length} Enquiries
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
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
          <StatsCard 
            icon={FiMessageSquare}
            label="Total Enquiries"
            value={enquiries.length}
            color="text-purple-400"
            bgColor="bg-purple-500/20"
          />
          <StatsCard 
            icon={FiCheckCircle}
            label="Responses Received"
            value={respondedEnquiries}
            color="text-green-400"
            bgColor="bg-green-500/20"
          />
        </motion.div>

        {enquiries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white">Recent Enquiries</h3>
                <p className="text-sm text-gray-400">Track your recent enquiries</p>
              </div>
              <button 
                onClick={() => setActiveTab('enquiries')}
                className="text-purple-400 text-sm hover:text-purple-300 transition-colors flex items-center gap-1 bg-purple-500/10 px-4 py-2 rounded-xl"
              >
                View All
                <FiArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {enquiries.slice(0, 3).map((enquiry) => {
                const StatusIcon = getStatusIcon(enquiry.status);
                return (
                  <div key={enquiry.id} className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <FiMessageSquare className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-medium truncate">{enquiry.subject}</p>
                        <p className="text-sm text-gray-400 truncate">
                          To: {enquiry.institutionName} • {new Date(enquiry.createdAt).toLocaleDateString('en-IN',{
                            day:'2-digit',
                            month:'short',
                            year:'numeric'
                          })}
                        </p>
                        {enquiry.parentEmail && (
                          <p className="text-xs text-gray-500 truncate">
                            <FiMail className="inline w-3 h-3 mr-1" />
                            {enquiry.parentEmail}
                            {enquiry.parentPhone && ` • ${enquiry.parentPhone}`}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(enquiry.status)} flex items-center gap-1`}>
                        <StatusIcon className="w-3 h-3" />
                        {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
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
            <LoadingSpinner message={`Loading ${parentData?.institutionType || 'institutions'}...`} />
          ) : error ? (
            <ErrorDisplay message={error} onRetry={() => {
              fetchCalledRef.current = false;
              fetchInstitutions();
            }} />
          ) : institutions.length === 0 ? (
            <EmptyState type={parentData?.institutionType || 'institutions'} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...institutions]
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 3)
                .map((inst) => (
                  <InstitutionCard
                    key={inst.id}
                    institution={inst}
                    isBookmarked={bookmarkedInstitutions.includes(inst.id)}
                    hasEnquired={enquiries.some(enq => enq.institutionId === inst.id)}
                    onToggleBookmark={toggleBookmark}
                    onOpenEnquiry={openEnquiryModal}
                    onNavigate={navigateToInstitution}
                  />
                ))}
            </div>
          )}
        </motion.div>
      </div>
    );
  };

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
        <LoadingSpinner message={`Loading ${parentData?.institutionType || 'institutions'}...`} />
      ) : error ? (
        <ErrorDisplay message={error} onRetry={() => {
          fetchCalledRef.current = false;
          fetchInstitutions();
        }} />
      ) : filteredInstitutions.length === 0 ? (
        <EmptyState type={parentData?.institutionType || 'institutions'} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstitutions.map((inst) => (
            <InstitutionCard
              key={inst.id}
              institution={inst}
              isBookmarked={bookmarkedInstitutions.includes(inst.id)}
              hasEnquired={enquiries.some(enq => enq.institutionId === inst.id)}
              onToggleBookmark={toggleBookmark}
              onOpenEnquiry={openEnquiryModal}
              onNavigate={navigateToInstitution}
            />
          ))}
        </div>
      )}
    </div>
  );

  const renderBookmarks = () => {
    const bookmarkedItems = institutions.filter(inst => bookmarkedInstitutions.includes(inst.id));
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Your Bookmarks</h2>
          <p className="text-gray-400">{parentData?.institutionType || 'Schools'} you've shortlisted</p>
        </div>

        {isLoading ? (
          <LoadingSpinner message={`Loading ${parentData?.institutionType || 'institutions'}...`} />
        ) : error ? (
          <ErrorDisplay message={error} onRetry={() => {
            fetchCalledRef.current = false;
            fetchInstitutions();
          }} />
        ) : bookmarkedItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedItems.map((inst) => (
              <InstitutionCard
                key={inst.id}
                institution={inst}
                isBookmarked={true}
                hasEnquired={enquiries.some(enq => enq.institutionId === inst.id)}
                onToggleBookmark={toggleBookmark}
                onOpenEnquiry={openEnquiryModal}
                onNavigate={navigateToInstitution}
              />
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

  const renderEnquiries = () => {
    const pendingEnquiries = enquiries.filter(enq => enq.status === 'pending');
    const respondedEnquiries = enquiries.filter(enq => enq.status === 'responded');
    const closedEnquiries = enquiries.filter(enq => enq.status === 'closed');

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Your Enquiries</h2>
          <p className="text-gray-400">Track all your enquiries and responses</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 text-center">
            <p className="text-2xl font-bold text-yellow-400">{pendingEnquiries.length}</p>
            <p className="text-xs text-gray-400">Pending</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 text-center">
            <p className="text-2xl font-bold text-green-400">{respondedEnquiries.length}</p>
            <p className="text-xs text-gray-400">Responded</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 text-center">
            <p className="text-2xl font-bold text-gray-400">{closedEnquiries.length}</p>
            <p className="text-xs text-gray-400">Closed</p>
          </div>
        </div>

        {isLoadingEnquiries ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <FiLoader className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        ) : enquiries.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
            <FiMessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white">No enquiries yet</h3>
            <p className="text-gray-400">Start enquiring about {parentData?.institutionType || 'Institute'} you're interested in</p>
            <button
              onClick={() => setActiveTab('search')}
              className="mt-4 px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/20"
            >
              Browse {parentData?.institutionType || 'Institute'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {enquiries.map((enquiry) => {
              const StatusIcon = getStatusIcon(enquiry.status);
              return (
                <motion.div
                  key={enquiry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        <h4 className="text-lg font-semibold text-white">{enquiry.subject}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(enquiry.status)} flex items-center gap-1`}>
                          <StatusIcon className="w-3 h-3" />
                          {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                        </span>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-3">{enquiry.message}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <FiBookOpen className="w-3 h-3" />
                          {enquiry.institutionName}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiCalendar className="w-3 h-3" />
                          {new Date(enquiry.createdAt).toLocaleDateString(
                            'en-IN',{
                            day:'2-digit',
                            month:'short',
                            year:'numeric'
                          }
                          )}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiClock className="w-3 h-3" />
                          {new Date(enquiry.createdAt).toLocaleTimeString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiUser className="w-3 h-3" />
                          Student: {enquiry.studentName}
                        </span>
                      </div>

                      {(enquiry.parentEmail || enquiry.parentPhone) && (
                        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                          {enquiry.parentEmail && (
                            <span className="flex items-center gap-1 text-gray-400">
                              <FiMail className="w-3 h-3 text-purple-400" />
                              <a href={`mailto:${enquiry.parentEmail}`} className="hover:text-purple-400 transition-colors">
                                {enquiry.parentEmail}
                              </a>
                            </span>
                          )}
                          {enquiry.parentPhone && (
                            <span className="flex items-center gap-1 text-gray-400">
                              <FiPhone className="w-3 h-3 text-purple-400" />
                              <a href={`tel:${enquiry.parentPhone}`} className="hover:text-purple-400 transition-colors">
                                {enquiry.parentPhone}
                              </a>
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-gray-500">
                            <FiAtSign className="w-3 h-3" />
                            Prefers: {enquiry.preferredContact}
                          </span>
                        </div>
                      )}

                      {(enquiry.institutionEmail || enquiry.institutionPhone) && (
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                          <span className="text-gray-500">Institution contact:</span>
                          {enquiry.institutionEmail && (
                            <span className="flex items-center gap-1">
                              <FiMail className="w-3 h-3 text-orange-400" />
                              <a href={`mailto:${enquiry.institutionEmail}`} className="hover:text-orange-400 transition-colors">
                                {enquiry.institutionEmail}
                              </a>
                            </span>
                          )}
                          {enquiry.institutionPhone && (
                            <span className="flex items-center gap-1">
                              <FiPhone className="w-3 h-3 text-orange-400" />
                              <a href={`tel:${enquiry.institutionPhone}`} className="hover:text-orange-400 transition-colors">
                                {enquiry.institutionPhone}
                              </a>
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      {enquiry.status === 'pending' && (
                        <button
                          onClick={() => updateEnquiryStatus(enquiry.id, 'responded')}
                          className="px-4 py-2 bg-green-500/20 text-green-400 rounded-xl text-sm hover:bg-green-500/30 transition-all"
                        >
                          Mark as Responded
                        </button>
                      )}
                      {enquiry.status === 'responded' && (
                        <button
                          onClick={() => updateEnquiryStatus(enquiry.id, 'closed')}
                          className="px-4 py-2 bg-red-800 text-red-400 rounded-xl text-sm hover:bg-gray-500/30 transition-all"
                        >
                          Mark as Closed
                        </button>
                      )}
                      {/* <div className="text-xs text-gray-500">
                        Updated: {new Date(enquiry.updatedAt).toLocaleDateString(
                          'en-IN',{
                            day:'2-digit',
                            month:'short',
                            year:'numeric'
                          }
                        )}
                      </div> */}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return renderDashboard();
      case 'search': return renderSearch();
      case 'bookmarks': return renderBookmarks();
      case 'enquiries': return renderEnquiries();
      default: return renderDashboard();
    }
  };

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
    { id: 'enquiries', label: 'Enquiries', icon: FiMessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10"
      >
        {isSidebarOpen ? <FiX className="w-6 h-6 text-white" /> : <FiMenu className="w-6 h-6 text-white" />}
      </button>

      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

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
                {item.id === 'enquiries' && enquiries.filter(e => e.status === 'pending').length > 0 && (
                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded-full flex-shrink-0 animate-pulse">
                    {enquiries.filter(e => e.status === 'pending').length}
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
              {parentData?.phone && (
                <p className="text-xs text-gray-500 truncate">{parentData.phone}</p>
              )}
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
                    {item.id === 'enquiries' && enquiries.filter(e => e.status === 'pending').length > 0 && (
                      <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded-full flex-shrink-0 animate-pulse">
                        {enquiries.filter(e => e.status === 'pending').length}
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
                  {parentData?.phone && (
                    <p className="text-xs text-gray-500 truncate">{parentData.phone}</p>
                  )}
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

      <main className="flex-1 lg:ml-72 p-4 lg:p-8 overflow-y-auto min-h-screen">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>

      <EnquiryModalComponent
        isOpen={modalState.isOpen}
        institution={modalState.institution}
        formData={formData}
        isSubmitting={modalState.isSubmitting}
        isSuccess={modalState.isSuccess}
        error={modalState.error}
        onClose={closeEnquiryModal}
        onSubmit={handleEnquirySubmit}
        onFormChange={handleFormChange}
      />
    </div>
  );
};

export default ParentDashboard;