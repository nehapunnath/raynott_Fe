import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  FaSchool, 
  FaUniversity, 
  FaChalkboardTeacher,
  FaGraduationCap,
  FaBookOpen,
  FaUserTie,
  FaTrophy,
  FaStar
} from "react-icons/fa";

const categories = [
  {
    name: "Schools",
    icon: <FaSchool />,
    link: "/all-schools",
    bg: "bg-gradient-to-br from-amber-50 to-orange-50",
    iconBg: "bg-gradient-to-r from-amber-500 to-orange-600",
    textColor: "text-amber-700",
    delay: 0.1
  },
  {
    name: "Colleges",
    icon: <FaUniversity />,
    link: "/all-colleges",
    bg: "bg-gradient-to-br from-blue-50 to-indigo-50",
    iconBg: "bg-gradient-to-r from-blue-500 to-indigo-600",
    textColor: "text-blue-700",
    delay: 0.2
  },
  {
    name: "PU College",
    icon: <FaGraduationCap />,
    link: "/all-pucolleges",
    bg: "bg-gradient-to-br from-purple-50 to-fuchsia-50",
    iconBg: "bg-gradient-to-r from-purple-500 to-fuchsia-600",
    textColor: "text-purple-700",
    delay: 0.3
  },
  {
    name: "Coaching / Tuition Center",
    icon: <FaChalkboardTeacher />,
    link: "/all-coaching",
    bg: "bg-gradient-to-br from-rose-50 to-pink-50",
    iconBg: "bg-gradient-to-r from-rose-500 to-pink-600",
    textColor: "text-rose-700",
    delay: 0.5
  },
  {
    name: "All Teachers",
    icon: <FaUserTie />,
    link: "/all-teachers",
    bg: "bg-gradient-to-br from-violet-50 to-indigo-50",
    iconBg: "bg-gradient-to-r from-violet-500 to-indigo-600",
    textColor: "text-violet-700",
    delay: 0.6
  },
  {
    name: "Best Sellers",
    icon: <FaTrophy />,
    link: "/best-sellers",
    bg: "bg-gradient-to-br from-yellow-50 to-amber-50",
    iconBg: "bg-gradient-to-r from-yellow-500 to-amber-600",
    textColor: "text-yellow-700",
    delay: 0.7,
    isSpecial: true
  },
];

const CategoryCard = ({ category, index }) => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      className={`group relative rounded-3xl p-8 ${category.bg} flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden ${category.isSpecial ? 'border-2 border-yellow-400' : ''}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: category.delay, duration: 0.5 }}
      whileHover={{ y: -10 }}
      onClick={() => navigate(category.link)}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      {/* Special badge for best sellers */}
      {category.isSpecial && (
        <div className="absolute top-4 right-4 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
          <FaStar className="mr-1" /> Popular
        </div>
      )}
      
      {/* Icon container */}
      <motion.div 
        className={`${category.iconBg} p-4 rounded-2xl text-white shadow-lg mb-6 group-hover:rotate-6 transition-transform duration-300`}
        whileHover={{ scale: 1.1 }}
      >
        <div className="text-3xl">
          {category.icon}
        </div>
      </motion.div>
      
      {/* Category name */}
      <h3 className={`font-bold text-xl text-center ${category.textColor} relative z-10`}>
        {category.name}
      </h3>
      
      {/* Additional text for best sellers */}
      {category.isSpecial && (
        <p className="text-yellow-600 text-sm mt-2 text-center">
          Top-rated educational institutions
        </p>
      )}
      
      {/* Hover effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={{ opacity: 0 }}
      />
    </motion.div>
  );
};

export default function Categories() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: "-100px" }}
        className="text-center mb-14"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-600">
          Explore Education Categories
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover the perfect educational path from our comprehensive categories
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <CategoryCard key={index} category={category} index={index} />
        ))}
      </div>
    </section>
  );
}