import React from 'react';
import { motion } from 'framer-motion';
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
import CoachingCenter from '../components/CoachingCenter';
import About from '../components/About';

function Home() {
    const services = [
        {
            title: "Pan India Presence",
            description: "With a presence across most of the cities in India, Edustoke has listed schools spread across the length and breadth of the country.",
            icon: <FaMapMarkerAlt className="text-5xl group-hover:scale-110 transition-all duration-500" />,
            border: "border-gradient-to-r from-amber-500 to-orange-600",
            bg: "bg-gradient-to-br from-amber-50 to-orange-50",
            iconBg: "bg-gradient-to-r from-amber-400 to-orange-500",
            textColor: "text-amber-700"
        },
        {
            title: "All Boards",
            description: "Be it CBSE, ICSE, IB or state boards, Edustoke has listed schools with their diverse approaches and curriculum for parents to choose.",
            icon: <FaFileAlt className="text-5xl group-hover:scale-110 transition-all duration-500" />,
            border: "border-gradient-to-r from-teal-500 to-emerald-600",
            bg: "bg-gradient-to-br from-teal-50 to-emerald-50",
            iconBg: "bg-gradient-to-r from-teal-400 to-emerald-500",
            textColor: "text-teal-700"
        },
        {
            title: "Counselling Team",
            description: "Our dedicated team of expert counsellors listen to you and comprehend your need and suggest to you unbiased options that suit your requirement.",
            icon: <FaChalkboardTeacher className="text-5xl group-hover:scale-110 transition-all duration-500" />,
            border: "border-gradient-to-r from-blue-500 to-indigo-600",
            bg: "bg-gradient-to-br from-blue-50 to-indigo-50",
            iconBg: "bg-gradient-to-r from-blue-400 to-indigo-500",
            textColor: "text-blue-700"
        },
        {
            title: "From Play School To University",
            description: "Edustoke as a platform, caters to all parents be it seeking admission in preschool, day-school, boarding school or even pre-universities.",
            icon: <FaGraduationCap className="text-5xl group-hover:scale-110 transition-all duration-500" />,
            border: "border-gradient-to-r from-purple-500 to-fuchsia-600",
            bg: "bg-gradient-to-br from-purple-50 to-fuchsia-50",
            iconBg: "bg-gradient-to-r from-purple-400 to-fuchsia-500",
            textColor: "text-purple-700"
        },
    ];

    return (
        <div className="bg-gradient-to-b from-amber-50 to-blue-50">
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

            {/* Custom Styled Search Bar */}
            <div className="flex justify-center -mt-14 px-8 relative z-20">
                <motion.div 
                    className="bg-white shadow-2xl rounded-3xl flex items-center w-full max-w-6xl overflow-hidden border-4 border-orange-500 hover:shadow-3xl transition-all duration-500"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                >
                    {/* Category Dropdown */}
                    <div className="pl-10 pr-5 py-6">
                        <label className="text-sm font-extrabold text-gray-700 block mb-2 uppercase tracking-widest">
                            Category <span className="text-orange-500 text-base">ⓘ</span>
                        </label>
                        <select className="bg-transparent font-bold text-gray-800 focus:outline-none text-lg hover:text-orange-500 transition-colors duration-300">
                            <option>Day School</option>
                            <option>College</option>
                            <option>PU College</option>
                            <option>Coaching Center</option>
                            <option>Tuition Center</option>
                        </select>
                    </div>
                    <div className="h-16 border-l-2 border-orange-300 mx-5"></div>
                    {/* Search Input */}
                    <div className="flex-1 px-5 py-6">
                        <label className="text-sm font-extrabold text-gray-700 block mb-2 uppercase tracking-widest">
                            Location or School Name <span className="text-orange-500 text-base">ⓘ</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter school name or location"
                            className="w-full bg-transparent text-gray-800 focus:outline-none placeholder-gray-500 text-lg"
                        />
                    </div>
                    {/* Search Button */}
                    <motion.button 
                        className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 transition-all p-6 rounded-2xl mr-4 flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 20 20">
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

            <div className="max-w-screen-xl mx-auto px-8 py-20 bg-gradient-to-br from-white to-amber-50 rounded-3xl shadow-2xl mt-12 border border-orange-100">
                <h2 className="text-5xl font-extrabold mb-12 pb-4 inline-block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600 tracking-tight">
                    Additional Services
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {services.map((service, idx) => (
                        <motion.div
                            key={idx}
                            className={`group rounded-3xl p-8 ${service.bg} flex gap-6 items-start shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden`}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.3, duration: 1 }}
                        >
                            <div className={`${service.iconBg} p-4 rounded-xl text-white shadow-md`}>
                                {service.icon}
                            </div>
                            <div className="relative z-10">
                                <h3 className={`font-extrabold text-2xl mb-4 ${service.textColor}`}>{service.title}</h3>
                                <p className="text-gray-700 leading-relaxed">{service.description}</p>
                            </div>
                            <div className="absolute bottom-0 right-0 h-1 w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <Schools />
            <Colleges />
            <PuCollege />
            <CoachingCenter />
            <About />

           <div className="relative max-w-6xl mx-auto px-4 my-20 overflow-hidden">
  {/* Floating gradient background elements */}
  <div className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full filter blur-3xl opacity-20"></div>
  <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full filter blur-3xl opacity-20"></div>

  <motion.div 
    className="flex flex-wrap justify-center gap-6 md:gap-10 p-8 md:p-12 rounded-3xl shadow-2xl"
    style={{
      background: 'linear-gradient(135deg, rgba(234,88,12,0.9) 0%, rgba(251,146,60,0.9) 100%)',
      border: '2px solid rgba(255,255,255,0.2)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    }}
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
  >
    {[
      { number: "2500+", text: "Schools Listed", delay: 0.2,  },
      { number: "20K+", text: "Schools Viewed", delay: 0.4,},
      { number: "1L+", text: "Parents Served", delay: 0.6, },
    ].map((item, index) => (
      <motion.div
        key={index}
        className="text-center bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 flex-1 min-w-[180px] max-w-[240px]"
        initial={{ opacity: 0, scale: 0.7, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 100,
          damping: 10,
          delay: item.delay 
        }}
        whileHover={{ 
          y: -8,
          scale: 1.05,
          backgroundColor: 'rgba(255,255,255,0.15)'
        }}
      >
        <div className="text-4xl mb-3">{item.icon}</div>
        <p className="text-5xl font-extrabold text-white drop-shadow-lg mb-2">
          {item.number}
        </p>
        <p className="text-lg text-amber-100 font-semibold">
          {item.text}
        </p>
      </motion.div>
    ))}
  </motion.div>

  {/* Glowing border effect */}
  <div className="absolute inset-0 rounded-3xl border-2 border-transparent pointer-events-none" 
       style={{
         boxShadow: '0 0 20px 5px rgba(251, 146, 60, 0.3)',
       }}>
  </div>
</div>
        </div>
    );
}

export default Home;