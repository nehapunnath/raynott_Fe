import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import schoolApi from '../../services/schoolApi';
import "tailwindcss";


const SchoolsList = () => {
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchSchools();
    }, []);

    const fetchSchools = async () => {
        try {
            setLoading(true);
            const response = await schoolApi.getSchools();
            if (response.success) {
                const schoolsArray = response.data ? Object.values(response.data) : [];
                setSchools(schoolsArray);
            } else {
                setError(response.message || 'Failed to fetch schools');
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch schools');
            console.error('Error fetching schools:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (schoolId) => {
        if (!window.confirm('Are you sure you want to delete this school?')) {
            return;
        }

        try {
            const response = await schoolApi.deleteSchool(schoolId);
            if (response.success) {
                setSchools(schools.filter((school) => school.id !== schoolId));
                alert('School deleted successfully');
            } else {
                throw new Error(response.message || 'Failed to delete school');
            }
        } catch (err) {
            alert('Error deleting school: ' + err.message);
            console.error('Error deleting school:', err);
        }
    };

    const handleView = (schoolId) => {
        navigate(`/admin/school-details/${schoolId}`);
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
                    onClick={fetchSchools}
                    className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (schools.length === 0) {
        return (
            <div className="text-center py-12">
                <h3 className="text-xl text-gray-600 mb-4">No schools found</h3>
                <p className="text-gray-500">Get started by adding your first school</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gray-50 border-b">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                School
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
                        {schools.map((school) => (
                            <tr key={school.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-12 w-12">
                                            <img
                                                className="h-12 w-12 rounded-full object-cover"
                                                src={school.schoolImage || 'https://via.placeholder.com/48x48?text=School'}
                                                alt={school.name}
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{school.name}</div>
                                            <div className="text-sm text-gray-500">{school.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{school.city}</div>
                                    <div className="text-sm text-gray-500">{school.address}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {school.typeOfSchool}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {school.affiliation}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                        <button
                                            className="text-blue-600 hover:text-blue-900"
                                            onClick={() => handleView(school.id)}
                                        >
                                            <FaEye size={16} />
                                        </button>
                                        <button
                                            className="text-green-600 hover:text-green-900"
                                            onClick={() => navigate(`/admin/edit-school/${school.id}`)}
                                        >
                                            <FaEdit size={16} />
                                        </button>
                                        <button
                                            className="text-red-600 hover:text-red-900"
                                            onClick={() => handleDelete(school.id)}
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
        </div>
    );
};

export default SchoolsList;