import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; 
import Header from '../components/Header';
import Location from '../components/Location';
import '../styles/Home.css';
import Categories from '../components/Categories';
import { FaMapMarkerAlt, FaChalkboardTeacher, FaFileAlt, FaGraduationCap ,FaEye,FaSchool,FaUsers} from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Schools from '../components/Schools';
import Colleges from '../components/Colleges';
import PuCollege from '../components/PuCollege';
import CoachingCenter from '../components/CoachingCenter';
import About from '../components/About';
import Tuition from '../components/Tuition';
import Footer from '../components/Footer';
import StickyButton from '../components/StickyButton';


function Home() {
    const navigate = useNavigate(); 

    const services = [
        {
            title: "Pan India Presence",
            description: "With a presence across most of the cities in India, Edustoke has listed schools spread across the length and breadth of the country.",
            icon: <FaMapMarkerAlt className="text-4xl group-hover:scale-110 transition-all duration-500" />,
            border: "border-gradient-to-r from-amber-500 to-orange-600",
            bg: "bg-gradient-to-br from-amber-50 to-orange-50",
            iconBg: "bg-gradient-to-r from-amber-400 to-orange-500",
            textColor: "text-amber-700"
        },
        {
            title: "All Boards",
            description: "Be it CBSE, ICSE, IB or state boards, Edustoke has listed schools with their diverse approaches and curriculum for parents to choose.",
            icon: <FaFileAlt className="text-4xl group-hover:scale-110 transition-all duration-500" />,
            border: "border-gradient-to-r from-teal-500 to-emerald-600",
            bg: "bg-gradient-to-br from-teal-50 to-emerald-50",
            iconBg: "bg-gradient-to-r from-teal-400 to-emerald-500",
            textColor: "text-teal-700"
        },
        {
            title: "Counselling Team",
            description: "Our dedicated team of expert counsellors listen to you and comprehend your need and suggest to you unbiased options that suit your requirement.",
            icon: <FaChalkboardTeacher className="text-4xl group-hover:scale-110 transition-all duration-500" />,
            border: "border-gradient-to-r from-blue-500 to-indigo-600",
            bg: "bg-gradient-to-br from-blue-50 to-indigo-50",
            iconBg: "bg-gradient-to-r from-blue-400 to-indigo-500",
            textColor: "text-blue-700"
        },
        {
            title: "From Play School To University",
            description: "Edustoke as a platform, caters to all parents be it seeking admission in preschool, day-school, boarding school or even pre-universities.",
            icon: <FaGraduationCap className="text-4xl group-hover:scale-110 transition-all duration-500" />,
            border: "border-gradient-to-r from-purple-500 to-fuchsia-600",
            bg: "bg-gradient-to-br from-purple-50 to-fuchsia-50",
            iconBg: "bg-gradient-to-r from-purple-400 to-fuchsia-500",
            textColor: "text-purple-700"
        },
    ];

    const handleCategoryChange = (e) => {
        const selected = e.target.value;
        if (selected === 'Schools') ;
        else if (selected === 'College') ;
        else if (selected === 'PU College');
        else if (selected === 'Coaching Center') ;
        else if (selected === 'Tuition Center') ;
    };

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
            <div className="w-full h-[60vh] md:h-[70vh] bg-cover bg-center flex flex-col justify-center items-center text-white text-center px-8 relative overflow-hidden"
                style={{
                    backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1500&q=80)',
                }}>
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
            </div>

            {/* Search Bar */}
            <div className="flex justify-center -mt-12 px-8 relative z-20">
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
                            onChange={handleCategoryChange}
                            className="bg-transparent font-bold text-gray-800 focus:outline-none text-sm hover:text-orange-500 transition-colors duration-300"
                        >
                            <option value="">Select</option>
                            <option value="Schools">Schools</option>
                            <option value="College">College</option>
                            <option value="PU College">PU College</option>
                            <option value="Coaching Center">Coaching Center</option>
                            <option value="Tuition Center">Tuition Center</option>
                        </select>
                    </div>
                    <div className="h-8 border-l-2 border-orange-300 mx-3"></div>

                    {/* Search Input */}
                    <div className="flex-1 px-3 py-3">
                        <label className="text-xs font-extrabold text-gray-700 block mb-1 uppercase tracking-widest">
                            Location or School Name <span className="text-orange-500 text-sm">ⓘ</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter school name or location"
                            className="w-full bg-transparent text-gray-800 focus:outline-none placeholder-gray-500 text-sm"
                        />
                    </div>

                    {/* Search Button */}
                    <motion.button
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
            </div>

            <Location />
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

            <Schools />
            <Colleges />
            <PuCollege />
            <CoachingCenter />
            <Tuition/>
            <About />

            {/* Stats Section */}
    <div className="relative py-20 overflow-hidden bg-gradient-to-br from-orange-500 to-amber-600">
  {/* Decorative elements */}
  <div className="absolute top-0 left-0 w-full h-full opacity-10">
    <div className="absolute top-20 left-10 w-40 h-40 bg-white rounded-full mix-blend-overlay"></div>
    <div className="absolute bottom-10 right-20 w-60 h-60 bg-white rounded-full mix-blend-overlay"></div>
  </div>
  
  <div className="max-w-7xl mx-auto px-6 relative z-10">
    <div className="grid md:grid-cols-3 gap-8">
      {/* Stat 1 */}
      <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 group">
        <div className="text-6xl font-extrabold mb-3 text-white drop-shadow-lg group-hover:text-amber-100 transition-colors duration-300">
          2500+
        </div>
        <div className="text-xl font-medium text-amber-100 tracking-wide">
          Schools
        </div>
        <div className="mt-4 h-1 w-16 bg-amber-300 rounded-full group-hover:w-24 transition-all duration-500"></div>
      </div>
      
      {/* Stat 2 */}
      <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 group">
        <div className="text-6xl font-extrabold mb-3 text-white drop-shadow-lg group-hover:text-amber-100 transition-colors duration-300">
          20K+
        </div>
        <div className="text-xl font-medium text-amber-100 tracking-wide">
          Schools Viewed
        </div>
        <div className="mt-4 h-1 w-16 bg-amber-300 rounded-full group-hover:w-24 transition-all duration-500"></div>
      </div>
      
      {/* Stat 3 */}
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
{/* <Footer/> */}
    <StickyButton/>
        </div>
    );
}

export default Home;
