import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaChalkboardTeacher, FaSearch, FaFilter, FaBookOpen, FaTimes, FaHome } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { BsFillCalendar2CheckFill } from "react-icons/bs";
import Footer from '../components/Footer';
import StickyButton from '../components/StickyButton';

const listings = [
  {
    category: "Tuition Centers",
    icon: <FaChalkboardTeacher className="text-white" />,
    place: "Bengaluru",
    items: [
      {
        id: 1,
        name: "Brilliant Minds Tutorials",
        location: "Indiranagar",
        fees: "₹1,500 - ₹3,000 per month",
        views: "5.2K Views",
        subjects: "All Subjects",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 2,
        name: "Math & Science Excellence Center",
        location: "Koramangala",
        fees: "₹2,000 - ₹4,000 per month",
        views: "4.8K Views",
        subjects: "Math & Science",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 3,
        name: "Language Learning Hub",
        location: "Whitefield",
        fees: "₹1,800 - ₹3,500 per month",
        views: "3.5K Views",
        subjects: "Languages",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 4,
        name: "Competitive Exam Prep Center",
        location: "Jayanagar",
        fees: "₹2,500 - ₹5,000 per month",
        views: "6.1K Views",
        subjects: "Competitive Exams",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1549861833-c5932fd19229?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
];

function TutionList() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    feesRange: [0, 5000],
    subjects: [],
    classRange: [],
    teachingMode: [],
    location: 'Bengaluru'
  });

  const subjectOptions = ['Math', 'Science', 'English', 'Languages', 'Competitive Exams', 'All Subjects'];
  const classRangeOptions = ['Primary (1-5)', 'Middle (6-8)', 'High (9-10)', 'PUC (11-12)', 'College'];
  const teachingModeOptions = ['Offline', 'Online', 'Hybrid'];

  const nav = useNavigate()

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      if (filterType === 'feesRange') {
        return { ...prev, feesRange: value };
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
      feesRange: [0, 5000],
      subjects: [],
      classRange: [],
      teachingMode: [],
      location: 'Bengaluru'
    });
  };

  const applyFilters = () => {
    console.log('Applied filters:', filters);
    setIsFilterOpen(false);
  };

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

            <div className="md:hidden flex space-x-2">
              <motion.button
                className="bg-white text-orange-600 font-semibold py-2 px-4 rounded-full transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Demo
              </motion.button>
              <motion.button
                className="bg-white text-orange-600 font-semibold py-2 px-4 rounded-full transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaBookOpen />
              </motion.button>
            </div>
          </div>

          <div className="relative w-full max-w-2xl md:max-w-xl flex-grow md:ml-8">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400" />
            <input
              type="text"
              placeholder="Search Tuition Centers, Locations in Bengaluru..."
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
              <span className="text-orange-600">{filters.location}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mt-2">
              Tuition Centers In {filters.location} 2025 - 26
            </h1>
            <p className="text-lg text-gray-600 flex items-center mt-1">
              <BsFillCalendar2CheckFill className="mr-2 text-orange-500" />
              1846 Tuition Centers | List Updated on Aug 1, 2025
            </p>
          </div>
          <motion.button
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300 mt-4 md:mt-0 flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFilterOpen(true)}
          >
            <FaFilter className="mr-2" />
            Filters (8)
          </motion.button>
        </div>

        {/* Section List */}
        {listings.map((section, index) => (
          <div key={index} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="p-2 bg-orange-600 rounded-full mr-3">
                {section.icon}
              </span>
              <span className="ml-2">{section.category} in {section.place}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {section.items.map((item) => (
                <Link
                  to={`/tuition-details`}
                  key={item.id}
                  className="group"
                >
                  <motion.div
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col w-full h-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="relative h-48 w-full overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4 bg-yellow-500 text-dark text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        New Batches Starting
                      </div>
                      <div className="absolute top-4 right-4 flex items-center bg-white/90 text-orange-600 px-3 py-1 rounded-full shadow-lg backdrop-blur-sm">
                        <span className="font-bold mr-1">{item.rating}</span>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-grow h-64">
                      <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide">{item.subjects}</p>
                      <h3 className="text-lg font-bold text-gray-900 mt-1 line-clamp-2 min-h-[4rem]">{item.name}</h3>
                      <p className="text-sm text-gray-500 flex items-center mt-2">
                        <IoLocationSharp className="mr-1 text-orange-400" />
                        <span className="line-clamp-1">{item.location}</span>
                      </p>

                      <div className="mt-3">
                        <p className="text-base font-bold text-gray-700">{item.fees}</p>
                      </div>

                      <div className="mt-auto pt-4">
                        <div className="flex justify-between items-center space-x-2">
                          <motion.button
                            className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium py-2 px-3 rounded-lg w-full transition duration-300"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={(e) => e.preventDefault()}
                          >
                            Enquire Now
                          </motion.button>
                          <motion.button
                            className="bg-transparent border border-orange-600 text-orange-600 hover:bg-orange-50 font-medium rounded-lg w-10 h-10 flex items-center justify-center transition duration-300"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={(e) => e.preventDefault()}
                          >
                            <i className="fas fa-phone-alt"></i>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        ))}
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
                  <h2 className="text-2xl font-bold text-gray-800">Filter Tuition Centers</h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>

                {/* Fees Range Filter */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Fees Range (per month)</h3>
                  <div className="px-2">
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="500"
                      value={filters.feesRange[1]}
                      onChange={(e) => handleFilterChange('feesRange', [filters.feesRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between mt-2">
                      <span className="text-sm text-gray-600">₹0</span>
                      <span className="text-sm text-gray-600">₹5,000+</span>
                    </div>
                    <div className="mt-2 text-center font-medium text-orange-600">
                      ₹{filters.feesRange[0].toLocaleString()} - ₹{filters.feesRange[1].toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Subjects Filter */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Subjects</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {subjectOptions.map((subject) => (
                      <label key={subject} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.subjects.includes(subject)}
                          onChange={() => handleFilterChange('subjects', subject)}
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-gray-700">{subject}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Class Range Filter */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Class Range</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {classRangeOptions.map((classRange) => (
                      <label key={classRange} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.classRange.includes(classRange)}
                          onChange={() => handleFilterChange('classRange', classRange)}
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-gray-700">{classRange}</span>
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
    {/* <Footer/> */}
    <StickyButton/>
    </div>
  );
}

export default TutionList;