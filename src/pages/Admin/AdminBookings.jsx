import React, { useState, useEffect } from 'react';
import { bookaDemoApi } from '../../services/BookaDemoApi'; // Adjust path to your API file
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'tailwindcss';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dateFilter, setDateFilter] = useState(null);

  // Fetch bookings with optional date filter
  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (dateFilter) params.date = dateFilter.toISOString().split('T')[0];
      const response = await bookaDemoApi.getBookings(params);
      setBookings(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  // Generate mailto link for reply
  const handleReply = (booking) => {
    const subject = encodeURIComponent(`Demo Booking Confirmation for ${booking.name}`);
    const body = encodeURIComponent(
      `Dear ${booking.name},\n\nThank you for booking a demo with Raynott on ${new Date(booking.date).toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' })} at ${booking.time}.\n\nWe will send you a meeting link soon. Please let us know if you have any questions.\n\nBest regards,\nRaynott Team`
    );
    window.location.href = `mailto:${booking.email}?subject=${subject}&body=${body}`;
  };

  // Fetch bookings on mount and when date filter changes
  useEffect(() => {
    fetchBookings();
  }, [dateFilter]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Demo Bookings</h2>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Date Filter */}
        {/* <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block font-semibold text-gray-800 mb-2">Filter by Date</label>
            <DatePicker
              selected={dateFilter}
              onChange={(date) => setDateFilter(date)}
              placeholderText="Select a date"
              className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
              dateFormat="MMMM d, yyyy"
              isClearable
            />
          </div>
        </div> */}

        {/* Bookings Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-6 text-center text-gray-600">Loading...</div>
          ) : bookings.length === 0 ? (
            <div className="p-6 text-center text-gray-600">No bookings found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th> */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.id}</td> */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(booking.date).toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.time}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleReply(booking)}
                          className="text-orange-600 hover:text-orange-800 font-medium"
                        >
                          Reply
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;