import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { schoolApi } from '../services/schoolApi';
import 'tailwindcss';

// 👇 Validation: only accept real http(s) URLs
const isValidUrl = (val) =>
  typeof val === 'string' &&
  val.trim().length > 0 &&
  val.trim().toLowerCase() !== 'null' &&
  val.trim().toLowerCase() !== 'undefined' &&
  val.trim().startsWith('http');

// 👇 Pick first valid photo from array (handles string or { url } shapes)
const pickFirstPhoto = (photos) => {
  if (!Array.isArray(photos)) return null;
  for (const p of photos) {
    if (isValidUrl(p)) return p;
    if (p && typeof p === 'object') {
      if (isValidUrl(p.url)) return p.url;
      if (isValidUrl(p.image)) return p.image;
      if (isValidUrl(p.src)) return p.src;
    }
  }
  return null;
};

// 👇 Resolve image with fallback chain
const getSchoolImage = (school) => {
  if (isValidUrl(school.schoolImage)) return school.schoolImage;
  if (isValidUrl(school.image)) return school.image;

  const fromPhotos =
    pickFirstPhoto(school.photos) ||
    pickFirstPhoto(school.images) ||
    pickFirstPhoto(school.gallery) ||
    pickFirstPhoto(school.photoGallery);
  if (fromPhotos) return fromPhotos;

  return null;
};

// 👇 Safe array (handles strings, null, undefined)
const safeArray = (value, fallback = []) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string' && value.trim()) {
    return value.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return fallback;
};

const NextArrow = ({ onClick }) => (
  <motion.div
    onClick={onClick}
    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white text-blue-600 rounded-full p-3 cursor-pointer shadow-lg hover:shadow-xl hover:bg-blue-600 hover:text-white transition-all"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    initial={{ opacity: 0.7 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <ArrowRight size={24} strokeWidth={2} />
  </motion.div>
);

const PrevArrow = ({ onClick }) => (
  <motion.div
    onClick={onClick}
    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white text-blue-600 rounded-full p-3 cursor-pointer shadow-lg hover:shadow-xl hover:bg-blue-600 hover:text-white transition-all"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    initial={{ opacity: 0.7 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <ArrowLeft size={24} strokeWidth={2} />
  </motion.div>
);

export default function Schools({ selectedCity }) {
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoading(true);
        const response = await schoolApi.getSchoolsWithFilters({
          city: selectedCity,
        });
        // Ensure unique schools by checking for duplicates
        const schoolsData = response.data
          ? Object.values(response.data).filter(
              (school, index, self) =>
                index === self.findIndex((s) => s.id === school.id)
            )
          : [];
        console.log('Fetched schools:', schoolsData);
        setSchools(schoolsData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSchools();
  }, [selectedCity]);

  const settings = {
    dots: schools.length > 1,
    infinite: schools.length > 1,
    speed: 500,
    slidesToShow: Math.min(schools.length, 4) || 1,
    slidesToScroll: 1,
    nextArrow: schools.length > 1 ? <NextArrow /> : null,
    prevArrow: schools.length > 1 ? <PrevArrow /> : null,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: Math.min(schools.length, 3) || 1,
          nextArrow: schools.length > 1 ? <NextArrow /> : null,
          prevArrow: schools.length > 1 ? <PrevArrow /> : null,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(schools.length, 2) || 1,
          nextArrow: schools.length > 1 ? <NextArrow /> : null,
          prevArrow: schools.length > 1 ? <PrevArrow /> : null,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          arrows: false,
          dots: schools.length > 1,
        },
      },
    ],
  };

  return (
    <div className="relative max-w-screen-2xl mx-auto px-6 py-12 bg-gradient-to-b from-blue-50 to-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-3">
          Premium Schools in {selectedCity}
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Top-rated educational institutions for comprehensive learning
        </p>
      </motion.div>

      {loading && (
        <div className="text-center text-gray-600">Loading schools...</div>
      )}

      {error && (
        <div className="text-center text-red-600">Error: {error}</div>
      )}

      {!loading && !error && schools.length === 0 && (
        <div className="text-center text-gray-600">
          No schools found in {selectedCity}
        </div>
      )}

      {!loading && !error && schools.length > 0 && (
        <div className="relative px-10">
          {schools.length === 1 ? (
            // Render single school without Slider
            <div className="flex justify-center">
              <motion.div
                className="px-3 w-full max-w-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <motion.div
                  onClick={() => navigate(`/school-details/${schools[0].id}`)}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  whileHover={{ y: -10 }}
                >
                  {(() => {
                    const image = getSchoolImage(schools[0]);
                    return (
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        {image && (
                          <img
                            src={image}
                            alt={schools[0].name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <div className="flex items-center justify-between">
                            <div className="bg-yellow-400 text-yellow-900 font-bold px-2 py-1 rounded-md text-sm flex items-center">
                              ⭐ {schools[0].rating || 'N/A'}
                            </div>
                            <span className="text-white text-sm">
                              {schools[0].city}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {schools[0].name}
                    </h3>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {safeArray(schools[0].boards, ['CBSE']).map((board, i) => (
                        <span
                          key={i}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                        >
                          {board}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          ) : (
            // Render multiple schools with Slider
            <Slider {...settings}>
              {schools.map((school, idx) => {
                const image = getSchoolImage(school);
                return (
                  <div key={school.id || idx} className="px-3">
                    <motion.div
                      onClick={() => navigate(`/school-details/${school.id}`)}
                      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
                      whileHover={{ y: -10 }}
                    >
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        {image && (
                          <img
                            src={image}
                            alt={school.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <div className="flex items-center justify-between">
                            <div className="bg-yellow-400 text-yellow-900 font-bold px-2 py-1 rounded-md text-sm flex items-center">
                              ⭐ {school.rating || 'N/A'}
                            </div>
                            <span className="text-white text-sm">
                              {school.city}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-xl font-bold text-gray-800 mb-1">
                          {school.name}
                        </h3>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {safeArray(school.boards, ['CBSE']).map((board, i) => (
                            <span
                              key={i}
                              className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                            >
                              {board}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </Slider>
          )}
        </div>
      )}
    </div>
  );
}