import React from 'react'
import { motion } from 'framer-motion';


function StickyButton() {
  return (
     <div className="fixed top-1/2 right-4 transform -translate-y-1/2 flex flex-col gap-4 z-50">
                <motion.button
                    className="bg-white text-green-500 font-bold py-3 px-6 rounded-full shadow-lg hover:bg-green-100 hover:shadow-xl transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    SHORTLISTS
                </motion.button>
                <motion.button
                    className="bg-white text-green-500 font-bold py-3 px-6 rounded-full shadow-lg hover:bg-green-100 hover:shadow-xl transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    APPLICATIONS
                </motion.button>
            </div>
    
  )
}

export default StickyButton