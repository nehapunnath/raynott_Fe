import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { teacherApi } from "../services/TeacherApi";

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

export default function Teachers({ selectedCity }) {
  const navigate = useNavigate();
  const [professionalTeachers, setProfessionalTeachers] = useState([]);
  const [personalMentors, setPersonalMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);

        // Fetch professional teachers
        const profResponse = await teacherApi.getProfessionalTeachers({ city: selectedCity });
        const profTeachersData = profResponse.data ? Object.values(profResponse.data).filter(
          (teacher, index, self) => index === self.findIndex((t) => t.id === teacher.id)
        ) : [];
        console.log('Fetched professional teachers:', profTeachersData);

        // Fetch personal mentors
        const mentorResponse = await teacherApi.getPersonalMentors({ city: selectedCity });
        const mentorData = mentorResponse.data ? Object.values(mentorResponse.data).filter(
          (mentor, index, self) => index === self.findIndex((m) => m.id === mentor.id)
        ) : [];
        console.log('Fetched personal mentors:', mentorData);

        setProfessionalTeachers(profTeachersData);
        setPersonalMentors(mentorData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTeachers();
  }, [selectedCity]);

  const createSliderSettings = (itemCount) => ({
    dots: itemCount > 1,
    infinite: itemCount > 1,
    speed: 500,
    slidesToShow: Math.min(itemCount, 4) || 1,
    slidesToScroll: 1,
    nextArrow: itemCount > 1 ? <NextArrow /> : null,
    prevArrow: itemCount > 1 ? <PrevArrow /> : null,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: Math.min(itemCount, 3) || 1,
          nextArrow: itemCount > 1 ? <NextArrow /> : null,
          prevArrow: itemCount > 1 ? <PrevArrow /> : null,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(itemCount, 2) || 1,
          nextArrow: itemCount > 1 ? <NextArrow /> : null,
          prevArrow: itemCount > 1 ? <PrevArrow /> : null,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          arrows: false,
          dots: itemCount > 1,
        },
      },
    ],
  });

  const renderTeacherCard = (teacher, type) => (
    <motion.div
      onClick={() => navigate(`/${type === 'professional' ? 'professional-teacher-details' : 'personal-mentor-details'}/${teacher.id}`)}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
      whileHover={{ y: -10 }}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={teacher.profileImage || "https://via.placeholder.com/800x400"}
          alt={teacher.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="bg-yellow-400 text-yellow-900 font-bold px-2 py-1 rounded-md text-sm flex items-center">
              ⭐ {teacher.rating || 'N/A'}
            </div>
            <span className="text-white text-sm">{teacher.experience || 'N/A'} experience</span>
          </div>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-1">{teacher.name}</h3>
        <p className="text-blue-600 font-medium mb-2">{teacher.subjects.split(',')[0]}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {(teacher.qualification ? teacher.qualification.split(',') : []).slice(0, 3).map((qual, i) => (
            <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {qual.trim()}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="relative max-w-screen-2xl mx-auto px-6 py-12 bg-gradient-to-b from-blue-50 to-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-3">Expert Teachers in {selectedCity}</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Highly qualified educators and mentors with proven track records
        </p>
      </motion.div>

      {loading && (
        <div className="text-center text-gray-600">Loading teachers...</div>
      )}

      {error && (
        <div className="text-center text-red-600">Error: {error}</div>
      )}

      {!loading && !error && (
        <>
          {/* Professional Teachers Section */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Professional Teachers</h3>
            {professionalTeachers.length === 0 ? (
              <div className="text-center text-gray-600">No professional teachers found in {selectedCity}</div>
            ) : professionalTeachers.length === 1 ? (
              <div className="flex justify-center">
                <motion.div
                  className="px-3 w-full max-w-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {renderTeacherCard(professionalTeachers[0], 'professional')}
                </motion.div>
              </div>
            ) : (
              <div className="relative px-10">
                <Slider {...createSliderSettings(professionalTeachers.length)}>
                  {professionalTeachers.map((teacher, idx) => (
                    <div key={teacher.id || idx} className="px-3">
                      {renderTeacherCard(teacher, 'professional')}
                    </div>
                  ))}
                </Slider>
              </div>
            )}
          </div>

          {/* Personal Mentors Section */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Personal Mentors</h3>
            {personalMentors.length === 0 ? (
              <div className="text-center text-gray-600">No personal mentors found in {selectedCity}</div>
            ) : personalMentors.length === 1 ? (
              <div className="flex justify-center">
                <motion.div
                  className="px-3 w-full max-w-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {renderTeacherCard(personalMentors[0], 'personal')}
                </motion.div>
              </div>
            ) : (
              <div className="relative px-10">
                <Slider {...createSliderSettings(personalMentors.length)}>
                  {personalMentors.map((mentor, idx) => (
                    <div key={mentor.id || idx} className="px-3">
                      {renderTeacherCard(mentor, 'personal')}
                    </div>
                  ))}
                </Slider>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}