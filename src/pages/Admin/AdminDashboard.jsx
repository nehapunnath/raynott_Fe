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


const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
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
            {/* Schools list table would go here */}
            {/* <div className="bg-white rounded-xl shadow-sm p-6">
              <p>List of all schools will appear here</p>
            </div> */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Sample Card 1 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          <img 
            src="https://via.placeholder.com/400x300?text=PU+College" 
            alt="school Image" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">ABC PU School</h3>
          <p className="text-gray-600 mb-3">123 Education Street, Bangalore</p>
          <div className="flex justify-between items-center">
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Day School</span>
            <div className="flex space-x-2">
              <button className="text-blue-600 hover:text-blue-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button className="text-red-600 hover:text-red-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
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
                Add New Colleges
              </button>
            </div>
            {/* Schools list table would go here */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Sample Card 1 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          <img 
            src="https://via.placeholder.com/400x300?text=PU+College" 
            alt="College Image" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">ABC PU College</h3>
          <p className="text-gray-600 mb-3">123 Education Street, Bangalore</p>
          <div className="flex justify-between items-center">
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Science</span>
            <div className="flex space-x-2">
              <button className="text-blue-600 hover:text-blue-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button className="text-red-600 hover:text-red-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    
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
                Add New Pu College
              </button>
            </div>
            {/* Schools list table would go here */}
           
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Sample Card 1 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          <img 
            src="https://via.placeholder.com/400x300?text=PU+College" 
            alt="College Image" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">ABC PU College</h3>
          <p className="text-gray-600 mb-3">123 Education Street, Bangalore</p>
          <div className="flex justify-between items-center">
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Science</span>
            <div className="flex space-x-2">
              <button className="text-blue-600 hover:text-blue-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button className="text-red-600 hover:text-red-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
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
                Add New Coaching/Tuition Centers
              </button>
            </div>
            {/* Schools list table would go here */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Sample Card 1 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          <img 
            src="https://via.placeholder.com/400x300?text=PU+College" 
            alt="College Image" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">ABC Coaching</h3>
          <p className="text-gray-600 mb-3">123 Education Street, Bangalore</p>
          <div className="flex justify-between items-center">
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Science</span>
            <div className="flex space-x-2">
              <button className="text-blue-600 hover:text-blue-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button className="text-red-600 hover:text-red-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    
          </div>
        );
      case 'add-coaching/tuition':
        return <AddCoaching />;


      case 'teachers':
          return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Teacher's Management</h1>
              <button 
                onClick={() => setActiveTab('add-teachers')}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
              >
                Add New Teachers
              </button>
            </div>
            {/* Schools list table would go here */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Sample Card 1 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          <img 
            src="https://via.placeholder.com/400x300?text=PU+College" 
            alt="College Image" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">priya</h3>
          <p className="text-gray-600 mb-3">123 Education Street, Bangalore</p>
          <div className="flex justify-between items-center">
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Science</span>
            <div className="flex space-x-2">
              <button className="text-blue-600 hover:text-blue-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button className="text-red-600 hover:text-red-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    
          </div>
        );
      case 'add-teachers':
        return <AddTeachers />;

 
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

      

        {renderContent()}
      </div>
  );
};

export default AdminDashboard;