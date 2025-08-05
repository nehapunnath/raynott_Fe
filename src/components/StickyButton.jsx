import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

function StickyButton() {
  const [openModal, setOpenModal] = useState(null);

  const modalContent = {
    shortlists: (
      <div className="p-6">
        <h3 className="text-2xl font-bold text-green-600 mb-6">Your Shortlists</h3>
        <p className="text-gray-700 text-lg">No Shortlists</p>
        {/* Add your shortlist content here */}
      </div>
    ),
    applications: (
      <div className="p-6">
        <h3 className="text-2xl font-bold text-green-600 mb-6">Your Applications</h3>
        <p className="text-gray-700 text-lg">No Applications</p>
        {/* Add your applications content here */}
      </div>
    )
  };

  return (
    <>
      <div className="fixed top-1/2 right-4 transform -translate-y-1/2 flex flex-col gap-4 z-50">
        <motion.button
          className={`bg-white text-green-500 font-bold py-3 px-6 rounded-full shadow-lg hover:bg-green-100 hover:shadow-xl transition-all duration-300 ${openModal === 'shortlists' ? 'bg-green-100' : ''}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          onClick={() => setOpenModal(openModal === 'shortlists' ? null : 'shortlists')}
        >
          SHORTLISTS
        </motion.button>
        <motion.button
          className={`bg-white text-green-500 font-bold py-3 px-6 rounded-full shadow-lg hover:bg-green-100 hover:shadow-xl transition-all duration-300 ${openModal === 'applications' ? 'bg-green-100' : ''}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          onClick={() => setOpenModal(openModal === 'applications' ? null : 'applications')}
        >
          APPLICATIONS
        </motion.button>
      </div>

      <AnimatePresence>
        {openModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenModal(null)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] relative"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 p-1"
                onClick={() => setOpenModal(null)}
              >
                <FiX size={28} />
              </button>
              
              <div className="overflow-y-auto max-h-[calc(90vh-4rem)] p-8">
                {modalContent[openModal]}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default StickyButton;