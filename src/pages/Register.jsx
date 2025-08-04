import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSchool, FaCheckCircle, FaChalkboardTeacher, FaUsers, FaSearchLocation } from "react-icons/fa";
import { motion } from 'framer-motion';
import Header from '../components/Header';

function Register() {
  const navigate = useNavigate();

//   const handleRegisterClick = () => {
//     navigate('/register-form');
//   };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen font-sans text-gray-800">
        <Header/>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-500 to-amber-600 text-white py-20 px-6 text-center overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-white"></div>
          <div className="absolute bottom-10 right-20 w-40 h-40 rounded-full bg-white"></div>
          <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-white"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Join the <span className="text-amber-200">Premier Education Network</span>
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Showcase your institution to thousands of parents and students searching for quality education.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/register-form')}
            className="mt-6 bg-white text-orange-600 font-bold px-8 py-4 rounded-full hover:bg-amber-100 transition-all shadow-lg hover:shadow-xl"
          >
            Start Registration - It's Free!
          </motion.button>
        </motion.div>
      </div>

      {/* Why Register Section */}
      <div className="max-w-7xl mx-auto py-16 px-6">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Why Choose Raynott?</h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We connect quality institutions with the right students and parents through our trusted platform.
          </p>
        </motion.div>

        <motion.ul 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          <motion.li 
            variants={itemVariants}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border-t-4 border-orange-500"
          >
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
              <FaSearchLocation className="text-orange-600 text-2xl" />
            </div>
            <h3 className="font-bold text-xl mb-3 text-center">Increased Visibility</h3>
            <p className="text-gray-600 text-center">
              Get discovered by thousands of families actively searching for educational institutions every month.
            </p>
          </motion.li>
          
          <motion.li 
            variants={itemVariants}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border-t-4 border-amber-500"
          >
            <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
              <FaUsers className="text-amber-600 text-2xl" />
            </div>
            <h3 className="font-bold text-xl mb-3 text-center">Trusted Platform</h3>
            <p className="text-gray-600 text-center">
              Benefit from our reputation as a verified education directory trusted by parents and students.
            </p>
          </motion.li>
          
          <motion.li 
            variants={itemVariants}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border-t-4 border-amber-400"
          >
            <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
              <FaChalkboardTeacher className="text-amber-600 text-2xl" />
            </div>
            <h3 className="font-bold text-xl mb-3 text-center">Comprehensive Profile</h3>
            <p className="text-gray-600 text-center">
              Showcase your facilities, faculty, achievements, and unique offerings in one professional profile.
            </p>
          </motion.li>
        </motion.ul>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">10,000+</div>
              <div className="text-xl">Institutions Listed</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">500K+</div>
              <div className="text-xl">Monthly Visitors</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">24h</div>
              <div className="text-xl">Average Approval Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Process */}
      <div className="max-w-7xl mx-auto py-16 px-6">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Simple Registration Process</h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get your institution listed in just a few easy steps
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline */}
          <div className="hidden md:block absolute left-1/2 h-full w-1 bg-gradient-to-b from-orange-400 to-amber-500"></div>
          
          {/* Steps */}
          <div className="space-y-12 md:space-y-0">
            {/* Step 1 */}
            <div className="relative md:flex items-center">
              <div className="md:w-1/2 md:pr-16 mb-8 md:mb-0 text-right">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-500 text-white font-bold mb-4">
                    1
                  </div>
                  <h3 className="text-xl font-bold mb-2">Complete the Form</h3>
                  <p className="text-gray-600">
                    Fill in basic details about your institution including name, location, and educational offerings.
                  </p>
                </motion.div>
              </div>
              <div className="hidden md:block md:w-1/2"></div>
            </div>
            
            {/* Step 2 */}
            <div className="relative md:flex items-center">
              <div className="hidden md:block md:w-1/2"></div>
              <div className="md:w-1/2 md:pl-16 mb-8 md:mb-0 text-left">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500 text-white font-bold mb-4">
                    2
                  </div>
                  <h3 className="text-xl font-bold mb-2">Upload Documents</h3>
                  <p className="text-gray-600">
                    Provide photos of your campus, accreditation documents, and other relevant materials.
                  </p>
                </motion.div>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="relative md:flex items-center">
              <div className="md:w-1/2 md:pr-16 mb-8 md:mb-0 text-right">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-500 text-white font-bold mb-4">
                    3
                  </div>
                  <h3 className="text-xl font-bold mb-2">Verification</h3>
                  <p className="text-gray-600">
                    Our team will review your submission (typically within 24 hours) to ensure accuracy.
                  </p>
                </motion.div>
              </div>
              <div className="hidden md:block md:w-1/2"></div>
            </div>
            
            {/* Step 4 */}
            <div className="relative md:flex items-center">
              <div className="hidden md:block md:w-1/2"></div>
              <div className="md:w-1/2 md:pl-16 mb-8 md:mb-0 text-left">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500 text-white font-bold mb-4">
                    4
                  </div>
                  <h3 className="text-xl font-bold mb-2">Go Live!</h3>
                  <p className="text-gray-600">
                    Once approved, your profile will be visible to our entire network of prospective students.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Grow Your Institution?</h2>
          <p className="text-xl text-amber-100 mb-8">
            Join thousands of educational institutions already benefiting from our platform.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/register-form')}
            className="bg-white text-orange-600 font-bold px-10 py-4 rounded-full hover:bg-amber-100 transition-all shadow-lg hover:shadow-xl text-lg"
          >
            Register Now - No Cost!
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default Register;