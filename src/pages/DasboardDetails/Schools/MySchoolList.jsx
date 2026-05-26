// src/components/dashboards/MySchoolsList.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';
import { schoolApi } from '../../../services/schoolApi';
import { useNavigate } from 'react-router-dom';

const MySchoolsList = ({ institutionName }) => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    try {
      const allSchools = await schoolApi.getSchools();
      // Handle different response formats
      let schoolsArray = [];
      if (Array.isArray(allSchools)) {
        schoolsArray = allSchools;
      } else if (allSchools && allSchools.data && Array.isArray(allSchools.data)) {
        schoolsArray = allSchools.data;
      } else if (allSchools && allSchools.schools && Array.isArray(allSchools.schools)) {
        schoolsArray = allSchools.schools;
      }
      
      const mySchools = schoolsArray.filter(school => school.name === institutionName);
      setSchools(mySchools);
    } catch (error) {
      console.error('Error loading schools:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await schoolApi.deleteSchool(id);
      setSchools(schools.filter(school => school._id !== id && school.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting school:', error);
      alert('Failed to delete school');
    }
  };

  const handleView = (school) => {
    // Navigate to view school details or open modal
    console.log('View school:', school);
  };

  const handleEdit = (school) => {
    // Navigate to edit page
    navigate('/school-dashboard', { state: { activeTab: 'edit-school' } });
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Institutions</h1>
          <p className="text-gray-600 mt-2">View and manage your registered institutions</p>
        </div>

        {schools.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🏫</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Institutions Found</h3>
            <p className="text-gray-600 mb-4">You haven't registered any institution yet.</p>
            <button 
              onClick={() => navigate('/register-form')}
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Register Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {schools.map((school) => (
              <motion.div
                key={school._id || school.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="md:flex">
                  {school.schoolImage && (
                    <div className="md:w-48 h-48 overflow-hidden">
                      <img src={school.schoolImage} alt={school.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">{school.name}</h2>
                    <p className="text-gray-600 mb-2">{school.city}, {school.address}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">{school.typeOfSchool}</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">{school.affiliation}</span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Est. {school.establishmentYear}</span>
                    </div>
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => handleView(school)} 
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                      >
                        <FiEye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                      <button 
                        onClick={() => handleEdit(school)} 
                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1"
                      >
                        <FiEdit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button 
                        onClick={() => setDeleteConfirm(school._id || school.id)} 
                        className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-1"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
                {deleteConfirm === (school._id || school.id) && (
                  <div className="border-t p-4 bg-red-50">
                    <p className="text-red-800 mb-3">Are you sure you want to delete this institution?</p>
                    <div className="flex space-x-3">
                      <button onClick={() => handleDelete(school._id || school.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Yes, Delete</button>
                      <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">Cancel</button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MySchoolsList;