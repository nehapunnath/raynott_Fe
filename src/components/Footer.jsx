import React from 'react';
import { FaFacebook, FaInstagram, FaYoutube, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-slate-800 text-white py-10 px-6 md:px-20">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Left Column: Logo + Address */}
        <div>
          <h2 className="text-2xl font-bold mb-2 text-orange-500">Raynott</h2>
          {/* <p className="text-sm mb-2">Your Company Name</p> */}
          <p className="flex items-center text-sm mb-1"><FaMapMarkerAlt className="mr-2" /> Bengaluru, Karnataka 560103</p>
          <p className="flex items-center text-sm"><FaPhone className="mr-2" /> +91 981 124 7700</p>
          <div className="flex mt-4 space-x-3">
            <a href="#"><FaFacebook className="text-xl hover:text-blue-500" /></a>
            <a href="#"><FaInstagram className="text-xl hover:text-pink-500" /></a>
            <a href="#"><FaYoutube className="text-xl hover:text-red-500" /></a>
          </div>
        </div>

        {/* Schools Column */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Schools</h3>
          <ul className="text-sm space-y-2">
            <li><a href="#">CBSE Schools</a></li>
            <li><a href="#">ICSE Schools</a></li>
            <li><a href="#">State Board Schools</a></li>
            <li><a href="#">IB Schools</a></li>
          </ul>
        </div>

        {/* Colleges Column */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Colleges</h3>
          <ul className="text-sm space-y-2">
            <li><a href="#">Engineering Colleges</a></li>
            <li><a href="#">Medical Colleges</a></li>
            <li><a href="#">Law Colleges</a></li>
            <li><a href="#">Arts & Science Colleges</a></li>
          </ul>
        </div>

        {/* PU Colleges Column */}
        <div>
          <h3 className="font-semibold text-lg mb-3">PU Colleges</h3>
          <ul className="text-sm space-y-2">
            <li><a href="#">Plus One Colleges</a></li>
            <li><a href="#">Plus Two Colleges</a></li>
            <li><a href="#">Inter Colleges</a></li>
            <li><a href="#">Junior Colleges</a></li>
          </ul>
        </div>

        {/* Coaching Centers Column */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Coaching Centers</h3>
          <ul className="text-sm space-y-2">
            <li><a href="#">IIT-JEE Coaching</a></li>
            <li><a href="#">NEET Coaching</a></li>
            <li><a href="#">UPSC Coaching</a></li>
            <li><a href="#">Language Training</a></li>
          </ul>
        </div>
      </div>

    
    </footer>
  );
}

export default Footer;
