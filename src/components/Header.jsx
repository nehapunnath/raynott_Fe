import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const dropdownItems = {
    schools: [
      { label: 'Day School', subItems: [
        { name: 'Schools in Bangalore', path: '/listing' },
        { name: 'Schools in Mumbai', path: '/listing' }
      ] },
      { label: 'Boarding School', subItems: [
        { name: 'Residential Schools', path: '/listed?type=residential' },
        { name: 'International Schools', path: '/listed' }
      ] }
    ],
    colleges: [
      { label: 'Engineering', subItems: [
        { name: 'Bangalore Colleges', path: '/colleges' },
        { name: 'Pune Colleges', path: '/colleges' }
      ] },
      { label: 'Medical', subItems: [
        { name: 'Bangalore Colleges', path: '/colleges' },
        { name: 'Pune Colleges', path: '/colleges' }
      ] }
    ],
    pu: [
      { label: 'Plus One', subItems: [
        { name: 'PU Colleges in Bangalore', path: '/pu-colleges' },
      ] },
      { label: 'Plus Two', subItems: [
        { name: 'PU Colleges in Bangalore', path: '/pu-colleges' },
      ] }
    ],
    coaching: [
      { label: 'Entrance Exams', subItems: [
        { name: 'Coaching in Bangalore', path: '/coaching' },
      ] },
      { label: 'Tuition Centers', subItems: [
        { name: 'Tutors in Bangalore', path: '/tutors' },
      ] }
    ]
  };

  const renderDropdown = (category) => (
    <div className="absolute top-full left-0 w-auto bg-white text-gray-900 rounded shadow-lg py-3 z-40">
      <div className="flex">
        {dropdownItems[category].map((group, index) => (
          <div key={index} className="px-6 py-4 min-w-[220px] border-r last:border-r-0 border-gray-200">
            <h4 className="font-semibold text-sm text-orange-500 mb-3">{group.label}</h4>
            <ul className="space-y-3">
              {group.subItems.map((item, i) => (
                <li key={i}>
                  <Link 
                    to={item.path} 
                    className="text-sm hover:text-orange-400 block"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <header className="bg-gray-900 text-white px-6 h-20 flex items-center justify-between relative z-50">
      <Link to="/" className="flex items-center space-x-3">
        <span className="text-2xl font-bold text-orange-500" style={{ fontFamily: 'Cinzel, serif' }}>Raynott</span>
      </Link>

      {/* Desktop Nav - Single Line */}
      <nav className="hidden md:flex items-center space-x-6 text-lg font-medium relative">
        {['schools', 'colleges', 'pu', 'coaching'].map((key) => (
          <div
            key={key}
            className="relative group"
            onMouseEnter={() => setActiveDropdown(key)}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <span className="cursor-pointer hover:text-orange-400 px-2 py-1 whitespace-nowrap">
              {key === 'pu' ? 'PU College' : 
               key === 'coaching' ? 'Coaching/Tuition' : 
               key.charAt(0).toUpperCase() + key.slice(1)}
            </span>
            {activeDropdown === key && renderDropdown(key)}
          </div>
        ))}

        <Link to="/all-teachers" className="hover:text-orange-400 px-2 py-1 whitespace-nowrap">All Teachers</Link>
        <Link to="/contact" className="hover:text-orange-400 px-2 py-1 whitespace-nowrap">Contact Us</Link>
      </nav>

      {/* Login Button - Desktop */}
      <div className="hidden md:block">
        <Link 
          to="/login" 
          className="bg-white text-gray-900 px-6 py-2 rounded-lg hover:bg-orange-200 transition font-medium text-lg whitespace-nowrap"
        >
          Login
        </Link>
      </div>

      {/* Mobile Hamburger */}
      <button className="md:hidden text-white text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-20 left-0 w-full bg-gray-900 text-white flex flex-col py-6 space-y-6 md:hidden z-50 px-6">
          {Object.keys(dropdownItems).map((key, idx) => (
            <div key={idx} className="flex flex-col space-y-4">
              <span className="font-semibold text-orange-400 text-lg">
                {key === 'pu' ? 'PU College' : key === 'coaching' ? 'Coaching/Tuition' : key.charAt(0).toUpperCase() + key.slice(1)}
              </span>
              {dropdownItems[key].map((group, gidx) => (
                <div key={gidx} className="ml-4">
                  <h5 className="text-base text-orange-300 mb-2">{group.label}</h5>
                  <ul className="ml-2 space-y-2">
                    {group.subItems.map((item, iidx) => (
                      <li key={iidx}>
                        <Link 
                          to={item.path} 
                          onClick={() => setMenuOpen(false)} 
                          className="text-sm block py-1"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
          <div className="space-y-4">
            <Link to="/all-teachers" onClick={() => setMenuOpen(false)} className="hover:text-orange-400 block py-2">All Teachers</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)} className="hover:text-orange-400 block py-2">Contact Us</Link>
          </div>
          <Link 
            to="/login" 
            onClick={() => setMenuOpen(false)} 
            className="bg-white text-gray-900 px-6 py-3 rounded-lg hover:bg-orange-200 transition font-medium text-lg text-center mt-4"
          >
            Login
          </Link>
        </div>
      )}
    </header>
  );
}

export default Header;