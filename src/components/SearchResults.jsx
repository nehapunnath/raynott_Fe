import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { schoolApi } from '../services/schoolApi';
import { collegeApi } from '../services/collegeApi';
import { puCollegeApi } from '../services/pucollegeApi';
import{ TuitionCoachingApi} from '../services/TuitionCoachingApi';
import { teacherApi } from '../services/TeacherApi';
import "tailwindcss";


function SearchResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category') || '';
  const query = queryParams.get('query') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        let response;

        switch (category) {
          case 'Schools':
            response = await schoolApi.getSchools({ city: query, name: query });
            setResults(response.data ? Object.values(response.data) : []);
            break;
          case 'College':
            response = await collegeApi.getColleges({ city: query, name: query });
            setResults(response.data ? Object.values(response.data) : []);
            break;
          case 'PU College':
            response = await puCollegeApi.getPuColleges({ city: query, name: query });
            setResults(response.data ? Object.values(response.data) : []);
            break;
          case 'Coaching/Tuition Center':
            response = await TuitionCoachingApi.getTuitionCoaching({ city: query, name: query });
            setResults(response.data ? Object.values(response.data) : []);
            break;
          case 'Teachers':
            const [profResponse, mentorResponse] = await Promise.all([
              teacherApi.searchProfessionalTeachersByName(query, { city: query }),
              teacherApi.searchPersonalMentorsByName(query, { city: query }),
            ]);
            const profTeachers = profResponse.data ? Object.values(profResponse.data) : [];
            const mentors = mentorResponse.data ? Object.values(mentorResponse.data) : [];
            setResults([...profTeachers, ...mentors]);
            break;
          default:
            setResults([]);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchResults();
  }, [category, query]);

  const handleCardClick = (item) => {
    switch (category) {
      case 'Schools':
        navigate(`/school-details/${item.id}`);
        break;
      case 'College':
        navigate(`/college-details/${item.id}`);
        break;
      case 'PU College':
        navigate(`/pucollege-details/${item.id}`);
        break;
      case 'Coaching/Tuition Center':
        navigate(`/tuitioncoaching-details/${item.id}`);
        break;
      case 'Teachers':
        if (['School', 'College', 'PU College', 'Coaching Institute'].includes(item.institutionType)) {
          navigate(`/professional-teacher-details/${item.id}`);
        } else {
          navigate(`/personal-mentor-details/${item.id}`);
        }
        break;
      default:
        break;
    }
  };

  const renderCard = (item) => {
    const isTeacher = category === 'Teachers';
    return (
      <motion.div
        key={item.id}
        onClick={() => handleCardClick(item)}
        className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
        whileHover={{ y: -10 }}
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={isTeacher ? item.profileImage : item.image || 'https://via.placeholder.com/800x400'}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div className="bg-yellow-400 text-yellow-900 font-bold px-2 py-1 rounded-md text-sm flex items-center">
                ⭐ {item.rating || 'N/A'}
              </div>
              <span className="text-white text-sm">{isTeacher ? item.experience : item.type || 'N/A'}</span>
            </div>
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-800 mb-1">{item.name}</h3>
          <p className="text-blue-600 font-medium mb-2">
            {isTeacher ? item.subjects.split(',')[0] : item.city}
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {(isTeacher ? (item.qualification ? item.qualification.split(',') : []) : [item.board || 'N/A']).slice(0, 3).map((tag, i) => (
              <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {tag.trim()}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-12 bg-gradient-to-b from-blue-50 to-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-3">Search Results for {category}</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Showing results for "{query}"
        </p>
      </motion.div>

      {loading && (
        <div className="text-center text-gray-600">Loading results...</div>
      )}

      {error && (
        <div className="text-center text-red-600">Error: {error}</div>
      )}

      {!loading && !error && results.length === 0 && (
        <div className="text-center text-gray-600">No results found for "{query}" in {category}</div>
      )}

      {!loading && !error && results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((item) => (
            <div key={item.id}>{renderCard(item)}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResults;