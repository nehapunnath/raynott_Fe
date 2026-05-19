// src/components/dashboards/CoachingDashboard.jsx
import React, { useState, useEffect } from 'react';
import { FiPlus, FiList, FiEdit, FiEye } from 'react-icons/fi';
import AddCoaching from '../pages/Admin/AddCoaching';
import CoachingList from '../pages/Admin/CoachingList';
import DashSidebar from '../components/DashSidebar';

const CoachingDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  const coachingMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiEye className="w-5 h-5" /> },
    { id: 'add-coaching', label: 'Add Center', icon: <FiPlus className="w-5 h-5" /> },
    { id: 'manage-coaching', label: 'My Centers', icon: <FiList className="w-5 h-5" /> },
    { id: 'edit-coaching', label: 'Edit Details', icon: <FiEdit className="w-5 h-5" /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <CoachingDashboardStats />;
      case 'add-coaching':
        return <AddCoaching />;
      case 'manage-coaching':
        return <CoachingList showOnlyOwn={true} />;
      default:
        return <CoachingDashboardStats />;
    }
  };

  return (
    <div className="flex h-screen bg-orange-50 font-sans">
      <DashSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        menuItems={coachingMenuItems}
        institutionType="Coaching/Tuition"
      />
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {renderContent()}
      </div>
    </div>
  );
};

const CoachingDashboardStats = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Coaching Center Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-2">Total Batches</h3>
        <p className="text-3xl text-orange-600">0</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-2">Total Students</h3>
        <p className="text-3xl text-orange-600">0</p>
      </div>
    </div>
  </div>
);

export default CoachingDashboard;