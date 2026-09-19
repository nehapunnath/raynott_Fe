import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FiLogOut, FiUser, FiHome, FiPlus, FiUsers, FiCalendar, FiClock, 
  FiMenu, FiX, FiCheckCircle, FiXCircle, FiAlertCircle, 
  FiLoader, FiFileText, FiMail, FiPhone, FiMapPin, FiBookOpen, 
  FiAward, FiBriefcase, FiFlag, FiCheck, FiClipboard, FiInfo, 
  FiArrowRight, FiRefreshCw, FiMessageSquare, FiInbox,
  FiEye, FiCopy, FiAtSign, FiSearch, FiLock, FiUnlock,
  FiPackage, FiStar, FiChevronDown, FiChevronUp,
  FiDollarSign, FiCreditCard,FiZap
} from 'react-icons/fi';
import { authApis } from '../services/allApis';
import registerApi from '../services/RegisterApi';
import { schoolApi } from '../services/schoolApi';
import { collegeApi } from '../services/collegeApi';
import { puCollegeApi } from '../services/pucollegeApi';
import { TuitionCoachingApi } from '../services/TuitionCoachingApi';
import { teacherApi } from '../services/TeacherApi';
import { toast } from 'react-toastify';
import enquiryApi from '../services/EnquiryApi';

const DEFAULT_FREE_LIMIT = 5;

// Fallback plans if backend fails
const FALLBACK_PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    enquiries: 10,
    price: 500,
    originalPrice: 700,
    popular: false,
    badge: '',
    features: ['10 additional enquiries', 'Email & phone access', 'Priority support']
  },
  {
    id: 'standard',
    name: 'Standard',
    enquiries: 25,
    price: 1000,
    originalPrice: 1500,
    popular: true,
    badge: 'MOST POPULAR',
    features: ['25 additional enquiries', 'Email & phone access', 'Priority support', 'Better visibility']
  },
  {
    id: 'premium',
    name: 'Premium',
    enquiries: 50,
    price: 1800,
    originalPrice: 2800,
    popular: false,
    badge: 'BEST VALUE',
    features: ['50 additional enquiries', 'Email & phone access', 'Priority support', 'Better visibility', 'Featured badge']
  }
];

