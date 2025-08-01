import React from 'react';
import { motion } from 'framer-motion';
import { FaBookOpen, FaSearch, FaStar, FaPhone, FaMapMarkerAlt, FaGraduationCap } from 'react-icons/fa';
import { IoMdTime } from 'react-icons/io';
import BasicInfo from '../components/BasicInfo';
import FeesStructure from '../components/FeesStructure';
import Contact from '../components/Contact';
import Review from '../components/Review';
import { useEffect } from 'react';

const SchoolDetails = () => {

    useEffect(() => {
        window.scrollTo(0,0);
    }, []);

    const school = {
        name: 'New Horizon International School',
        address: 'Hennur Main Road, Bengaluru, Karnataka 560077',
        fees: '₹1,54,000/year',
        rating: 4.7,
        board: 'CBSE',
        phone: '+91 9876543210',
        image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        established: 2005,
        medium: 'English',
        grades: 'Nursery to 12th',
        facilities: ['Smart Classes', 'Swimming Pool', 'STEM Lab', 'Basketball Court', 'Music Room']
    };

    const similarSchools = [
        { name: 'Delhi Public School', address: 'Koramangala', rating: 4.2, image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', link: '/school/dps' },
        { name: 'Vibgyor High School', address: 'Whitefield', rating: 4.0, image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', link: '/school/vibgyor' },
        { name: 'Ryan International School', address: 'Electronic City', rating: 4.1, image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', link: '/school/ryan' },
        { name: 'The Heritage School', address: 'Yelahanka', rating: 4.3, image: 'https://images.unsplash.com/photo-1549861833-c5932fd19229?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', link: '/school/heritage' },
        { name: 'Oakridge International School', address: 'Bannerghatta Road', rating: 4.4, image: 'https://images.unsplash.com/photo-1581093450021-4a7360e9a6a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', link: '/school/oakridge' },
    ];

    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };





    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
            {/* Header */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', stiffness: 120 }}
                className="bg-gradient-to-r from-orange-600 to-amber-600 shadow-lg sticky top-0 z-50 py-2"
            >
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
                    <motion.div
                        className="flex items-center"
                        whileHover={{ scale: 1.03 }}
                    >
                        <span className="text-2xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-amber-100">
                            Raynott
                        </span>
                    </motion.div>

                    <div className="relative w-full max-w-2xl mx-2 my-2 md:my-0">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="h-4 w-4 text-orange-300" />
                        </div>
                        <motion.input
                            whileFocus={{ scale: 1.02, boxShadow: '0 0 0 2px rgba(249, 115, 22, 0.5)' }}
                            type="text"
                            placeholder="Search schools..."
                            className="block w-full pl-10 pr-3 py-2 text-sm border border-transparent rounded-full bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-400 focus:border-transparent shadow-lg transition-all duration-300"
                        />
                    </div>

                    <div className="hidden md:flex space-x-2">
                        <motion.button
                            whileHover={{ y: -2, boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)' }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-white text-orange-600 text-sm font-semibold py-1 px-4 rounded-full flex items-center shadow-md hover:shadow-sm transition-all duration-300"
                        >
                            <FaBookOpen className="mr-1 h-3 w-3" /> Add School
                        </motion.button>
                        <motion.button
                            whileHover={{ y: -2, boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)' }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-amber-700 text-white text-sm font-semibold py-1 px-4 rounded-full shadow-md hover:shadow-sm transition-all duration-300"
                        >
                            Book Demo
                        </motion.button>
                    </div>
                </div>
            </motion.header>

            {/* Hero Banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative max-w-7xl mx-auto mt-8 rounded-3xl overflow-hidden shadow-2xl"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10"></div>
                <img
                    src={school.image}
                    alt={school.name}
                    className="w-full h-[32rem] object-cover"
                />

                <div className="absolute bottom-0 left-0 right-0 z-20 p-8 text-white">
                    <motion.h1
                        className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {school.name}
                    </motion.h1>

                    <div className="flex flex-wrap items-center gap-4 mb-4">
                        <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                            <FaMapMarkerAlt className="mr-1 text-orange-300" />
                            <span>{school.address}</span>
                        </div>
                        <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                            <FaGraduationCap className="mr-1 text-orange-300" />
                            <span>{school.board}</span>
                        </div>
                        <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                            <IoMdTime className="mr-1 text-orange-300" />
                            <span>Est. {school.established}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center text-amber-300 text-xl">
                                <FaStar className="mr-1" /> {school.rating}
                            </div>
                            <p className="text-xl font-semibold text-white">{school.fees}</p>
                        </div>

                        <motion.a
                            href={`tel:${school.phone}`}
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
                        {['Basic Info', 'Fee Structure', 'Contact', 'Reviews'].map((section) => (
                            <motion.button
                                key={section}
                                onClick={() => scrollToSection(section.replace(/\s+/g, '').toLowerCase())}
                                className="flex-shrink-0 px-8 py-4 relative group"
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="text-2xl font-bold font-['Poppins'] bg-clip-text  bg-gradient-to-r  text-amber-900  transition-all duration-300">
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
                                Basic Information
                            </h2>
                            <BasicInfo school={school} />
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
                            <FeesStructure school={school} />
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
                            <Contact school={school} />
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
                                Parent Reviews
                            </h2>
                            <Review school={school} />
                        </div>
                    </motion.div>
                </div>

                {/* Right Column - Fixed Form (Now with White Background) */}
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
                                    placeholder="Parent's Name"
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
                                    <option value="">Select School Type</option>
                                    <option value="boarding">Boarding</option>
                                    <option value="day">Day School</option>
                                    <option value="pre">Pre School</option>
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

                    {/* Quick Facts */}
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
                                        <p className="font-medium">{school.board}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="p-2 bg-orange-100 rounded-full mr-3">
                                        <IoMdTime className="text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Established</p>
                                        <p className="font-medium">{school.established}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="p-2 bg-orange-100 rounded-full mr-3">
                                        <FaBookOpen className="text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Medium</p>
                                        <p className="font-medium">{school.medium}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="p-2 bg-orange-100 rounded-full mr-3">
                                        <FaStar className="text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Grades</p>
                                        <p className="font-medium">{school.grades}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Similar Schools */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="max-w-7xl mx-auto mt-16 px-4 pb-4"
            >
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Similar Schools You Might Like</h2>
                <p className="text-lg text-center text-gray-600 mb-8">Discover other great educational options in Bengaluru</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {similarSchools.map((school, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -8 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            className="bg-white rounded-xl shadow-lg overflow-hidden"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={school.image}
                                    alt={school.name}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold text-white">{school.name}</h3>
                                        <div className="flex items-center bg-white/90 text-amber-600 px-2 py-1 rounded-full">
                                            <FaStar className="mr-1" />
                                            <span className="font-bold">{school.rating}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5">
                                <p className="text-gray-600 mb-3 flex items-center">
                                    <FaMapMarkerAlt className="mr-2 text-orange-500" />
                                    {school.address}
                                </p>
                                <motion.a
                                    href={school.link}
                                    whileHover={{ color: '#EA580C' }}
                                    className="inline-block text-orange-600 font-medium hover:underline"
                                >
                                    View Details →
                                </motion.a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Call to Action */}
            {/* <motion.div
                className="bg-gradient-to-r from-orange-600 to-amber-600 mt-16 py-12 px-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            >
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Find the Perfect School?</h2>
                    <p className="text-xl text-amber-100 mb-8">Our education experts are here to help you make the right choice for your child's future.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)' }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-white text-orange-600 font-bold py-3 px-8 rounded-full shadow-lg"
                        >
                            Book Free Consultation
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)' }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full shadow-lg"
                        >
                            Browse All Schools
                        </motion.button>
                    </div>
                </div>
            </motion.div> */}
        </div>
    );
};

export default SchoolDetails;