import React from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const teachers = [
  {
    name: "Dr. Priya Sharma",
    image: "https://cdn.eduadvisor.my/articles/2022/04/how-to-be-teacher-malaysia-feature.png",
    id: "priya-sharma",
    rating: 4.9,
    subject: "Mathematics",
    experience: "15+ years",
    qualifications: ["PhD in Mathematics", "M.Sc", "B.Ed"]
  },
  {
    name: "Prof. Rahul Verma",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    id: "rahul-verma",
    rating: 4.8,
    subject: "Physics",
    experience: "12 years",
    qualifications: ["M.Tech", "B.Ed"]
  },
  {
    name: "Ms. Ananya Patel",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    id: "ananya-patel",
    rating: 4.7,
    subject: "English Literature",
    experience: "8 years",
    qualifications: ["MA in English", "PhD Candidate", "B.Ed"]
  },
  {
    name: "Mr. Sanjay Kumar",
    image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    id: "sanjay-kumar",
    rating: 4.6,
    subject: "Computer Science",
    experience: "10 years",
    qualifications: ["M.Tech in CS", "B.Ed"]
  },
  {
    name: "Dr. Meena Desai",
    image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    id: "meena-desai",
    rating: 5.0,
    subject: "Chemistry",
    experience: "18 years",
    qualifications: ["PhD in Chemistry", "M.Sc", "B.Ed"]
  },
];

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

export default function Teachers() {
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
    <div className="relative max-w-screen-2xl mx-auto px-6 py-12 bg-gradient-to-b from-blue-50 to-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-3">Expert Teachers</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Highly qualified educators with proven track records
        </p>
      </motion.div>

      <div className="relative px-10">
        <Slider {...settings}>
          {teachers.map((teacher, idx) => (
            <motion.div 
              key={idx} 
              className="px-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <motion.div
                onClick={() => navigate(`/teachers-details`)}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
                whileHover={{ y: -10 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={teacher.image}
                    alt={teacher.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <div className="flex items-center justify-between">
                      <div className="bg-yellow-400 text-yellow-900 font-bold px-2 py-1 rounded-md text-sm flex items-center">
                        ⭐ {teacher.rating}
                      </div>
                      <span className="text-white text-sm">{teacher.experience} experience</span>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{teacher.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">{teacher.subject}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {teacher.qualifications.map((qualification, i) => (
                      <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {qualification}
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