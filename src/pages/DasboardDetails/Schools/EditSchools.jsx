// src/components/dashboards/EditSchoolDetails.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { schoolApi } from '../../../services/schoolApi';

const EditSchoolDetails = ({ schoolData, schoolId, onUpdate }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [schoolImageFile, setSchoolImageFile] = useState(null);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);

  useEffect(() => {
    if (schoolData) {
      // Safely parse facilities
      let facilitiesArray = [];
      if (schoolData.facilities) {
        if (Array.isArray(schoolData.facilities)) {
          facilitiesArray = schoolData.facilities;
        } else if (typeof schoolData.facilities === 'string') {
          try {
            const parsed = JSON.parse(schoolData.facilities);
            facilitiesArray = Array.isArray(parsed) ? parsed : [];
          } catch (e) {
            facilitiesArray = [];
          }
        }
      }

      // Safely parse socialMedia
      let socialMediaObj = { facebook: '', twitter: '', instagram: '' };
      if (schoolData.socialMedia) {
        if (typeof schoolData.socialMedia === 'object') {
          socialMediaObj = schoolData.socialMedia;
        } else if (typeof schoolData.socialMedia === 'string') {
          try {
            const parsed = JSON.parse(schoolData.socialMedia);
            socialMediaObj = typeof parsed === 'object' ? parsed : socialMediaObj;
          } catch (e) {
            socialMediaObj = { facebook: '', twitter: '', instagram: '' };
          }
        }
      }

      setFormData({
        name: schoolData.name || '',
        typeOfSchool: schoolData.typeOfSchool || '',
        affiliation: schoolData.affiliation || '',
        grade: schoolData.grade || '',
        ageForAdmission: schoolData.ageForAdmission || '',
        language: schoolData.language || '',
        establishmentYear: schoolData.establishmentYear || '',
        facilities: facilitiesArray,
        totalAnnualFee: schoolData.totalAnnualFee || '',
        admissionFee: schoolData.admissionFee || '',
        tuitionFee: schoolData.tuitionFee || '',
        transportFee: schoolData.transportFee || '',
        booksUniformsFee: schoolData.booksUniformsFee || '',
        address: schoolData.address || '',
        city: schoolData.city || '',
        phone: schoolData.phone || '',
        email: schoolData.email || '',
        website: schoolData.website || '',
        socialMedia: socialMediaObj,
        googleMapsEmbedUrl: schoolData.googleMapsEmbedUrl || '',
        campusSize: schoolData.campusSize || '',
        classrooms: schoolData.classrooms || '',
        laboratories: schoolData.laboratories || 'No',
        library: schoolData.library || 'No',
        playground: schoolData.playground || 'No',
        auditorium: schoolData.auditorium || 'No',
        smartBoards: schoolData.smartBoards || 'No',
        cctv: schoolData.cctv || 'No',
        medicalRoom: schoolData.medicalRoom || 'No',
        wifi: schoolData.wifi || 'No',
        admissionLink: schoolData.admissionLink || '',
        admissionProcess: schoolData.admissionProcess || '',
        schoolImage: schoolData.schoolImage || '',
        photos: schoolData.photos || []
      });
      setExistingPhotos(schoolData.photos || []);
    }
  }, [schoolData]);

  const cities = ['Bangalore', 'Hyderabad', 'Mumbai', 'Kolkata', 'Delhi', 'Chennai'];

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
        setSchoolImageFile(files[0]);
      }
    } else if (type === 'gallery') {
      const currentPhotos = formData.photos || [];
      if (currentPhotos.length + files.length > 6) {
        alert('You can upload a maximum of 6 gallery images.');
        return;
      }
      const newImages = files.map(file => URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, photos: [...currentPhotos, ...newImages] }));
      setPhotoFiles(prev => [...prev, ...files]);
    }
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
    if (index >= existingPhotos.length) {
      const newPhotoIndex = index - existingPhotos.length;
      setPhotoFiles(prev => prev.filter((_, i) => i !== newPhotoIndex));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const submitData = new FormData();
      
      const simpleFields = [
        'name', 'typeOfSchool', 'affiliation', 'grade', 'ageForAdmission',
        'language', 'establishmentYear', 'totalAnnualFee', 'admissionFee',
        'tuitionFee', 'transportFee', 'booksUniformsFee', 'address', 'city',
        'phone', 'email', 'website', 'googleMapsEmbedUrl', 'campusSize',
        'classrooms', 'admissionLink', 'admissionProcess'
      ];
      
      simpleFields.forEach(field => {
        if (formData[field]) {
          submitData.append(field, formData[field]);
        }
      });
      
      submitData.append('facilities', JSON.stringify(formData.facilities));
      submitData.append('socialMedia', JSON.stringify(formData.socialMedia));
      
      const infrastructureFields = [
        'laboratories', 'library', 'playground', 'auditorium',
        'smartBoards', 'cctv', 'medicalRoom', 'wifi'
      ];
      
      infrastructureFields.forEach(field => {
        submitData.append(field, formData[field] || 'No');
      });
      
      if (schoolImageFile) {
        submitData.append('schoolImage', schoolImageFile);
      }
      
      if (photoFiles.length > 0) {
        photoFiles.forEach(file => {
          submitData.append('photos', file);
        });
      }
      
      // Add existing photos URLs to keep them
      if (existingPhotos.length > 0) {
        submitData.append('existingPhotos', JSON.stringify(existingPhotos));
      }
      
      await schoolApi.updateSchool(schoolId, submitData);
      
      setMessage({ type: 'success', text: 'School details updated successfully!' });
      if (onUpdate) onUpdate();
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error updating school:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to update school details' });
    } finally {
      setLoading(false);
    }
  };

  const facilitiesList = formData.facilities || [];

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit School Details</h1>
        
        {message.text && (
          <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Basic Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="name" placeholder="School Name *" value={formData.name || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" />
              <select name="typeOfSchool" value={formData.typeOfSchool || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg">
                <option value="">Select School Type *</option>
                <option value="Pre School">Pre School</option>
                <option value="Residential Schools">Residential Schools</option>
                <option value="International School">International School</option>
              </select>
              <select name="affiliation" value={formData.affiliation || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg">
                <option value="">Select Affiliation *</option>
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE</option>
                <option value="State Board">State Board</option>
                <option value="International">International</option>
              </select>
              <input type="text" name="grade" placeholder="Grade" value={formData.grade || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" />
              <input type="text" name="ageForAdmission" placeholder="Age for Admission" value={formData.ageForAdmission || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" />
              <input type="text" name="language" placeholder="Language" value={formData.language || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" />
              <input type="number" name="establishmentYear" placeholder="Establishment Year" value={formData.establishmentYear || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-700 mt-6">Facilities</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {['Smart Classes', 'Swimming Pool', 'STEM Lab', 'Basketball Court', 'Music Room'].map(facility => (
                <label key={facility} className="flex items-center space-x-2">
                  <input type="checkbox" name={facility} checked={facilitiesList.includes(facility)} onChange={handleCheckboxChange} className="h-4 w-4 text-orange-600" />
                  <span>{facility}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Fee Structure */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Fee Structure</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="totalAnnualFee" placeholder="Total Annual Fee" value={formData.totalAnnualFee || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" />
              <input type="text" name="admissionFee" placeholder="Admission Fee" value={formData.admissionFee || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" />
              <input type="text" name="tuitionFee" placeholder="Tuition Fee" value={formData.tuitionFee || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" />
              <input type="text" name="transportFee" placeholder="Transport Fee" value={formData.transportFee || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" />
              <input type="text" name="booksUniformsFee" placeholder="Books & Uniforms Fee" value={formData.booksUniformsFee || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" />
            </div>
          </div>

          {/* Contact Details */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="address" placeholder="Address *" value={formData.address || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" />
              <select name="city" value={formData.city || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg">
                <option value="">Select City *</option>
                {cities.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
              <input type="tel" name="phone" placeholder="Phone" value={formData.phone || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" />
              <input type="email" name="email" placeholder="Email" value={formData.email || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" />
              <input type="url" name="website" placeholder="Website" value={formData.website || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" />
            </div>
          </div>

          {/* School Image */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">School Image</h2>
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'schoolImage')} className="w-full p-3 border border-gray-300 rounded-lg" />
            {formData.schoolImage && (
              <div className="mt-4 max-w-xs">
                <img src={formData.schoolImage} alt="School" className="w-full h-48 object-cover rounded-lg" />
              </div>
            )}
          </div>

          {/* School Gallery */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">School Gallery (Max 6 Images)</h2>
            <input type="file" accept="image/*" multiple onChange={(e) => handleImageUpload(e, 'gallery')} className="w-full p-3 border border-gray-300 rounded-lg" />
            <p className="text-sm text-gray-500 mt-2">You can upload up to 6 images for the gallery.</p>
            {formData.photos && formData.photos.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {formData.photos.map((photo, index) => (
                  <motion.div key={index} className="relative aspect-square overflow-hidden rounded-xl group" whileHover={{ scale: 1.02 }}>
                    <img src={photo} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Infrastructure */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Infrastructure</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="campusSize" placeholder="Campus Size" value={formData.campusSize || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" />
              <input type="text" name="classrooms" placeholder="Classrooms" value={formData.classrooms || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" />
              {['laboratories', 'library', 'playground', 'auditorium', 'smartBoards', 'cctv', 'medicalRoom', 'wifi'].map(field => (
                <div key={field} className="flex items-center justify-between p-2 border rounded-lg">
                  <label className="text-gray-700 capitalize font-medium">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input type="radio" name={field} value="Yes" checked={formData[field] === 'Yes'} onChange={handleRadioChange} className="h-4 w-4 text-orange-600" />
                      <span className="ml-2">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name={field} value="No" checked={formData[field] === 'No' || !formData[field]} onChange={handleRadioChange} className="h-4 w-4 text-orange-600" />
                      <span className="ml-2">No</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admission Details */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Admission Details</h2>
            <input type="url" name="admissionLink" placeholder="Admission Link" value={formData.admissionLink || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" />
            <textarea name="admissionProcess" placeholder="Admission Process" rows="4" value={formData.admissionProcess || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg mt-4" />
          </div>

          {/* Submit Button */}
          <button onClick={handleSubmit} disabled={loading} className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white py-3 rounded-lg font-bold transition-all shadow-lg disabled:opacity-50">
            {loading ? 'Updating...' : 'Update School Details'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default EditSchoolDetails;