const Dashboard = () => {
  // ============ BASIC STATE ============
  const [institutionName, setInstitutionName] = useState('');
  const [institutionType, setInstitutionType] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [registrationId, setRegistrationId] = useState(null);
  const [institutionId, setInstitutionId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [pollingInterval, setPollingInterval] = useState(null);
  
  // ============ ENQUIRY STATE ============
  const [allEnquiries, setAllEnquiries] = useState([]);
  const [visibleEnquiries, setVisibleEnquiries] = useState([]);
  const [lockedEnquiries, setLockedEnquiries] = useState([]);
  const [enquiriesLoading, setEnquiriesLoading] = useState(false);
  const [enquiryStats, setEnquiryStats] = useState({
    total: 0,
    visible: 0,
    locked: 0,
    pending: 0,
    responded: 0,
    closed: 0
  });
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showEnquiryDetail, setShowEnquiryDetail] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const [showPlansExpanded, setShowPlansExpanded] = useState(false);
  
  // ============ PLANS STATE (from backend) ============
  const [pricingPlans, setPricingPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);
  
  // ============ LIMIT STATE (from backend) ============
  const [institutionLimit, setInstitutionLimit] = useState({
    freeLimit: DEFAULT_FREE_LIMIT,
    customLimit: 0,
    totalLimit: DEFAULT_FREE_LIMIT,
    lastUpdatedAt: null
  });

  const navigate = useNavigate();

  // ============ HELPER FUNCTIONS ============

  const findInstitutionByEmail = async (email) => {
    try {
      const apis = [
        { type: 'school', api: schoolApi, method: 'getSchools' },
        { type: 'college', api: collegeApi, method: 'getColleges' },
        { type: 'pu_college', api: puCollegeApi, method: 'getPUColleges' },
        { type: 'coaching', api: TuitionCoachingApi, method: 'getTuitionCoachings' },
        { type: 'teacher', api: teacherApi, method: 'getTeachers' }
      ];

      for (const item of apis) {
        try {
          const response = await item.api[item.method]();
          
          if (response && response.success && response.data) {
            let institutions = [];
            if (Array.isArray(response.data)) {
              institutions = response.data;
            } else if (typeof response.data === 'object') {
              institutions = Object.keys(response.data).map(key => ({
                id: key,
                ...response.data[key]
              }));
            }
            
            const found = institutions.find(inst => 
              inst.email === email || 
              inst.email?.toLowerCase() === email?.toLowerCase()
            );
            
            if (found) {
              return { ...found, institutionType: item.type };
            }
          }
        } catch (e) {
          console.log(`⚠️ Error fetching ${item.type}:`, e.message);
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error finding institution by email:', error);
      return null;
    }
  };

  // ============ FETCH INSTITUTION LIMIT FROM BACKEND ============
  const fetchInstitutionLimit = async () => {
    const id = institutionId || localStorage.getItem('institutionId');
    if (!id) return;

    try {
      console.log('📡 Fetching institution limit from backend:', id);
      const result = await enquiryApi.getInstitutionLimit(id);
      
      if (result && result.success && result.data) {
        const limitData = {
          freeLimit: result.data.freeLimit || DEFAULT_FREE_LIMIT,
          customLimit: result.data.customLimit || 0,
          totalLimit: result.data.totalLimit || (DEFAULT_FREE_LIMIT + (result.data.customLimit || 0)),
          lastUpdatedAt: result.data.lastUpdatedAt || null
        };
        
        console.log('✅ Fetched limit:', limitData);
        setInstitutionLimit(limitData);
        return limitData;
      }
    } catch (error) {
      console.warn('⚠️ Failed to fetch limit from backend, using localStorage');
      
      const savedLimits = JSON.parse(localStorage.getItem('institutionLimits') || '{}');
      const localLimit = savedLimits[id];
      
      const fallbackLimit = {
        freeLimit: DEFAULT_FREE_LIMIT,
        customLimit: localLimit?.customLimit || 0,
        totalLimit: DEFAULT_FREE_LIMIT + (localLimit?.customLimit || 0),
        lastUpdatedAt: localLimit?.updatedAt || null
      };
      
      setInstitutionLimit(fallbackLimit);
      return fallbackLimit;
    }
  };

  // ============ FETCH ACTIVE PLANS FROM BACKEND ============
  const fetchActivePlans = async () => {
    setPlansLoading(true);
    try {
      console.log('📡 Fetching active plans from backend...');
      const result = await enquiryApi.getActivePlans();
      
      if (result && result.success && Array.isArray(result.data) && result.data.length > 0) {
        console.log(`📋 Loaded ${result.data.length} active plans`);
        setPricingPlans(result.data);
      } else {
        console.warn('⚠️ No plans from backend, using fallback');
        // setPricingPlans(FALLBACK_PLANS);
      }
    } catch (error) {
      console.error('❌ Error fetching plans:', error);
      // setPricingPlans(FALLBACK_PLANS);
    } finally {
      setPlansLoading(false);
    }
  };

  // Get current limit (from state)
  const getEnquiryLimit = () => {
    return institutionLimit;
  };

  // ============ ENQUIRY FUNCTIONS ============

  const fetchInstitutionEnquiries = async () => {
    const id = institutionId || localStorage.getItem('institutionId');
    
    if (!id) return;

    setEnquiriesLoading(true);
    try {
      console.log('📡 Fetching institution enquiries from backend:', id);
      const result = await enquiryApi.getPublicInstitutionEnquiries(id);
      
      console.log('📋 Enquiries response:', result);
      
      let enquiriesData = [];
      let visible = [];
      let lockedCount = 0;
      let limitData = institutionLimit;

      if (result && result.success && result.visibleEnquiries) {
        enquiriesData = result.data || result.visibleEnquiries || [];
        visible = result.visibleEnquiries || [];
        lockedCount = result.lockedCount || 0;
        
        if (result.limit) {
          limitData = {
            freeLimit: result.limit.freeLimit || DEFAULT_FREE_LIMIT,
            customLimit: result.limit.customLimit || 0,
            totalLimit: result.limit.totalLimit || DEFAULT_FREE_LIMIT,
            lastUpdatedAt: result.limit.lastUpdatedAt || null
          };
          setInstitutionLimit(limitData);
        }
      } else {
        if (result && result.success && result.data) {
          enquiriesData = Array.isArray(result.data) ? result.data : [];
        } else if (result && result.enquiries) {
          enquiriesData = result.enquiries;
        }
        
        if (!Array.isArray(enquiriesData)) {
          enquiriesData = [];
        }

        const { totalLimit } = limitData;
        visible = enquiriesData.slice(0, totalLimit);
        lockedCount = Math.max(0, enquiriesData.length - totalLimit);
      }

      visible.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      enquiriesData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const locked = enquiriesData.slice(limitData.totalLimit);

      setAllEnquiries(enquiriesData);
      setVisibleEnquiries(visible);
      setLockedEnquiries(locked);
      
      setEnquiryStats({
        total: enquiriesData.length,
        visible: visible.length,
        locked: lockedCount,
        pending: visible.filter(e => e.status === 'pending').length,
        responded: visible.filter(e => e.status === 'responded').length,
        closed: visible.filter(e => e.status === 'closed').length
      });
      
    } catch (error) {
      console.error('❌ Error fetching enquiries:', error);
      toast.error('Failed to load enquiries');
    } finally {
      setEnquiriesLoading(false);
    }
  };

  const handleUpdateStatus = async (enquiryId, newStatus) => {
    try {
      const result = await enquiryApi.updateEnquiryStatus(enquiryId, newStatus);
      
      if (result && result.success) {
        toast.success(`Enquiry ${newStatus}`);
        await fetchInstitutionEnquiries();
      } else {
        toast.error(result.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess('Copied!');
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopySuccess(''), 3000);
    }).catch(() => {
      toast.error('Failed to copy');
    });
  };

  const getFilteredEnquiries = () => {
    let filtered = [...visibleEnquiries];
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(e => e.status === filterStatus);
    }
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(e => 
        e.parentName?.toLowerCase().includes(term) ||
        e.subject?.toLowerCase().includes(term) ||
        e.message?.toLowerCase().includes(term) ||
        e.parentEmail?.toLowerCase().includes(term) ||
        e.parentPhone?.toLowerCase().includes(term)
      );
    }
    
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return filtered;
  };

  // ============ REGISTRATION FUNCTIONS ============

  const checkExistingRegistration = async (email) => {
    if (!email) {
      setRegistrationStatus('not_started');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const result = await registerApi.checkRegistrationByEmail(email);

      if (result && result.success && result.data) {
        const regData = result.data;
        setRegistrationId(regData.id);
        localStorage.setItem('registrationId', regData.id);
        setRegistrationData(regData);
        setRegistrationStatus(regData.status);
        
        if (regData.institutionType) {
          localStorage.setItem('institutionType', regData.institutionType);
          setInstitutionType(regData.institutionType);
        } else if (regData.type) {
          localStorage.setItem('institutionType', regData.type);
          setInstitutionType(regData.type);
        }
        
        if (regData.status === 'approved') {
          let id = regData.schoolId || regData.institutionId || regData.id;
          
          if (id) {
            setInstitutionId(id);
            localStorage.setItem('institutionId', id);
            
            const type = regData.institutionType || regData.type || localStorage.getItem('institutionType');
            if (type) {
              const foundInstitution = await findInstitutionByEmail(email);
              if (foundInstitution) {
                const foundId = foundInstitution.id || foundInstitution._id;
                setInstitutionId(foundId);
                localStorage.setItem('institutionId', foundId);
                localStorage.setItem('institutionType', foundInstitution.institutionType);
                const instType = foundInstitution.institutionType;
                localStorage.setItem(`${instType}Data`, JSON.stringify(foundInstitution));
                setInstitutionType(instType);
              }
            }
            
            await fetchInstitutionLimit();
            await fetchInstitutionEnquiries();
          } else {
            const foundInstitution = await findInstitutionByEmail(email);
            if (foundInstitution) {
              const foundId = foundInstitution.id || foundInstitution._id;
              setInstitutionId(foundId);
              localStorage.setItem('institutionId', foundId);
              localStorage.setItem('institutionType', foundInstitution.institutionType);
              const type = foundInstitution.institutionType;
              localStorage.setItem(`${type}Data`, JSON.stringify(foundInstitution));
              setInstitutionType(type);
              await fetchInstitutionLimit();
              await fetchInstitutionEnquiries();
            }
          }
        }
        
        if (regData.status === 'pending') {
          startStatusPolling(regData.id);
        }
      } else {
        setRegistrationStatus('not_started');
      }
    } catch (error) {
      console.error('❌ Error checking registration:', error);
      
      if (error.message.includes('Session expired')) {
        toast.error('Session expired. Please login again.');
        navigate('/login', { replace: true });
      } else {
        setError(error.message || 'Failed to check registration');
        toast.error('Failed to check registration status');
      }
      setRegistrationStatus('not_started');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRegistrationStatus = async (id) => {
    if (!id) {
      setRegistrationStatus('not_started');
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const result = await registerApi.getRegistrationStatus(id);

      if (result && result.success && result.data) {
        const regData = result.data;
        setRegistrationData(regData);
        setRegistrationStatus(regData.status);
        
        if (regData.institutionType) {
          localStorage.setItem('institutionType', regData.institutionType);
          setInstitutionType(regData.institutionType);
        } else if (regData.type) {
          localStorage.setItem('institutionType', regData.type);
          setInstitutionType(regData.type);
        }
        
        if (regData.status === 'approved') {
          let id = regData.schoolId || regData.institutionId || regData.id;
          
          if (id) {
            setInstitutionId(id);
            localStorage.setItem('institutionId', id);
            
            const type = regData.institutionType || regData.type || localStorage.getItem('institutionType');
            if (type) {
              const email = regData.email || userEmail;
              if (email) {
                const foundInstitution = await findInstitutionByEmail(email);
                if (foundInstitution) {
                  const foundId = foundInstitution.id || foundInstitution._id;
                  setInstitutionId(foundId);
                  localStorage.setItem('institutionId', foundId);
                  localStorage.setItem('institutionType', foundInstitution.institutionType);
                  const instType = foundInstitution.institutionType;
                  localStorage.setItem(`${instType}Data`, JSON.stringify(foundInstitution));
                  setInstitutionType(instType);
                }
              }
            }
            
            await fetchInstitutionLimit();
            await fetchInstitutionEnquiries();
          } else {
            const email = regData.email || userEmail;
            if (email) {
              const foundInstitution = await findInstitutionByEmail(email);
              if (foundInstitution) {
                const foundId = foundInstitution.id || foundInstitution._id;
                setInstitutionId(foundId);
                localStorage.setItem('institutionId', foundId);
                localStorage.setItem('institutionType', foundInstitution.institutionType);
                const type = foundInstitution.institutionType;
                localStorage.setItem(`${type}Data`, JSON.stringify(foundInstitution));
                setInstitutionType(type);
                await fetchInstitutionLimit();
                await fetchInstitutionEnquiries();
              }
            }
          }
        }
        
        if (regData.status === 'pending') {
          startStatusPolling(id);
        }
      } else {
        setRegistrationStatus('not_started');
        localStorage.removeItem('registrationId');
        localStorage.removeItem('institutionId');
      }
    } catch (error) {
      console.error('Error fetching registration:', error);
      
      if (error.message.includes('Session expired')) {
        toast.error('Session expired. Please login again.');
        navigate('/login', { replace: true });
      } else {
        setError('Failed to fetch registration status');
        setRegistrationStatus('not_started');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const startStatusPolling = (id) => {
    if (pollingInterval) clearInterval(pollingInterval);
    
    const interval = setInterval(async () => {
      try {
        const result = await registerApi.getRegistrationStatus(id);
        
        if (result && result.success && result.data) {
          const newStatus = result.data.status;
          if (newStatus !== registrationStatus) {
            setRegistrationStatus(newStatus);
            setRegistrationData(result.data);
            
            if (newStatus === 'approved') {
              if (result.data.schoolId || result.data.institutionId) {
                const id = result.data.schoolId || result.data.institutionId;
                setInstitutionId(id);
                localStorage.setItem('institutionId', id);
                await fetchInstitutionLimit();
                await fetchInstitutionEnquiries();
              } else {
                const email = result.data.email || userEmail;
                if (email) {
                  const foundInstitution = await findInstitutionByEmail(email);
                  if (foundInstitution) {
                    const foundId = foundInstitution.id || foundInstitution._id;
                    setInstitutionId(foundId);
                    localStorage.setItem('institutionId', foundId);
                    localStorage.setItem('institutionType', foundInstitution.institutionType);
                    const type = foundInstitution.institutionType;
                    localStorage.setItem(`${type}Data`, JSON.stringify(foundInstitution));
                    setInstitutionType(type);
                    await fetchInstitutionLimit();
                    await fetchInstitutionEnquiries();
                  }
                }
              }
            }
            
            if (newStatus === 'approved') {
              toast.success('🎉 Your registration has been approved!');
            } else if (newStatus === 'rejected') {
              toast.error('Your registration was rejected. Please check the reason.');
            }
            
            if (newStatus === 'approved' || newStatus === 'rejected') {
              clearInterval(interval);
              setPollingInterval(null);
            }
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
        if (error.message.includes('Session expired')) {
          clearInterval(interval);
          setPollingInterval(null);
          toast.error('Session expired. Please login again.');
          navigate('/login', { replace: true });
        }
      }
    }, 30000);
    
    setPollingInterval(interval);
  };

  // ============ UI HANDLERS ============

  const handleLogout = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
    authApis.adminLogout();
    navigate('/login', { replace: true });
  };

  const handleRegisterForm = () => {
    navigate('/register-form');
  };

  const handleRefreshStatus = async () => {
    if (registrationId) {
      await fetchRegistrationStatus(registrationId);
    } else {
      const email = localStorage.getItem('userEmail');
      if (email) {
        await checkExistingRegistration(email);
      } else {
        toast.warning('No email found. Please login again.');
        navigate('/login', { replace: true });
      }
    }
    
    if (registrationStatus === 'approved') {
      await fetchInstitutionLimit();
      await fetchInstitutionEnquiries();
      await fetchActivePlans();
    }
  };

  const handleViewProfile = () => {
    let type = localStorage.getItem('institutionType');
    
    if (!type) {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      type = userData.institutionType || userData.type;
    }
    
    if (!type && registrationData) {
      type = registrationData.institutionType || registrationData.type;
    }
    
    if (!type) {
      if (localStorage.getItem('collegeData')) type = 'college';
      else if (localStorage.getItem('schoolData')) type = 'school';
      else if (localStorage.getItem('puCollegeData')) type = 'pu_college';
      else if (localStorage.getItem('coachingData')) type = 'coaching';
      else if (localStorage.getItem('teacherData')) type = 'teacher';
    }
    
    const id = institutionId || localStorage.getItem('institutionId');
    
    if (!id) {
      toast.warning('Profile ID not found. Please contact support.');
      return;
    }

    switch(type?.toLowerCase()) {
      case 'college': navigate('/college-profile'); break;
      case 'school': navigate('/school-profile'); break;
      case 'pu_college':
      case 'pucollege': navigate('/pu-college-profile'); break;
      case 'coaching':
      case 'tuition': navigate('/coaching-profile'); break;
      case 'teacher': navigate('/teacher-profile'); break;
      default:
        if (localStorage.getItem('collegeData')) navigate('/college-profile');
        else if (localStorage.getItem('schoolData')) navigate('/school-profile');
        else if (localStorage.getItem('puCollegeData')) navigate('/pu-college-profile');
        else if (localStorage.getItem('coachingData')) navigate('/coaching-profile');
        else if (localStorage.getItem('teacherData')) navigate('/teacher-profile');
        else toast.warning('Profile type not found. Please contact support.');
    }
  };

  const handleBuyPlan = (plan) => {
    const subject = encodeURIComponent(`Enquiry Plan Purchase - ${plan.name} Plan`);
    const body = encodeURIComponent(
      `Hello Raynott Support Team,\n\n` +
      `I would like to purchase the following plan for my institution:\n\n` +
      `Institution: ${institutionName || 'N/A'}\n` +
      `Email: ${userEmail || 'N/A'}\n\n` +
      `Selected Plan: ${plan.name}\n` +
      `Enquiries: ${plan.enquiries}\n` +
      `Price: ₹${plan.price.toLocaleString()}\n\n` +
      `Please guide me through the payment process.\n\n` +
      `Thank you.`
    );
    window.location.href = `mailto:raynottbangalore@gmail.com?subject=${subject}&body=${body}`;
    toast.success('Opening email client...');
  };

  const getStatusConfig = (status) => {
    const configs = {
      'not_started': {
        icon: FiClipboard, color: 'text-gray-400', bgColor: 'bg-gray-500/10',
        borderColor: 'border-gray-500/20', title: 'Complete Your Registration',
        message: 'Start your institution registration process to access all features.',
        buttonText: 'Start Registration', buttonAction: handleRegisterForm,
        showButton: true, details: 'Click the button below to begin the registration process.'
      },
      'pending': {
        icon: FiLoader, color: 'text-yellow-400', bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/20', title: 'Registration Under Review',
        message: 'Your registration has been submitted and is currently being reviewed by our admin team.',
        buttonText: 'Refresh Status', buttonAction: handleRefreshStatus,
        showButton: true, details: 'Please wait for admin approval. This process usually takes 24-48 hours.'
      },
      'approved': {
        icon: FiCheckCircle, color: 'text-green-400', bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/20', title: 'Registration Approved! 🎉',
        message: 'Congratulations! Your institution has been verified and approved. You now have full access to all features.',
        buttonText: 'View Full Profile', buttonAction: handleViewProfile,
        showButton: true, details: 'Your institution is now active.'
      },
      'rejected': {
        icon: FiXCircle, color: 'text-red-400', bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/20', title: 'Registration Rejected',
        message: 'Your registration was not approved. Please review the reason and contact support.',
        buttonText: 'Contact Support', buttonAction: () => window.location.href = 'mailto:raynottbangalore@gmail.com',
        showButton: true, details: 'Our team will help you resolve any issues with your registration.'
      }
    };
    return configs[status] || configs['not_started'];
  };

  // ============ RENDER INFO BANNER ============
  const renderInfoBanner = () => {
    if (registrationStatus !== 'approved') return null;

    const { freeLimit, customLimit, totalLimit } = institutionLimit;

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-orange-500/10 rounded-2xl border border-blue-500/20 mb-6 overflow-hidden mt-4 shadow-2xl backdrop-blur-sm"
      >
        {/* Decorative top accent bar */}
        <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500" />

        {/* Background glow decorations */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">

            {/* LEFT: INFO */}
            <div className="flex items-start gap-4 flex-1">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl blur-md opacity-50" />
                <div className="relative p-3.5 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-lg">
                  <FiPackage className="w-7 h-7 text-white" />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <h3 className="text-white font-bold text-xl tracking-tight">
                    Unlock More Enquiries
                  </h3>
                  <span className="px-2.5 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg">
                    Premium
                  </span>
                </div>

                <p className="text-gray-300 text-sm mb-3">
                  You're on the <span className="text-white font-semibold">Free Tier</span> with{' '}
                  <span className="text-orange-400 font-bold">{freeLimit} enquiries</span>
                  {customLimit > 0 && (
                    <> + <span className="text-green-400 font-bold">{customLimit} unlocked</span></>
                  )}
                  {' '}= <span className="text-white font-bold">{totalLimit} total visible</span>
                </p>

              </div>
            </div>

            {/* RIGHT: CTA */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => {
                  const newState = !showPlansExpanded;
                  setShowPlansExpanded(newState);
                  if (newState) fetchActivePlans();
                }}
                className="group relative px-6 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all text-sm font-bold flex items-center gap-2 shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 whitespace-nowrap"
              >
                <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <FiPackage className="w-4 h-4 relative" />
                <span className="relative">{showPlansExpanded ? 'Hide Plans' : 'View Plans'}</span>
                {showPlansExpanded ?
                  <FiChevronUp className="w-4 h-4 relative" /> :
                  <FiChevronDown className="w-4 h-4 relative" />
                }
              </button>
            </div>
          </div>
        </div>

        {/* EXPANDED PLANS */}
        {showPlansExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-blue-500/20 bg-gray-900/40"
          >
            <div className="p-6 lg:p-8">

              {/* ============ HOW IT WORKS SECTION ============ */}
              <div className="mb-8">
                <div className="text-center mb-5">
                  <h4 className="text-xl font-bold text-white mb-1">How to Purchase a Plan</h4>
                  <p className="text-sm text-gray-400">Simple 3-step process — we'll guide you through it</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Step 1 */}
                  <div className="relative bg-gray-800/60 backdrop-blur-sm rounded-xl p-5 border border-orange-500/20 hover:border-orange-500/40 shadow-lg transition-all">
                    <div className="absolute -top-3 -left-3 w-9 h-9 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-orange-500/40">
                      1
                    </div>
                    <div className="flex items-start gap-3 mt-1">
                      <div className="p-2.5 bg-orange-500/20 rounded-lg flex-shrink-0">
                        <FiPackage className="w-5 h-5 text-orange-400" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm mb-1">Choose Your Plan</p>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          Pick the plan that fits your enquiry volume
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative bg-gray-800/60 backdrop-blur-sm rounded-xl p-5 border border-blue-500/20 hover:border-blue-500/40 shadow-lg transition-all">
                    <div className="absolute -top-3 -left-3 w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/40">
                      2
                    </div>
                    <div className="flex items-start gap-3 mt-1">
                      <div className="p-2.5 bg-blue-500/20 rounded-lg flex-shrink-0">
                        <FiMail className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm mb-1">Click "Buy Plan"</p>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          An email will open pre-filled with your plan details
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative bg-gray-800/60 backdrop-blur-sm rounded-xl p-5 border border-green-500/20 hover:border-green-500/40 shadow-lg transition-all">
                    <div className="absolute -top-3 -left-3 w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-green-500/40">
                      3
                    </div>
                    <div className="flex items-start gap-3 mt-1">
                      <div className="p-2.5 bg-green-500/20 rounded-lg flex-shrink-0">
                        <FiCreditCard className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm mb-1">Get Payment Details</p>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          Our team will share payment info & activate your plan
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrow flow indicator */}
                <div className="hidden md:flex items-center justify-center gap-2 mt-5 text-xs text-gray-500">
                  <span className="px-2 py-1 bg-gray-800/50 rounded-md">Select Plan</span>
                  <FiArrowRight className="w-3 h-3 text-orange-400" />
                  <span className="px-2 py-1 bg-gray-800/50 rounded-md">Send Email</span>
                  <FiArrowRight className="w-3 h-3 text-blue-400" />
                  <span className="px-2 py-1 bg-gray-800/50 rounded-md">Receive Payment Info</span>
                  <FiArrowRight className="w-3 h-3 text-green-400" />
                  <span className="px-2 py-1 bg-gray-800/50 rounded-md">Get Access</span>
                </div>
              </div>

              {/* ============ PLANS GRID ============ */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
                {plansLoading ? (
                  <div className="col-span-full text-center py-12">
                    <FiLoader className="w-10 h-10 text-orange-400 animate-spin mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">Loading premium plans...</p>
                  </div>
                ) : pricingPlans.length === 0 ? (
                  <div className="col-span-full text-center py-12 bg-gray-800/40 rounded-2xl border border-gray-700/50">
                    <FiPackage className="w-14 h-14 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No plans available right now</p>
                    <p className="text-xs text-gray-500 mt-1">Please contact support for details</p>
                  </div>
                ) : (
                  pricingPlans.map((plan, index) => {
                    const discount = plan.originalPrice > plan.price
                      ? Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)
                      : 0;
                    const pricePerEnquiry = plan.enquiries > 0
                      ? Math.round(plan.price / plan.enquiries)
                      : 0;
                    const savings = plan.originalPrice > plan.price
                      ? plan.originalPrice - plan.price
                      : 0;

                    return (
                      <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -6, scale: 1.02 }}
                        className={`group relative rounded-2xl p-6 transition-all duration-300 ${
                          plan.popular
                            ? 'bg-gradient-to-br from-purple-600/20 via-pink-600/10 to-purple-600/20 border-2 border-purple-500/50 shadow-2xl shadow-purple-500/30 lg:scale-105'
                            : 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50 hover:border-orange-500/50 shadow-xl hover:shadow-orange-500/20'
                        }`}
                      >
                        {/* Shine effect on hover */}
                        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                          <div className="absolute -top-1/2 -left-1/2 w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-45 opacity-0 group-hover:opacity-100 group-hover:translate-x-[400%] group-hover:translate-y-[400%] transition-all duration-1000" />
                        </div>

                        {/* POPULAR RIBBON */}
                        {plan.popular && (
                          <>
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                              <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 blur-md opacity-70 rounded-full" />
                                <span className="relative px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-extrabold rounded-full shadow-lg flex items-center gap-1.5 whitespace-nowrap tracking-wider">
                                  <FiStar className="w-3 h-3 fill-white" />
                                  {plan.badge || 'MOST POPULAR'}
                                </span>
                              </div>
                            </div>
                            <div className="absolute inset-0 rounded-2xl border-2 border-purple-500/30 animate-pulse pointer-events-none" />
                          </>
                        )}

                        {/* Non-popular badge */}
                        {!plan.popular && plan.badge && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                            <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-extrabold rounded-full shadow-lg whitespace-nowrap tracking-wider">
                              {plan.badge}
                            </span>
                          </div>
                        )}

                        {/* DISCOUNT BADGE */}
                        {discount > 0 && (
                          <div className="absolute top-4 right-4 z-10">
                            <div className="relative">
                              <div className="absolute inset-0 bg-red-500 blur-md opacity-50 rounded-full" />
                              <span className="relative px-2.5 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-[11px] font-extrabold rounded-full shadow-lg">
                                -{discount}%
                              </span>
                            </div>
                          </div>
                        )}

                        {/* PLAN HEADER */}
                        <div className="relative mb-5 mt-2">
                          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 shadow-lg ${
                            plan.popular
                              ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-500/40'
                              : 'bg-gradient-to-br from-orange-500 to-amber-500 shadow-orange-500/40'
                          }`}>
                            <FiPackage className="w-6 h-6 text-white" />
                          </div>

                          <h5 className="text-2xl font-extrabold text-white tracking-tight">
                            {plan.name}
                          </h5>

                          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                            <FiZap className="w-3 h-3 text-yellow-400" />
                            Best for growing institutions
                          </p>
                        </div>

                        {/* PRICE */}
                        <div className="relative mb-5 pb-5 border-b border-gray-700/50">
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-4xl font-black text-white tracking-tight">
                              ₹{plan.price.toLocaleString()}
                            </span>
                            {plan.originalPrice > plan.price && (
                              <span className="text-sm text-gray-500 line-through">
                                ₹{plan.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>

                          {savings > 0 && (
                            <p className="text-xs text-green-400 font-semibold mt-1">
                              You save ₹{savings.toLocaleString()}
                            </p>
                          )}

                          <p className="text-[11px] text-gray-400 mt-1.5">
                            Just <span className="text-orange-400 font-bold">₹{pricePerEnquiry}</span> per enquiry
                          </p>
                        </div>

                        {/* ENQUIRIES HIGHLIGHT */}
                        <div className={`mb-5 p-3 rounded-xl flex items-center gap-3 ${
                          plan.popular
                            ? 'bg-purple-500/10 border border-purple-500/30'
                            : 'bg-orange-500/10 border border-orange-500/30'
                        }`}>
                          <div className={`p-2 rounded-lg ${
                            plan.popular ? 'bg-purple-500/20' : 'bg-orange-500/20'
                          }`}>
                            <FiPackage className={`w-4 h-4 ${
                              plan.popular ? 'text-purple-400' : 'text-orange-400'
                            }`} />
                          </div>
                          <div>
                            <p className="text-xl font-extrabold text-white leading-none">
                              {plan.enquiries}
                            </p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">
                              Enquiries unlocked
                            </p>
                          </div>
                        </div>

                        {/* FEATURES */}
                        <ul className="space-y-2.5 mb-6">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-sm">
                              <div className={`p-0.5 rounded-full flex-shrink-0 mt-0.5 ${
                                plan.popular ? 'bg-purple-500/20' : 'bg-green-500/20'
                              }`}>
                                <FiCheck className={`w-3 h-3 ${
                                  plan.popular ? 'text-purple-400' : 'text-green-400'
                                }`} />
                              </div>
                              <span className="text-gray-300 leading-tight">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        {/* CTA BUTTON */}
                        <button
                          onClick={() => handleBuyPlan(plan)}
                          className={`group/btn relative w-full px-4 py-3.5 rounded-xl font-bold text-sm transition-all overflow-hidden ${
                            plan.popular
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl shadow-purple-500/40 hover:shadow-purple-500/60'
                              : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xl shadow-orange-500/40 hover:shadow-orange-500/60'
                          } hover:scale-[1.02]`}
                        >
                          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                          <div className="relative flex items-center justify-center gap-2">
                            <FiMail className="w-4 h-4" />
                            Buy Plan
                            <FiArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </div>
                        </button>

                        {/* Flow hint */}
                        <p className="text-center text-[10px] text-gray-500 mt-3 flex items-center justify-center gap-1">
                          <FiInfo className="w-2.5 h-2.5" />
                          Email opens → We'll send payment details
                        </p>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* ============ SUPPORT & INFO FOOTER ============ */}
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* Support card */}
                <div className="p-5 bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/20 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex-shrink-0 shadow-lg shadow-blue-500/30">
                      <FiMail className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-bold mb-1">Have questions before buying?</p>
                      <p className="text-xs text-gray-400 mb-3">
                        Our team can help you choose the right plan for your institution's needs
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <a
                          href="mailto:raynottbangalore@gmail.com?subject=Plan%20Consultation"
                          className="px-3 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all text-xs font-medium flex items-center gap-2 border border-blue-500/30"
                        >
                          <FiMail className="w-3.5 h-3.5" />
                          Email Team
                        </a>
                        <a
                          href="tel:8618591978"
                          className="px-3 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-all text-xs font-medium flex items-center gap-2 border border-green-500/30"
                        >
                          <FiPhone className="w-3.5 h-3.5" />
                          Call Now
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guarantee card */}
                <div className="p-5 bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex-shrink-0 shadow-lg shadow-green-500/30">
                      <FiCheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-bold mb-1">Activation within 24 hours</p>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Once payment is confirmed, your enquiry limit will be increased and instantly visible on your dashboard.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  };

  // ============ RENDER ENQUIRY DETAIL MODAL ============
  const renderEnquiryDetailModal = () => {
    if (!showEnquiryDetail || !selectedEnquiry) return null;

    const enquiry = selectedEnquiry;

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowEnquiryDetail(false)}>
        <div className="bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 border border-gray-700" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-white">{enquiry.subject}</h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  enquiry.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  enquiry.status === 'responded' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(enquiry.createdAt).toLocaleString()}
                </span>
                {enquiry.preferredContact && (
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs flex items-center gap-1">
                    <FiAtSign className="w-3 h-3" />
                    Prefers: {enquiry.preferredContact}
                  </span>
                )}
              </div>
            </div>
            <button onClick={() => setShowEnquiryDetail(false)} className="text-gray-400 hover:text-white">
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-700/30 rounded-lg p-4">
              <h4 className="text-sm text-gray-400 mb-2">Parent Information</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="text-white font-medium">{enquiry.parentName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <div className="flex items-center gap-2">
                    <a href={`mailto:${enquiry.parentEmail}?subject=Re: ${enquiry.subject}`} className="text-blue-400 hover:underline text-sm truncate" target="_blank" rel="noopener noreferrer">
                      {enquiry.parentEmail}
                    </a>
                    <button onClick={() => { navigator.clipboard.writeText(enquiry.parentEmail); toast.success('Email copied!'); }} className="text-gray-400 hover:text-white text-xs">
                      <FiCopy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                {enquiry.parentPhone && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">Phone</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <a href={`tel:${enquiry.parentPhone}`} className="text-green-400 hover:underline">
                        {enquiry.parentPhone}
                      </a>
                      <button onClick={() => copyToClipboard(enquiry.parentPhone)} className="text-gray-400 hover:text-white text-xs">
                        <FiCopy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {enquiry.studentName && (
              <div className="bg-gray-700/30 rounded-lg p-4">
                <h4 className="text-sm text-gray-400 mb-2">Student Information</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="text-white">{enquiry.studentName}</p>
                  </div>
                  {enquiry.studentClass && (
                    <div>
                      <p className="text-xs text-gray-500">Class</p>
                      <p className="text-white">{enquiry.studentClass}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-gray-700/30 rounded-lg p-4">
              <h4 className="text-sm text-gray-400 mb-2">Message</h4>
              <p className="text-white whitespace-pre-wrap leading-relaxed">{enquiry.message}</p>
            </div>

            {enquiry.responses && enquiry.responses.length > 0 && (
              <div className="bg-gray-700/30 rounded-lg p-4">
                <h4 className="text-sm text-gray-400 mb-2">Responses</h4>
                {enquiry.responses.map((response, idx) => (
                  <div key={idx} className="bg-gray-700/20 rounded-lg p-3 mb-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-300 font-medium">{response.responseBy}</span>
                      <span className="text-gray-500">{new Date(response.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-gray-300 text-sm mt-1">{response.message}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-700">
              <select
                value={enquiry.status}
                onChange={(e) => {
                  handleUpdateStatus(enquiry.id || enquiry.enquiryId, e.target.value);
                  setShowEnquiryDetail(false);
                }}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg border border-gray-600 focus:outline-none focus:border-orange-500"
              >
                <option value="pending">Pending</option>
                <option value="responded">Responded</option>
                <option value="closed">Closed</option>
              </select>
              
              {enquiry.parentEmail && (
                <a href={`mailto:${enquiry.parentEmail}?subject=Re: ${enquiry.subject}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all flex items-center gap-2">
                  <FiMail className="w-4 h-4" />
                  Email Parent
                </a>
              )}

              {enquiry.parentPhone && (
                <a href={`tel:${enquiry.parentPhone}`} className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all flex items-center gap-2">
                  <FiPhone className="w-4 h-4" />
                  Call Parent
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============ RENDER ENQUIRIES SECTION ============
  const renderEnquiriesSection = () => {
    if (registrationStatus !== 'approved') return null;

    const filteredEnquiries = getFilteredEnquiries();
    const pendingCount = visibleEnquiries.filter(e => e.status === 'pending').length;
    const hasLocked = lockedEnquiries.length > 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 mt-6"
        id="enquiries-section"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <FiInbox className="text-orange-400" />
              Enquiries
            </h2>
            <p className="text-gray-400 text-sm">
              {pendingCount > 0 ? (
                <span className="text-yellow-400">{pendingCount} pending enquiries need your response</span>
              ) : (
                'Manage enquiries from parents'
              )}
            </p>
          </div>
          <button
            onClick={async () => {
              await fetchInstitutionLimit();
              await fetchInstitutionEnquiries();
            }}
            className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-all flex items-center gap-2"
          >
            <FiRefreshCw className={`w-4 h-4 ${enquiriesLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {hasLocked && (
          <div className="mb-6 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <div className="flex items-center gap-3 flex-wrap">
              <FiLock className="w-4 h-4 text-orange-400 flex-shrink-0" />
              <p className="text-sm text-orange-300 flex-1">
                <strong>{lockedEnquiries.length} enquiries</strong> are not visible with your current plan.
                Scroll to the top to see upgrade plans.
              </p>
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setTimeout(() => setShowPlansExpanded(true), 500);
                }}
                className="px-3 py-1.5 bg-orange-500/20 text-orange-300 rounded-lg hover:bg-orange-500/30 transition-all text-xs font-medium flex items-center gap-1"
              >
                <FiPackage className="w-3 h-3" />
                View Plans
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div 
            className={`bg-gray-700/30 rounded-lg p-4 text-center cursor-pointer transition-all hover:bg-gray-700/50 ${
              filterStatus === 'all' ? 'ring-2 ring-orange-500' : ''
            }`} 
            onClick={() => setFilterStatus('all')}
          >
            <div className="text-3xl font-bold text-white">{enquiryStats.visible}</div>
            <div className="text-sm text-gray-400">Visible</div>
          </div>
          <div 
            className={`bg-yellow-500/10 rounded-lg p-4 text-center border border-yellow-500/20 cursor-pointer transition-all hover:bg-yellow-500/20 ${
              filterStatus === 'pending' ? 'ring-2 ring-yellow-500' : ''
            }`} 
            onClick={() => setFilterStatus('pending')}
          >
            <div className="text-3xl font-bold text-yellow-400">{enquiryStats.pending}</div>
            <div className="text-sm text-yellow-400">Pending</div>
          </div>
          <div 
            className={`bg-blue-500/10 rounded-lg p-4 text-center border border-blue-500/20 cursor-pointer transition-all hover:bg-blue-500/20 ${
              filterStatus === 'responded' ? 'ring-2 ring-blue-500' : ''
            }`} 
            onClick={() => setFilterStatus('responded')}
          >
            <div className="text-3xl font-bold text-blue-400">{enquiryStats.responded}</div>
            <div className="text-sm text-blue-400">Responded</div>
          </div>
          <div 
            className={`bg-green-500/10 rounded-lg p-4 text-center border border-green-500/20 cursor-pointer transition-all hover:bg-green-500/20 ${
              filterStatus === 'closed' ? 'ring-2 ring-green-500' : ''
            }`} 
            onClick={() => setFilterStatus('closed')}
          >
            <div className="text-3xl font-bold text-green-400">{enquiryStats.closed}</div>
            <div className="text-sm text-green-400">Closed</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by parent name, email, phone, subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-orange-500 placeholder-gray-400"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {enquiriesLoading ? (
          <div className="text-center py-8">
            <FiLoader className="w-8 h-8 text-orange-400 animate-spin mx-auto mb-2" />
            <p className="text-gray-400">Loading enquiries...</p>
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="text-center py-12 bg-gray-700/20 rounded-lg">
            {searchTerm || filterStatus !== 'all' ? (
              <>
                <FiSearch className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-400">No enquiries match your filters</p>
                <button onClick={() => { setSearchTerm(''); setFilterStatus('all'); }} className="mt-2 text-orange-400 text-sm hover:underline">
                  Clear filters
                </button>
              </>
            ) : (
              <>
                <FiInbox className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-400">No enquiries yet</p>
                <p className="text-sm text-gray-500">Parents will contact you here</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEnquiries.map((enquiry) => {
              const StatusIcon = enquiry.status === 'pending' ? FiClock : 
                                enquiry.status === 'responded' ? FiCheckCircle : FiXCircle;
              const statusColor = enquiry.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                  enquiry.status === 'responded' ? 'bg-blue-500/20 text-blue-400' :
                                  'bg-green-500/20 text-green-400';

              return (
                <div
                  key={enquiry.id || enquiry.enquiryId}
                  className={`bg-gray-700/30 rounded-lg p-4 border ${
                    enquiry.status === 'pending' ? 'border-yellow-500/30 hover:border-yellow-500/50' :
                    enquiry.status === 'responded' ? 'border-blue-500/30 hover:border-blue-500/50' :
                    'border-green-500/30 hover:border-green-500/50'
                  } transition-all`}
                >
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor} flex items-center gap-1`}>
                          <StatusIcon className="w-3 h-3" />
                          {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                        </span>
                        {enquiry.status === 'pending' && (
                          <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full animate-pulse">
                            Needs Response
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          {new Date(enquiry.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="text-white font-medium truncate">{enquiry.subject}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mt-1">
                        <span className="flex items-center gap-1">
                          <FiUser className="w-3 h-3 text-purple-400" />
                          {enquiry.parentName}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiMail className="w-3 h-3 text-blue-400" />
                          <a href={`mailto:${enquiry.parentEmail}`} className="hover:text-blue-400 transition-colors truncate max-w-[150px]">
                            {enquiry.parentEmail}
                          </a>
                        </span>
                        {enquiry.parentPhone && (
                          <span className="flex items-center gap-1">
                            <FiPhone className="w-3 h-3 text-green-400" />
                            <a href={`tel:${enquiry.parentPhone}`} className="hover:text-green-400 transition-colors">
                              {enquiry.parentPhone}
                            </a>
                          </span>
                        )}
                        {enquiry.studentClass && (
                          <span className="flex items-center gap-1">
                            <FiBookOpen className="w-3 h-3 text-orange-400" />
                            Class {enquiry.studentClass}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => { setSelectedEnquiry(enquiry); setShowEnquiryDetail(true); }}
                        className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all text-sm flex items-center gap-1"
                      >
                        <FiEye className="w-3 h-3" />
                        View
                      </button>
                      
                      {enquiry.parentEmail && (
                        <a
                          href={`mailto:${enquiry.parentEmail}?subject=Re: ${enquiry.subject}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all text-sm flex items-center gap-1"
                        >
                          <FiMail className="w-3 h-3" />
                          Email
                        </a>
                      )}

                      {enquiry.parentPhone && (
                        <a
                          href={`tel:${enquiry.parentPhone}`}
                          className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all text-sm flex items-center gap-1"
                        >
                          <FiPhone className="w-3 h-3" />
                          Call
                        </a>
                      )}

                      <select
                        value={enquiry.status}
                        onChange={(e) => handleUpdateStatus(enquiry.id || enquiry.enquiryId, e.target.value)}
                        className="px-2 py-1.5 bg-gray-900 text-gray-300 rounded-lg border border-gray-600 text-sm focus:outline-none focus:border-orange-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="responded">Responded</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>

                  {enquiry.responses && enquiry.responses.length > 0 && (
                    <div className="mt-3 border-t border-gray-600 pt-3">
                      <p className="text-xs text-gray-400 mb-2">Responses:</p>
                      {enquiry.responses.map((response, idx) => (
                        <div key={idx} className="bg-gray-700/20 rounded-lg p-2 mb-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-300 font-medium">{response.responseBy}</span>
                            <span className="text-gray-500">{new Date(response.createdAt).toLocaleString()}</span>
                          </div>
                          <p className="text-gray-300 text-sm mt-1">{response.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    );
  };

  // ============ RENDER REGISTRATION STATUS CARD ============
  const renderRegistrationStatusCard = () => {
    if (isLoading) {
      return (
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 border border-gray-700/50 text-center">
          <FiLoader className="w-12 h-12 text-orange-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Loading registration status...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-500/10 backdrop-blur-lg rounded-xl p-8 border border-red-500/20 text-center">
          <FiAlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-300">{error}</p>
          <button onClick={handleRefreshStatus} className="mt-4 px-6 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all">
            Try Again
          </button>
        </div>
      );
    }

    const config = getStatusConfig(registrationStatus);
    const StatusIcon = config.icon;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 border ${config.borderColor}`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className={`p-4 rounded-full ${config.bgColor}`}>
            <StatusIcon className={`w-12 h-12 ${config.color}`} />
          </div>
          <div className="flex-1">
            <h3 className={`text-2xl font-bold ${config.color} mb-2`}>{config.title}</h3>
            <p className="text-gray-300 text-lg mb-2">{config.message}</p>
            <p className="text-gray-400 text-sm">{config.details}</p>
            {registrationStatus === 'pending' && registrationData?.submittedAt && (
              <div className="mt-3 flex items-center gap-2">
                <FiClock className="text-yellow-400 w-4 h-4" />
                <span className="text-yellow-400 text-sm">
                  Submitted: {new Date(registrationData.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>
            )}
            {registrationStatus === 'approved' && registrationData?.approvedAt && (
              <div className="mt-3 flex items-center gap-2">
                <FiCheck className="text-green-400 w-4 h-4" />
                <span className="text-green-400 text-sm">
                  Approved: {new Date(registrationData.approvedAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>
            )}
            {registrationStatus === 'rejected' && registrationData?.rejectionReason && (
              <div className="mt-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <p className="text-red-400 text-sm">
                  <strong>Reason:</strong> {registrationData.rejectionReason}
                </p>
              </div>
            )}
            {config.showButton && (
              <motion.button
                onClick={config.buttonAction}
                className="mt-4 px-6 py-3 rounded-lg bg-gradient-to-r from-orange-600 to-amber-500 text-white font-semibold hover:from-orange-500 hover:to-amber-400 transition-all flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {config.buttonText}
                <FiArrowRight className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // ============ RENDER REGISTRATION DETAILS ============
  const renderRegistrationDetails = () => {
    if (!registrationData || registrationStatus === 'not_started' || registrationStatus === 'pending') return null;

    const details = [
      { icon: FiFileText, label: 'Institution Name', value: registrationData.institutionName || institutionName },
      { icon: FiBriefcase, label: 'Institution Type', value: registrationData.institutionType || institutionType },
      { icon: FiPhone, label: 'Contact Number', value: registrationData.phone || 'Not provided' },
      { icon: FiMail, label: 'Email', value: registrationData.email || userEmail },
      { icon: FiMapPin, label: 'Address', value: registrationData.address || 'Not provided' },
      { icon: FiAward, label: 'Affiliations', value: registrationData.affiliations || 'Not specified' },
      { icon: FiFlag, label: 'Established Year', value: registrationData.establishedYear || 'Not specified' },
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 mt-6"
      >
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <FiInfo className="text-orange-400" />
          Registration Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {details.map((detail, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-700/30 rounded-lg">
              <detail.icon className="w-5 h-5 text-orange-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-400">{detail.label}</p>
                <p className="text-white font-medium">{detail.value}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  // ============ RENDER WELCOME MESSAGE ============
  const renderWelcomeMessage = () => {
    if (registrationStatus === 'approved') {
      return (
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
          <p className="text-green-400 flex items-center gap-2">
            <FiCheckCircle className="w-5 h-5" />
            Your institution has been approved! You can now access all features.
          </p>
        </div>
      );
    }
    if (registrationStatus === 'pending') {
      return (
        <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
          <p className="text-yellow-400 flex items-center gap-2">
            <FiClock className="w-5 h-5" />
            Your registration is being reviewed. You will be notified once approved.
          </p>
        </div>
      );
    }
    return null;
  };

  // ============ INITIALIZATION ============
  useEffect(() => {
    const token = authApis.getAdminToken();
    
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    const name = localStorage.getItem('institutionName');
    const type = localStorage.getItem('institutionType');
    const email = localStorage.getItem('userEmail');
    const role = localStorage.getItem('userRole');
    
    const registrationKey = email ? `registrationId_${email}` : 'registrationId';
    const regId = localStorage.getItem(registrationKey);

    if (role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
      return;
    }

    if (name) setInstitutionName(name);
    if (type) setInstitutionType(type);
    if (email) {
      setUserEmail(email);
      if (regId) {
        setRegistrationId(regId);
        fetchRegistrationStatus(regId);
      } else {
        checkExistingRegistration(email);
      }
    } else {
      setRegistrationStatus('not_started');
      setIsLoading(false);
    }

    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, [navigate]);

  // ✅ NEW: Fetch plans when registration is approved
  useEffect(() => {
    if (registrationStatus === 'approved') {
      fetchActivePlans();
    }
  }, [registrationStatus]);

  // ============ MAIN RENDER ============
  return (
    <div className="min-h-screen bg-gray-900">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-lg text-white"
      >
        {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      <motion.div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 border-r border-gray-700 z-40 transform transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {institutionName ? institutionName.charAt(0).toUpperCase() : 'I'}
              </span>
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm truncate">{institutionName || 'Institution'}</h3>
              <p className="text-gray-400 text-xs">{institutionType || 'Type'}</p>
            </div>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center gap-3 px-4 py-3 text-white bg-gray-700/50 rounded-lg transition-all"
            >
              <FiHome className="w-5 h-5" />
              <span className="flex-1 text-left">Dashboard</span>
            </button>
            {(registrationStatus === 'not_started' || registrationStatus === 'rejected') && (
              <button
                onClick={handleRegisterForm}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all"
              >
                <FiPlus className="w-5 h-5" />
                <span className="flex-1 text-left">New Registration</span>
              </button>
            )}
            {registrationStatus === 'approved' && (
              <>
                <button
                  onClick={handleViewProfile}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all"
                >
                  <FiUsers className="w-5 h-5" />
                  <span className="flex-1 text-left">View Profile</span>
                </button>
                <button
                  onClick={() => document.getElementById('enquiries-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all"
                >
                  <FiMessageSquare className="w-5 h-5" />
                  <span className="flex-1 text-left">Enquiries</span>
                  {enquiryStats.pending > 0 && (
                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                      {enquiryStats.pending}
                    </span>
                  )}
                  {lockedEnquiries.length > 0 && (
                    <span className="px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full flex items-center gap-1">
                      <FiLock className="w-2.5 h-2.5" />
                      {lockedEnquiries.length}
                    </span>
                  )}
                </button>
              </>
            )}
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
            >
              <FiLogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </motion.div>

      <div className={`lg:ml-64 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : ''}`}>
        <div className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Institute Dashboard</h1>
              <p className="text-gray-400 text-sm">
                Welcome back, <span className="text-white font-medium">{institutionName || 'User'}</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleRefreshStatus}
                className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-all flex items-center gap-2"
              >
                <FiRefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <div className="flex items-center gap-2 text-gray-300 bg-gray-700/30 px-4 py-2 rounded-lg">
                <FiUser className="w-4 h-4" />
                <span className="text-sm hidden md:block">{userEmail}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 max-w-6xl mx-auto">
          {renderWelcomeMessage()}
          {renderRegistrationStatusCard()}
          {registrationStatus === 'approved' && renderInfoBanner()}
          {registrationStatus === 'approved' && renderRegistrationDetails()}
          {registrationStatus === 'approved' && renderEnquiriesSection()}
        </div>
      </div>

      {renderEnquiryDetailModal()}
    </div>
  );
};

export default Dashboard;