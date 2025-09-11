
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FaBookOpen,
    FaSearch,
    FaStar,
    FaPhone,
    FaMapMarkerAlt,
    FaGraduationCap,
    FaChevronLeft,
    FaChevronRight,
    FaTimes
} from 'react-icons/fa';
import { IoMdTime } from 'react-icons/io';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { puCollegeApi } from '../services/pucollegeApi';
import StickyButton from '../components/StickyButton';
import BasicInfo from '../components/PuCollege/BasicInfo';
import FeeStructure from '../components/PuCollege/FeeStructure';
import Contact from '../components/PuCollege/Contact';

// City name normalization map for display purposes
const cityNormalizationMap = {
  'bangalore': 'Bengaluru',
  'bengaluru': 'Bengaluru',
  'mumbai': 'Mumbai',
  'delhi': 'Delhi',
  'chennai': 'Chennai',
  'hyderabad': 'Hyderabad',
  'kolkata': 'Kolkata',
  'pune': 'Pune',
};

const PUCollegeDetails = () => {
    const { id } = useParams(); // Get college ID from URL
    const navigate = useNavigate();
    const [puCollege, setPUCollege] = useState(null);
    const [similarPUColleges, setSimilarPUColleges] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Normalize city name for display
    const normalizeCity = (city) => {
        if (!city) return 'Unknown';
        const cleanCity = city.trim().toLowerCase();
        return cityNormalizationMap[cleanCity] || city;
    };

    // Fetch college details and similar colleges
    useEffect(() => {
        const fetchCollegeDetails = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch specific college by ID
                const collegeResponse = await puCollegeApi.getPUCollege(id);
                console.log('College API response:', collegeResponse);

                if (!collegeResponse.success || !collegeResponse.data) {
                    throw new Error('College not found');
                }

                const collegeData = collegeResponse.data;
                const mappedCollege = {
                    id: collegeData.id || collegeData._id || id,
                    name: collegeData.name || 'Unnamed College',
                    address: collegeData.address || 'Unknown Location',
                    city: normalizeCity(collegeData.city || collegeData.addressCity || collegeData.location || 'Unknown'),
                    fees: collegeData.totalAnnualFee 
                        ? `₹${Number(collegeData.totalAnnualFee).toLocaleString()}/year`
                        : '₹30,000/year',
                    rating: collegeData.rating || (Math.random() * (5 - 4) + 4).toFixed(1),
                    board: collegeData.board || 'Karnataka PU Board',
                    phone: collegeData.phone || '+91 9876543210',
                    image: collegeData.collegeImage || 
                           'https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    established: collegeData.established || 2010,
                    streams: Array.isArray(collegeData.streams) 
                        ? collegeData.streams 
                        : (typeof collegeData.streams === 'string' ? collegeData.streams.split(', ') : ['Science', 'Commerce']),
                    facilities: Array.isArray(collegeData.facilities) 
                        ? collegeData.facilities 
                        : (typeof collegeData.facilities === 'string' ? collegeData.facilities.split(', ') : ['Smart Classes', 'Laboratories', 'Library']),
                    photos: collegeData.photos && Array.isArray(collegeData.photos) && collegeData.photos.length > 0 
                        ? collegeData.photos 
                        : [
                            'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
                            'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
                            'https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
                        ]
                };
                setPUCollege(mappedCollege);

                // Fetch similar colleges
                const allCollegesResponse = await puCollegeApi.getPUColleges();
                console.log('All Colleges API response:', allCollegesResponse);

                let collegesArray = [];
                if (allCollegesResponse.success && allCollegesResponse.data) {
                    collegesArray = Array.isArray(allCollegesResponse.data) 
                        ? allCollegesResponse.data 
                        : Object.values(allCollegesResponse.data);
                }

                // Filter similar colleges (e.g., same city or streams, excluding the current college)
                const similarColleges = collegesArray
                    .filter(college => college.id !== id && (
                        college.city === collegeData.city || 
                        (Array.isArray(college.streams) && college.streams.some(s => mappedCollege.streams.includes(s)))
                    ))
                    .slice(0, 3) // Limit to 3 similar colleges
                    .map(college => ({
                        id: college.id || college._id || Math.random().toString(36).substr(2, 9),
                        name: college.name || 'Unnamed College',
                        address: college.address || 'Unknown Location',
                        rating: college.rating || (Math.random() * (5 - 4) + 4).toFixed(1),
                        image: college.collegeImage || 
                               'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
                        link: `/pucollege-details/${college.id || college._id}`
                    }));

                console.log('Similar colleges:', similarColleges);
                setSimilarPUColleges(similarColleges);

            } catch (err) {
                console.error('Error fetching PU College:', err);
                setError('Failed to load college details. Please try again later.');
                setPUCollege(null);
                setSimilarPUColleges([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCollegeDetails();
        window.scrollTo(0, 0);
    }, [id]);

    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const openImage = (image, index) => {
        setSelectedImage(image);
        setCurrentImageIndex(index);
    };

    const closeImage = () => {
        setSelectedImage(null);
    };

    const navigateImages = (direction) => {
        if (!puCollege) return;
        let newIndex;
        if (direction === 'prev') {
            newIndex = currentImageIndex === 0 ? puCollege.photos.length - 1 : currentImageIndex - 1;
        } else {
            newIndex = currentImageIndex === puCollege.photos.length - 1 ? 0 : currentImageIndex + 1;
        }
        setSelectedImage(puCollege.photos[newIndex]);
        setCurrentImageIndex(newIndex);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
            {/* Header */}
            <header className="bg-orange-600 shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 flex flex-col md:flex-row items-center justify-between">
                    <div className="flex w-full md:w-auto justify-between items-center mb-4 md:mb-0">
                        <Link to="/" className="text-3xl font-extrabold text-white">
                            <motion.span whileHover={{ scale: 1.05 }}>
                                Raynott
                            </motion.span>
                        </Link>
                        <div className="md:hidden flex space-x-2">
                            <motion.button
                                className="bg-white text-orange-600 font-semibold py-2 px-4 rounded-full transition duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Demo
                            </motion.button>
                            <motion.button
                                className="bg-white text-orange-600 font-semibold py-2 px-4 rounded-full transition duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaBookOpen />
                            </motion.button>
                        </div>
                    </div>
                    <div className="relative w-full max-w-2xl md:max-w-xl flex-grow md:ml-8">
                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400" />
                        <input
                            type="text"
                            placeholder="Search PU Colleges across India..."
                            className="pl-12 pr-4 py-3 rounded-full bg-white border border-transparent text-gray-800 focus:outline-none w-full focus:ring-2 focus:ring-orange-200 focus:border-transparent shadow-sm"
                        />
                    </div>
                    <div className="hidden md:flex space-x-4 ml-8">
                        <motion.button
                            className="bg-white border border-white text-orange-600 hover:bg-orange-100 font-semibold py-2 px-4 rounded-full transition duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/bookdemo')}
                        >
                            Book A Demo
                        </motion.button>
                    </div>
                </div>
            </header>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center h-64 max-w-7xl mx-auto mt-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="text-center text-red-600 font-medium p-8 max-w-7xl mx-auto mt-8">
                    {error}
                </div>
            )}

            {/* Main Content */}
            {puCollege && !loading && !error && (
                <>
                    {/* Hero Banner */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="relative max-w-7xl mx-auto mt-8 rounded-3xl overflow-hidden shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10"></div>
                        <img
                            src={puCollege.image}
                            alt={puCollege.name}
                            className="w-full h-[32rem] object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 z-20 p-8 text-white">
                            <motion.h1
                                className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                {puCollege.name}
                            </motion.h1>
                            <div className="flex flex-wrap items-center gap-4 mb-4">
                                <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                    <FaMapMarkerAlt className="mr-1 text-orange-300" />
                                    <span>{puCollege.address}, {puCollege.city}</span>
                                </div>
                                <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                    <FaGraduationCap className="mr-1 text-orange-300" />
                                    <span>{puCollege.board}</span>
                                </div>
                                <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                    <IoMdTime className="mr-1 text-orange-300" />
                                    <span>Est. {puCollege.established}</span>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center justify-between">
                                <div className="flex items-center space-x-6">
                                    <div className="flex items-center text-amber-300 text-xl">
                                        <FaStar className="mr-1" /> {puCollege.rating}
                                    </div>
                                    <p className="text-xl font-semibold text-white">{puCollege.fees}</p>
                                </div>
                                <motion.a
                                    href={`tel:${puCollege.phone}`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-3 px-8 rounded-full flex items-center transition-all duration-300 shadow-lg"
                                >
                                    <FaPhone className="mr-2" /> Call Now
                                </motion.a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Navigation Tabs */}
                    <motion.div
                        className="max-w-7xl mx-auto mt-8 px-4 sticky top-[76px] z-40"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="flex overflow-x-auto scrollbar-hide justify-center bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-1 shadow-inner">
                                {['Basic Info', 'Photos', 'Streams', 'Fee Structure', 'Contact'].map((section) => (
                                    <motion.button
                                        key={section}
                                        onClick={() => scrollToSection(section.replace(/\s+/g, '').toLowerCase())}
                                        className="flex-shrink-0 px-8 py-4 relative group"
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <span className="text-2xl font-bold font-['Poppins'] bg-clip-text bg-gradient-to-r text-amber-900 transition-all duration-300">
                                            {section}
                                        </span>
                                        <motion.div
                                            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                                            initial={{ width: 0 }}
                                            whileHover={{ width: '80%' }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                        />
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <div className="max-w-7xl mx-auto mt-6 px-4 flex flex-col lg:flex-row gap-8">
                        {/* Left Column - Scrollable */}
                        <div className="w-full lg:w-2/3 space-y-8">
                            {/* Basic Info */}
                            <motion.div
                                id="basicinfo"
                                className="bg-white rounded-2xl shadow-lg overflow-hidden"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true, margin: "-100px" }}
                            >
                                <div className="p-6">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                        <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                                        PU College Information
                                    </h2>
                                    <BasicInfo />
                                </div>
                            </motion.div>

                            {/* Photos Section */}
                            <motion.div
                                id="photos"
                                className="bg-white rounded-2xl shadow-lg overflow-hidden"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true, margin: "-100px" }}
                            >
                                <div className="p-6">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                        <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                                        PU College Gallery
                                    </h2>
                                    {puCollege.photos && puCollege.photos.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                            {puCollege.photos.map((photo, index) => (
                                                <motion.div
                                                    key={index}
                                                    className="relative aspect-square overflow-hidden rounded-xl cursor-pointer group"
                                                    whileHover={{ scale: 1.02 }}
                                                    onClick={() => openImage(photo, index)}
                                                >
                                                    <img
                                                        src={photo}
                                                        alt={`${puCollege.name} - Photo ${index + 1}`}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                        loading="lazy"
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/300?text=Image+Not+Found';
                                                        }}
                                                    />
                                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center">No photos available for this PU college.</p>
                                    )}
                                    {puCollege.photos && puCollege.photos.length > 0 && (
                                        <p className="text-sm text-gray-500 mt-4 text-center">
                                            Click on any photo to view in full size
                                        </p>
                                    )}
                                </div>
                            </motion.div>

                            {/* Streams Section */}
                            <motion.div
                                id="streams"
                                className="bg-white rounded-2xl shadow-lg overflow-hidden"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true, margin: "-100px" }}
                            >
                                <div className="p-6">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                        <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                                        Streams Offered
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {puCollege.streams.map((stream, index) => (
                                            <div key={index} className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                                                <h3 className="font-bold text-lg text-orange-800">{stream}</h3>
                                                {/* <p className="mt-2 text-gray-600 text-sm">
                                                    {stream.includes('Science') 
                                                        ? 'Physics, Chemistry, Mathematics, Biology'
                                                        : stream.includes('Commerce')
                                                        ? 'Accountancy, Business Studies, Economics'
                                                        : 'History, Political Science, Sociology'}
                                                </p> */}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Fee Structure */}
                            <motion.div
                                id="feestructure"
                                className="bg-white rounded-2xl shadow-lg overflow-hidden"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true, margin: "-100px" }}
                            >
                                <div className="p-6">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                        <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                                        Fee Structure
                                    </h2>
                                    <FeeStructure />
                                </div>
                            </motion.div>

                            {/* Contact */}
                            <motion.div
                                id="contact"
                                className="bg-white rounded-2xl shadow-lg overflow-hidden"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true, margin: "-100px" }}
                            >
                                <div className="p-6">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                        <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                                        Contact Details
                                    </h2>
                                    <Contact />
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Column - Fixed Form */}
                        <motion.div
                            className="w-full lg:w-1/3 lg:sticky lg:top-[140px] self-start pt-2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100">
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold mb-4 text-gray-800">Free Counselling</h3>
                                    <p className="mb-6 text-gray-600">Get personalized guidance from our education experts</p>
                                    <div className="space-y-4">
                                        <motion.input
                                            type="text"
                                            placeholder="Student/Parent Name"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400 text-gray-700"
                                            whileFocus={{ scale: 1.02 }}
                                        />
                                        <motion.input
                                            type="tel"
                                            placeholder="Mobile Number"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400 text-gray-700"
                                            whileFocus={{ scale: 1.02 }}
                                        />
                                        <motion.select
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700"
                                            whileFocus={{ scale: 1.02 }}
                                        >
                                            <option value="">Select Stream</option>
                                            <option value="science">Science</option>
                                            <option value="commerce">Commerce</option>
                                            <option value="arts">Arts</option>
                                        </motion.select>
                                        <motion.textarea
                                            placeholder="Your Questions"
                                            rows="4"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400 text-gray-700"
                                            whileFocus={{ scale: 1.02 }}
                                        />
                                        <motion.button
                                            type="button"
                                            whileHover={{ scale: 1.03, boxShadow: '0 4px 15px rgba(249, 115, 22, 0.3)' }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white py-3 rounded-lg font-bold hover:from-orange-600 hover:to-amber-700 transition-all shadow-lg"
                                        >
                                            Get Free Consultation
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100">
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Facts</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <div className="p-2 bg-orange-100 rounded-full mr-3">
                                                <FaGraduationCap className="text-orange-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Board</p>
                                                <p className="font-medium">{puCollege.board}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="p-2 bg-orange-100 rounded-full mr-3">
                                                <IoMdTime className="text-orange-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Established</p>
                                                <p className="font-medium">{puCollege.established}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="p-2 bg-orange-100 rounded-full mr-3">
                                                <FaBookOpen className="text-orange-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Streams</p>
                                                <p className="font-medium">{puCollege.streams.join(', ')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Similar PU Colleges */}
                    {/* {similarPUColleges.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="max-w-7xl mx-auto mt-16 px-4 pb-4"
                        >
                            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Similar PU Colleges</h2>
                            <p className="text-lg text-center text-gray-600 mb-8">Discover other great educational options</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {similarPUColleges.map((college) => (
                                    <motion.div
                                        key={college.id}
                                        whileHover={{ y: -8 }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                        className="bg-white rounded-xl shadow-lg overflow-hidden"
                                    >
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={college.image}
                                                alt={college.name}
                                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                                <div className="flex justify-between items-center">
                                                    <h3 className="text-lg font-semibold text-white">{college.name}</h3>
                                                    <div className="flex items-center bg-white/90 text-amber-600 px-2 py-1 rounded-full">
                                                        <FaStar className="mr-1" />
                                                        <span className="font-bold">{college.rating}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <p className="text-gray-600 mb-3 flex items-center">
                                                <FaMapMarkerAlt className="mr-2 text-orange-500" />
                                                {college.address}
                                            </p>
                                            <Link
                                                to={college.link}
                                                className="inline-block text-orange-600 font-medium hover:underline"
                                            >
                                                View Details →
                                            </Link>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )} */}

                    {/* Image Modal */}
                    {selectedImage && (
                        <motion.div
                            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <button
                                className="absolute top-4 right-4 text-white text-3xl"
                                onClick={closeImage}
                            >
                                <FaTimes />
                            </button>
                            <button
                                className="absolute left-4 text-white text-3xl bg-black/50 rounded-full p-2"
                                onClick={() => navigateImages('prev')}
                            >
                                <FaChevronLeft />
                            </button>
                            <motion.img
                                src={selectedImage}
                                alt={`${puCollege.name} - Photo ${currentImageIndex + 1}`}
                                className="max-w-full max-h-screen object-contain"
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.9 }}
                            />
                            <button
                                className="absolute right-4 text-white text-3xl bg-black/50 rounded-full p-2"
                                onClick={() => navigateImages('next')}
                            >
                                <FaChevronRight />
                            </button>
                            <div className="absolute bottom-4 left-0 right-0 text-center text-white">
                                Photo {currentImageIndex + 1} of {puCollege.photos.length}
                            </div>
                        </motion.div>
                    )}
                </>
            )}

            <StickyButton />
        </div>
    );
};

export default PUCollegeDetails;
