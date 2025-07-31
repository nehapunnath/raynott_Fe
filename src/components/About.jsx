import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const aboutData = [
  {
    title: 'About School',
    content: 'What a child learns in the early years of education forms the foundation for their future. Play schools create a nurturing environment that fosters curiosity and develops questioning skills. Influenced by international pedagogies, these schools adopt research-based curriculums for early childhood development. When choosing a play school, consider distance, curriculum, infrastructure, and the founders\' educational philosophy. Edustoke helps parents find schools that nurture children as they would, with over 50k+ views of listed schools.',
    image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    stats: '50k+ School Views'
  },
  {
    title: 'About Colleges',
    content: 'Higher education in colleges shapes young adults by providing advanced knowledge and career-ready skills. Colleges offer diverse courses, state-of-the-art facilities, and opportunities for personal growth. Our platform helps students navigate options based on location, reputation, and academic programs, with over 30k+ views to guide decisions. We showcase institutions that balance academic rigor with holistic development.',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    stats: '30k+ College Views'
  },
  {
    title: 'About PU College',
    content: 'PU Colleges bridge school and university, offering specialized streams with career-focused academics. These institutions provide expert faculty and comprehensive preparation for higher education. We simplify selection by highlighting top colleges based on infrastructure, faculty quality, and success rates, with over 20k+ views. Our platform helps students find institutions that maximize their potential during these crucial years.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    stats: '20k+ PU College Views'
  },
  {
    title: 'About Coaching Centers',
    content: 'Coaching centers provide targeted training for competitive exams and skill development, offering structured programs and expert guidance. We help students find centers with proven track records, filtering by success rates, faculty experience, and student reviews. With over 15k+ views, our platform connects learners with institutions that offer personalized attention and effective teaching methodologies.',
    image: 'https://images.unsplash.com/photo-1549861833-c5932fd19229?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    stats: '15k+ Coaching Center Views'
  }
];

function About() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % aboutData.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + aboutData.length) % aboutData.length);
  };

  // Auto-rotate slides every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 8000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <div className="max-w-6xl mx-auto my-16 p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl border border-blue-100">
      <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
        Our Educational Ecosystem
      </h2>
      
      <div className="relative h-[400px] md:h-[350px]">
        <AnimatePresence custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute inset-0 flex flex-col md:flex-row items-center gap-8 p-4"
          >
            <div className="w-full md:w-1/2 h-full">
              <motion.img 
                src={aboutData[currentIndex].image} 
                alt={aboutData[currentIndex].title} 
                className="rounded-xl w-full h-full object-cover shadow-md"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="w-full md:w-1/2">
              <h3 className="text-2xl font-bold mb-4 text-blue-700">
                {aboutData[currentIndex].title}
              </h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                {aboutData[currentIndex].content}
              </p>
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg inline-block font-medium">
                {aboutData[currentIndex].stats}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center mt-8 space-x-4">
        {aboutData.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`w-3 h-3 rounded-full transition-all ${index === currentIndex ? 'bg-blue-600 w-6' : 'bg-blue-300'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <motion.button
          onClick={prevSlide}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft size={24} />
        </motion.button>
        <motion.button
          onClick={nextSlide}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight size={24} />
        </motion.button>
      </div>
    </div>
  );
}

export default About;