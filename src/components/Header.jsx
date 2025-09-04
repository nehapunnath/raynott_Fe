import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaChevronRight } from 'react-icons/fa';
import { schoolApi } from '../services/schoolApi';
import collegeApi from '../services/collegeApi';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [schoolsData, setSchoolsData] = useState({});
  const [collegesData, setCollegesData] = useState({});
  const [loading, setLoading] = useState(true);
  const [mobileSubmenu, setMobileSubmenu] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Function to extract and organize data from API response
  const organizeData = (data, typeField, cityField) => {
    const organizedData = {};
    
    let itemsArray = [];
    if (Array.isArray(data)) {
      itemsArray = data;
    } else if (data && typeof data === 'object') {
      itemsArray = Object.values(data);
    }
    
    console.log('Items to process:', itemsArray);
    
    itemsArray.forEach(item => {
      if (!item) return;
      
      const type = item[typeField] || 
                   item.type || 
                   item.category || 
                   item.collegeType || 
                   item.schoolType || 
                   item.typeOfCollege || 
                   'Other';
      
      const city = item[cityField] || 
                   item.city || 
                   item.location || 
                   item.addressCity || 
                   item.address?.city || 
                   'Unknown';
      
      if (type && city && type !== 'Other' && city !== 'Unknown') {
        const cleanType = type.trim();
        const cleanCity = city.trim();
        
        if (!organizedData[cleanType]) {
          organizedData[cleanType] = new Set();
        }
        
        organizedData[cleanType].add(cleanCity);
      }
    });
    
    const finalData = {};
    Object.keys(organizedData).forEach(type => {
      finalData[type] = Array.from(organizedData[type]).sort();
    });
    
    return finalData;
  };

  const fetchData = async () => {
    try {
      console.log('Fetching data...');
      
      const schoolsResponse = await schoolApi.getSchools();
      console.log('Schools API response:', schoolsResponse);
      
      if (schoolsResponse.success && schoolsResponse.data) {
        const schoolData = organizeData(schoolsResponse.data, 'typeOfSchool', 'city');
        setSchoolsData(schoolData);
        console.log('Processed schools data:', schoolData);
      }

      const collegesResponse = await collegeApi.getColleges();
      console.log('Colleges API response:', collegesResponse);
      
      let collegesDataToProcess = collegesResponse.data;
      if (collegesResponse && !collegesResponse.data && collegesResponse.success) {
        for (const key in collegesResponse) {
          if (key !== 'success' && key !== 'message' && Array.isArray(collegesResponse[key])) {
            collegesDataToProcess = collegesResponse[key];
            break;
          }
        }
      }
      
      if (collegesResponse.success && collegesDataToProcess) {
        const collegeData = organizeData(collegesDataToProcess, 'typeOfCollege', 'city');
        setCollegesData(collegeData);
        console.log('Processed colleges data:', collegeData);
      } else {
        console.warn('No college data found in response');
        setCollegesData({
          'Engineering': ['Bangalore', 'Pune', 'Chennai', 'Hyderabad', 'Delhi'],
          'Medical': ['Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Kolkata'],
          'Arts & Science': ['Bangalore', 'Chennai', 'Mumbai', 'Delhi', 'Kolkata'],
          'Management': ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune']
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setSchoolsData({
        'CBSE': ['Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad'],
        'ICSE': ['Bangalore', 'Mumbai', 'Pune', 'Kolkata', 'Delhi'],
        'State Board': ['Bangalore', 'Chennai', 'Hyderabad', 'Mumbai', 'Pune'],
        'International': ['Bangalore', 'Mumbai', 'Delhi', 'Chennai']
      });
      setCollegesData({
        'Engineering': ['Bangalore', 'Pune', 'Chennai', 'Hyderabad', 'Delhi'],
        'Medical': ['Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Kolkata'],
        'Arts & Science': ['Bangalore', 'Chennai', 'Mumbai', 'Delhi', 'Kolkata'],
        'Management': ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune']
      });
    } finally {
      setLoading(false);
    }
  };

  const dropdownItems = {
    schools: Object.keys(schoolsData).length > 0 ? 
      Object.keys(schoolsData).map(type => ({
        label: type,
        subItems: schoolsData[type].map(city => ({
          name: `Schools in ${city}`,
          path: `/listing?type=${encodeURIComponent(type)}&city=${encodeURIComponent(city)}` // Updated to /listing
        }))
      })) : [
        {
          label: 'Schools',
          subItems: [{ name: 'Browse All Schools', path: '/listing' }]
        }
      ],
    
    colleges: Object.keys(collegesData).length > 0 ? 
      Object.keys(collegesData).map(type => ({
        label: type,
        subItems: collegesData[type].map(city => ({
          name: `Schools in ${city}`,
          path: `/colleges?type=${encodeURIComponent(type)}&city=${encodeURIComponent(city)}`
        }))
      })) : [
        {
          label: 'Colleges',
          subItems: [{ name: 'Browse All Schools', path: '/colleges' }]
        }
      ],
    
    pu: [
      { 
        label: 'PU Colleges', 
        subItems: [
          { name: 'PU Colleges in Bangalore', path: '/pu-colleges?city=Bangalore' },
          { name: 'PU Colleges in Mumbai', path: '/pu-colleges?city=Mumbai' },
          { name: 'PU Colleges in Delhi', path: '/pu-colleges?city=Delhi' }
        ] 
      }
    ],
    
    coaching: [
      { 
        label: 'Entrance Exams', 
        subItems: [
          { name: 'Coaching in Bangalore', path: '/coaching?type=entrance&city=Bangalore' },
          { name: 'Coaching in Delhi', path: '/coaching?type=entrance&city=Delhi' },
          { name: 'Coaching in Mumbai', path: '/coaching?type=entrance&city=Mumbai' }
        ] 
      },
      { 
        label: 'Tuition Centers', 
        subItems: [
          { name: 'Tutors in Bangalore', path: '/tutors?city=Bangalore' },
          { name: 'Tutors in Delhi', path: '/tutors?city=Delhi' },
          { name: 'Tutors in Mumbai', path: '/tutors?city=Mumbai' }
        ] 
      }
    ]
  };

  const renderDesktopDropdown = (category) => {
    const items = dropdownItems[category];
    
    if (!items || items.length === 0) {
      return (
        <div className="absolute top-full left-0 w-48 bg-white text-gray-900 rounded shadow-lg py-3 z-40">
          <div className="px-4 py-2">
            <p className="text-sm text-gray-500">No data available</p>
            <Link 
              to={`/${category}`} 
              className="text-sm text-orange-500 hover:text-orange-400 block mt-2"
              onClick={() => setActiveDropdown(null)}
            >
              Browse All {category.charAt(0).toUpperCase() + category.slice(1)}
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="absolute top-full left-0 w-auto bg-white text-gray-900 rounded shadow-lg py-3 z-40 max-h-96 overflow-y-auto">
        <div className="flex">
          {items.map((group, index) => (
            <div key={index} className="px-6 py-4 min-w-[220px] border-r last:border-r-0 border-gray-200">
              <h4 className="font-semibold text-sm text-orange-500 mb-3">{group.label}</h4>
              <ul className="space-y-2">
                {group.subItems.map((item, i) => (
                  <li key={i}>
                    <Link 
                      to={item.path} 
                      className="text-sm hover:text-orange-400 block transition-colors"
                      onClick={() => setActiveDropdown(null)}
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
  };

  const renderMobileSubmenu = (category) => {
    const items = dropdownItems[category];
    
    return (
      <div className="ml-4 mt-2 space-y-4">
        <button 
          onClick={() => setMobileSubmenu(null)}
          className="flex items-center text-orange-400 font-medium mb-2"
        >
          <FaChevronRight className="rotate-180 mr-1" /> Back
        </button>
        
        {items && items.length > 0 ? (
          items.map((group, gidx) => (
            <div key={gidx} className="mb-4">
              <h5 className="text-base text-orange-300 font-semibold mb-2">{group.label}</h5>
              <ul className="ml-2 space-y-2">
                {group.subItems.map((item, iidx) => (
                  <li key={iidx}>
                    <Link 
                      to={item.path} 
                      onClick={() => {
                        setMenuOpen(false);
                        setMobileSubmenu(null);
                      }} 
                      className="text-sm block py-1 hover:text-orange-400 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <div className="mb-4">
            <p className="text-gray-400 mb-2">No data available</p>
            <Link 
              to={`/${category}`} 
              onClick={() => {
                setMenuOpen(false);
                setMobileSubmenu(null);
              }} 
              className="text-sm text-orange-500 hover:text-orange-400"
            >
              Browse All {category.charAt(0).toUpperCase() + category.slice(1)}
            </Link>
          </div>
        )}
      </div>
    );
  };

  return (
    <header className="bg-gray-900 text-white px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between relative z-50 shadow-md">
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-2">
        <span className="text-xl sm:text-2xl font-bold text-orange-500" style={{ fontFamily: 'Cinzel, serif' }}>
          Raynott
        </span>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 text-base lg:text-lg font-medium relative">
        {['schools', 'colleges', 'pu', 'coaching'].map((key) => (
          <div
            key={key}
            className="relative group"
            onMouseEnter={() => setActiveDropdown(key)}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <span className="cursor-pointer hover:text-orange-400 px-2 py-1 whitespace-nowrap flex items-center transition-colors">
              {key === 'pu' ? 'PU College' : 
               key === 'coaching' ? 'Coaching/Tuition' : 
               key.charAt(0).toUpperCase() + key.slice(1)}
            </span>
            {activeDropdown === key && renderDesktopDropdown(key)}
          </div>
        ))}

        <Link to="/all-teachers" className="hover:text-orange-400 px-2 py-1 whitespace-nowrap transition-colors">
          All Teachers
        </Link>
        <Link to="/contact" className="hover:text-orange-400 px-2 py-1 whitespace-nowrap transition-colors">
          Contact Us
        </Link>
      </nav>

      {/* Login Button - Desktop */}
      <div className="hidden md:block">
        <Link 
          to="/login" 
          className="bg-white text-gray-900 px-4 py-1.5 lg:px-6 lg:py-2 rounded-lg hover:bg-orange-200 transition-all font-medium text-base lg:text-lg whitespace-nowrap shadow-sm hover:shadow-md"
        >
          Login
        </Link>
      </div>

      {/* Mobile Hamburger */}
      <button 
        className="md:hidden text-white text-xl p-1" 
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        >
          <div 
            className="absolute top-0 right-0 h-full w-4/5 max-w-sm bg-gray-900 text-white overflow-y-auto z-50 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5">
              {/* Close button */}
              <div className="flex justify-end mb-6">
                <button 
                  onClick={() => setMenuOpen(false)}
                  className="text-white p-1"
                  aria-label="Close menu"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {/* Mobile menu content */}
              {mobileSubmenu ? (
                renderMobileSubmenu(mobileSubmenu)
              ) : (
                <div className="space-y-6">
                  {Object.keys(dropdownItems).map((key, idx) => (
                    <div key={idx} className="border-b border-gray-700 pb-4">
                      <button 
                        onClick={() => setMobileSubmenu(key)}
                        className="flex items-center justify-between w-full text-left font-semibold text-orange-400 text-lg py-2"
                      >
                        <span>
                          {key === 'pu' ? 'PU College' : 
                           key === 'coaching' ? 'Coaching/Tuition' : 
                           key.charAt(0).toUpperCase() + key.slice(1)}
                        </span>
                        <FaChevronRight className="text-sm" />
                      </button>
                    </div>
                  ))}
                  
                  <div className="border-b border-gray-700 pb-4">
                    <Link 
                      to="/all-teachers" 
                      onClick={() => setMenuOpen(false)} 
                      className="block font-semibold text-lg py-2 hover:text-orange-400 transition-colors"
                    >
                      All Teachers
                    </Link>
                  </div>
                  
                  <div className="border-b border-gray-700 pb-4">
                    <Link 
                      to="/contact" 
                      onClick={() => setMenuOpen(false)} 
                      className="block font-semibold text-lg py-2 hover:text-orange-400 transition-colors"
                    >
                      Contact Us
                    </Link>
                  </div>
                  
                  <div className="pt-4">
                    <Link 
                      to="/login" 
                      onClick={() => setMenuOpen(false)} 
                      className="block bg-white text-gray-900 px-6 py-3 rounded-lg hover:bg-orange-200 transition-all font-medium text-lg text-center"
                    >
                      Login
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;