// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser, FiHome, FiPlus, FiUsers, FiCalendar, FiClock, FiBarChart2, FiMenu, FiX, FiCheckCircle, FiXCircle, FiAlertCircle, FiLoader,FiFileText, FiMail, FiPhone, FiMapPin, FiBookOpen,FiAward, FiBriefcase, FiFlag, FiCheck, FiClipboard,FiInfo, FiDownload, FiArrowRight, FiRefreshCw} from 'react-icons/fi';
import { authApis } from '../services/allApis';
import registerApi from '../services/RegisterApi';
import { schoolApi } from '../services/schoolApi';
import { collegeApi } from '../services/collegeApi';
import { puCollegeApi } from '../services/pucollegeApi';
import { TuitionCoachingApi } from '../services/TuitionCoachingApi';
import { teacherApi } from '../services/TeacherApi';
import { toast } from 'react-toastify';

const Dashboard = () => {
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
  const navigate = useNavigate();

  // Function to find institution by email across all types
  const findInstitutionByEmail = async (email) => {
    try {
      console.log('🔍 Looking for institution with email:', email);
      
      const apis = [
        { type: 'school', api: schoolApi, method: 'getSchools' },
        { type: 'college', api: collegeApi, method: 'getColleges' },
        { type: 'pu_college', api: puCollegeApi, method: 'getPUColleges' },
        { type: 'coaching', api: TuitionCoachingApi, method: 'getTuitionCoachings' },
        { type: 'teacher', api: teacherApi, method: 'getTeachers' }
      ];

      for (const item of apis) {
        try {
          console.log(`📡 Checking ${item.type}...`);
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
            
            const found = institutions.find(item => 
              item.email === email || 
              item.email?.toLowerCase() === email?.toLowerCase()
            );
            
            if (found) {
              console.log(`✅ Found institution in ${item.type}:`, found);
              return { ...found, institutionType: item.type };
            }
          }
        } catch (e) {
          console.log(`⚠️ Error fetching ${item.type}:`, e.message);
        }
      }
      
      console.log('❌ No institution found with email:', email);
      return null;
    } catch (error) {
      console.error('Error finding institution by email:', error);
      return null;
    }
  };

  useEffect(() => {
    const token = authApis.getAdminToken();
    console.log('🔍 Dashboard - Token:', token ? 'Present' : 'Missing');
    
    if (!token) {
      console.log('🔍 No token found, redirecting to login');
      navigate('/login', { replace: true });
      return;
    }

    // Get user data from localStorage
    const name = localStorage.getItem('institutionName');
    const type = localStorage.getItem('institutionType');
    const email = localStorage.getItem('userEmail');
    const role = localStorage.getItem('userRole');
    
    // Use email-specific keys for registration data
    const registrationKey = email ? `registrationId_${email}` : 'registrationId';
    const institutionKey = email ? `institutionId_${email}` : 'institutionId';
    
    const regId = localStorage.getItem(registrationKey);
    const storedInstitutionId = localStorage.getItem(institutionKey);

    console.log('📋 Dashboard - User Data:', { 
      name, type, email, role, regId, storedInstitutionId 
    });

    // If user is admin, redirect to admin dashboard
    if (role === 'admin') {
      console.log('🔍 User is admin, redirecting to /admin/dashboard');
      navigate('/admin/dashboard', { replace: true });
      return;
    }

    if (name) setInstitutionName(name);
    if (type) {
      setInstitutionType(type);
    }
    if (email) {
      setUserEmail(email);
      // Check if there's registration data for this specific user
      if (regId) {
        setRegistrationId(regId);
        fetchRegistrationStatus(regId);
      } else if (email) {
        checkExistingRegistration(email);
      } else {
        setRegistrationStatus('not_started');
        setIsLoading(false);
      }
    } else {
      setRegistrationStatus('not_started');
      setIsLoading(false);
    }

    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [navigate]);

  // Check existing registration using registerApi
  const checkExistingRegistration = async (email) => {
    if (!email) {
      console.log('⚠️ No email provided for registration check');
      setRegistrationStatus('not_started');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      console.log('📡 Checking registration for email:', email);
      
      const result = await registerApi.checkRegistrationByEmail(email);
      
      console.log('📡 Registration check result:', result);

      if (result && result.success && result.data) {
        const regData = result.data;
        setRegistrationId(regData.id);
        localStorage.setItem('registrationId', regData.id);
        setRegistrationData(regData);
        setRegistrationStatus(regData.status);
        
        // Store institution type from registration
        if (regData.institutionType) {
          localStorage.setItem('institutionType', regData.institutionType);
          setInstitutionType(regData.institutionType);
        } else if (regData.type) {
          localStorage.setItem('institutionType', regData.type);
          setInstitutionType(regData.type);
        }
        
        // If registration is approved, get the institution ID
        if (regData.status === 'approved') {
          // First try to get ID from registration
          let id = regData.schoolId || regData.institutionId || regData.id;
          
          if (id) {
            setInstitutionId(id);
            localStorage.setItem('institutionId', id);
            console.log('✅ Institution ID found in registration:', id);
            
            // Try to find the full institution data
            const type = regData.institutionType || regData.type || localStorage.getItem('institutionType');
            if (type) {
              const foundInstitution = await findInstitutionByEmail(email);
              if (foundInstitution) {
                console.log('✅ Found full institution data:', foundInstitution);
                const foundId = foundInstitution.id || foundInstitution._id;
                setInstitutionId(foundId);
                localStorage.setItem('institutionId', foundId);
                localStorage.setItem('institutionType', foundInstitution.institutionType);
                const instType = foundInstitution.institutionType;
                localStorage.setItem(`${instType}Data`, JSON.stringify(foundInstitution));
                setInstitutionType(instType);
              }
            }
          } else {
            // Try to find institution by email
            console.log('⚠️ No institutionId in registration, trying to find by email');
            const foundInstitution = await findInstitutionByEmail(email);
            if (foundInstitution) {
              console.log('✅ Found institution by email:', foundInstitution);
              const foundId = foundInstitution.id || foundInstitution._id;
              setInstitutionId(foundId);
              localStorage.setItem('institutionId', foundId);
              localStorage.setItem('institutionType', foundInstitution.institutionType);
              const type = foundInstitution.institutionType;
              localStorage.setItem(`${type}Data`, JSON.stringify(foundInstitution));
              setInstitutionType(type);
            } else {
              console.log('❌ No institution found with email:', email);
              toast.warning('Institution profile not found. Please contact support.');
            }
          }
        }
        
        console.log('📋 Found existing registration:', regData);
        
        // Start polling if pending
        if (regData.status === 'pending') {
          startStatusPolling(regData.id);
        }
      } else {
        setRegistrationStatus('not_started');
        console.log('📋 No existing registration found');
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

  // Fetch registration status using registerApi
  const fetchRegistrationStatus = async (id) => {
    if (!id) {
      console.log('⚠️ No registration ID provided');
      setRegistrationStatus('not_started');
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      console.log('🔍 Fetching registration status for ID:', id);
      
      const result = await registerApi.getRegistrationStatus(id);

      console.log('📋 Registration Status Response:', result);

      if (result && result.success && result.data) {
        const regData = result.data;
        setRegistrationData(regData);
        setRegistrationStatus(regData.status);
        
        // Store institution type
        if (regData.institutionType) {
          localStorage.setItem('institutionType', regData.institutionType);
          setInstitutionType(regData.institutionType);
        } else if (regData.type) {
          localStorage.setItem('institutionType', regData.type);
          setInstitutionType(regData.type);
        }
        
        // If registration is approved, get the institution ID
        if (regData.status === 'approved') {
          let id = regData.schoolId || regData.institutionId || regData.id;
          
          if (id) {
            setInstitutionId(id);
            localStorage.setItem('institutionId', id);
            console.log('✅ Institution ID found in registration:', id);
            
            // Try to get full data
            const type = regData.institutionType || regData.type || localStorage.getItem('institutionType');
            if (type) {
              const email = regData.email || userEmail;
              if (email) {
                const foundInstitution = await findInstitutionByEmail(email);
                if (foundInstitution) {
                  console.log('✅ Found full institution data:', foundInstitution);
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
          } else {
            // Try to find institution by email
            const email = regData.email || userEmail;
            if (email) {
              console.log('⚠️ No institutionId in registration, trying to find by email');
              const foundInstitution = await findInstitutionByEmail(email);
              if (foundInstitution) {
                console.log('✅ Found institution by email:', foundInstitution);
                const foundId = foundInstitution.id || foundInstitution._id;
                setInstitutionId(foundId);
                localStorage.setItem('institutionId', foundId);
                localStorage.setItem('institutionType', foundInstitution.institutionType);
                const type = foundInstitution.institutionType;
                localStorage.setItem(`${type}Data`, JSON.stringify(foundInstitution));
                setInstitutionType(type);
              }
            }
          }
        }
        
        console.log('✅ Registration status set to:', regData.status);
        
        // Start polling if pending
        if (regData.status === 'pending') {
          startStatusPolling(id);
        }
      } else {
        console.log('❌ No registration data found');
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

  // Start polling for status updates
  const startStatusPolling = (id) => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
    
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
  };

  // Handle view profile navigation based on institution type
  const handleViewProfile = () => {
    // Try multiple ways to get the institution type
    let type = localStorage.getItem('institutionType');
    
    // If not found, try to get from user data
    if (!type) {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      type = userData.institutionType || userData.type;
    }
    
    // If still not found, try to determine from registration data
    if (!type && registrationData) {
      type = registrationData.institutionType || registrationData.type;
    }
    
    // If still not found, try to determine from stored data
    if (!type) {
      if (localStorage.getItem('collegeData')) {
        type = 'college';
      } else if (localStorage.getItem('schoolData')) {
        type = 'school';
      } else if (localStorage.getItem('puCollegeData')) {
        type = 'pu_college';
      } else if (localStorage.getItem('coachingData')) {
        type = 'coaching';
      } else if (localStorage.getItem('teacherData')) {
        type = 'teacher';
      }
    }
    
    // If still not found, check what's in the registration data from the API
    if (!type && registrationData) {
      // Check if registration data has institution type
      if (registrationData.institutionType) {
        type = registrationData.institutionType;
      } else if (registrationData.type) {
        type = registrationData.type;
      }
    }
    
    // Get the institution ID
    const id = institutionId || localStorage.getItem('institutionId');
    
    if (!id) {
      toast.warning('Profile ID not found. Please contact support.');
      return;
    }

    console.log('🔍 Navigating to profile - Type:', type, 'ID:', id);

    // Navigate to the correct profile page based on institution type
    switch(type?.toLowerCase()) {
      case 'college':
        navigate('/college-profile');
        break;
      case 'school':
        navigate('/school-profile');
        break;
      case 'pu_college':
      case 'pucollege':
        navigate('/pu-college-profile');
        break;
      case 'coaching':
      case 'tuition':
        navigate('/coaching-profile');
        break;
      case 'teacher':
        navigate('/teacher-profile');
        break;
      default:
        // If type is still unknown, try to determine from email or registration
        console.log('⚠️ Unknown institution type, trying to determine from data');
        
        // Check if we have any stored data
        if (localStorage.getItem('collegeData')) {
          navigate('/college-profile');
        } else if (localStorage.getItem('schoolData')) {
          navigate('/school-profile');
        } else if (localStorage.getItem('puCollegeData')) {
          navigate('/pu-college-profile');
        } else if (localStorage.getItem('coachingData')) {
          navigate('/coaching-profile');
        } else if (localStorage.getItem('teacherData')) {
          navigate('/teacher-profile');
        } else {
          toast.warning('Profile type not found. Please contact support.');
        }
    }
  };

  // Get status configuration
  const getStatusConfig = (status) => {
    const configs = {
      'not_started': {
        icon: FiClipboard,
        color: 'text-gray-400',
        bgColor: 'bg-gray-500/10',
        borderColor: 'border-gray-500/20',
        title: 'Complete Your Registration',
        message: 'Start your institution registration process to access all features.',
        buttonText: 'Start Registration',
        buttonAction: handleRegisterForm,
        showButton: true,
        details: 'Click the button below to begin the registration process.'
      },
      'pending': {
        icon: FiLoader,
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/20',
        title: 'Registration Under Review',
        message: 'Your registration has been submitted and is currently being reviewed by our admin team.',
        buttonText: 'Refresh Status',
        buttonAction: handleRefreshStatus,
        showButton: true,
        details: 'Please wait for admin approval. This process usually takes 24-48 hours.'
      },
      'approved': {
        icon: FiCheckCircle,
        color: 'text-green-400',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/20',
        title: 'Registration Approved! 🎉',
        message: 'Congratulations! Your institution has been verified and approved. You now have full access to all features.',
        buttonText: 'View Full Profile',
        buttonAction: handleViewProfile,
        showButton: true,
        details: 'Your institution is now active.'
      },
      'rejected': {
        icon: FiXCircle,
        color: 'text-red-400',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/20',
        title: 'Registration Rejected',
        message: 'Your registration was not approved. Please review the reason and contact support.',
        buttonText: 'Contact Support',
        buttonAction: () => window.location.href = 'mailto:support@raynott.com',
        showButton: true,
        details: 'Our team will help you resolve any issues with your registration.'
      }
    };
    return configs[status] || configs['not_started'];
  };

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
          <button
            onClick={handleRefreshStatus}
            className="mt-4 px-6 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
          >
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
            <h3 className={`text-2xl font-bold ${config.color} mb-2`}>
              {config.title}
            </h3>
            <p className="text-gray-300 text-lg mb-2">{config.message}</p>
            <p className="text-gray-400 text-sm">{config.details}</p>
            {registrationStatus === 'pending' && registrationData?.submittedAt && (
              <div className="mt-3 flex items-center gap-2">
                <FiClock className="text-yellow-400 w-4 h-4" />
                <span className="text-yellow-400 text-sm">
                  Submitted: {new Date(registrationData.submittedAt).toLocaleString()}
                </span>
              </div>
            )}
            {registrationStatus === 'approved' && registrationData?.approvedAt && (
              <div className="mt-3 flex items-center gap-2">
                <FiCheck className="text-green-400 w-4 h-4" />
                <span className="text-green-400 text-sm">
                  Approved: {new Date(registrationData.approvedAt).toLocaleString()}
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
        {registrationData.photos && registrationData.photos.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-2">Gallery Photos</p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {registrationData.photos.slice(0, 6).map((photo, index) => (
                <img 
                  key={index}
                  src={photo} 
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-20 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

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

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-lg text-white"
      >
        {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
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
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all group"
              >
                <FiPlus className="w-5 h-5" />
                <span className="flex-1 text-left">New Registration</span>
              </button>
            )}
            {registrationStatus === 'approved' && (
              <button
                onClick={handleViewProfile}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all group"
              >
                <FiUsers className="w-5 h-5" />
                <span className="flex-1 text-left">View Profile</span>
              </button>
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

      {/* Main Content */}
      <div className={`lg:ml-64 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : ''}`}>
        {/* Header */}
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
                Refresh Status
              </button>
              <div className="flex items-center gap-2 text-gray-300 bg-gray-700/30 px-4 py-2 rounded-lg">
                <FiUser className="w-4 h-4" />
                <span className="text-sm hidden md:block">{userEmail}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6 max-w-6xl mx-auto">
          {renderWelcomeMessage()}
          {renderRegistrationStatusCard()}
          {registrationStatus === 'approved' && renderRegistrationDetails()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;