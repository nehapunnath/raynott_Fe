import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { TuitionCoachingApi, coachingTypeApi } from '../../services/TuitionCoachingApi';

const CoachingList = () => {
    const [tuitionCoachings, setTuitionCoachings] = useState([]);
    const [coachingTypes, setCoachingTypes] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCoachingTypes();
        fetchTuitionCoachings();
    }, []);

    const fetchCoachingTypes = async () => {
        try {
            const response = await coachingTypeApi.getCoachingTypes();
            if (response.success) {
                // Convert array to object with id as key for easy lookup
                const typesMap = {};
                Object.values(response.data || {}).forEach(type => {
                    typesMap[type.id] = type.name;
                });
                setCoachingTypes(typesMap);
            }
        } catch (err) {
            console.error('Error fetching coaching types:', err);
        }
    };

    const fetchTuitionCoachings = async () => {
        try {
            setLoading(true);
            const response = await TuitionCoachingApi.getTuitionCoachings();
            if (response.success) {
                const tuitionCoachingsArray = response.data ? Object.values(response.data) : [];
                setTuitionCoachings(tuitionCoachingsArray);
            } else {
                setError(response.message || 'Failed to fetch tuition/coaching centers');
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch tuition/coaching centers');
            console.error('Error fetching tuition/coaching centers:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (tuitionCoachingId) => {
        if (!window.confirm('Are you sure you want to delete this tuition/coaching center?')) {
            return;
        }

        try {
            const response = await TuitionCoachingApi.deleteTuitionCoaching(tuitionCoachingId);
            if (response.success) {
                setTuitionCoachings(tuitionCoachings.filter((center) => center.id !== tuitionCoachingId));
                alert('Tuition/Coaching Center deleted successfully');
            } else {
                throw new Error(response.message || 'Failed to delete tuition/coaching center');
            }
        } catch (err) {
            alert('Error deleting tuition/coaching center: ' + err.message);
            console.error('Error deleting tuition/coaching center:', err);
        }
    };

    const handleView = (tuitionCoachingId) => {
        navigate(`/admin/tuition-coaching-details/${tuitionCoachingId}`);
    };

    // Function to get coaching type name by ID
    const getCoachingTypeName = (typeName) => {
        return coachingTypes[typeName] || typeName || 'N/A';
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
                    onClick={fetchTuitionCoachings}
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
                <h2 className="text-2xl font-bold text-gray-800">Tuition/Coaching Centers</h2>
            </div>

            {tuitionCoachings.length === 0 ? (
                <div className="text-center py-12">
                    <h3 className="text-xl text-gray-600 mb-4">No tuition/coaching centers found</h3>
                    <p className="text-gray-500">Get started by adding your first tuition/coaching center</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-50 border-b">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Center
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Location
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Subjects
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {tuitionCoachings.map((center) => (
                                <tr key={center.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-12 w-12">
                                                <img
                                                    className="h-12 w-12 rounded-full object-cover"
                                                    src={center.centerImage || 'https://via.placeholder.com/48x48?text=Center'}
                                                    alt={center.name}
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{center.name}</div>
                                                <div className="text-sm text-gray-500">{center.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{center.city}</div>
                                        <div className="text-sm text-gray-500">{center.address}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {getCoachingTypeName(center.typeOfCoaching)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {center.subjects || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                className="text-blue-600 hover:text-blue-900"
                                                onClick={() => handleView(center.id)}
                                            >
                                                <FaEye size={16} />
                                            </button>
                                            <button
                                                className="text-green-600 hover:text-green-900"
                                                onClick={() => navigate(`/admin/edit-tuition-coaching/${center.id}`)}
                                            >
                                                <FaEdit size={16} />
                                            </button>
                                            <button
                                                className="text-red-600 hover:text-red-900"
                                                onClick={() => handleDelete(center.id)}
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

export default CoachingList;