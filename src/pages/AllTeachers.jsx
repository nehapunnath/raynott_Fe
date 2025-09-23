import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaChalkboardTeacher, FaSearch, FaFilter, FaBookOpen, FaTimes, FaHome, FaChild, FaSchool, FaGraduationCap, FaUserGraduate, FaUserTie, FaUniversity, FaBook } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { BsFillCalendar2CheckFill } from "react-icons/bs";
import Footer from '../components/Footer';
import StickyButton from '../components/StickyButton';

const teacherCategories = [
  {
    id: 1,
    title: "Professional Teachers",
    icon: <FaUniversity className="text-4xl text-orange-500" />,
    description: "Qualified teachers for Schools, Colleges, PU Colleges, and Coaching Centers",
    path: "/teachers",
    subcategories: ["Schools", "Colleges", "PU Colleges", "Coaching Centers"]
  },
  {
    id: 2,
    title: "Personal Mentorship",
    icon: <FaUserTie className="text-4xl text-orange-500" />,
    description: "Personalized guidance and one-on-one mentoring for individual learning",
    path: "/teachers"
  },
  // {
  //   id: 3,
  //   title: "Become A Teacher",
  //   subtitle: "Join Our Platform",
  //   icon: <FaChalkboardTeacher className="text-4xl text-orange-500" />,
  //   description: "Register as a teacher and connect with students across all levels",
  //   path: "/register",
  //   isRegistration: true
  // }
];

