import { motion } from 'framer-motion';
import { FaSchool, FaChalkboardTeacher, FaUsers, FaGraduationCap } from 'react-icons/fa';
import { BsCalendarCheck } from 'react-icons/bs';
import "tailwindcss";


const Dashboard = () => {
  const quickStats = [
    { title: 'Total Schools', value: '1,284', icon: <FaSchool className="text-2xl" />, change: '+12%' },
    { title: 'Total Colleges', value: '856', icon: <FaGraduationCap className="text-2xl" />, change: '+8%' },
    { title: 'PU Colleges', value: '324', icon: <FaGraduationCap className="text-2xl" />, change: '+5%' },
    { title: 'coaching/Tuition Centers', value: '2,456', icon: <FaChalkboardTeacher className="text-2xl" />, change: '+18%' },
    { title: 'Total Teachers', value: '5,678', icon: <FaUsers className="text-2xl" />, change: '+15%' },
  ];

  const recentActivities = [
    { id: 1, type: 'New School', name: 'Global Public School', time: '10 mins ago' },
    { id: 2, type: 'New College', name: 'City Arts & Science College', time: '25 mins ago' },
    { id: 3, type: 'New PU College', name: 'Bright PU College', time: '1 hour ago' },
    { id: 4, type: 'New Coaching/Tuition', name: 'Math Excellence Center', time: '2 hours ago' },
    { id: 5, type: 'New Teacher', name: 'Rahul Sharma', time: '5 hours ago' },
  ];

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {quickStats.map((stat, index) => (
          <motion.div 
            key={index}
            className="bg-white rounded-xl shadow-sm p-6"
            whileHover={{ y: -5 }}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                <p className="text-sm text-green-500 mt-1">{stat.change}</p>
              </div>
              <div className="p-3 rounded-lg bg-orange-100 text-orange-600">
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Recent Activities</h3>
          <button className="text-orange-600 hover:text-orange-800 text-sm font-medium">
            View All
          </button>
        </div>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <motion.div 
              key={activity.id}
              className="flex items-start p-3 hover:bg-orange-50 rounded-lg transition-colors"
              whileHover={{ x: 5 }}
            >
              <div className="p-2 rounded-lg bg-orange-100 text-orange-600 mr-4">
                {activity.type === 'New School' && <FaSchool />}
                {activity.type === 'New College' && <FaGraduationCap />}
                {activity.type === 'New PU College' && <FaGraduationCap />}
                {activity.type === 'New Tuition' && <FaChalkboardTeacher />}
                {activity.type === 'New Teacher' && <FaUsers />}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{activity.name}</h4>
                <p className="text-sm text-gray-500">{activity.type} • {activity.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Registrations */}
      {/* <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Recent Registrations</h3>
          <button className="text-orange-600 hover:text-orange-800 text-sm font-medium">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-orange-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-orange-600 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-orange-600 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-orange-600 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-orange-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-orange-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-orange-600 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[1, 2, 3, 4, 5].map((item) => (
                <tr key={item} className="hover:bg-orange-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{1000 + item}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item === 1 && 'Global Public School'}
                    {item === 2 && 'City Arts & Science College'}
                    {item === 3 && 'Bright PU College'}
                    {item === 4 && 'Math Excellence Center'}
                    {item === 5 && 'Rahul Sharma'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item === 1 && 'School'}
                    {item === 2 && 'College'}
                    {item === 3 && 'PU College'}
                    {item === 4 && 'Tuition Center'}
                    {item === 5 && 'Teacher'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Aug {item}, 2025</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${item % 2 === 0 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                      {item % 2 === 0 ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-orange-600 hover:text-orange-900 mr-3">View</button>
                    <button className="text-gray-600 hover:text-gray-900">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}
      {/* </div> */}
    </main>
  );
};

export default Dashboard;