import React from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const puColleges = [
  {
    name: "Excel PU College",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    id: "excel-pu",
    rating: 4.7,
    location: "Bangalore",
    streams: ["Science", "Commerce", "Arts"],
    results: "98% pass rate"
  },
  {
    name: "National PU College",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    id: "national-pu",
    rating: 4.5,
    location: "Mumbai",
    streams: ["Science", "Commerce"],
    results: "95% pass rate"
  },
  {
    name: "Brilliant PU College",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    id: "brilliant-pu",
    rating: 4.6,
    location: "Delhi",
    streams: ["Science", "Commerce", "Arts"],
    results: "97% pass rate"
  },
  {
    name: "Global PU College",
    image: "https://images.unsplash.com/photo-1549861833-c5932fd19229?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    id: "global-pu",
    rating: 4.8,
    location: "Hyderabad",
    streams: ["Science", "Commerce"],
    results: "99% pass rate"
  },
  {
    name: "Vidyarthi PU College",
    image: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    id: "vidyarthi-pu",
    rating: 4.4,
    location: "Chennai",
    streams: ["Science", "Commerce", "Arts"],
    results: "96% pass rate"
  }
];

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

export default function PuCollege() {
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
    <div className="relative max-w-screen-2xl mx-auto px-6 py-12 bg-gradient-to-b from-purple-50 to-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-3">Top PU/Inter Colleges</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Premier institutions for +1 and +2 education with excellent results
        </p>
      </motion.div>

      <div className="relative px-10">
        <Slider {...settings}>
          {puColleges.map((college, idx) => (
            <motion.div 
              key={idx} 
              className="px-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <motion.div
                onClick={() => navigate(`/pu-colleges/${college.id}`)}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
                whileHover={{ y: -10 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={college.image}
                    alt={college.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <div className="flex items-center justify-between">
                      <div className="bg-yellow-400 text-yellow-900 font-bold px-2 py-1 rounded-md text-sm flex items-center">
                        ⭐ {college.rating}
                      </div>
                      <span className="text-white text-sm">{college.location}</span>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{college.name}</h3>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {college.streams.map((stream, i) => (
                      <span key={i} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        {stream}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    <span className="font-medium">Results:</span> {college.results}
                  </p>
                  {/* <button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition-colors">
                    View Courses
                  </button> */}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </Slider>
      </div>

      
    </div>
  );
}