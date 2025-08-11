import { motion } from 'framer-motion';
import { FaHome, FaUsers, FaSchool, FaChalkboardTeacher, FaCog, FaUserCircle, FaGraduationCap } from 'react-icons/fa';

const NavItem = ({ icon, text, active, onClick, sidebarOpen }) => {
  return (
    <motion.div
      className={`flex items-center px-4 py-3 cursor-pointer ${active ? 'bg-orange-700' : 'hover:bg-orange-700'}`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
    >
      <div className="text-lg mr-3">{icon}</div>
      {sidebarOpen && <span>{text}</span>}
    </motion.div>
  );
};

const Sidebar = ({ sidebarOpen, setSidebarOpen, activeTab, setActiveTab }) => {
  return (
    <motion.div 
      className={`bg-orange-600 text-white ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 flex flex-col`}
      initial={{ width: 256 }}
      animate={{ width: sidebarOpen ? 256 : 80 }}
    >
      <div className="p-4 flex items-center justify-between border-b border-orange-500">
        {sidebarOpen ? (
          <h1 className="text-2xl font-bold">Raynott Admin</h1>
        ) : (
          <h1 className="text-2xl font-bold">R</h1>
        )}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 rounded-full hover:bg-orange-700"
        >
          {sidebarOpen ? '«' : '»'}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <NavItem 
          icon={<FaHome />} 
          text="Dashboard" 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')}
          sidebarOpen={sidebarOpen}
        />
        <NavItem 
          icon={<FaSchool />} 
          text="Schools" 
          active={activeTab === 'schools'} 
          onClick={() => setActiveTab('schools')}
          sidebarOpen={sidebarOpen}
        />
        <NavItem 
          icon={<FaGraduationCap />} 
          text="Colleges" 
          active={activeTab === 'colleges'} 
          onClick={() => setActiveTab('colleges')}
          sidebarOpen={sidebarOpen}
        />
        <NavItem 
          icon={<FaGraduationCap />} 
          text="PU Colleges" 
          active={activeTab === 'pucolleges'} 
          onClick={() => setActiveTab('pucolleges')}
          sidebarOpen={sidebarOpen}
        />
        <NavItem 
          icon={<FaChalkboardTeacher />} 
          text="Coaching/Tuition Centers" 
          active={activeTab === 'coaching/tuitions'} 
          onClick={() => setActiveTab('coaching/tuitions')}
          sidebarOpen={sidebarOpen}
        />
        <NavItem 
          icon={<FaUsers />} 
          text="All Teachers" 
          active={activeTab === 'teachers'} 
          onClick={() => setActiveTab('teachers')}
          sidebarOpen={sidebarOpen}
        />
        {/* <NavItem 
          icon={<FaCog />} 
          text="Settings" 
          active={activeTab === 'settings'} 
          onClick={() => setActiveTab('settings')}
          sidebarOpen={sidebarOpen}
        /> */}
      </nav>

      <div className="p-4 border-t border-orange-500">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center">
            <FaUserCircle className="text-xl" />
          </div>
          {sidebarOpen && (
            <div>
              <p className="font-medium">Admin User</p>
              <p className="text-xs text-orange-200">admin@raynott.com</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;