// // src/components/dashboards/AddNewSchool.jsx
// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { schoolApi } from '../../../services/schoolApi';

// const AddNewSchool = ({ onSuccess }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     typeOfSchool: '',
//     affiliation: '',
//     grade: '',
//     ageForAdmission: '',
//     language: '',
//     establishmentYear: '',
//     facilities: [],
//     totalAnnualFee: '',
//     admissionFee: '',
//     tuitionFee: '',
//     transportFee: '',
//     booksUniformsFee: '',
//     address: '',
//     city: '',
//     phone: '',
//     email: '',
//     website: '',
//     socialMedia: { facebook: '', twitter: '', instagram: '' },
//     googleMapsEmbedUrl: '',
//     campusSize: '',
//     classrooms: '',
//     laboratories: '',
//     library: '',
//     playground: '',
//     auditorium: '',
//     smartBoards: '',
//     cctv: '',
//     medicalRoom: '',
//     wifi: '',
//     admissionLink: '',
//     admissionProcess: '',
//     schoolImage: '',
//     photos: []
//   });

//   const [schoolImageFile, setSchoolImageFile] = useState(null);
//   const [photoFiles, setPhotoFiles] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });

//   const cities = ['Bangalore', 'Hyderabad', 'Mumbai', 'Kolkata', 'Delhi', 'Chennai'];

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     if (name.includes('socialMedia.')) {
//       const socialMediaField = name.split('.')[1];
//       setFormData(prev => ({
//         ...prev,
//         socialMedia: { ...prev.socialMedia, [socialMediaField]: value }
//       }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleCheckboxChange = (e) => {
//     const { name, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       facilities: checked ? [...prev.facilities, name] : prev.facilities.filter(facility => facility !== name)
//     }));
//   };

//   const handleRadioChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleImageUpload = (e, type) => {
//     const files = Array.from(e.target.files);
//     if (type === 'schoolImage') {
//       if (files.length > 0) {
//         setFormData(prev => ({ ...prev, schoolImage: URL.createObjectURL(files[0]) }));
//         setSchoolImageFile(files[0]);
//       }
//     } else if (type === 'gallery') {
//       if (formData.photos.length + files.length > 6) {
//         alert('You can upload a maximum of 6 gallery images.');
//         return;
//       }
//       const newImages = files.map(file => URL.createObjectURL(file));
//       setFormData(prev => ({ ...prev, photos: [...prev.photos, ...newImages] }));
//       setPhotoFiles(prev => [...prev, ...files]);
//     }
//   };

//   const removePhoto = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       photos: prev.photos.filter((_, i) => i !== index)
//     }));
//     setPhotoFiles(prev => prev.filter((_, i) => i !== index));
//   };

//   const handleSubmit = async () => {
//     setIsSubmitting(true);
//     setSubmitStatus({ success: null, message: '' });

//     try {
//       const submitData = new FormData();
      
//       const simpleFields = [
//         'name', 'typeOfSchool', 'affiliation', 'grade', 'ageForAdmission',
//         'language', 'establishmentYear', 'totalAnnualFee', 'admissionFee',
//         'tuitionFee', 'transportFee', 'booksUniformsFee', 'address', 'city',
//         'phone', 'email', 'website', 'googleMapsEmbedUrl', 'campusSize',
//         'classrooms', 'admissionLink', 'admissionProcess'
//       ];
      
//       simpleFields.forEach(field => {
//         if (formData[field]) submitData.append(field, formData[field]);
//       });
      
//       submitData.append('facilities', JSON.stringify(formData.facilities));
//       submitData.append('socialMedia', JSON.stringify(formData.socialMedia));
      
//       const infrastructureFields = ['laboratories', 'library', 'playground', 'auditorium', 'smartBoards', 'cctv', 'medicalRoom', 'wifi'];
//       infrastructureFields.forEach(field => submitData.append(field, formData[field] || 'No'));
      
//       if (schoolImageFile) submitData.append('schoolImage', schoolImageFile);
//       if (photoFiles.length > 0) photoFiles.forEach(file => submitData.append('photos', file));
      
//       await schoolApi.addSchool(submitData);
      
//       setSubmitStatus({ success: true, message: 'School added successfully!' });
      
//       setFormData({
//         name: '', typeOfSchool: '', affiliation: '', grade: '', ageForAdmission: '', language: '', establishmentYear: '',
//         facilities: [], totalAnnualFee: '', admissionFee: '', tuitionFee: '', transportFee: '', booksUniformsFee: '',
//         address: '', city: '', phone: '', email: '', website: '', socialMedia: { facebook: '', twitter: '', instagram: '' },
//         googleMapsEmbedUrl: '', campusSize: '', classrooms: '', laboratories: '', library: '', playground: '',
//         auditorium: '', smartBoards: '', cctv: '', medicalRoom: '', wifi: '', admissionLink: '', admissionProcess: '',
//         schoolImage: '', photos: []
//       });
//       setSchoolImageFile(null);
//       setPhotoFiles([]);
      
//       if (onSuccess) onSuccess();
      
//       setTimeout(() => setSubmitStatus({ success: null, message: '' }), 3000);
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       setSubmitStatus({ success: false, message: error.message || 'Failed to submit school data' });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="p-6">
//       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New School</h1>
        
//         {submitStatus.message && (
//           <div className={`mb-4 p-4 rounded-lg ${submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//             {submitStatus.message}
//           </div>
//         )}

//         <div className="bg-white rounded-xl shadow-lg p-8">
//           {/* Basic Information */}
//           <div className="mb-8">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">Basic Information</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <input type="text" name="name" placeholder="School Name *" value={formData.name} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" required />
//               <select name="typeOfSchool" value={formData.typeOfSchool} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" required>
//                 <option value="">Select School Type *</option>
//                 <option value="Pre School">Pre School</option>
//                 <option value="Residential Schools">Residential Schools</option>
//                 <option value="International School">International School</option>
//               </select>
//               <select name="affiliation" value={formData.affiliation} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" required>
//                 <option value="">Select Affiliation *</option>
//                 <option value="CBSE">CBSE</option>
//                 <option value="ICSE">ICSE</option>
//                 <option value="State Board">State Board</option>
//                 <option value="International">International</option>
//               </select>
//               <input type="text" name="grade" placeholder="Grade (e.g., Nursery to 12th)" value={formData.grade} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" />
//               <input type="text" name="ageForAdmission" placeholder="Age for Admission (e.g., 3 Years)" value={formData.ageForAdmission} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" />
//               <input type="text" name="language" placeholder="Language of Instruction" value={formData.language} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" />
//               <input type="number" name="establishmentYear" placeholder="Establishment Year" value={formData.establishmentYear} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" />
//             </div>
            
//             <h3 className="text-lg font-semibold text-gray-700 mt-6">Facilities</h3>
//             <div className="grid grid-cols-2 gap-4 mt-2">
//               {['Smart Classes', 'Swimming Pool', 'STEM Lab', 'Basketball Court', 'Music Room'].map(facility => (
//                 <label key={facility} className="flex items-center space-x-2">
//                   <input type="checkbox" name={facility} checked={formData.facilities.includes(facility)} onChange={handleCheckboxChange} className="h-4 w-4 text-orange-600" />
//                   <span>{facility}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* Fee Structure */}
//           <div className="mb-8">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">Fee Structure</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <input type="text" name="totalAnnualFee" placeholder="Total Annual Fee (e.g., ₹1,54,000/year)" value={formData.totalAnnualFee} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" />
//               <input type="text" name="admissionFee" placeholder="Admission Fee (e.g., ₹25,000)" value={formData.admissionFee} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" />
//               <input type="text" name="tuitionFee" placeholder="Tuition Fee (e.g., ₹1,00,000)" value={formData.tuitionFee} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" />
//               <input type="text" name="transportFee" placeholder="Transport Fee (e.g., ₹15,000)" value={formData.transportFee} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" />
//               <input type="text" name="booksUniformsFee" placeholder="Books & Uniforms Fee (e.g., ₹14,000)" value={formData.booksUniformsFee} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" />
//             </div>
//           </div>

//           {/* Contact Details */}
//           <div className="mb-8">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Details</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <input type="text" name="address" placeholder="Address *" value={formData.address} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" required />
//               <select name="city" value={formData.city} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" required>
//                 <option value="">Select City *</option>
//                 {cities.map(city => <option key={city} value={city}>{city}</option>)}
//               </select>
//               <input type="tel" name="phone" placeholder="Phone (e.g., +91 9876543210)" value={formData.phone} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" />
//               <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" />
//               <input type="url" name="website" placeholder="Website (e.g., https://www.example.com)" value={formData.website} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" />
//             </div>
//           </div>

//           {/* School Image */}
//           <div className="mb-8">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">School Image</h2>
//             <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'schoolImage')} className="w-full p-3 border border-gray-300 rounded-lg" />
//             {formData.schoolImage && (
//               <div className="mt-4 max-w-xs">
//                 <img src={formData.schoolImage} alt="School" className="w-full h-48 object-cover rounded-lg" />
//               </div>
//             )}
//           </div>

//           {/* Submit Button */}
//           <button onClick={handleSubmit} disabled={isSubmitting} className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white py-3 rounded-lg font-bold transition-all shadow-lg disabled:opacity-50">
//             {isSubmitting ? 'Submitting...' : 'Submit School Details'}
//           </button>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default AddNewSchool;