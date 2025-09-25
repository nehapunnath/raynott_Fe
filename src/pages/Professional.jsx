import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaTimes, FaHome, FaStar, FaPhone, FaMapMarkerAlt, FaGraduationCap, FaChalkboardTeacher, FaUniversity } from "react-icons/fa";
import { BsCashStack, BsFillCalendar2CheckFill } from "react-icons/bs";
import StickyButton from '../components/StickyButton';
import { teacherApi } from '../services/TeacherApi';

const professionalTypes = ['School', 'College', 'PU College', 'Coaching Institute'];

function Professional() {
    const [teachers, setTeachers] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        subjects: [],
        experience: [0, 20],
        qualification: [],
        teachingMode: [],
        minRating: 0,
        location: ['Bangalore', 'Hyderabad', 'Mumbai', 'Kolkata', 'Delhi', 'Chennai'], 
        institutionType: professionalTypes
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const subjectOptions = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science', 'Economics', 'Business Studies', 'Social Studies', 'Languages', 'Commerce', 'Arts'];
    const qualificationOptions = ['B.Ed', 'M.Ed', 'PhD', 'Post Graduate', 'Graduate', 'M.Sc', 'M.A', 'B.Sc', 'B.A'];
    const teachingModeOptions = ['Online', 'Offline', 'Both'];
    const ratingOptions = [0, 3, 3.5, 4, 4.5];

    const nav = useNavigate();

    useEffect(() => {
        fetchTeachers();
        window.scrollTo(0, 0);
    }, []);

    const fetchTeachers = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('Fetching professional teachers with filters:', filters);

            const response = await teacherApi.getProfessionalTeachers({
                city: filters.location,
                subjects: filters.subjects.join(','), // Convert array to comma-separated string
                institutionType: filters.institutionType.join(','), // Ensure all professional types
                teachingMode: filters.teachingMode.join(','), // Convert array to comma-separated string
                minHourlyRate: filters.minRating, // Assuming minRating is used as a proxy; adjust if you have specific rate filters
                // Add experience filter if backend supports it
            });

            console.log('API response:', response);

            if (response.success) {
                let teachersData = [];

                if (Array.isArray(response.data)) {
                    teachersData = response.data;
                } else if (response.data && typeof response.data === 'object') {
                    teachersData = Object.keys(response.data).map(key => ({
                        id: key,
                        ...response.data[key]
                    }));
                }

                console.log('Professional teachers data:', teachersData);
                setTeachers(teachersData);
            } else {
                console.log('No professional teachers found');
                setTeachers([]);
            }
        } catch (err) {
            console.error('Error fetching professional teachers:', err);
            setError(err.message || 'Failed to load professional teachers');
            setTeachers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => {
            if (filterType === 'experience' || filterType === 'minRating') {
                return { ...prev, [filterType]: value };
            } else {
                const currentValues = [...prev[filterType]];
                const index = currentValues.indexOf(value);
                if (index === -1) {
                    currentValues.push(value);
                } else {
                    currentValues.splice(index, 1);
                }
                return { ...prev, [filterType]: currentValues };
            }
        });
    };

    const applyFilters = () => {
        console.log('Applying filters:', filters);
        fetchTeachers();
        setIsFilterOpen(false);
    };

    const resetFilters = () => {
        const resetFilters = {
            subjects: [],
            experience: [0, 20],
            qualification: [],
            teachingMode: [],
            minRating: 0,
            location: ['Bengaluru', 'Hyderabad', 'Mumbai', 'Kolkata', 'Delhi', 'Chennai'],
            institutionType: professionalTypes
        };
        setFilters(resetFilters);
        fetchTeachers();
    };

    const filteredTeachers = teachers.filter(teacher => {
        if (!searchQuery) return true;
        return teacher.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            teacher.subjects?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="bg-orange-50 min-h-screen font-sans">
            {/* Header */}
            <header className="bg-orange-600 shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 flex flex-col md:flex-row items-center justify-between">
                    <div className="flex w-full md:w-auto justify-between items-center mb-4 md:mb-0">
                        <Link to="/" className="text-3xl font-extrabold text-white">
                            <motion.span whileHover={{ scale: 1.05 }}>
                                Raynott
                            </motion.span>
                        </Link>
                    </div>

                    <div className="relative w-full max-w-2xl md:max-w-xl flex-grow md:ml-8">
                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400" />
                        <input
                            type="text"
                            placeholder="Search professional teachers, subjects..."
                            className="pl-12 pr-4 py-3 rounded-full bg-white border border-transparent text-gray-800 focus:outline-none w-full focus:ring-2 focus:ring-orange-200 focus:border-transparent shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="hidden md:flex space-x-4 ml-8">
                        <motion.button
                            className="bg-white border border-white text-orange-600 hover:bg-orange-100 font-semibold py-2 px-4 rounded-full transition duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => nav('/bookdemo')}
                        >
                            Book A Demo
                        </motion.button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="bg-white p-6 rounded-lg shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <div className="text-sm text-gray-500 flex items-center">
                            <Link to="/" className="flex items-center hover:text-orange-600">
                                <FaHome className="mr-1 text-orange-500" />
                                Home
                            </Link>
                            <span className="mx-2">»</span>
                            <Link to="/all-teachers" className="hover:text-orange-600">Teachers</Link>
                            <span className="mx-2">»</span>
                            <span className="text-orange-600">Professional Teachers</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mt-2 flex items-center">
                            <FaUniversity className="mr-3 text-orange-500" />
                            Professional Teachers
                        </h1>
                        <p className="text-lg text-gray-600 flex items-center mt-1">
                            <BsFillCalendar2CheckFill className="mr-2 text-orange-500" />
                            {filteredTeachers.length} Professional Teachers Available
                        </p>
                    </div>
                    <motion.button
                        className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300 mt-4 md:mt-0 flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsFilterOpen(true)}
                    >
                        <FaFilter className="mr-2" />
                        Filters
                    </motion.button>
                </div>

                {/* Loading and Error States */}
                {loading && (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                        <p className="text-lg text-gray-600 mt-4">Loading professional teachers...</p>
                    </div>
                )}

                {error && (
                    <div className="text-center py-8">
                        <p className="text-lg text-red-600 mb-4">{error}</p>
                        <button
                            onClick={fetchTeachers}
                            className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Teachers List */}
                {!loading && !error && (
                    <>
                        <div className="mb-6">
                            {/* <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                Professional Teachers in {filters.location}
                            </h2> */}

                            {filteredTeachers.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                                    <FaUniversity className="text-6xl text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Professional Teachers Found</h3>
                                    <p className="text-gray-600 mb-4">We couldn't find any professional teachers matching your criteria.</p>
                                    <button
                                        onClick={resetFilters}
                                        className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredTeachers.map((teacher) => (
                                        <Link to={`/professional-teachers-details/${id}`} key={teacher.id} className="group">
                                            <motion.div
                                                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-full"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5 }}
                                                whileHover={{ y: -5 }}
                                            >
                                                <div className="relative h-48 w-full overflow-hidden">
                                                    <img
                                                        src={teacher.profileImage || 'https://via.placeholder.com/300x200?text=Teacher+Image'}
                                                        alt={teacher.name}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/300x200?text=Teacher+Image';
                                                        }}
                                                    />
                                                    {/* {teacher.demoFee?.toLowerCase() === 'free' && (
                                                        <div className="absolute top-4 left-4 bg-yellow-500 text-dark text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                                            Free Demo
                                                        </div>
                                                    )}
                                                    <div className="absolute top-4 right-4 flex items-center bg-white/90 text-orange-600 px-3 py-1 rounded-full shadow-lg backdrop-blur-sm">
                                                        <span className="font-bold mr-1">{teacher.rating || '4.5'}</span>
                                                        <FaStar className="w-4 h-4 fill-current" />
                                                    </div> */}
                                                </div>

                                                <div className="p-4 flex flex-col flex-grow">
                                                    <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide">
                                                        {teacher.institutionType || 'Professional Teacher'}
                                                    </p>
                                                    <h3 className="text-lg font-bold text-gray-900 mt-1 line-clamp-2">{teacher.name || 'Teacher Name'}</h3>

                                                    <p className="text-sm text-gray-500 flex items-center mt-2">
                                                        <FaMapMarkerAlt className="mr-1 text-orange-400" />
                                                        <span className="line-clamp-1">{teacher.city || 'Location not specified'}</span>
                                                    </p>

                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        {(teacher.subjects?.split(',') || ['General']).map((subject, index) => (
                                                            <span key={index} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                                                                {subject.trim()}
                                                            </span>
                                                        ))}
                                                    </div>

                                                    <div className="mt-3 space-y-2">
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <FaGraduationCap className="mr-2 text-orange-500" />
                                                            <span>{teacher.qualification || 'Qualification not specified'}</span>
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <BsFillCalendar2CheckFill className="mr-2 text-orange-500" />
                                                            <span>{teacher.experience || 'Experience not specified'}</span>
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <BsCashStack className="mr-2 text-orange-500" />
                                                            <span>{teacher.hourlyRate || 'Rate not specified'}</span>
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <FaChalkboardTeacher className="mr-2 text-orange-500" />
                                                            <span>{teacher.teachingMode || 'Teaching mode not specified'}</span>
                                                        </div>
                                                    </div>

                                                    <div className="mt-auto pt-4">
                                                        <div className="flex justify-between items-center space-x-2">
                                                            <motion.button
                                                                className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium py-2 px-3 rounded-lg w-full transition duration-300"
                                                                whileHover={{ scale: 1.02 }}
                                                                whileTap={{ scale: 0.98 }}
                                                            >
                                                                View Profile
                                                            </motion.button>
                                                            <motion.button
                                                                className="bg-transparent border border-orange-600 text-orange-600 hover:bg-orange-50 font-medium rounded-lg w-10 h-10 flex items-center justify-center transition duration-300"
                                                                whileHover={{ scale: 1.02 }}
                                                                whileTap={{ scale: 0.98 }}
                                                            >
                                                                <FaPhone />
                                                            </motion.button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>

            {/* Filter Modal */}
            <AnimatePresence>
                {isFilterOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            transition={{ type: "spring", damping: 25 }}
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center border-b pb-4 mb-4">
                                    <h2 className="text-2xl font-bold text-gray-800">Filter Professional Teachers</h2>
                                    <button onClick={() => setIsFilterOpen(false)} className="text-gray-500 hover:text-gray-700">
                                        <FaTimes className="text-xl" />
                                    </button>
                                </div>

                                {/* Experience Range Filter */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold mb-3 text-gray-700">Years of Experience</h3>
                                    <div className="px-2">
                                        <input
                                            type="range"
                                            min="0"
                                            max="20"
                                            step="1"
                                            value={filters.experience[1]}
                                            onChange={(e) => handleFilterChange('experience', [filters.experience[0], parseInt(e.target.value)])}
                                            className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <div className="flex justify-between mt-2">
                                            <span className="text-sm text-gray-600">0 years</span>
                                            <span className="text-sm text-gray-600">20+ years</span>
                                        </div>
                                        <div className="mt-2 text-center font-medium text-orange-600">
                                            {filters.experience[0]} - {filters.experience[1]} years
                                        </div>
                                    </div>
                                </div>

                                {/* Minimum Rating Filter */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold mb-3 text-gray-700">Minimum Rating</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {ratingOptions.map((rating) => (
                                            <button
                                                key={rating}
                                                onClick={() => handleFilterChange('minRating', rating)}
                                                className={`px-4 py-2 rounded-full ${filters.minRating === rating ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                            >
                                                {rating === 0 ? 'Any' : `${rating}+`}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Subjects Filter */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold mb-3 text-gray-700">Subjects</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {subjectOptions.map((subject) => (
                                            <label key={subject} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.subjects.includes(subject)}
                                                    onChange={() => handleFilterChange('subjects', subject)}
                                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                                />
                                                <span className="ml-2 text-gray-700">{subject}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Qualification Filter */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold mb-3 text-gray-700">Qualifications</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {qualificationOptions.map((qualification) => (
                                            <label key={qualification} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.qualification.includes(qualification)}
                                                    onChange={() => handleFilterChange('qualification', qualification)}
                                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                                />
                                                <span className="ml-2 text-gray-700">{qualification}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Teaching Mode Filter */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold mb-3 text-gray-700">Teaching Mode</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {teachingModeOptions.map((mode) => (
                                            <label key={mode} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.teachingMode.includes(mode)}
                                                    onChange={() => handleFilterChange('teachingMode', mode)}
                                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                                />
                                                <span className="ml-2 text-gray-700">{mode}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-between border-t pt-4">
                                    <button onClick={resetFilters} className="px-4 py-2 text-orange-600 font-medium hover:bg-orange-50 rounded-lg">
                                        Reset All
                                    </button>
                                    <div className="space-x-3">
                                        <button onClick={() => setIsFilterOpen(false)} className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50">
                                            Cancel
                                        </button>
                                        <button onClick={applyFilters} className="px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700">
                                            Apply Filters
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <StickyButton />
        </div>
    );
}

export default Professional;