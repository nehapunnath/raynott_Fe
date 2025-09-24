// TeachersList.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaSearch, FaFilter, FaTimes, FaHome, FaStar, FaPhone, FaMapMarkerAlt, FaGraduationCap, FaChalkboardTeacher, FaUniversity, FaUserTie } from "react-icons/fa";
import { BsCashStack, BsFillCalendar2CheckFill } from "react-icons/bs";
import StickyButton from '../components/StickyButton';
import { teacherApi } from '../services/TeacherApi';

// Fallback static data for debugging
const fallbackTeachers = {
  professional: [
    {
      id: '1',
      name: 'Dr. Priya Sharma',
      institutionType: 'School',
      subjects: 'Mathematics,Physics',
      qualification: 'PhD in Mathematics, M.Ed',
      experience: '12 years',
      city: 'Bengaluru',
      hourlyRate: '₹800 - ₹1200/hr',
      teachingMode: 'Both',
      profileImage: 'https://cdn.eduadvisor.my/articles/2022/04/how-to-be-teacher-malaysia-feature.png',
      demoFee: 'Free',
      rating: 4.9
    },
    {
      id: '2',
      name: 'Prof. Ramesh Kumar',
      institutionType: 'College',
      subjects: 'Computer Science,Programming',
      qualification: 'M.Tech (CSE), B.Ed',
      experience: '8 years',
      city: 'Bengaluru',
      hourlyRate: '₹600 - ₹1000/hr',
      teachingMode: 'Online',
      profileImage: 'https://static.vecteezy.com/system/resources/thumbnails/048/764/749/small_2x/confident-young-polish-male-teacher-in-classroom-smiling-in-front-of-blackboard-for-education-and-teaching-concepts-photo.jpg',
      demoFee: 'Free',
      rating: 4.7
    },
    {
      id: '3',
      name: 'Ms. Anjali Patel',
      institutionType: 'PU College',
      subjects: 'Biology,Chemistry',
      qualification: 'M.Sc, B.Ed',
      experience: '6 years',
      city: 'Bengaluru',
      hourlyRate: '₹700 - ₹1100/hr',
      teachingMode: 'Offline',
      profileImage: 'https://img.freepik.com/free-photo/portrait-female-teacher-holding-book_23-2148201873.jpg',
      demoFee: '₹200',
      rating: 4.8
    }
  ],
  personal: [
    {
      id: '4',
      name: 'Mr. Vikram Singh',
      institutionType: 'Personal Mentor',
      subjects: 'Mathematics,Physics,Career Guidance',
      qualification: 'M.Tech, Industry Expert',
      experience: '15 years',
      city: 'Bengaluru',
      hourlyRate: '₹1000 - ₹1500/hr',
      teachingMode: 'Both',
      profileImage: 'https://img.freepik.com/free-photo/portrait-successful-man-suit_1262-14624.jpg',
      demoFee: 'Free',
      rating: 4.9,
      specialization: 'Career Mentoring'
    },
    {
      id: '5',
      name: 'Dr. Meera Nair',
      institutionType: 'Personal Mentor',
      subjects: 'Psychology,Study Techniques',
      qualification: 'PhD in Psychology',
      experience: '10 years',
      city: 'Bengaluru',
      hourlyRate: '₹1200 - ₹1800/hr',
      teachingMode: 'Online',
      profileImage: 'https://img.freepik.com/free-photo/portrait-beautiful-young-woman-standing-grey-wall_231208-10760.jpg',
      demoFee: 'Free',
      rating: 4.8,
      specialization: 'Learning Strategies'
    }
  ]
};

