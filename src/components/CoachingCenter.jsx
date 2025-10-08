import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { TuitionCoachingApi } from "../services/TuitionCoachingApi";

const NextArrow = ({ onClick }) => (
  <motion.div
    onClick={onClick}
    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white text-red-600 rounded-full p-3 cursor-pointer shadow-lg hover:shadow-xl hover:bg-red-600 hover:text-white transition-all"
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
    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white text-red-600 rounded-full p-3 cursor-pointer shadow-lg hover:shadow-xl hover:bg-red-600 hover:text-white transition-all"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    initial={{ opacity: 0.7 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <ArrowLeft size={24} strokeWidth={2} />
  </motion.div>
);

export default function TuitionCoaching({ selectedCity }) {
  const navigate = useNavigate();
  const [tuitionCoachings, setTuitionCoachings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTuitionCoachings = async () => {
      try {
        setLoading(true);
        const response = await TuitionCoachingApi.searchTuitionCoachings({ city: selectedCity });
        const tuitionCoachingsData = response.data ? Object.values(response.data).filter(
          (center, index, self) =>
            index === self.findIndex((c) => c.id === center.id)
        ) : [];
        console.log('Fetched tuition/coaching centers:', tuitionCoachingsData); // Debug log
        setTuitionCoachings(tuitionCoachingsData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTuitionCoachings();
  }, [selectedCity]);

  const settings = {
    dots: tuitionCoachings.length > 1,
    infinite: tuitionCoachings.length > 1,
    speed: 500,
    slidesToShow: Math.min(tuitionCoachings.length, 4) || 1,
    slidesToScroll: 1,
    nextArrow: tuitionCoachings.length > 1 ? <NextArrow /> : null,
    prevArrow: tuitionCoachings.length > 1 ? <PrevArrow /> : null,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: Math.min(tuitionCoachings.length, 3) || 1,
          nextArrow: tuitionCoachings.length > 1 ? <NextArrow /> : null,
          prevArrow: tuitionCoachings.length > 1 ? <PrevArrow /> : null,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(tuitionCoachings.length, 2) || 1,
          nextArrow: tuitionCoachings.length > 1 ? <NextArrow /> : null,
          prevArrow: tuitionCoachings.length > 1 ? <PrevArrow /> : null,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          arrows: false,
          dots: tuitionCoachings.length > 1,
        },
      },
    ],
  };

  return (
    <div className="relative max-w-screen-2xl mx-auto px-6 py-12 bg-gradient-to-b from-red-50 to-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-3">Top Tuition & Coaching Centers in {selectedCity}</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Premier institutes for academic and competitive exam preparation with proven results
        </p>
      </motion.div>

      {loading && (
        <div className="text-center text-gray-600">Loading tuition/coaching centers...</div>
      )}

      {error && (
        <div className="text-center text-red-600">Error: {error}</div>
      )}

      {!loading && !error && tuitionCoachings.length === 0 && (
        <div className="text-center text-gray-600">No tuition/coaching centers found in {selectedCity}</div>
      )}

      {!loading && !error && tuitionCoachings.length > 0 && (
        <div className="relative px-10">
          {tuitionCoachings.length === 1 ? (
            <div className="flex justify-center">
              <motion.div
                className="px-3 w-full max-w-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <motion.div
                  onClick={() => navigate(`/tuitioncoaching-details/${tuitionCoachings[0].id}`)}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  whileHover={{ y: -10 }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={tuitionCoachings[0].centerImage || "https://via.placeholder.com/800x400"}
                      alt={tuitionCoachings[0].name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <div className="flex items-center justify-between">
                        <div className="bg-yellow-400 text-yellow-900 font-bold px-2 py-1 rounded-md text-sm flex items-center">
                          ⭐ {tuitionCoachings[0].rating || 'N/A'}
                        </div>
                        <span className="text-white text-sm">{tuitionCoachings[0].city}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{tuitionCoachings[0].name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{tuitionCoachings[0].typeOfCoaching}</p>
                    <div className="flex flex-wrap gap-1 mt-2 mb-4">
                      {(tuitionCoachings[0].subjects || []).slice(0, 3).map((subject, i) => (
                        <span key={i} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          ) : (
            <Slider {...settings}>
              {tuitionCoachings.map((center, idx) => (
                <div key={center.id || idx} className="px-3">
                  <motion.div
                    onClick={() => navigate(`/tuitioncoaching-details/${center.id}`)}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    whileHover={{ y: -10 }}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={center.centerImage || "https://via.placeholder.com/800x400"}
                        alt={center.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <div className="flex items-center justify-between">
                          <div className="bg-yellow-400 text-yellow-900 font-bold px-2 py-1 rounded-md text-sm flex items-center">
                            ⭐ {center.rating || 'N/A'}
                          </div>
                          <span className="text-white text-sm">{center.city}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{center.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{center.typeOfCoaching}</p>
                      <div className="flex flex-wrap gap-1 mt-2 mb-4">
                        {(center.subjects || []).slice(0, 3).map((subject, i) => (
                          <span key={i} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            {subject}
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