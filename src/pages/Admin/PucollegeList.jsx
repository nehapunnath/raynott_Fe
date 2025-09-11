import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { puCollegeApi, puCollegeTypeApi } from '../../services/pucollegeApi';

const PucollegeList = () => {
    const [puColleges, setPUColleges] = useState([]);
    const [puCollegeTypes, setPUCollegeTypes] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchPUCollegeTypes();
        fetchPUColleges();
    }, []);

    const fetchPUCollegeTypes = async () => {
        try {
            const response = await puCollegeTypeApi.getPuCollegeTypes();
            if (response.success) {
                // Convert array to object with id as key for easy lookup
                const typesMap = {};
                Object.values(response.data).forEach(type => {
                    typesMap[type.id] = type.name;
                });
                setPUCollegeTypes(typesMap);
            }
        } catch (err) {
            console.error('Error fetching PU college types:', err);
        }
    };

    const fetchPUColleges = async () => {
        try {
            setLoading(true);
            const response = await puCollegeApi.getPUColleges();
            if (response.success) {
                const puCollegesArray = response.data ? Object.values(response.data) : [];
                setPUColleges(puCollegesArray);
            } else {
                setError(response.message || 'Failed to fetch PU colleges');
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch PU colleges');
            console.error('Error fetching PU colleges:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (puCollegeId) => {
        if (!window.confirm('Are you sure you want to delete this PU college?')) {
            return;
        }

        try {
            const response = await puCollegeApi.deletePUCollege(puCollegeId);
            if (response.success) {
                setPUColleges(puColleges.filter((puCollege) => puCollege.id !== puCollegeId));
                alert('PU College deleted successfully');
            } else {
                throw new Error(response.message || 'Failed to delete PU college');
            }
        } catch (err) {
            alert('Error deleting PU college: ' + err.message);
            console.error('Error deleting PU college:', err);
        }
    };

    const handleView = (puCollegeId) => {
        navigate(`/admin/pucollege-details/${puCollegeId}`);
    };

    // Function to get PU college type name by ID
    const getPUCollegeTypeName = (typeId) => {
        return puCollegeTypes[typeId] || 'Unknown Type';
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
                    onClick={fetchPUColleges}
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
                <h2 className="text-2xl font-bold text-gray-800">PU Colleges</h2>
            </div>

            {puColleges.length === 0 ? (
                <div className="text-center py-12">
                    <h3 className="text-xl text-gray-600 mb-4">No PU colleges found</h3>
                    <p className="text-gray-500">Get started by adding your first PU college</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-50 border-b">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    PU College
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Location
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Board
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {puColleges.map((puCollege) => (
                                <tr key={puCollege.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-12 w-12">
                                                <img
                                                    className="h-12 w-12 rounded-full object-cover"
                                                    src={puCollege.collegeImage || 'https://via.placeholder.com/48x48?text=PU+College'}
                                                    alt={puCollege.name}
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{puCollege.name}</div>
                                                <div className="text-sm text-gray-500">{puCollege.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{puCollege.city}</div>
                                        <div className="text-sm text-gray-500">{puCollege.address}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {puCollege.typeOfCollege || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {puCollege.board || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                className="text-blue-600 hover:text-blue-900"
                                                onClick={() => handleView(puCollege.id)}
                                                aria-label={`View PU College ${puCollege.name}`}
                                            >
                                                <FaEye size={16} />
                                            </button>
                                            <button
                                                className="text-green-600 hover:text-green-900"
                                                onClick={() => navigate(`/admin/edit-pucollege/${puCollege.id}`)}
                                                aria-label={`Edit PU College ${puCollege.name}`}
                                            >
                                                <FaEdit size={16} />
                                            </button>
                                            <button
                                                className="text-red-600 hover:text-red-900"
                                                onClick={() => handleDelete(puCollege.id)}
                                                aria-label={`Delete PU College ${puCollege.name}`}
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

export default PucollegeList;