function TeachersList() {
  const [searchParams] = useSearchParams();
  const institutionTypeFromQuery = searchParams.get('institutionType')?.split(',').map(type => type.trim()) || [];
  const [teachers, setTeachers] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    subjects: [],
    experience: [0, 20],
    qualification: [],
    teachingMode: [],
    minRating: 0,
    location: 'Bengaluru',
    institutionType: institutionTypeFromQuery,
    specialization: [] // Added for Personal Mentors
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const subjectOptions = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science', 'Economics', 'Business Studies', 'Social Studies', 'Languages', 'Commerce', 'Arts'];
  const qualificationOptions = ['B.Ed', 'M.Ed', 'PhD', 'Post Graduate', 'Graduate', 'M.Sc', 'M.A', 'B.Sc', 'B.A'];
  const teachingModeOptions = ['Online', 'Offline', 'Both'];
  const ratingOptions = [0, 3, 3.5, 4, 4.5];
  const institutionTypeOptions = ['School', 'College', 'PU College', 'Coaching Institute', 'Personal Mentor'];
  const specializationOptions = ['Career Mentoring', 'Learning Strategies', 'Exam Preparation', 'Skill Development']; // Example specializations

  const professionalTypes = ['School', 'College', 'PU College', 'Coaching Institute'];
  const personalTypes = ['Personal Mentor'];

  const nav = useNavigate();

  const isProfessionalView = institutionTypeFromQuery.some(type => professionalTypes.includes(type));
  const isPersonalView = institutionTypeFromQuery.some(type => personalTypes.includes(type));

  useEffect(() => {
    console.log('Current searchParams:', searchParams.toString());
    console.log('Initial institutionType:', institutionTypeFromQuery);
    setFilters(prev => ({ ...prev, institutionType: institutionTypeFromQuery }));
    fetchTeachers({ ...filters, institutionType: institutionTypeFromQuery });
    window.scrollTo(0, 0);
  }, [searchParams]);

  const fetchTeachers = async (filterParams) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching teachers with filters:', filterParams);

      // For demo purposes, use fallback data (comment out in production)
      let teachersData = [];
      if (filterParams.institutionType.some(type => professionalTypes.includes(type))) {
        teachersData = fallbackTeachers.professional.filter(teacher =>
          filterParams.institutionType.includes(teacher.institutionType)
        );
      } else if (filterParams.institutionType.some(type => personalTypes.includes(type))) {
        teachersData = fallbackTeachers.personal.filter(teacher =>
          filterParams.institutionType.includes(teacher.institutionType)
        );
      } else {
        teachersData = [...fallbackTeachers.professional, ...fallbackTeachers.personal];
      }

      // Apply additional filters on fallback data
      teachersData = teachersData.filter(teacher => {
        let include = true;
        if (filterParams.subjects.length > 0 && teacher.subjects) {
          include = filterParams.subjects.some(subject =>
            teacher.subjects.toLowerCase().includes(subject.toLowerCase())
          );
        }
        if (filterParams.qualification.length > 0 && teacher.qualification) {
          include = include && filterParams.qualification.some(qual =>
            teacher.qualification.toLowerCase().includes(qual.toLowerCase())
          );
        }
        if (filterParams.teachingMode.length > 0 && teacher.teachingMode) {
          include = include && filterParams.teachingMode.includes(teacher.teachingMode);
        }
        if (filterParams.minRating !== 0 && teacher.rating) {
          include = include && teacher.rating >= filterParams.minRating;
        }
        if (filterParams.experience[1] !== 20 && teacher.experience) {
          const exp = parseInt(teacher.experience.replace(/[^0-9]+/g, '')) || 0;
          include = include && exp <= filterParams.experience[1];
        }
        if (filterParams.specialization.length > 0 && teacher.specialization) {
          include = include && filterParams.specialization.includes(teacher.specialization);
        }
        return include;
      });

      setTeachers(teachersData);
      setLoading(false);

      // Uncomment below to use actual API in production
      /*
      const token = localStorage.getItem('adminToken');
      console.log('Authorization token:', token ? 'Present' : 'Missing');

      const query = {
        city: filterParams.location || undefined,
        subjects: filterParams.subjects.join(',') || undefined,
        qualification: filterParams.qualification.join(',') || undefined,
        teachingMode: filterParams.teachingMode.join(',') || undefined,
        maxExperience: filterParams.experience[1] !== 20 ? filterParams.experience[1] : undefined,
        minRating: filterParams.minRating !== 0 ? filterParams.minRating : undefined,
        institutionType: filterParams.institutionType.join(',') || undefined,
        specialization: filterParams.specialization.join(',') || undefined
      };

      console.log('API query params:', query);

      const response = await teacherApi.getTeachersWithFilters(query);
      console.log('Teachers API response:', response);

      if (response.success && response.data) {
        const teachersData = Array.isArray(response.data)
          ? response.data
          : Object.values(response.data);
        console.log('Processed teachers data:', teachersData);
        setTeachers(teachersData);
      } else {
        console.log('No teachers found in response');
        setTeachers([]);
      }
      setLoading(false);
      */
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load teachers');
      setTeachers([]);
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      if (filterType === 'experience') {
        return { ...prev, [filterType]: [prev.experience[0], parseInt(value)] };
      } else if (filterType === 'minRating') {
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
    const resetFilters = {
      subjects: [],
      experience: [0, 20],
      qualification: [],
      teachingMode: [],
      minRating: 0,
      location: 'Bengaluru',
      institutionType: institutionTypeFromQuery,
      specialization: []
    };
    setFilters(resetFilters);
    console.log('Reset filters:', resetFilters);
    fetchTeachers(resetFilters);
  };

  const applyFilters = () => {
    console.log('Applying filters:', filters);
    const queryParams = new URLSearchParams();
    if (filters.subjects.length > 0) queryParams.set('subjects', filters.subjects.join(','));
    if (filters.qualification.length > 0) queryParams.set('qualification', filters.qualification.join(','));
    if (filters.experience[1] !== 20) queryParams.set('maxExperience', filters.experience[1]);
    if (filters.minRating !== 0) queryParams.set('minRating', filters.minRating);
    if (filters.location) queryParams.set('city', filters.location);
    if (filters.teachingMode.length > 0) queryParams.set('teachingMode', filters.teachingMode.join(','));
    if (filters.institutionType.length > 0) queryParams.set('institutionType', filters.institutionType.join(','));
    if (filters.specialization.length > 0) queryParams.set('specialization', filters.specialization.join(','));
    nav(`/teachers?${queryParams.toString()}`);
    fetchTeachers(filters);
    setIsFilterOpen(false);
  };

  const filteredTeachers = teachers.filter(teacher => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      teacher.name?.toLowerCase().includes(searchLower) ||
      teacher.subjects?.toLowerCase().includes(searchLower) ||
      teacher.specialization?.toLowerCase().includes(searchLower)
    );
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
              placeholder={`Search ${isProfessionalView ? 'professional teachers' : isPersonalView ? 'personal mentors' : 'teachers'} in ${filters.location}...`}
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
                {isProfessionalView ? 'Professional Teachers' : 
                 isPersonalView ? 'Personal Mentors' : 'All Teachers'}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mt-2 flex items-center">
              {isProfessionalView ? (
                <>
                  <FaUniversity className="mr-3 text-orange-500" />
                  Professional Teachers
                </>
              ) : isPersonalView ? (
                <>
                  <FaUserTie className="mr-3 text-orange-500" />
                  Personal Mentors
                </>
              ) : (
                'Find the Best Teachers'
              )}
            </h1>
            <p className="text-lg text-gray-600 flex items-center mt-1">
              <BsFillCalendar2CheckFill className="mr-2 text-orange-500" />
              {filteredTeachers.length} {isProfessionalView ? 'Professional Teachers' : 
                                       isPersonalView ? 'Personal Mentors' : 'Teachers'} Available | Updated on Sep 24, 2025
            </p>
          </div>
          <motion.button
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300 mt-4 md:mt-0 flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFilterOpen(true)}
          >
            <FaFilter className="mr-2" />
            Filters ({filters.subjects.length + filters.qualification.length + filters.teachingMode.length + filters.institutionType.length + filters.specialization.length})
          </motion.button>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600">Loading {isProfessionalView ? 'professional teachers' : isPersonalView ? 'personal mentors' : 'teachers'}...</p>
          </div>
        )}
        {error && (
          <div className="text-center py-8">
            <p className="text-lg text-red-600">{error}</p>
            <button
              onClick={() => fetchTeachers(filters)}
              className="mt-4 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
            >
              Retry
            </button>
          </div>
        )}

        {/* Teachers List */}
        {!loading && !error && filteredTeachers.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="p-2 bg-orange-600 rounded-full mr-3">
                <FaChalkboardTeacher className="text-white" />
              </span>
              <span>
                {isProfessionalView ? 'Professional Teachers in ' : 
                 isPersonalView ? 'Personal Mentors in ' : 'Teachers in '}
                {filters.location}
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeachers.map((teacher) => (
                <Link
                  to={`/teachers-details/${teacher.id}`}
                  key={teacher.id}
                  className="group"
                >
                  <motion.div
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="relative h-48 w-full overflow-hidden">
                      <img
                        src={teacher.profileImage || 'https://via.placeholder.com/150'}
                        alt={teacher.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* {teacher.demoFee?.toLowerCase() === 'free' && (
                        <div className="absolute top-4 left-4 bg-yellow-500 text-dark text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          Free Demo
                        </div>
                      )} */}
                      {/* <div className="absolute top-4 right-4 flex items-center bg-white/90 text-orange-600 px-3 py-1 rounded-full shadow-lg backdrop-blur-sm">
                        <span className="font-bold mr-1">{teacher.rating || 'N/A'}</span>
                        <FaStar className="w-4 h-4 fill-current" />
                      </div> */}
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide">
                        {teacher.institutionType || 'N/A'}
                        {teacher.specialization && ` • ${teacher.specialization}`}
                      </p>
                      <h3 className="text-lg font-bold text-gray-900 mt-1 line-clamp-2">{teacher.name}</h3>
                      <p className="text-sm text-gray-500 flex items-center mt-2">
                        <FaMapMarkerAlt className="mr-1 text-orange-400" />
                        <span className="line-clamp-1">{teacher.city}</span>
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {teacher.subjects?.split(',').map((subject, index) => (
                          <span key={index} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                            {subject.trim()}
                          </span>
                        ))}
                      </div>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <FaGraduationCap className="mr-2 text-orange-500" />
                          <span>{teacher.qualification}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <BsFillCalendar2CheckFill className="mr-2 text-orange-500" />
                          <span>{teacher.experience} experience</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <BsCashStack className="mr-2 text-orange-500" />
                          <span>{teacher.hourlyRate || 'N/A'}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FaChalkboardTeacher className="mr-2 text-orange-500" />
                          <span>{teacher.teachingMode}</span>
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
          </div>
        )}
        {!loading && !error && filteredTeachers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600">
              No {isProfessionalView ? 'professional teachers' : isPersonalView ? 'personal mentors' : 'teachers'} found in {filters.location}.
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
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
                  <h2 className="text-2xl font-bold text-gray-800">Filter {isProfessionalView ? 'Professional Teachers' : isPersonalView ? 'Personal Mentors' : 'Teachers'}</h2>
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

                {/* Minimum Rating Filter */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Minimum Rating</h3>
                  <div className="flex flex-wrap gap-3">
                    {ratingOptions.map((rating) => (
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

                {/* Specialization Filter (for Personal Mentors) */}
                {isPersonalView && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-700">Specialization</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {specializationOptions.map((specialization) => (
                        <label key={specialization} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.specialization.includes(specialization)}
                            onChange={() => handleFilterChange('specialization', specialization)}
                            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-gray-700">{specialization}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

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