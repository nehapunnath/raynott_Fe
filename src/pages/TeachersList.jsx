import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaChalkboardTeacher, FaSearch, FaFilter, FaBookOpen, FaTimes, FaHome, FaStar, FaPhone, FaMapMarkerAlt, FaGraduationCap } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { BsFillCalendar2CheckFill, BsCashStack } from "react-icons/bs";
import StickyButton from '../components/StickyButton';

const teachersData = [
  {
    id: 1,
    name: "Dr. Priya Sharma",
    subjects: ["Mathematics", "Physics"],
    qualification: "PhD in Mathematics, M.Ed",
    experience: "12 years",
    rating: 4.9,
    location: "HSR Layout, Bengaluru",
    fees: "₹800 - ₹1200/hr",
    teachingMode: ["Online", "Offline"],
    image: "https://cdn.eduadvisor.my/articles/2022/04/how-to-be-teacher-malaysia-feature.png",
    demoAvailable: true
  },
  {
    id: 2,
    name: "Prof. Ramesh Kumar",
    subjects: ["Computer Science", "Programming"],
    qualification: "M.Tech (CSE), B.Ed",
    experience: "8 years",
    rating: 4.7,
    location: "Koramangala, Bengaluru",
    fees: "₹600 - ₹1000/hr",
    teachingMode: ["Online"],
    image: "https://static.vecteezy.com/system/resources/thumbnails/048/764/749/small_2x/confident-young-polish-male-teacher-in-classroom-smiling-in-front-of-blackboard-for-education-and-teaching-concepts-photo.jpg",
    demoAvailable: true
  },
  {
    id: 3,
    name: "Ms. Ananya Patel",
    subjects: ["English", "Social Studies"],
    qualification: "MA English, B.Ed",
    experience: "5 years",
    rating: 4.8,
    location: "Indiranagar, Bengaluru",
    fees: "₹500 - ₹900/hr",
    teachingMode: ["Offline"],
    image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    demoAvailable: false
  },
  {
    id: 4,
    name: "Mr. Arjun Singh",
    subjects: ["Chemistry", "Biology"],
    qualification: "M.Sc Chemistry, B.Ed",
    experience: "6 years",
    rating: 4.6,
    location: "Whitefield, Bengaluru",
    fees: "₹700 - ₹1100/hr",
    teachingMode: ["Online", "Offline"],
    image: "https://static.vecteezy.com/system/resources/thumbnails/048/764/549/small_2x/confident-middleaged-male-school-teacher-middle-eastern-descent-smiling-in-classroom-ideal-for-educational-professional-and-cultural-diversity-themes-photo.jpg",
    demoAvailable: true
  },
  {
    id: 5,
    name: "Ms. Deepika Reddy",
    subjects: ["Economics", "Business Studies"],
    qualification: "MA Economics, M.Ed",
    experience: "10 years",
    rating: 4.9,
    location: "Jayanagar, Bengaluru",
    fees: "₹900 - ₹1500/hr",
    teachingMode: ["Online"],
    image: "https://wpvip.edutopia.org/wp-content/uploads/2022/10/alber-169hero-thelook-shutterstock_0.jpg?w=2880&quality=85",
    demoAvailable: true
  },
  {
    id: 6,
    name: "Mr. Vikram Joshi",
    subjects: ["Physics", "Mathematics"],
    qualification: "M.Sc Physics, B.Ed",
    experience: "7 years",
    rating: 4.7,
    location: "Marathahalli, Bengaluru",
    fees: "₹750 - ₹1200/hr",
    teachingMode: ["Offline"],
    image: "https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/file-uploads/blogs/2147503633/images/22af86c-42bc-03d2-6141-0b8b1fb4b60_AdobeStock_104938952.jpeg",
    demoAvailable: false
  },
];

