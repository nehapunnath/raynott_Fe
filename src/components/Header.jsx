import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const dropdownItems = {
    schools: [
      { label: 'Day School', subItems: ['Schools in Bangalore', 'Schools in Mumbai'] },
      { label: 'Boarding School', subItems: ['Residential Schools', 'International Schools'] }
    ],
    colleges: [
      { label: 'Engineering', subItems: ['Bangalore Colleges', 'Pune Colleges'] },
      { label: 'Medical', subItems: ['MBBS Colleges', 'Dental Colleges'] }
    ],
    pu: [
      { label: 'Plus One', subItems: ['Science', 'Commerce'] },
      { label: 'Plus Two', subItems: ['Arts', 'Vocational'] }
    ],
    coaching: [
      { label: 'Entrance Exams', subItems: ['JEE Coaching', 'NEET Coaching'] },
      { label: 'Others', subItems: ['UPSC', 'SSC'] }
    ],
    tuition: [
      { label: 'Home Tutors', subItems: ['Maths', 'Science'] },
      { label: 'Online Tutors', subItems: ['CBSE', 'ICSE'] }
    ]
  };

  const renderDropdown = (category) => (
    <div className="absolute top-full left-0 w-auto bg-white text-gray-900 rounded shadow-lg py-3 z-40">
      <div className="flex">
        {dropdownItems[category].map((group, index) => (
          <div key={index} className="px-4 py-2 min-w-[200px] border-r last:border-r-0 border-gray-200">
            <h4 className="font-semibold text-sm text-orange-500 mb-2">{group.label}</h4>
            <ul className="space-y-2">
              {group.subItems.map((item, i) => (
                <li key={i}>
                  <Link 
                    to={`/${category}/${item.toLowerCase().replace(/\s+/g, '-')}`} 
                    className="text-sm hover:text-orange-400 block"
                  >
                    {item}
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
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-3">
        <img src="/logo.png" alt="Raynott Logo" className="w-10 h-10" />
        <span className="text-2xl font-bold text-orange-500" style={{ fontFamily: 'Cinzel, serif' }}>Raynott</span>
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden md:flex space-x-6 text-lg font-medium relative">
        {['schools', 'colleges', 'pu', 'coaching', 'tuition'].map((key) => (
          <div
            key={key}
            className="relative group"
            onMouseEnter={() => setActiveDropdown(key)}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <span className="cursor-pointer capitalize hover:text-orange-400">
              {key === 'pu' ? 'PU College' : key === 'coaching' ? 'Coaching Center' : key === 'tuition' ? 'Tuition Center' : key.charAt(0).toUpperCase() + key.slice(1)}
            </span>
            {activeDropdown === key && renderDropdown(key)}
          </div>
        ))}

        <Link to="/contact" className="hover:text-orange-400 transition">Contact Us</Link>
      </nav>

      {/* Login Button - Desktop */}
      <div className="hidden md:block">
        <Link 
          to="/login" 
          className="bg-white text-gray-900 px-6 py-2 rounded-lg hover:bg-orange-200 transition font-medium text-lg"
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
        <div className="absolute top-20 left-0 w-full bg-gray-900 text-white flex flex-col py-4 space-y-4 md:hidden z-50 px-6">
          {Object.keys(dropdownItems).map((key, idx) => (
            <div key={idx} className="flex flex-col space-y-2">
              <span className="font-semibold text-orange-400">{key === 'pu' ? 'PU College' : key === 'coaching' ? 'Coaching Center' : key === 'tuition' ? 'Tuition Center' : key.charAt(0).toUpperCase() + key.slice(1)}</span>
              {dropdownItems[key].map((group, gidx) => (
                <div key={gidx} className="ml-4">
                  <h5 className="text-sm text-orange-300">{group.label}</h5>
                  <ul className="ml-2 space-y-1">
                    {group.subItems.map((item, iidx) => (
                      <li key={iidx}>
                        <Link to={`/${key}/${item.toLowerCase().replace(/\s+/g, '-')}`} onClick={() => setMenuOpen(false)} className="text-sm block">
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
          <Link to="/contact" onClick={() => setMenuOpen(false)} className="hover:text-orange-400">Contact Us</Link>
          {/* Login Button - Mobile */}
          <Link 
            to="/login" 
            onClick={() => setMenuOpen(false)} 
            className="bg-white text-gray-900 px-6 py-3 rounded-lg hover:bg-orange-200 transition font-medium text-lg text-center"
          >
            Login
          </Link>
        </div>
      )}
    </header>
  );
}

export default Header;