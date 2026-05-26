// src/components/dashboards/SchoolDashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiHome, FiEye, FiEdit, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
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

  useEffect(() => {
    loadRegistrationData();
  }, []);

  const loadRegistrationData = async () => {
    const savedRequestId = localStorage.getItem('registrationRequestId');
    const institutionName = localStorage.getItem('institutionName');
    const institutionType = localStorage.getItem('institutionType');
    
    if (savedRequestId) {
      try {
        // Check registration status
        const statusResponse = await registerApi.getRegistrationStatus(savedRequestId);
        if (statusResponse.success && statusResponse.data) {
          setRegistrationRequest(statusResponse.data);
          setRequestId(savedRequestId);
          
          // If approved, fetch the institution data
          if (statusResponse.data.status === 'approved') {
            await loadInstitutionData(institutionName, institutionType);
          }
        }
      } catch (error) {
        console.error('Error loading registration status:', error);
      }
    } else if (institutionName && institutionType === 'Schools') {
      // Check if already registered as approved institution
      await loadInstitutionData(institutionName, institutionType);
    }
    
    setLoading(false);
  };

  const loadInstitutionData = async (institutionName, institutionType) => {
    try {
      const response = await schoolApi.getSchools();
      let schools = [];
      if (Array.isArray(response)) {
        schools = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        schools = response.data;
      } else if (response && response.schools && Array.isArray(response.schools)) {
        schools = response.schools;
      }
      
      const school = schools.find(s => s.name === institutionName);
      if (school) {
        setInstitutionData(school);
        localStorage.setItem('schoolId', school._id || school.id);
      }
    } catch (error) {
      console.error('Error loading institution data:', error);
    }
  };

  const handleRegistrationSuccess = (newRequestId) => {
    localStorage.setItem('registrationRequestId', newRequestId);
    setRequestId(newRequestId);
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
            onUpdate={() => loadInstitutionData(institutionData.name, 'Schools')} 
          />;
        default:
          return <SchoolStats institutionData={institutionData} registrationStatus="approved" />;
      }
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