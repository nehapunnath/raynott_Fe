import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import TimePicker from 'react-time-picker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-time-picker/dist/TimePicker.css';
import Footer from '../components/Footer';
import StickyButton from '../components/StickyButton';

const BookaDemo = () => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState('10:00');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('Please fill in all required fields');
      return;
    }
    alert(`Demo booked for ${name} (${phone}) on ${date.toDateString()} at ${time}. You'll receive a confirmation email shortly.`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Column - Information */}
        <div className="bg-orange-600 text-white p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-6">Connect With Parents Across India</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-orange-500 rounded-full p-2 mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">India's largest education  Platform</h3>
                  <p className="text-orange-100">Thousands of institutions trust our platform—join them today.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-orange-500 rounded-full p-2 mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Direct Parent Connections</h3>
                  <p className="text-orange-100">Showcase your institution to thousands of searching parents</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-orange-500 rounded-full p-2 mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Verified Enquiries</h3>
                  <p className="text-orange-100">Receive genuine interest from serious parents</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-orange-500 pt-6">
            <p className="text-orange-200">"Partnering with Raynott helped us increase admissions by 40% last academic year."</p>
            <p className="font-medium mt-2">- Principal, Delhi Public School</p>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Book Your Demo</h2>
            <p className="text-gray-600 mt-2">Schedule a personalized consultation with our education experts</p>
          </div>

          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 text-left mb-6">
            <p className="text-gray-800 font-medium mb-2">Dear Education Professional,</p>
            <p className="text-gray-700 text-sm">
              We are proud to be India's largest education platform, dedicated to bridging the gap between institutions and students. 
              To learn more about how we can help your institution, please fill in your details and select a convenient time slot below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-semibold text-gray-800 mb-2">Your Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-800 mb-2">Phone Number <span className="text-red-500">*</span></label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your 10-digit mobile number"
                className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                required
                pattern="[0-9]{10}"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-800 mb-2">Select Date <span className="text-red-500">*</span></label>
              <DatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                dateFormat="MMMM d, yyyy"
                minDate={new Date()}
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-800 mb-2">Select Time <span className="text-red-500">*</span></label>
              <div className="border-2 border-gray-200 rounded-lg p-1 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200 transition">
                <TimePicker
                  onChange={setTime}
                  value={time}
                  className="w-full border-none p-2"
                  disableClock={true}
                  clearIcon={null}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 transform hover:scale-[1.02]"
            >
              Book My Demo Session
            </button>
          </form>

          <div className="text-center text-sm text-gray-500 mt-6 border-t border-gray-100 pt-4">
            <p>Once you book the slot, you will receive an email with the meeting link.</p>
            <p className="mt-1 text-xs text-gray-400">Our team will contact you to confirm your booking</p>
          </div>
        </div>
      </div>
     
    </div>
  );
};

export default BookaDemo;