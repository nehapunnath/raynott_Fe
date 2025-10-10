import React from 'react';
import { FaFacebook, FaInstagram, FaYoutube, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-slate-800 text-white py-10 px-6 md:px-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* First Column: Logo */}
        <div>
          <h2 className="text-2xl font-bold mb-2 text-orange-500">Raynott</h2>
          <p className="text-sm text-gray-300 mb-4">
            Your trusted partner in education and career guidance
          </p>
        </div>

        {/* Second Column: Main Categories */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
          <ul className="text-sm space-y-3">
            <li><a href="/all-schools" className="hover:text-orange-400 transition-colors block py-1">Schools</a></li>
            <li><a href="/all-colleges" className="hover:text-orange-400 transition-colors block py-1">Colleges</a></li>
            <li><a href="/all-pucolleges" className="hover:text-orange-400 transition-colors block py-1">PU Colleges</a></li>
            <li><a href="/all-coaching" className="hover:text-orange-400 transition-colors block py-1">Coaching/Tuition Centers</a></li>
            <li><a href="/all-teachers" className="hover:text-orange-400 transition-colors block py-1">All Teachers</a></li>
          </ul>
        </div>

        {/* Third Column: Contact & Social Media */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
          <div className="space-y-3 mb-6">
            <p className="flex items-center text-sm">
              <FaMapMarkerAlt className="mr-3 text-orange-500" /> 
              Bengaluru, Karnataka 560103
            </p>
            <p className="flex items-center text-sm">
              <FaPhone className="mr-3 text-orange-500" /> 
              +91 981 124 7700
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-3">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="bg-slate-700 p-2 rounded-lg hover:bg-blue-600 transition-colors">
                <FaFacebook className="text-xl" />
              </a>
              <a href="#" className="bg-slate-700 p-2 rounded-lg hover:bg-pink-600 transition-colors">
                <FaInstagram className="text-xl" />
              </a>
              <a href="#" className="bg-slate-700 p-2 rounded-lg hover:bg-red-600 transition-colors">
                <FaYoutube className="text-xl" />
              </a>
            </div>
          </div>
        </div>
      </div>

     
    </footer>
  );
}

export default Footer;