import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Location from '../components/Location';
import '../styles/Home.css';
import Categories from '../components/Categories';
import { FaMapMarkerAlt, FaChalkboardTeacher, FaFileAlt, FaGraduationCap } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Schools from '../components/Schools';
import Colleges from '../components/Colleges';
import PuCollege from '../components/PuCollege';
import TuitionCoaching from '../components/CoachingCenter';
import Teachers from '../components/Teachers';
import About from '../components/About';
import Footer from '../components/Footer';
import StickyButton from '../components/StickyButton';
import { schoolApi } from '../services/schoolApi';
import { collegeApi } from '../services/collegeApi';
import {puCollegeApi  } from '../services/pucollegeApi';
import  { TuitionCoachingApi } from '../services/TuitionCoachingApi';
import { teacherApi } from '../services/TeacherApi';

function Home() {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState('Bangalore');
  const [category, setCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  const services = [
    {
      title: "Service In All India",
      description: "Raynott offers nationwide services, connecting students and parents with institutions across every major city and region in India.",
      icon: <FaMapMarkerAlt className="text-4xl group-hover:scale-110 transition-all duration-500" />,
      border: "border-gradient-to-r from-amber-500 to-orange-600",
      bg: "bg-gradient-to-br from-amber-50 to-orange-50",
      iconBg: "bg-gradient-to-r from-amber-400 to-orange-500",
      textColor: "text-amber-700"
    },
    {
      title: "All Boards / Type Of Courses",
      description: "Raynott features institutions offering CBSE, ICSE, IB, State Boards, and more — helping you explore diverse curricula and educational paths.",
      icon: <FaFileAlt className="text-4xl group-hover:scale-110 transition-all duration-500" />,
      border: "border-gradient-to-r from-teal-500 to-emerald-600",
      bg: "bg-gradient-to-br from-teal-50 to-emerald-50",
      iconBg: "bg-gradient-to-r from-teal-400 to-emerald-500",
      textColor: "text-teal-700"
    },
    {
      title: "Dedicated Counselling Team",
      description: "Our expert counsellors at Raynott guide you with personalized, unbiased advice to help you find the right institution for your child's future.",
      icon: <FaChalkboardTeacher className="text-4xl group-hover:scale-110 transition-all duration-500" />,
      border: "border-gradient-to-r from-blue-500 to-indigo-600",
      bg: "bg-gradient-to-br from-blue-50 to-indigo-50",
      iconBg: "bg-gradient-to-r from-blue-400 to-indigo-500",
      textColor: "text-blue-700"
    },
    {
      title: "Day School To University",
      description: "Raynott supports your educational journey from day school to higher education with listings that include day schools, boarding, and universities.",
      icon: <FaGraduationCap className="text-4xl group-hover:scale-110 transition-all duration-500" />,
      border: "border-gradient-to-r from-purple-500 to-fuchsia-600",
      bg: "bg-gradient-to-br from-purple-50 to-fuchsia-50",
      iconBg: "bg-gradient-to-r from-purple-400 to-fuchsia-500",
      textColor: "text-purple-700"
    },
  ];

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setShowDropdown(false);
    setSearchResults([]);
  };

  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
    setShowDropdown(false);
    setSearchResults([]);
  };

  const handleSearch = async () => {
    if (!category || !searchQuery) {
      alert('Please select a category and enter a search query.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      let response;

      switch (category) {
        case 'Schools':
          response = await schoolApi.getSchools({ city: searchQuery, name: searchQuery });
          setSearchResults(response.data ? Object.values(response.data) : []);
          break;
        case 'College':
          response = await collegeApi.getColleges({ city: searchQuery, name: searchQuery });
          setSearchResults(response.data ? Object.values(response.data) : []);
          break;
        case 'PU College':
          response = await puCollegeApi.getPuColleges({ city: searchQuery, name: searchQuery });
          setSearchResults(response.data ? Object.values(response.data) : []);
          break;
        case 'Coaching/Tuition Center':
          response = await TuitionCoachingApi.getTuitionCoaching({ city: searchQuery, name: searchQuery });
          setSearchResults(response.data ? Object.values(response.data) : []);
          break;
        case 'Teachers':
          const [profResponse, mentorResponse] = await Promise.all([
            teacherApi.searchProfessionalTeachersByName(searchQuery, { city: searchQuery }),
            teacherApi.searchPersonalMentorsByName(searchQuery, { city: searchQuery }),
          ]);
          const profTeachers = profResponse.data ? Object.values(profResponse.data) : [];
          const mentors = mentorResponse.data ? Object.values(mentorResponse.data) : [];
          setSearchResults([...profTeachers, ...mentors]);
          break;
        default:
          setSearchResults([]);
      }
      setShowDropdown(true);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setShowDropdown(false);
    }
  };

  const handleResultClick = (item) => {
    setShowDropdown(false);
    setSearchResults([]);
    switch (category) {
      case 'Schools':
        navigate(`/school-details/${item.id}`);
        break;
      case 'College':
        navigate(`/college-details/${item.id}`);
        break;
      case 'PU College':
        navigate(`/pucollege-details/${item.id}`);
        break;
      case 'Coaching/Tuition Center':
        navigate(`/tuitioncoaching-details/${item.id}`);
        break;
      case 'Teachers':
        if (['School', 'College', 'PU College', 'Coaching Institute'].includes(item.institutionType)) {
          navigate(`/professional-teacher-details/${item.id}`);
        } else {
          navigate(`/personal-mentor-details/${item.id}`);
        }
        break;
      default:
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-gradient-to-b from-amber-50 to-blue-50 relative">
      <Header />

      {/* Scrolling Announcement */}
      <div className="w-full overflow-hidden bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 py-4 shadow-xl bg-[length:200%_auto] animate-gradient-x">
        <div className="whitespace-nowrap animate-marquee text-white text-lg md:text-xl font-extrabold tracking-wide">
          🎓 Admissions Open for 2025 – Apply Now! &nbsp;&nbsp;&nbsp; 📢 New Coaching Centers Launched in Your City &nbsp;&nbsp;&nbsp; 🏫 Explore Top Schools, Colleges & Tuitions Near You!
        </div>
      </div>

      {/* Hero Banner */}
      <div
        className="w-full h-[60vh] md:h-[70vh] bg-cover bg-center flex flex-col justify-center items-center text-white text-center px-8 relative overflow-hidden"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1500&q=80)',
        }}
      >
        <motion.h1
          className="text-5xl md:text-8xl font-extrabold mb-6 relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500"
          style={{ fontFamily: 'Fredoka, sans-serif' }}
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        >
          Raynott
        </motion.h1>

        <motion.p
          className="text-xl md:text-3xl font-semibold relative z-10 max-w-3xl bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-orange-200"
          style={{ fontFamily: 'Poppins, sans-serif' }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1.4, ease: "easeOut" }}
        >
          Your Gateway to the Perfect Educational Journey
        </motion.p>

        <motion.div
          className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-amber-50 to-transparent z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        />
        <motion.div
          className="mb-2 mt-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <button
            onClick={() => navigate('/register')}
            className="bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:from-orange-600 hover:to-amber-700 transition-all duration-300 hover:shadow-xl"
          >
            Register Now
          </button>
        </motion.div>
      </div>

      {/* Search Bar Container */}
      <div className="flex flex-col items-center px-8 relative z-30 -mt-8">
        {/* Search Bar */}
        <motion.div
          className="bg-white shadow-2xl rounded-3xl flex items-center w-full max-w-4xl overflow-hidden border-4 border-orange-500 hover:shadow-3xl transition-all duration-500"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          {/* Category Dropdown */}
          <div className="pl-6 pr-3 py-3">
            <label className="text-xs font-extrabold text-gray-700 block mb-1 uppercase tracking-widest">
              Category <span className="text-orange-500 text-sm">ⓘ</span>
            </label>
            <select
              value={category}
              onChange={handleCategoryChange}
              className="bg-transparent font-bold text-gray-800 focus:outline-none text-sm hover:text-orange-500 transition-colors duration-300"
            >
              <option value="">Select</option>
              <option value="Schools">Schools</option>
              <option value="College">College</option>
              <option value="PU College">PU College</option>
              <option value="Coaching/Tuition Center">Coaching/Tuition Center</option>
              <option value="Teachers">Teachers</option>
            </select>
          </div>
          <div className="h-8 border-l-2 border-orange-300 mx-3"></div>

          {/* Search Input */}
          <div className="flex-1 px-3 py-3">
            <label className="text-xs font-extrabold text-gray-700 block mb-1 uppercase tracking-widest">
              Location or Name <span className="text-orange-500 text-sm">ⓘ</span>
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInput}
              placeholder="Enter name or location"
              className="w-full bg-transparent text-gray-800 focus:outline-none placeholder-gray-500 text-sm"
            />
          </div>

          {/* Search Button */}
          <motion.button
            onClick={handleSearch}
            className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 transition-all p-3 rounded-2xl mr-3 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M12.9 14.32a8 8 0 111.41-1.41l4.3 4.3a1 1 0 01-1.42 1.42l-4.3-4.3zM8 14a6 6 0 100-12 6 6 0 000 12z"
                clipRule="evenodd"
              />
            </svg>
            <span className="ml-2 text-white font-bold hidden md:inline">Search</span>
          </motion.button>
        </motion.div>

        {/* Search Results Dropdown */}
        {showDropdown && (
          <motion.div
            ref={dropdownRef}
            className="absolute top-full mt-2 w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-orange-200 max-h-96 overflow-y-auto z-40"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {loading && (
              <div className="p-4 text-center text-gray-600">Loading results...</div>
            )}

            {error && (
              <div className="p-4 text-center text-red-600">Error: {error}</div>
            )}

            {!loading && !error && searchResults.length === 0 && (
              <div className="p-4 text-center text-gray-600">
                No results found for "{searchQuery}" in {category}
              </div>
            )}

            {!loading && !error && searchResults.length > 0 && (
              <div className="divide-y divide-gray-200">
                {searchResults.map((item) => (
                  <motion.div
                    key={item.id}
                    onClick={() => handleResultClick(item)}
                    className="p-4 flex items-center gap-4 hover:bg-orange-50 cursor-pointer transition-colors duration-200"
                    whileHover={{ backgroundColor: '#fff7ed' }}
                  >
                    {/* <img
                      src={category === 'Teachers' ? item.profileImage : item.image || 'https://via.placeholder.com/100'}
                      alt={item.name}
                      className="w-12 h-12 rounded-full object-cover"
                    /> */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        {category === 'Teachers' ? item.subjects.split(',')[0] : item.city}
                      </p>
                      {/* <p className="text-xs text-gray-500">
                        {category === 'Teachers' ? item.experience : item.board || item.type || 'N/A'}
                      </p> */}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      <Location onCitySelect={setSelectedCity} />
      <Categories />

      {/* Additional Services */}
      <div className="max-w-screen-xl mx-auto px-8 py-12 bg-gradient-to-br from-white to-amber-50 rounded-3xl shadow-2xl mt-12 border border-orange-100">
        <h2 className="text-4xl font-extrabold mb-8 pb-4 inline-block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600 tracking-tight">
          Additional Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              className={`group rounded-3xl p-6 ${service.bg} flex gap-4 items-start shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.3, duration: 1 }}
            >
              <div className={`${service.iconBg} p-3 rounded-xl text-white shadow-md`}>
                {service.icon}
              </div>
              <div className="relative z-10">
                <h3 className={`font-extrabold text-xl mb-2 ${service.textColor}`}>{service.title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Schools selectedCity={selectedCity} />
      <Colleges selectedCity={selectedCity} />
      <PuCollege selectedCity={selectedCity} />
      <TuitionCoaching selectedCity={selectedCity} />
      <Teachers selectedCity={selectedCity} />
      <About />

      {/* Stats Section */}
      <div className="relative py-20 overflow-hidden bg-gradient-to-br from-orange-500 to-amber-600">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-10 w-40 h-40 bg-white rounded-full mix-blend-overlay"></div>
          <div className="absolute bottom-10 right-20 w-60 h-60 bg-white rounded-full mix-blend-overlay"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="text-6xl font-extrabold mb-3 text-white drop-shadow-lg group-hover:text-amber-100 transition-colors duration-300">
                2500+
              </div>
              <div className="text-xl font-medium text-amber-100 tracking-wide">
                Schools
              </div>
              <div className="mt-4 h-1 w-16 bg-amber-300 rounded-full group-hover:w-24 transition-all duration-500"></div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="text-6xl font-extrabold mb-3 text-white drop-shadow-lg group-hover:text-amber-100 transition-colors duration-300">
                20K+
              </div>
              <div className="text-xl font-medium text-amber-100 tracking-wide">
                Schools Viewed
              </div>
              <div className="mt-4 h-1 w-16 bg-amber-300 rounded-full group-hover:w-24 transition-all duration-500"></div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="text-6xl font-extrabold mb-3 text-white drop-shadow-lg group-hover:text-amber-100 transition-colors duration-300">
                1L+
              </div>
              <div className="text-xl font-medium text-amber-100 tracking-wide">
                Parents Served
              </div>
              <div className="mt-4 h-1 w-16 bg-amber-300 rounded-full group-hover:w-24 transition-all duration-500"></div>
            </div>
          </div>
        </div>
      </div>
      <StickyButton />
    </div>
  );
}

export default Home;