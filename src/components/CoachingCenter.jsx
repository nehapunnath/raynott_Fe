import React from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const coachingCenters = [
  {
    name: "Brilliant Minds Coaching Centerite IIT Academy",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    id: "elite-iit",
    rating: 4.8,
    location: "Bangalore",
    courses: ["JEE", "NEET", "Foundation"],
    successRate: "92% selection rate"
  },
  {
    name: "Champion NEET Prep",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    id: "champion-neet",
    rating: 4.7,
    location: "Bangalore",
    courses: ["NEET", "AIIMS"],
    successRate: "95% selection rate"
  },
  {
    name: "Future IAS Institute",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    id: "future-ias",
    rating: 4.9,
    location: "Bangalore",
    courses: ["UPSC", "State PSC"],
    successRate: "210+ selections"
  },
  {
    name: "Global Gate Academy",
    image: "https://images.unsplash.com/photo-1549861833-c5932fd19229?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    id: "global-gate",
    rating: 4.6,
    location: "Bangalored",
    courses: ["GATE", "IES"],
    successRate: "85% success rate"
  },
  {
    name: "Bright CAT Coaching",
    image: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    id: "bright-cat",
    rating: 4.5,
    location: "Bangalore",
    courses: ["CAT", "XAT"],
    successRate: "90%ile+ achievers"
  }
];

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

export default function CoachingCenter() {
  const navigate = useNavigate();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { 
        breakpoint: 1280, 
        settings: { 
          slidesToShow: 3,
          nextArrow: <NextArrow />,
          prevArrow: <PrevArrow />
        } 
      },
      { 
        breakpoint: 1024, 
        settings: { 
          slidesToShow: 2,
          nextArrow: <NextArrow />,
          prevArrow: <PrevArrow />
        } 
      },
      { 
        breakpoint: 640, 
        settings: { 
          slidesToShow: 1,
          arrows: false,
          dots: true
        } 
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
        <h2 className="text-4xl font-bold text-gray-800 mb-3">Top Coaching / Tuition Centers</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Premier institutes for competitive exam preparation with proven results
        </p>
      </motion.div>

      <div className="relative px-10">
        <Slider {...settings}>
          {coachingCenters.map((center, idx) => (
            <motion.div 
              key={idx} 
              className="px-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <motion.div
                onClick={() => navigate(`/coaching-details`)}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
                whileHover={{ y: -10 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={center.image}
                    alt={center.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <div className="flex items-center justify-between">
                      <div className="bg-yellow-400 text-yellow-900 font-bold px-2 py-1 rounded-md text-sm flex items-center">
                        ⭐ {center.rating}
                      </div>
                      <span className="text-white text-sm">{center.location}</span>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{center.name}</h3>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {center.courses.map((course, i) => (
                      <span key={i} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        {course}
                      </span>
                    ))}
                  </div>
                  
                </div>
              </motion.div>
            </motion.div>
          ))}
        </Slider>
      </div>

      
    </div>
  );
}