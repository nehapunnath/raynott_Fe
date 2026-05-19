// src/components/dashboards/SchoolDashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiList, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import AddSchools from '../pages/Admin/AddSchools';
import SchoolsList from '../pages/Admin/SchoolsList';
import { schoolApi } from '../services/schoolApi';
import DashSidebar from '../components/DashSidebar';

const SchoolDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [institutionData, setInstitutionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInstitutionData();
  }, []);

  const loadInstitutionData = async () => {
    const institutionName = localStorage.getItem('institutionName');
    const institutionType = localStorage.getItem('institutionType');
    
    if (institutionName && institutionType === 'Schools') {
      // Fetch the specific school data
      try {
        const schools = await schoolApi.getSchools();
        const school = schools.find(s => s.name === institutionName);
        setInstitutionData(school);
      } catch (error) {
        console.error('Error loading school data:', error);
      }
    }
    setLoading(false);
  };

  const schoolMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiEye className="w-5 h-5" /> },
    { id: 'add-school', label: 'Add School', icon: <FiPlus className="w-5 h-5" /> },
    { id: 'manage-schools', label: 'My Schools', icon: <FiList className="w-5 h-5" /> },
    { id: 'edit-school', label: 'Edit Details', icon: <FiEdit className="w-5 h-5" /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <SchoolDashboardStats institutionData={institutionData} />;
      case 'add-school':
        return <AddSchools />;
      case 'manage-schools':
        return <SchoolsList showOnlyOwn={true} institutionName={localStorage.getItem('institutionName')} />;
      case 'edit-school':
        return <EditSchool schoolData={institutionData} />;
      default:
        return <SchoolDashboardStats institutionData={institutionData} />;
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

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
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {renderContent()}
      </div>
    </div>
  );
};

const SchoolDashboardStats = ({ institutionData }) => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">School Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-2">Total Students</h3>
        <p className="text-3xl text-orange-600">{institutionData?.totalStudents || 0}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-2">Total Teachers</h3>
        <p className="text-3xl text-orange-600">{institutionData?.totalTeachers || 0}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-2">Active Listings</h3>
        <p className="text-3xl text-orange-600">1</p>
      </div>
    </div>
  </div>
);

export default SchoolDashboard;