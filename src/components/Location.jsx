import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const locations = [
  { name: 'Bengaluru', icon: '🏙️', color: 'from-indigo-500 to-purple-600', link: '/listed' },
  { name: 'Hyderabad', icon: '🏰', color: 'from-amber-500 to-orange-600' },
  { name: 'Pune', icon: '🏛️', color: 'from-emerald-500 to-teal-600' },
  { name: 'Mumbai', icon: '🌆', color: 'from-rose-500 to-pink-600' },
  { name: 'Kolkata', icon: '🕌', color: 'from-blue-500 to-cyan-600' },
  { name: 'Delhi', icon: '🏯', color: 'from-violet-500 to-fuchsia-600' },
  { name: 'Chennai', icon: '🛕', color: 'from-green-500 to-lime-600' },
  { name: 'Vizag', icon: '⛩️', color: 'from-red-500 to-amber-600' },
  { name: 'Noida', icon: '🏗️', color: 'from-purple-500 to-indigo-600' },
  { name: 'Gurugram', icon: '🏢', color: 'from-cyan-500 to-sky-600' },
  { name: 'Faridabad', icon: '🏚️', color: 'from-yellow-500 to-amber-600' },
  { name: 'Online Schools', icon: '💻', color: 'from-gray-500 to-slate-600' },
  { name: 'Boarding Schools', icon: '🏫', color: 'from-amber-500 to-rose-600' },
];

function Location() {
  const [showLocations, setShowLocations] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Bengaluru');

  return (
    <div className="flex flex-col items-center justify-center py-12 bg-gradient-to-b from-white to-blue-50">
      {/* Search Cities Button */}
      <motion.button
        onClick={() => setShowLocations(true)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className={`${
          showLocations ? 'hidden' : 'flex'
        } bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 items-center gap-3 text-lg relative overflow-hidden group`}
      >
        <span className="absolute inset-0 bg-gradient-to-r from-[#FF8E53] to-[#FF6B6B] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        <span className="relative z-10 flex items-center gap-2">
          <span className="text-2xl">🔍</span>
          <span>Search Cities</span>
          <span className="text-xl animate-pulse">↓</span>
        </span>
      </motion.button>

      {/* Location Modal */}
      <AnimatePresence>
        {showLocations && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowLocations(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowLocations(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                title="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-500 hover:text-red-500 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Heading */}
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
                  Select Your Location
                </h2>
                <p className="text-gray-600">
                  Currently selected:{' '}
                  <span className="font-semibold text-gray-800">{selectedCity}</span>
                </p>
              </div>

              {/* Locations Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {locations.map((loc, index) => {
                  const content = (
                    <motion.div
                      whileHover={{ y: -5, scale: 1.03 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedCity(loc.name);
                        setTimeout(() => setShowLocations(false), 300);
                      }}
                      className={`bg-gradient-to-br ${loc.color} text-white p-4 rounded-xl cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center relative overflow-hidden group`}
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                        {loc.icon}
                      </div>
                      <p className="font-semibold text-center text-white text-sm sm:text-base">
                        {loc.name}
                      </p>
                      {selectedCity === loc.name && (
                        <div className="absolute top-2 right-2 bg-white text-purple-600 rounded-full p-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </motion.div>
                  );

                  return loc.link ? (
                    <Link to={loc.link} key={index}>
                      {content}
                    </Link>
                  ) : (
                    <div key={index}>{content}</div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Location;
