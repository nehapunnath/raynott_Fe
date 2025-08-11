       import React, { useState } from 'react';
        import { createRoot } from 'react-dom/client';
        import { motion } from 'framer-motion';
        import { FaBookOpen, FaSearch, FaMapMarkerAlt, FaGraduationCap, FaRupeeSign, FaSchool, FaFlask, FaBook, FaRunning, FaTheaterMasks, FaChalkboardTeacher, FaVideo, FaFirstAid, FaWifi, FaLink, FaClipboardList, FaPhone } from 'react-icons/fa';
        import { IoMdTime } from 'react-icons/io';
        import { Link } from 'react-router-dom';

        const AddSchools = () => {
            const [formData, setFormData] = useState({
                name: '',
                typeOfSchool: 'Day School',
                affiliation: 'CBSE',
                grade: 'Nursery to 12th',
                ageForAdmission: '3 Years',
                language: 'English',
                establishmentYear: '',
                facilities: [],
                totalAnnualFee: '',
                admissionFee: '',
                tuitionFee: '',
                transportFee: '',
                booksUniformsFee: '',
                address: '',
                phone: '',
                email: '',
                website: '',
                socialMedia: { facebook: '', twitter: '', instagram: '' },
                googleMapsEmbedUrl: '',
                campusSize: '',
                classrooms: '',
                laboratories: 'No',
                library: 'No',
                playground: 'No',
                auditorium: 'No',
                smartBoards: 'No',
                cctv: 'No',
                medicalRoom: 'No',
                wifi: 'No',
                admissionLink: '',
                admissionProcess: '',
                schoolImage: '',
                photos: []
            });

            const handleInputChange = (e) => {
                const { name, value } = e.target;
                if (name.includes('socialMedia.')) {
                    const socialMediaField = name.split('.')[1];
                    setFormData(prev => ({
                        ...prev,
                        socialMedia: { ...prev.socialMedia, [socialMediaField]: value }
                    }));
                } else {
                    setFormData(prev => ({ ...prev, [name]: value }));
                }
            };

            const handleCheckboxChange = (e) => {
                const { name, checked } = e.target;
                setFormData(prev => ({
                    ...prev,
                    facilities: checked
                        ? [...prev.facilities, name]
                        : prev.facilities.filter(facility => facility !== name)
                }));
            };

            const handleRadioChange = (e) => {
                const { name, value } = e.target;
                setFormData(prev => ({ ...prev, [name]: value }));
            };

            const handleImageUpload = (e, type) => {
                const files = Array.from(e.target.files);
                if (type === 'schoolImage') {
                    if (files.length > 0) {
                        setFormData(prev => ({ ...prev, schoolImage: URL.createObjectURL(files[0]) }));
                    }
                } else if (type === 'gallery') {
                    if (formData.photos.length + files.length > 6) {
                        alert('You can upload a maximum of 6 gallery images.');
                        return;
                    }
                    const newImages = files.map(file => URL.createObjectURL(file));
                    setFormData(prev => ({ ...prev, photos: [...prev.photos, ...newImages] }));
                }
            };

            const handleSubmit = () => {
                console.log('Form Data:', formData);
                alert('School data submitted! Check console for details.');
            };

            return (
                <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">

                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-7xl mx-auto mt-8 px-4 pb-8"
                    >
                        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Add New School</h1>
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-orange-100">
                            {/* Basic Information */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="mb-8"
                            >
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                    <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                                    Basic Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <motion.input
                                        type="text"
                                        name="name"
                                        placeholder="School Name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        whileFocus={{ scale: 1.02 }}
                                    />
                                    <motion.select
                                        name="typeOfSchool"
                                        value={formData.typeOfSchool}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        whileFocus={{ scale: 1.02 }}
                                    >
                                        <option value="Day School">Day School</option>
                                        <option value="Boarding">Boarding</option>
                                        <option value="Pre School">Pre School</option>
                                    </motion.select>
                                    <motion.select
                                        name="affiliation"
                                        value={formData.affiliation}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        whileFocus={{ scale: 1.02 }}
                                    >
                                        <option value="CBSE">CBSE</option>
                                        <option value="ICSE">ICSE</option>
                                        <option value="State Board">State Board</option>
                                        <option value="International">International</option>
                                    </motion.select>
                                    <motion.input
                                        type="text"
                                        name="grade"
                                        placeholder="Grade (e.g., Nursery to 12th)"
                                        value={formData.grade}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        whileFocus={{ scale: 1.02 }}
                                    />
                                    <motion.input
                                        type="text"
                                        name="ageForAdmission"
                                        placeholder="Age for Admission (e.g., 3 Years)"
                                        value={formData.ageForAdmission}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        whileFocus={{ scale: 1.02 }}
                                    />
                                    <motion.input
                                        type="text"
                                        name="language"
                                        placeholder="Language of Instruction"
                                        value={formData.language}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        whileFocus={{ scale: 1.02 }}
                                    />
                                    <motion.input
                                        type="number"
                                        name="establishmentYear"
                                        placeholder="Establishment Year"
                                        value={formData.establishmentYear}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        whileFocus={{ scale: 1.02 }}
                                    />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-700 mt-6">Facilities</h3>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    {['Smart Classes', 'Swimming Pool', 'STEM Lab', 'Basketball Court', 'Music Room'].map(facility => (
                                        <label key={facility} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                name={facility}
                                                checked={formData.facilities.includes(facility)}
                                                onChange={handleCheckboxChange}
                                                className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                                            />
                                            <span>{facility}</span>
                                        </label>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Fees Structure */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="mb-8"
                            >
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                    <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                                    Fee Structure
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <motion.input
                                        type="text"
                                        name="totalAnnualFee"
                                        placeholder="Total Annual Fee (e.g., ₹1,54,000/year)"
                                        value={formData.totalAnnualFee}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        whileFocus={{ scale: 1.02 }}
                                    />
                                    <motion.input
                                        type="text"
                                        name="admissionFee"
                                        placeholder="Admission Fee (e.g., ₹25,000)"
                                        value={formData.admissionFee}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        whileFocus={{ scale: 1.02 }}
                                    />
                                    <motion.input
                                        type="text"
                                        name="tuitionFee"
                                        placeholder="Tuition Fee (e.g., ₹1,00,000)"
                                        value={formData.tuitionFee}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        whileFocus={{ scale: 1.02 }}
                                    />
                                    <motion.input
                                        type="text"
                                        name="transportFee"
                                        placeholder="Transport Fee (e.g., ₹15,000)"
                                        value={formData.transportFee}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        whileFocus={{ scale: 1.02 }}
                                    />
                                    <motion.input
                                        type="text"
                                        name="booksUniformsFee"
                                        placeholder="Books & Uniforms Fee (e.g., ₹14,000)"
                                        value={formData.booksUniformsFee}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        whileFocus={{ scale: 1.02 }}
                                    />
                                </div>
                            </motion.div>

                            {/* Contact Details */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="mb-8"
                            >
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                    <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                                    Contact Details
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <motion.input
                                        type="text"
                                        name="address"
                                        placeholder="Address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        whileFocus={{ scale: 1.02 }}
                                    />
                                    <motion.input
                                        type="tel"
                                        name="phone"
                                        placeholder="Phone (e.g., +91 9876543210)"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        whileFocus={{ scale: 1.02 }}
                                    />
                                    <motion.input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        whileFocus={{ scale: 1.02 }}
                                    />
                                    <motion.input
                                        type="url"
                                        name="website"
                                        placeholder="Website (e.g., https://www.example.com)"
                                        value={formData.website}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        whileFocus={{ scale: 1.02 }}
                                    />
                                    <motion.input
                                        type="url"
                                        name="socialMedia.facebook"
                                        placeholder="Facebook URL"
                                        value={formData.socialMedia.facebook}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        whileFocus={{ scale: 1.02 }}
                                    />
                                    <motion.input
                                        type="url"
                                        name="socialMedia.twitter"
                                        placeholder="Twitter URL"
                                        value={formData.socialMedia.twitter}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        whileFocus={{ scale: 1.02 }}
                                    />
                                    <motion.input
                                        type="url"
                                        name="socialMedia.instagram"
                                        placeholder="Instagram URL"
                                        value={formData.socialMedia.instagram}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        whileFocus={{ scale: 1.02 }}
                                    />
                                    <motion.input
                                        type="url"
                                        name="googleMapsEmbedUrl"
                                        placeholder="Google Maps Embed URL (e.g., https://www.google.com/maps/embed?...)"
                                        value={formData.googleMapsEmbedUrl}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        whileFocus={{ scale: 1.02 }}
                                    />
                                </div>
                            </motion.div>

                            {/* School Image */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="mb-8"
                            >
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                    <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                                    School Image
                                </h2>
                                <motion.input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, 'schoolImage')}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    whileFocus={{ scale: 1.02 }}
                                />
                                {formData.schoolImage && (
                                    <motion.div
                                        className="relative aspect-square overflow-hidden rounded-xl mt-4 max-w-xs"
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <img
                                            src={formData.schoolImage}
                                            alt="School Image"
                                            className="w-full h-full object-cover"
                                        />
                                    </motion.div>
                                )}
                            </motion.div>

                            {/* School Gallery */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="mb-8"
                            >
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                    <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                                    School Gallery (Max 6 Images)
                                </h2>
                                <motion.input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => handleImageUpload(e, 'gallery')}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    whileFocus={{ scale: 1.02 }}
                                />
                                <p className="text-sm text-gray-500 mt-2">You can upload up to 6 images for the gallery.</p>
                                {formData.photos.length > 0 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                        {formData.photos.map((photo, index) => (
                                            <motion.div
                                                key={index}
                                                className="relative aspect-square overflow-hidden rounded-xl"
                                                whileHover={{ scale: 1.02 }}
                                            >
                                                <img
                                                    src={photo}
                                                    alt={`Gallery Photo ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>

                            {/* Infrastructure */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                className="mb-8"
                            >
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                    <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                                    School Infrastructure
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <motion.input
                                        type="text"
                                        name="campusSize"
                                        placeholder="Campus Size (e.g., 10 acres)"
                                        value={formData.campusSize}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        whileFocus={{ scale: 1.02 }}
                                    />
                                    <motion.input
                                        type="text"
                                        name="classrooms"
                                        placeholder="Classrooms (e.g., 40+)"
                                        value={formData.classrooms}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        whileFocus={{ scale: 1.02 }}
                                    />
                                    {['laboratories', 'library', 'playground', 'auditorium', 'smartBoards', 'cctv', 'medicalRoom', 'wifi'].map(field => (
                                        <div key={field} className="flex items-center space-x-4">
                                            <label className="text-gray-700 capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                                            <div className="flex space-x-4">
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name={field}
                                                        value="Yes"
                                                        checked={formData[field] === 'Yes'}
                                                        onChange={handleRadioChange}
                                                        className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                                                    />
                                                    <span className="ml-2">Yes</span>
                                                </label>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name={field}
                                                        value="No"
                                                        checked={formData[field] === 'No'}
                                                        onChange={handleRadioChange}
                                                        className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                                                    />
                                                    <span className="ml-2">No</span>
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Admission Details */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                                className="mb-8"
                            >
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                    <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                                    Admission Details
                                </h2>
                                <motion.input
                                    type="url"
                                    name="admissionLink"
                                    placeholder="Admission Link (e.g., https://example.com/admission)"
                                    value={formData.admissionLink}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    whileFocus={{ scale: 1.02 }}
                                />
                                <motion.textarea
                                    name="admissionProcess"
                                    placeholder="Admission Process"
                                    rows="4"
                                    value={formData.admissionProcess}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 mt-4"
                                    whileFocus={{ scale: 1.02 }}
                                />
                            </motion.div>

                            {/* Submit Button */}
                            <motion.button
                                onClick={handleSubmit}
                                whileHover={{ scale: 1.03, boxShadow: '0 4px 15px rgba(249, 115, 22, 0.3)' }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white py-3 rounded-lg font-bold hover:from-orange-600 hover:to-amber-700 transition-all shadow-lg"
                            >
                                Submit School Details
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            );
        };

export default AddSchools;