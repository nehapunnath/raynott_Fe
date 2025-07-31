import React from "react";
import { FaSchool, FaUniversity, FaChalkboardTeacher, FaStar } from "react-icons/fa";

const categories = [
  { name: "Schools", icon: <FaSchool />, link: "/categories/schools" },
  { name: "Colleges", icon: <FaUniversity />, link: "/categories/colleges" },
  { name: "PU College / Inter / Plus One", icon: <FaUniversity />, link: "/categories/pu-college" },
  { name: "Plus Two", icon: <FaUniversity />, link: "/categories/plus-two" },
  { name: "Coaching Center", icon: <FaChalkboardTeacher />, link: "/categories/coaching" },
  { name: "Tuition Teachers", icon: <FaChalkboardTeacher />, link: "/categories/tuition" },
  { name: "Best Sellers", icon: <FaStar />, link: "/categories/bestsellers" },
];

export default function Categories() {
  return (
    <div className="mt-10 px-6 max-w-screen-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 border-b-4 border-red-500 inline-block">
        Browse by Categories
      </h2>

      <div className="flex overflow-x-auto gap-6 py-4 scrollbar-hide">
        {categories.map((cat, index) => (
          <a
            key={index}
            href={cat.link}
            className="flex-shrink-0 w-64 h-40 bg-white shadow-md hover:shadow-xl transition duration-300 rounded-xl flex flex-col items-center justify-center border border-gray-200"
          >
            <div className="text-4xl text-red-600 mb-3">{cat.icon}</div>
            <span className="text-lg font-semibold text-center px-2">{cat.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