function AllTeachers() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    subject: [],
    qualification: [],
    experience: [0, 20],
    location: 'Bengaluru',
    teachingMode: [],
    institutionType: []
  });

  const subjectOptions = ['Mathematics', 'Science', 'English', 'Social Studies', 'Computer Science', 'Languages', 'Physics', 'Chemistry', 'Biology', 'Commerce', 'Arts'];
  const qualificationOptions = ['B.Ed', 'M.Ed', 'PhD', 'Post Graduate', 'Graduate', 'M.Sc', 'M.A', 'B.Sc', 'B.A'];
  const teachingModeOptions = ['Online', 'Offline', 'Both'];
  const institutionTypeOptions = ['School', 'College', 'PU College', 'Coaching Center', 'University'];

  const nav = useNavigate();

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      if (filterType === 'experience') {
        return { ...prev, experience: value };
      } else {
        const currentValues = [...prev[filterType]];
        const index = currentValues.indexOf(value);

        if (index === -1) {
          currentValues.push(value);
        } else {
          currentValues.splice(index, 1);
        }

        return { ...prev, [filterType]: currentValues };
      }
    });
  };

  const resetFilters = () => {
    setFilters({
      subject: [],
      qualification: [],
      experience: [0, 20],
      location: 'Bengaluru',
      teachingMode: [],
      institutionType: []
    });
  };

  const applyFilters = () => {
    console.log('Applied filters:', filters);
    setIsFilterOpen(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-orange-50 min-h-screen font-sans">
      {/* Header */}
      <header className="bg-orange-600 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex w-full md:w-auto justify-between items-center mb-4 md:mb-0">
            <Link to="/" className="text-3xl font-extrabold text-white">
              <motion.span whileHover={{ scale: 1.05 }}>
                Raynott
              </motion.span>
            </Link>
          </div>

          <div className="relative w-full max-w-2xl md:max-w-xl flex-grow md:ml-8">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400" />
            <input
              type="text"
              placeholder="Search Teachers, Subjects, Institutions, Locations..."
              className="pl-12 pr-4 py-3 rounded-full bg-white border border-transparent text-gray-800 focus:outline-none w-full focus:ring-2 focus:ring-orange-200 focus:border-transparent shadow-sm"
            />
          </div>

          <div className="hidden md:flex space-x-4 ml-8">
            <motion.button
              className="bg-white border border-white text-orange-600 hover:bg-orange-100 font-semibold py-2 px-4 rounded-full transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => nav('/bookdemo')}
            >
              Book A Demo
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <div className="text-sm text-gray-500 flex items-center">
              <Link to="/" className="flex items-center hover:text-orange-600">
                <FaHome className="mr-1 text-orange-500" />
                Home
              </Link>
              <span className="mx-2">»</span>
              <span className="text-orange-600">All Teachers</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mt-2">
              Find Qualified Teachers & Mentors
            </h1>

            <p className="text-lg text-gray-600 flex items-center mt-1">
              <BsFillCalendar2CheckFill className="mr-2 text-orange-500" />
              5846 Teachers | List Updated on Aug 1, 2025
            </p>
          </div>
          {/* <motion.button
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300 mt-4 md:mt-0 flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFilterOpen(true)}
          >
            <FaFilter className="mr-2" />
            Filters
          </motion.button> */}
        </div>

        {/* Teacher Categories - Professional Focus */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teacherCategories.map((category) => (
            <Link to={category.path} key={category.id}>
              <motion.div 
                className={`bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full ${category.isRegistration ? 'border-2 border-orange-500' : ''}`}
                whileHover={{ y: -5 }}
              >
                <div className="p-6 flex flex-col items-center text-center h-full">
                  <div className="mb-4">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{category.title}</h3>
                  {category.subtitle && (
                    <h4 className="text-lg font-semibold text-orange-600 mb-1">{category.subtitle}</h4>
                  )}
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  
                  {/* Show subcategories for Professional Teachers */}
                  {category.subcategories && (
                    <div className="mb-4">
                      <div className="flex flex-wrap justify-center gap-2">
                        {category.subcategories.map((subcat, index) => (
                          <span key={index} className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                            {subcat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <motion.button
                    className={`mt-auto w-full py-3 px-4 font-medium rounded-lg transition duration-300 ${
                      category.isRegistration 
                        ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                        : 'bg-orange-100 hover:bg-orange-200 text-orange-700'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {category.isRegistration ? 'Register Now' : 'Explore Teachers'}
                  </motion.button>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Additional Info Section */}
        {/* <div className="mt-12 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Comprehensive Teacher Solutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4">
              <FaSchool className="text-3xl text-orange-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-700">Schools</h3>
              <p className="text-sm text-gray-600">K-12 Curriculum Teachers</p>
            </div>
            <div className="text-center p-4">
              <FaUniversity className="text-3xl text-orange-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-700">Colleges</h3>
              <p className="text-sm text-gray-600">Degree College Professors</p>
            </div>
            <div className="text-center p-4">
              <FaUserGraduate className="text-3xl text-orange-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-700">PU Colleges</h3>
              <p className="text-sm text-gray-600">Pre-University Faculty</p>
            </div>
            <div className="text-center p-4">
              <FaBook className="text-3xl text-orange-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-700">Coaching Centers</h3>
              <p className="text-sm text-gray-600">Specialized Training</p>
            </div>
          </div>
        </div> */}
      </main>

      {/* Filter Modal */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Filter Teachers</h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>

                {/* Institution Type Filter */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Institution Type</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {institutionTypeOptions.map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.institutionType.includes(type)}
                          onChange={() => handleFilterChange('institutionType', type)}
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Experience Range Filter */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Years of Experience</h3>
                  <div className="px-2">
                    <input
                      type="range"
                      min="0"
                      max="20"
                      step="1"
                      value={filters.experience[1]}
                      onChange={(e) => handleFilterChange('experience', [filters.experience[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between mt-2">
                      <span className="text-sm text-gray-600">0 years</span>
                      <span className="text-sm text-gray-600">20+ years</span>
                    </div>
                    <div className="mt-2 text-center font-medium text-orange-600">
                      {filters.experience[0]} - {filters.experience[1]} years
                    </div>
                  </div>
                </div>

                {/* Subject Filter */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Subjects</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {subjectOptions.map((subject) => (
                      <label key={subject} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.subject.includes(subject)}
                          onChange={() => handleFilterChange('subject', subject)}
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-gray-700">{subject}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Qualification Filter */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Qualifications</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {qualificationOptions.map((qualification) => (
                      <label key={qualification} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.qualification.includes(qualification)}
                          onChange={() => handleFilterChange('qualification', qualification)}
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-gray-700">{qualification}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Teaching Mode Filter */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Teaching Mode</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {teachingModeOptions.map((mode) => (
                      <label key={mode} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.teachingMode.includes(mode)}
                          onChange={() => handleFilterChange('teachingMode', mode)}
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-gray-700">{mode}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between border-t pt-4">
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 text-orange-600 font-medium hover:bg-orange-50 rounded-lg"
                  >
                    Reset All
                  </button>
                  <div className="space-x-3">
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={applyFilters}
                      className="px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <StickyButton />
    </div>
  );
}

export default AllTeachers;