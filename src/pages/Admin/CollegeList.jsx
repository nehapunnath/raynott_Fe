import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaEye, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { collegeApi, collegeTypeApi } from '../../services/collegeApi';
import "tailwindcss";


const CollegesList = () => {
    const [colleges, setColleges] = useState([]);
    const [collegeTypes, setCollegeTypes] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCollegeTypes();
        fetchColleges();
    }, []);

    const fetchCollegeTypes = async () => {
        try {
            const response = await collegeTypeApi.getCollegeTypes();
            if (response.success) {
                const typesMap = {};
                response.data?.forEach(type => {
                    typesMap[type.id] = type.name;
                });
                setCollegeTypes(typesMap);
            }
        } catch (err) {
            console.error('Error fetching college types:', err);
        }
    };

    const fetchColleges = async () => {
        try {
            setLoading(true);
            const response = await collegeApi.getColleges();
            if (response.success) {
                const collegesArray = response.data ? Object.values(response.data) : [];
                setColleges(collegesArray);
            } else {
                setError(response.message || 'Failed to fetch colleges');
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch colleges');
            console.error('Error fetching colleges:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (collegeId) => {
        if (!window.confirm('Are you sure you want to delete this college?')) {
            return;
        }

        try {
            const response = await collegeApi.deleteCollege(collegeId);
            if (response.success) {
                setColleges(colleges.filter((college) => college.id !== collegeId));
                alert('College deleted successfully');
            } else {
                throw new Error(response.message || 'Failed to delete college');
            }
        } catch (err) {
            alert('Error deleting college: ' + err.message);
            console.error('Error deleting college:', err);
        }
    };

    const handleView = (collegeId) => {
        navigate(`/admin/college-details/${collegeId}`);
    };

    // Function to get college type name by ID
    const getCollegeTypeName = (typeId) => {
        return collegeTypes[typeId] || 'Unknown Type';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <p>Error: {error}</p>
                <button
                    onClick={fetchColleges}
                    className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Colleges</h2>
            </div>

            {colleges.length === 0 ? (
                <div className="text-center py-12">
                    <h3 className="text-xl text-gray-600 mb-4">No colleges found</h3>
                    <p className="text-gray-500">Get started by adding your first college</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-50 border-b">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    College
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Location
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Affiliation
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {colleges.map((college) => (
                                <tr key={college.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-12 w-12">
                                                <img
                                                    className="h-12 w-12 rounded-full object-cover"
                                                    src={college.collegeImage || 'https://via.placeholder.com/48x48?text=College'}
                                                    alt={college.name}
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{college.name}</div>
                                                <div className="text-sm text-gray-500">{college.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{college.city}</div>
                                        <div className="text-sm text-gray-500">{college.address}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {/* {getCollegeTypeName(college.collegeTypeId)} */}
                                             {college.typeOfCollege|| college.type || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {college.affiliation || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                className="text-blue-600 hover:text-blue-900"
                                                onClick={() => handleView(college.id)}
                                            >
                                                <FaEye size={16} />
                                            </button>
                                            <button
                                                className="text-green-600 hover:text-green-900"
                                                onClick={() => navigate(`/admin/edit-college/${college.id}`)}
                                            >
                                                <FaEdit size={16} />
                                            </button>
                                            <button
                                                className="text-red-600 hover:text-red-900"
                                                onClick={() => handleDelete(college.id)}
                                            >
                                                <FaTrash size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CollegesList;