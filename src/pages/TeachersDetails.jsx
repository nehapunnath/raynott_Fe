import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaChalkboardTeacher,
  FaSearch,
  FaStar,
  FaPhone,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaBook,
  FaClock,
  FaMoneyBillWave,
  FaLaptop,
  FaUserGraduate,
  FaCertificate,
  FaRegHeart,
  FaHeart
} from 'react-icons/fa';
import { IoMdTime } from 'react-icons/io';
import { Link, useNavigate, useParams } from 'react-router-dom';
import StickyButton from '../components/StickyButton';
import BasicInfo from '../components/Teacher/BasicInfo';
import Contact from '../components/Teacher/Contact';
import Review from '../components/Teacher/Review';
import { teacherApi } from '../services/TeacherApi';
import FeeStructure from '../components/Teacher/FeeStructure';

const TeachersDetails = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams(); // Get the teacher ID from the URL
  const nav = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchTeacherDetails();
  }, [id]);

  const fetchTeacherDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await teacherApi.getProfessionalTeacherDetails(id);
      if (response.success) {
        // Map API response to the expected teacher object structure
        const teacherData = {
          id: response.data.id,
          name: response.data.basicInfo.name || 'Not specified',
          subjects: response.data.basicInfo.subjects || [],
          qualification: response.data.basicInfo.qualification || 'Not specified',
          experience: response.data.basicInfo.experience || 'Not specified',
          rating: response.data.basicInfo.rating || 4.5,
          location: `${response.data.basicInfo.address}, ${response.data.basicInfo.city}` || 'Not specified',
          fees: response.data.teachingDetails.hourlyRate || 'Not specified',
          teachingMode: response.data.teachingDetails.teachingMode
            ? response.data.teachingDetails.teachingMode.split(',').map(mode => mode.trim())
            : ['Not specified'],
          demoAvailable: response.data.teachingDetails.demoFee?.toLowerCase() === 'free',
          image: response.data.basicInfo.profileImage || 'https://via.placeholder.com/300x200?text=Teacher+Image',
          about: response.data.about || 'No description available',
          specialization: response.data.specialization.specialization || [],
          certifications: response.data.specialization.certifications || [],
          availability: response.data.availability.availability || 'Not specified',
          languages: response.data.specialization.languages || [],
          photos: response.data.facilities && response.data.facilities.length > 0
            ? response.data.facilities // Use facilities as photos if available
            : [
              'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
              'https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
              'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
            ], // Fallback photos if none provided
          phone: response.data.contact.phone || 'Not specified'
        };
        setTeacher(teacherData);
      } else {
        setError('Failed to fetch teacher details');
      }
    } catch (err) {
      console.error('Error fetching teacher details:', err);
      setError(err.message || 'Failed to load teacher details');
    } finally {
      setLoading(false);
    }
  };



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
    if (!teacher) return;
    let newIndex;
    if (direction === 'prev') {
      newIndex = currentImageIndex === 0 ? teacher.photos.length - 1 : currentImageIndex - 1;
    } else {
      newIndex = currentImageIndex === teacher.photos.length - 1 ? 0 : currentImageIndex + 1;
    }
    setSelectedImage(teacher.photos[newIndex]);
    setCurrentImageIndex(newIndex);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="text-lg text-gray-600 mt-4">Loading teacher details...</p>
        </div>
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">{error || 'Teacher not found'}</p>
          <button
            onClick={() => nav('/professional-teachers')}
            className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
          >
            Back to Professional Teachers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="bg-orange-600 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:py-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex w-full md:w-auto justify-between items-center mb-4 md:mb-0">
            <Link to="/" className="text-3xl font-extrabold text-white">
              <motion.span whileHover={{ scale: 1.05 }}>
                Raynott
              </motion.span>
            </Link>
          </div>

          {/* <div className="relative w-full max-w-2xl md:max-w-xl flex-grow md:ml-8">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400" />
            <input
              type="text"
              placeholder="Search teachers, subjects..."
              className="pl-12 pr-4 py-3 rounded-full bg-white border border-transparent text-gray-800 focus:outline-none w-full focus:ring-2 focus:ring-orange-200 focus:border-transparent shadow-sm"
            />
          </div> */}

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

      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative max-w-7xl mx-auto mt-8 rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10"></div>
        <img
          src={teacher.image}
          alt={teacher.name}
          className="w-full h-[32rem] object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=Teacher+Image';
          }}
        />

        <div className="absolute bottom-0 left-0 right-0 z-20 p-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <motion.h1
                className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {teacher.name}
              </motion.h1>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <FaGraduationCap className="mr-1 text-orange-300" />
                  <span>{teacher.qualification}</span>
                </div>
                <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <FaMapMarkerAlt className="mr-1 text-orange-300" />
                  <span>{teacher.location}</span>
                </div>
                <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <IoMdTime className="mr-1 text-orange-300" />
                  <span>{teacher.experience} experience</span>
                </div>
              </div>
            </div>

            <motion.button
              onClick={() => setIsFavorite(!isFavorite)}
              className="text-3xl text-white hover:text-amber-300 transition-colors"
              whileTap={{ scale: 0.9 }}
            >
              {isFavorite ? <FaHeart className="text-amber-300" /> : <FaRegHeart />}
            </motion.button>
          </div>

          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* <div className="flex items-center text-amber-300 text-xl">
                <FaStar className="mr-1" /> {teacher.rating}
              </div>
              <p className="text-xl font-semibold text-white">{teacher.fees}</p> */}
            </div>

            <div className="flex space-x-4">
              {teacher.demoAvailable && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-orange-600 font-semibold py-3 px-6 rounded-full flex items-center transition-all duration-300 shadow-lg"
                >
                  <FaChalkboardTeacher className="mr-2" /> Book Demo
                </motion.button>
              )}
              <motion.a
                href={`tel:${teacher.phone}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-full flex items-center transition-all duration-300 shadow-lg"
              >
                <FaPhone className="mr-2" /> Contact
              </motion.a>
            </div>
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
            {['Basic Info', 'Fee Structure', 'Contact', 'Reviews'].map((section) => (
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
                About the Teacher
              </h2>
              <BasicInfo />
            </div>
          </motion.div>

          {/* Teaching Details */}
          <motion.div
            id="teaching"
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

          {/* Gallery Section */}
          {/* <motion.div
            id="gallery"
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                Teacher Gallery
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {teacher.photos.map((photo, index) => (
                  <motion.div
                    key={index}
                    className="relative aspect-square overflow-hidden rounded-xl cursor-pointer group"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => openImage(photo, index)}
                  >
                    <img
                      src={photo}
                      alt={`${teacher.name} - Photo ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=Photo+Not+Available';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.div>
                ))}
              </div>

              <p className="text-sm text-gray-500 mt-4 text-center">
                Click on any photo to view in full size
              </p>
            </div>
          </motion.div> */}

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

          {/* Reviews */}
          <motion.div
            id="reviews"
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                Reviews
              </h2>
              <Review teacherId={id} type="professional" />
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
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Book a Session</h3>
              <p className="mb-6 text-gray-600">Schedule a class with {teacher.name.split(' ')[0]}</p>

              <div className="space-y-4">
                <motion.input
                  type="text"
                  placeholder="Student's Name"
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
                  <option value="">Select Subject</option>
                  {teacher.subjects.map((subject, index) => (
                    <option key={index} value={subject}>{subject}</option>
                  ))}
                </motion.select>
                <motion.select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700"
                  whileFocus={{ scale: 1.02 }}
                >
                  <option value="">Select Teaching Mode</option>
                  {teacher.teachingMode.map((mode, index) => (
                    <option key={index} value={mode}>{mode}</option>
                  ))}
                </motion.select>
                <motion.textarea
                  placeholder="Your Learning Goals"
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
                  Book Now
                </motion.button>
              </div>
            </div>
          </div>

          {/* Quick Facts */}
          <div className="mt-6 bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Facts</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-full mr-3">
                    <FaBook className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Subjects</p>
                    <p className="font-medium">{teacher.subjects.join(', ')}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-full mr-3">
                    <FaClock className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-medium">{teacher.experience}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-full mr-3">
                    <FaMoneyBillWave className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fees</p>
                    <p className="font-medium">{teacher.fees}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-full mr-3">
                    <FaLaptop className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Teaching Mode</p>
                    <p className="font-medium">{teacher.teachingMode.join(', ')}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-full mr-3">
                    <FaUserGraduate className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Specialization</p>
                    <p className="font-medium">{teacher.specialization.join(', ')}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-full mr-3">
                    <FaCertificate className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Certifications</p>
                    <p className="font-medium">{teacher.certifications.join(', ')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Similar Teachers */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto mt-16 px-4 pb-4"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Similar Teachers You Might Like</h2>
        <p className="text-lg text-center text-gray-600 mb-8">Discover other great educators in {teacher.location.split(', ')[1]}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {similarTeachers.map((teacher, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={teacher.image}
                  alt={teacher.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">{teacher.name}</h3>
                    <div className="flex items-center bg-white/90 text-amber-600 px-2 py-1 rounded-full">
                      <FaStar className="mr-1" />
                      <span className="font-bold">{teacher.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <p className="text-gray-600 mb-3 flex items-center">
                  <FaBook className="mr-2 text-orange-500" />
                  {teacher.subjects.join(', ')}
                </p>
                <motion.a
                  href={teacher.link}
                  whileHover={{ color: '#EA580C' }}
                  className="inline-block text-orange-600 font-medium hover:underline"
                >
                  View Profile →
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div> */}

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
            alt={`${teacher.name} - Photo ${currentImageIndex + 1}`}
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
            Photo {currentImageIndex + 1} of {teacher.photos.length}
          </div>
        </motion.div>
      )}
      <StickyButton />
    </div>
  );
};

export default TeachersDetails;