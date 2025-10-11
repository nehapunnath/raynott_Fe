import { useState } from 'react';
import { FaSearch, FaUserCircle, FaBell } from 'react-icons/fa';
import { IoMdNotificationsOutline } from 'react-icons/io';
import Dashboard from '../../components/Dashboard';
import Sidebar from '../../components/Sidebar';
import AddSchools from './AddSchools';
import AddColleges from './AddColleges';
import AddPucollege from './AddPucollege';
import AddCoaching from './AddCoaching';
import AddTeachers from './AddTeachers';
import SuperAdmin from './SuperAdmin';
import SchoolsList from './SchoolsList';
import CollegeList from './CollegeList';
import PucollegeList from './PucollegeList';
import CoachingList from './CoachingList';
import TeacherList from './TeacherList';
import "tailwindcss";
import AdminReg from './AdminReg';
import AdminBookings from './AdminBookings';



const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('schools');

  const renderContent = () => {
    switch (activeTab) {
      // case 'dashboard':
      //   return <Dashboard />;
      case 'schools':
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Schools Management</h1>
              <button
                onClick={() => setActiveTab('add-school')}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
              >
                Add New School
              </button>
            </div>
            <SchoolsList />
          </div>
        );
      case 'add-school':
        return <AddSchools />;
      case 'colleges':
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">College Management</h1>
              <button
                onClick={() => setActiveTab('add-colleges')}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
              >
                Add New college
              </button>
            </div>
            <CollegeList />
          </div>
        );
      case 'add-colleges':
        return <AddColleges />;

      case 'pucolleges':
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Pu College Management</h1>
              <button
                onClick={() => setActiveTab('add-pucolleges')}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
              >
                Add New Pucollege
              </button>
            </div>
            <PucollegeList />
          </div>
        );
      case 'add-pucolleges':
        return <AddPucollege />;

      case 'coaching/tuitions':
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Coaching/Tuition Management</h1>
              <button
                onClick={() => setActiveTab('add-coaching/tuition')}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
              >
                Add New Coaching/Tuition
              </button>
            </div>
            <CoachingList />
          </div>
          
        );
      case 'add-coaching/tuition':
        return <AddCoaching />;


      case 'teachers':
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Pu College Management</h1>
              <button
                onClick={() => setActiveTab('add-teachers')}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
              >
                Add New Teachers
              </button>
            </div>
            <TeacherList />
          </div>
        );
      case 'add-teachers':
        return <AddTeachers />;

      case ('Registered'):
        return <AdminReg />;
        case 'Bookings':
          return <AdminBookings/>


    }
  };

  return (
    <div className="flex h-screen bg-orange-50 font-sans">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div
        className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'
          }`}
      >

        {renderContent()}

      </div>
    </div>



  );
};

export default AdminDashboard;