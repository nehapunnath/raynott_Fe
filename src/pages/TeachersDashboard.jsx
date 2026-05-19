// src/components/dashboards/TeachersDashboard.jsx
import React, { useState, useEffect } from 'react';
import { FiPlus, FiList, FiEdit, FiEye, FiUsers } from 'react-icons/fi';
import AddTeachers from '../pages/Admin/AddTeachers';
import TeacherList from '../pages/Admin/TeacherList';
import DashSidebar from '../components/DashSidebar';

const TeachersDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  const teacherMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiEye className="w-5 h-5" /> },
    { id: 'add-teacher', label: 'Add Teacher', icon: <FiPlus className="w-5 h-5" /> },
    { id: 'manage-teachers', label: 'My Teachers', icon: <FiList className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <FiUsers className="w-5 h-5" /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <TeachersDashboardStats />;
      case 'add-teacher':
        return <AddTeachers />;
      case 'manage-teachers':
        return <TeacherList showOnlyOwn={true} />;
      default:
        return <TeachersDashboardStats />;
    }
  };

  return (
    <div className="flex h-screen bg-orange-50 font-sans">
      <DashSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        menuItems={teacherMenuItems}
        institutionType="Teachers"
      />
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {renderContent()}
      </div>
    </div>
  );
};

const TeachersDashboardStats = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Teachers Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-2">Total Students</h3>
        <p className="text-3xl text-orange-600">0</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-2">Classes Today</h3>
        <p className="text-3xl text-orange-600">0</p>
      </div>
    </div>
  </div>
);

export default TeachersDashboard;