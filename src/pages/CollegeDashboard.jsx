// src/components/dashboards/CollegeDashboard.jsx
import React, { useState, useEffect } from 'react';
import { FiPlus, FiList, FiEdit, FiEye } from 'react-icons/fi';
import AddColleges from '../pages/Admin/AddColleges';
import CollegeList from '../pages/Admin/CollegeList';
import { collegeApi } from '../services/collegeApi';
import DashSidebar from '../components/DashSidebar';

const CollegeDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [institutionData, setInstitutionData] = useState(null);

  useEffect(() => {
    loadInstitutionData();
  }, []);

  const loadInstitutionData = async () => {
    const institutionName = localStorage.getItem('institutionName');
    try {
      const colleges = await collegeApi.getColleges();
      const college = colleges.find(c => c.name === institutionName);
      setInstitutionData(college);
    } catch (error) {
      console.error('Error loading college data:', error);
    }
  };

  const collegeMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiEye className="w-5 h-5" /> },
    { id: 'add-college', label: 'Add College', icon: <FiPlus className="w-5 h-5" /> },
    { id: 'manage-colleges', label: 'My Colleges', icon: <FiList className="w-5 h-5" /> },
    { id: 'edit-college', label: 'Edit Details', icon: <FiEdit className="w-5 h-5" /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <CollegeDashboardStats institutionData={institutionData} />;
      case 'add-college':
        return <AddColleges />;
      case 'manage-colleges':
        return <CollegeList showOnlyOwn={true} institutionName={localStorage.getItem('institutionName')} />;
      default:
        return <CollegeDashboardStats institutionData={institutionData} />;
    }
  };

  return (
    <div className="flex h-screen bg-orange-50 font-sans">
      <DashSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        menuItems={collegeMenuItems}
        institutionType="Colleges"
      />
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {renderContent()}
      </div>
    </div>
  );
};

const CollegeDashboardStats = ({ institutionData }) => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">College Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-2">Total Courses</h3>
        <p className="text-3xl text-orange-600">{institutionData?.courses?.length || 0}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-2">Total Faculty</h3>
        <p className="text-3xl text-orange-600">{institutionData?.totalFaculty || 0}</p>
      </div>
    </div>
  </div>
);

export default CollegeDashboard;