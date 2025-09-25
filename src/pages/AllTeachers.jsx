import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaHome, FaUniversity, FaUserTie } from "react-icons/fa";
import StickyButton from '../components/StickyButton';

const teacherCategories = [
  {
    id: 1,
    title: "Professional Teachers",
    icon: <FaUniversity className="text-4xl text-orange-500" />,
    description: "Qualified teachers for Schools, Colleges, PU Colleges, and Coaching Institutes",
    path: "/professional",
    subcategories: ["School", "College", "PU College", "Coaching Institute"],
    type: "professional"
  },
  {
    id: 2,
    title: "Personal Mentorship",
    icon: <FaUserTie className="text-4xl text-orange-500" />,
    description: "Personalized guidance and one-on-one mentoring for individual learning",
    path: "/personal",
    subcategories: ["Personal Mentor"],
    type: "personal"
  }
];

function AllTeachers() {
  const nav = useNavigate();

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
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
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
            <p className="text-lg text-gray-600 mt-1">
              Choose from our curated categories to find the perfect educator for your needs
            </p>
          </div>
        </div>

        {/* Teacher Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teacherCategories.map((category) => (
            <Link to={category.path} key={category.id}>
              <motion.div 
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full"
                whileHover={{ y: -5 }}
              >
                <div className="p-6 flex flex-col items-center text-center h-full">
                  <div className="mb-4">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{category.title}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
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
                    className="mt-auto w-full py-3 px-4 font-medium rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-700 transition duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Explore {category.title}
                  </motion.button>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </main>

      <StickyButton />
    </div>
  );
}

export default AllTeachers;