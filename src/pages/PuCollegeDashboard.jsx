// src/components/dashboards/PUCollegeDashboard.jsx
import React, { useState, useEffect } from 'react';
import { FiPlus, FiList, FiEdit, FiEye } from 'react-icons/fi';
import AddPucollege from '../pages/Admin/AddPucollege';
import PucollegeList from '../pages/Admin/PucollegeList';
import DashSidebar from '../components/DashSidebar';

const PuCollegeDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [institutionData, setInstitutionData] = useState(null);

  const puCollegeMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiEye className="w-5 h-5" /> },
    { id: 'add-pucollege', label: 'Add PU College', icon: <FiPlus className="w-5 h-5" /> },
    { id: 'manage-pucolleges', label: 'My PU Colleges', icon: <FiList className="w-5 h-5" /> },
    { id: 'edit-pucollege', label: 'Edit Details', icon: <FiEdit className="w-5 h-5" /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <PUCollegeDashboardStats institutionData={institutionData} />;
      case 'add-pucollege':
        return <AddPucollege />;
      case 'manage-pucolleges':
        return <PucollegeList showOnlyOwn={true} />;
      default:
        return <PUCollegeDashboardStats institutionData={institutionData} />;
    }
  };

  return (
    <div className="flex h-screen bg-orange-50 font-sans">
      <DashSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        menuItems={puCollegeMenuItems}
        institutionType="PU College"
      />
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {renderContent()}
      </div>
    </div>
  );
};

const PUCollegeDashboardStats = ({ institutionData }) => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">PU College Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-2">Total Streams</h3>
        <p className="text-3xl text-orange-600">{institutionData?.streams?.length || 0}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-2">Total Students</h3>
        <p className="text-3xl text-orange-600">{institutionData?.totalStudents || 0}</p>
      </div>
    </div>
  </div>
);

export default PuCollegeDashboard;