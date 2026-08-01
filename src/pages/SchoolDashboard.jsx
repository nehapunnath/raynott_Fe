// src/components/dashboards/SchoolDashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiHome, FiEye, FiEdit } from 'react-icons/fi';
import { schoolApi } from '../services/schoolApi';
import { registerApi } from '../services/RegisterApi';
import DashSidebar from '../components/DashSidebar';
import SchoolStats from '../pages/DasboardDetails/Schools/SchoolStats';
import SchoolDetailsView from '../pages/DasboardDetails/Schools/SchoolDetailsView';
import EditSchoolDetails from '../pages/DasboardDetails/Schools/EditSchools';
import RegistrationStatus from '../pages/DasboardDetails/Schools/RegistrationStatus';

const SchoolDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [institutionData, setInstitutionData] = useState(null);
  const [registrationRequest, setRegistrationRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestId, setRequestId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRegistrationData();
  }, []);


  const loadRegistrationData = async () => {
    setLoading(true);
    setError(null);
    
    const savedRequestId = localStorage.getItem('registrationRequestId');
    const institutionName = localStorage.getItem('institutionName');
    const institutionType = localStorage.getItem('institutionType');
    const schoolId = localStorage.getItem('schoolId');
    
    console.log('Loading registration data:', { savedRequestId, institutionName, institutionType, schoolId });
    
    try {
      if (savedRequestId) {
        // Check registration status
        const statusResponse = await registerApi.getRegistrationStatus(savedRequestId);
        console.log('Registration status response:', statusResponse);
        
        if (statusResponse.success && statusResponse.data) {
          setRegistrationRequest(statusResponse.data);
          setRequestId(savedRequestId);
          
          // If approved, fetch the institution data
          if (statusResponse.data.status === 'approved') {
            // Try to load by schoolId first, then by name
            if (schoolId) {
              await loadInstitutionDataById(schoolId);
            } else if (institutionName) {
              await loadInstitutionDataByName(institutionName);
            } else {
              // If no schoolId or name, try to get all schools and find by name from registration data
              if (statusResponse.data.institutionName) {
                await loadInstitutionDataByName(statusResponse.data.institutionName);
              }
            }
          }
        } else {
          setError('Failed to load registration status');
        }
      } else if (schoolId) {
        // Try loading by school ID if available
        await loadInstitutionDataById(schoolId);
      } else if (institutionName && institutionType === 'Schools') {
        // Check if already registered as approved institution
        await loadInstitutionDataByName(institutionName);
      }
    } catch (error) {
      console.error('Error in loadRegistrationData:', error);
      setError(error.message || 'Error loading registration data');
    }
    
    setLoading(false);
  };

  const loadInstitutionDataById = async (id) => {
    try {
      console.log('Loading school by ID:', id);
      const response = await schoolApi.getSchoolById(id);
      console.log('School by ID response:', response);
      
      // Handle different response formats
      let schoolData = null;
      if (response && response.data) {
        schoolData = response.data;
      } else if (response && response.school) {
        schoolData = response.school;
      } else if (response && typeof response === 'object' && response._id) {
        schoolData = response;
      } else if (response) {
        schoolData = response;
      }
      
      if (schoolData) {
        console.log('Found school data:', schoolData);
        setInstitutionData(schoolData);
        localStorage.setItem('schoolId', schoolData._id || schoolData.id);
        return true;
      } else {
        console.error('No school data found in response:', response);
        return false;
      }
    } catch (error) {
      console.error('Error loading institution by ID:', error);
      setError('Failed to load school data. Please try again.');
      return false;
    }
  };

  // Helper function to convert object to array
  const convertSchoolsObjectToArray = (schoolsObject) => {
    if (!schoolsObject) return [];
    
    // If it's already an array, return it
    if (Array.isArray(schoolsObject)) return schoolsObject;
    
    // If it's an object with dynamic keys, convert to array
    if (typeof schoolsObject === 'object') {
      return Object.keys(schoolsObject).map(key => ({
        id: key, // Keep the original key as id
        _id: key,
        ...schoolsObject[key] // Spread the school data
      }));
    }
    
    return [];
  };

  const loadInstitutionDataByName = async (institutionName) => {
    try {
      if (!institutionName) {
        console.log('No institution name provided');
        return false;
      }
      
      console.log('Loading school by name:', institutionName);
      const response = await schoolApi.getSchools();
      console.log('All schools response:', response);
      
      // Extract schools data from response
      let schoolsObject = null;
      
      if (response && response.data) {
        schoolsObject = response.data;
      } else if (response && response.schools) {
        schoolsObject = response.schools;
      } else if (response && response.result) {
        schoolsObject = response.result;
      } else if (response) {
        schoolsObject = response;
      }
      
      console.log('Schools object:', schoolsObject);
      
      // Convert object to array
      let schools = convertSchoolsObjectToArray(schoolsObject);
      console.log('Converted schools array:', schools);
      
      if (schools.length === 0) {
        console.log('No schools found in response');
        setError('No schools found. Please contact support.');
        return false;
      }
      
      // Find school by name (case insensitive)
      const school = schools.find(s => 
        s.name && s.name.toLowerCase() === institutionName.toLowerCase()
      );
      
      if (school) {
        console.log('Found school:', school);
        setInstitutionData(school);
        localStorage.setItem('schoolId', school._id || school.id);
        return true;
      } else {
        console.log('School not found with name:', institutionName);
        console.log('Available school names:', schools.map(s => s.name));
        
        // Try partial match
        const partialMatch = schools.find(s => 
          s.name && s.name.toLowerCase().includes(institutionName.toLowerCase())
        );
        
        if (partialMatch) {
          console.log('Found partial match:', partialMatch);
          setInstitutionData(partialMatch);
          localStorage.setItem('schoolId', partialMatch._id || partialMatch.id);
          return true;
        }
        
        // If still no match, use the first school
        if (schools.length > 0) {
          console.log('Using first available school as fallback:', schools[0]);
          setInstitutionData(schools[0]);
          localStorage.setItem('schoolId', schools[0]._id || schools[0].id);
          return true;
        }
        
        setError(`School "${institutionName}" not found. Please contact support.`);
        return false;
      }
    } catch (error) {
      console.error('Error loading institution by name:', error);
      setError('Failed to load school data. Please try again.');
      return false;
    }
  };

  const handleRegistrationSuccess = (newRequestId) => {
    localStorage.setItem('registrationRequestId', newRequestId);
    setRequestId(newRequestId);
    loadRegistrationData();
  };

  const handleRetry = () => {
    loadRegistrationData();
  };

  const schoolMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiHome className="w-5 h-5" /> },
    ...(registrationRequest?.status === 'approved' && institutionData ? [
      { id: 'view-school', label: 'My Institution', icon: <FiEye className="w-5 h-5" /> },
      { id: 'edit-school', label: 'Edit Details', icon: <FiEdit className="w-5 h-5" /> }
    ] : [])
  ];

  const renderContent = () => {
    // If there's an error
    if (error) {
      return (
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md w-full text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-red-800 mb-2">Something went wrong</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={handleRetry}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    // If no registration request and no institution data, show registration form
    if (!registrationRequest && !institutionData) {
      return <RegistrationStatus 
        status="not_registered" 
        onRegister={handleRegistrationSuccess}
      />;
    }

    // If registration is pending
    if (registrationRequest?.status === 'pending') {
      return <RegistrationStatus 
        status="pending" 
        registrationData={registrationRequest}
      />;
    }

    // If registration is rejected
    if (registrationRequest?.status === 'rejected') {
      return <RegistrationStatus 
        status="rejected" 
        registrationData={registrationRequest}
        onRegister={handleRegistrationSuccess}
      />;
    }

    // If approved and data exists
    if (registrationRequest?.status === 'approved' && institutionData) {
      switch (activeTab) {
        case 'dashboard':
          return <SchoolStats institutionData={institutionData} registrationStatus="approved" />;
        case 'view-school':
          return <SchoolDetailsView schoolData={institutionData} />;
        case 'edit-school':
          return <EditSchoolDetails 
            schoolData={institutionData} 
            schoolId={institutionData._id || institutionData.id} 
            onUpdate={() => {
              const schoolId = localStorage.getItem('schoolId');
              if (schoolId) {
                loadInstitutionDataById(schoolId);
              } else {
                const institutionName = localStorage.getItem('institutionName');
                if (institutionName) {
                  loadInstitutionDataByName(institutionName);
                }
              }
            }} 
          />;
        default:
          return <SchoolStats institutionData={institutionData} registrationStatus="approved" />;
      }
    }

    // If approved but no institution data, show loading or retry
    if (registrationRequest?.status === 'approved' && !institutionData) {
      return (
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 max-w-md w-full text-center">
            <div className="text-yellow-500 text-5xl mb-4">⏳</div>
            <h3 className="text-xl font-semibold text-yellow-800 mb-2">Loading Institution Data</h3>
            <p className="text-yellow-600 mb-4">We're having trouble loading your institution data.</p>
            <button 
              onClick={handleRetry}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return <RegistrationStatus status="not_registered" onRegister={handleRegistrationSuccess} />;
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
    </div>
  );

  return (
    <div className="flex h-screen bg-orange-50 font-sans">
      <DashSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        menuItems={schoolMenuItems}
        institutionType="Schools"
      />
      <div className={`flex-1 transition-all duration-300 overflow-y-auto ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {renderContent()}
      </div>
    </div>
  );
};

export default SchoolDashboard;