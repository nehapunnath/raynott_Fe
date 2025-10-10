import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { puCollegeApi } from "../services/pucollegeApi";
import "tailwindcss";


const NextArrow = ({ onClick }) => (
  <motion.div
    onClick={onClick}
    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white text-purple-600 rounded-full p-3 cursor-pointer shadow-lg hover:shadow-xl hover:bg-purple-600 hover:text-white transition-all"
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
    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white text-purple-600 rounded-full p-3 cursor-pointer shadow-lg hover:shadow-xl hover:bg-purple-600 hover:text-white transition-all"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    initial={{ opacity: 0.7 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <ArrowLeft size={24} strokeWidth={2} />
  </motion.div>
);

export default function PuCollege({ selectedCity }) {
  const navigate = useNavigate();
  const [puColleges, setPuColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPUColleges = async () => {
      try {
        setLoading(true);
        const response = await puCollegeApi.searchPUColleges({ city: selectedCity });
        const puCollegesData = response.data ? Object.values(response.data).filter(
          (puCollege, index, self) =>
            index === self.findIndex((c) => c.id === puCollege.id)
        ) : [];
        console.log('Fetched PU colleges:', puCollegesData); // Debug log
        setPuColleges(puCollegesData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPUColleges();
  }, [selectedCity]);

  const settings = {
    dots: puColleges.length > 1,
    infinite: puColleges.length > 1,
    speed: 500,
    slidesToShow: Math.min(puColleges.length, 4) || 1,
    slidesToScroll: 1,
    nextArrow: puColleges.length > 1 ? <NextArrow /> : null,
    prevArrow: puColleges.length > 1 ? <PrevArrow /> : null,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: Math.min(puColleges.length, 3) || 1,
          nextArrow: puColleges.length > 1 ? <NextArrow /> : null,
          prevArrow: puColleges.length > 1 ? <PrevArrow /> : null,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(puColleges.length, 2) || 1,
          nextArrow: puColleges.length > 1 ? <NextArrow /> : null,
          prevArrow: puColleges.length > 1 ? <PrevArrow /> : null,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          arrows: false,
          dots: puColleges.length > 1,
        },
      },
    ],
  };

  return (
    <div className="relative max-w-screen-2xl mx-auto px-6 py-12 bg-gradient-to-b from-purple-50 to-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-3">Top PU Colleges in {selectedCity}</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Premier institutions for +1 and +2 education with excellent results
        </p>
      </motion.div>

      {loading && (
        <div className="text-center text-gray-600">Loading PU colleges...</div>
      )}

      {error && (
        <div className="text-center text-red-600">Error: {error}</div>
      )}

      {!loading && !error && puColleges.length === 0 && (
        <div className="text-center text-gray-600">No PU colleges found in {selectedCity}</div>
      )}

      {!loading && !error && puColleges.length > 0 && (
        <div className="relative px-10">
          {puColleges.length === 1 ? (
            <div className="flex justify-center">
              <motion.div
                className="px-3 w-full max-w-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <motion.div
                  onClick={() => navigate(`/pucollege-details/${puColleges[0].id}`)}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  whileHover={{ y: -10 }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={puColleges[0].collegeImage || "https://via.placeholder.com/800x400"}
                      alt={puColleges[0].name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <div className="flex items-center justify-between">
                        <div className="bg-yellow-400 text-yellow-900 font-bold px-2 py-1 rounded-md text-sm flex items-center">
                          ⭐ {puColleges[0].rating || 'N/A'}
                        </div>
                        <span className="text-white text-sm">{puColleges[0].city}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{puColleges[0].name}</h3>
                    <div className="flex flex-wrap gap-1 mt-2 mb-4">
                      {(puColleges[0].streams || []).slice(0, 3).map((stream, i) => (
                        <span key={i} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          {stream}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          ) : (
            <Slider {...settings}>
              {puColleges.map((puCollege, idx) => (
                <div key={puCollege.id || idx} className="px-3">
                  <motion.div
                    onClick={() => navigate(`/pucollege-details/${puCollege.id}`)}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    whileHover={{ y: -10 }}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={puCollege.collegeImage || "https://via.placeholder.com/800x400"}
                        alt={puCollege.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <div className="flex items-center justify-between">
                          <div className="bg-yellow-400 text-yellow-900 font-bold px-2 py-1 rounded-md text-sm flex items-center">
                            ⭐ {puCollege.rating || 'N/A'}
                          </div>
                          <span className="text-white text-sm">{puCollege.city}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{puCollege.name}</h3>
                      <div className="flex flex-wrap gap-1 mt-2 mb-4">
                        {(puCollege.streams || []).slice(0, 3).map((stream, i) => (
                          <span key={i} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                            {stream}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </Slider>
          )}
        </div>
      )}
    </div>
  );
}