function TeachersList() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    subjects: [],
    experience: [0, 20],
    qualification: [],
    teachingMode: [],
    minRating: 0,
    location: 'Bengaluru'
  });
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const subjectOptions = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science', 'Economics', 'Business Studies', 'Social Studies'];
  const qualificationOptions = ['B.Ed', 'M.Ed', 'PhD', 'Post Graduate', 'Graduate'];
  const teachingModeOptions = ['Online', 'Offline'];
  const ratingOptions = [4.5, 4.0, 3.5, 3.0];

  const nav = useNavigate();

  useEffect(() => {
    if (location.state?.category) {
      setSelectedCategory(location.state.category);
    }
    window.scrollTo(0, 0);
  }, [location]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      if (filterType === 'experience' || filterType === 'minRating') {
        return { ...prev, [filterType]: value };
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
      subjects: [],
      experience: [0, 20],
      qualification: [],
      teachingMode: [],
      minRating: 0,
      location: 'Bengaluru'
    });
  };

  const applyFilters = () => {
    console.log('Applied filters:', filters);
    setIsFilterOpen(false);
  };

  const filteredTeachers = teachersData.filter(teacher => {
    // Filter by search query
    if (searchQuery && !teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !teacher.subjects.some(sub => sub.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    
    // Filter by selected category if exists
    if (selectedCategory && !teacher.subjects.includes(selectedCategory)) {
      return false;
    }
    
    // Filter by subjects
    if (filters.subjects.length > 0 && !filters.subjects.some(sub => teacher.subjects.includes(sub))) {
      return false;
    }
    
    // Filter by experience
    const expYears = parseInt(teacher.experience);
    if (expYears < filters.experience[0] || expYears > filters.experience[1]) {
      return false;
    }
    
    // Filter by qualification
    if (filters.qualification.length > 0 && !filters.qualification.includes(teacher.qualification.split(',')[1].trim())) {
      return false;
    }
    
    // Filter by teaching mode
    if (filters.teachingMode.length > 0 && !filters.teachingMode.some(mode => teacher.teachingMode.includes(mode))) {
      return false;
    }
    
    // Filter by rating
    if (teacher.rating < filters.minRating) {
      return false;
    }
    
    return true;
  });

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
              placeholder="Search teachers, subjects..."
              className="pl-12 pr-4 py-3 rounded-full bg-white border border-transparent text-gray-800 focus:outline-none w-full focus:ring-2 focus:ring-orange-200 focus:border-transparent shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
              <Link to="/all-teachers" className="hover:text-orange-600">Teachers</Link>
              <span className="mx-2">»</span>
              <span className="text-orange-600">
                {selectedCategory || 'All Teachers'}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mt-2">
              {selectedCategory ? `${selectedCategory} Teachers` : 'Find the Best Teachers'}
            </h1>
            <p className="text-lg text-gray-600 flex items-center mt-1">
              <BsFillCalendar2CheckFill className="mr-2 text-orange-500" />
              {filteredTeachers.length} Teachers Available | Updated on Aug 1, 2025
            </p>
          </div>
          <motion.button
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300 mt-4 md:mt-0 flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFilterOpen(true)}
          >
            <FaFilter className="mr-2" />
            Filters
          </motion.button>
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <Link
              to={`/teachers-details`}
                  key={teacher.id}
                  className="group"
            >
            <motion.div
              key={teacher.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={teacher.image}
                  alt={teacher.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                {teacher.demoAvailable && (
                  <div className="absolute top-4 left-4 bg-yellow-500 text-dark text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    Demo Available
                  </div>
                )}
                <div className="absolute top-4 right-4 flex items-center bg-white/90 text-orange-600 px-3 py-1 rounded-full shadow-lg backdrop-blur-sm">
                  <span className="font-bold mr-1">{teacher.rating}</span>
                  <FaStar className="w-4 h-4 fill-current" />
                </div>
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900">{teacher.name}</h3>
                <p className="text-sm text-orange-600 font-medium mt-1">
                  {teacher.qualification}
                </p>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  {teacher.subjects.map((subject, index) => (
                    <span key={index} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                      {subject}
                    </span>
                  ))}
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <FaGraduationCap className="mr-2 text-orange-500" />
                    <span>{teacher.experience} experience</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <IoLocationSharp className="mr-2 text-orange-500" />
                    <span>{teacher.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <BsCashStack className="mr-2 text-orange-500" />
                    <span>{teacher.fees}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FaChalkboardTeacher className="mr-2 text-orange-500" />
                    <span>{teacher.teachingMode.join(', ')}</span>
                  </div>
                </div>

                <div className="mt-auto pt-4">
                  <div className="flex justify-between items-center space-x-2">
                    <motion.button
                      className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium py-2 px-3 rounded-lg w-full transition duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      View Profile
                    </motion.button>
                    <motion.button
                      className="bg-transparent border border-orange-600 text-orange-600 hover:bg-orange-50 font-medium rounded-lg w-10 h-10 flex items-center justify-center transition duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaPhone />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
            </Link>
            
          ))}
        </div>

        {filteredTeachers.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No teachers found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or search query</p>
            <button
              onClick={resetFilters}
              className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
            >
              Reset Filters
            </button>
          </div>
        )}
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

                {/* Minimum Rating Filter */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Minimum Rating</h3>
                  <div className="flex flex-wrap gap-3">
                    {[0, 3, 3.5, 4, 4.5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => handleFilterChange('minRating', rating)}
                        className={`px-4 py-2 rounded-full ${filters.minRating === rating ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        {rating === 0 ? 'Any' : `${rating}+`}
                      </button>
                    ))}
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

export default TeachersList;