import React, { useState } from 'react';
import { FaStar, FaRegStar, FaThumbsUp, FaThumbsDown, FaReply, FaChalkboardTeacher } from 'react-icons/fa';

const Review = () => {
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [teacherRating, setTeacherRating] = useState(0);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [reviews, setReviews] = useState([
    { 
      id: 1, 
      teacher: 'Mrs. Sunita Sharma', 
      subject: 'Mathematics', 
      text: 'Excellent teaching methodology. Makes complex concepts easy to understand.', 
      rating: 5, 
      likes: 12, 
      dislikes: 1, 
      date: '2023-05-10', 
      author: 'Parent of Rohan' 
    },
    { 
      id: 2, 
      teacher: 'Mr. Rajesh Kumar', 
      subject: 'Science', 
      text: 'Very knowledgeable but sometimes rushes through topics. Could be more patient with students.', 
      rating: 3, 
      likes: 5, 
      dislikes: 2, 
      date: '2023-04-18', 
      author: 'Parent of Ananya' 
    },
    { 
      id: 3, 
      teacher: 'Ms. Priya Malhotra', 
      subject: 'English', 
      text: 'The best English teacher! My child has developed a love for literature thanks to her.', 
      rating: 5, 
      likes: 18, 
      dislikes: 0, 
      date: '2023-06-05', 
      author: 'Parent of Arjun' 
    },
  ]);

  const teachers = [
    { name: 'Mrs. Sunita Sharma', subject: 'Mathematics' },
    { name: 'Mr. Rajesh Kumar', subject: 'Science' },
    { name: 'Ms. Priya Malhotra', subject: 'English' },
    { name: 'Mr. Amit Patel', subject: 'Social Studies' },
    { name: 'Mrs. Neha Gupta', subject: 'Hindi' },
    { name: 'Mr. Vijay Singh', subject: 'Physical Education' },
  ];

  const handleStarClick = (rating) => {
    setTeacherRating(rating);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (teacherRating > 0 && reviewText.trim() && selectedTeacher) {
      const teacher = teachers.find(t => t.name === selectedTeacher);
      const newReview = { 
        id: Date.now(), 
        teacher: selectedTeacher,
        subject: teacher.subject,
        text: reviewText, 
        rating: teacherRating, 
        likes: 0, 
        dislikes: 0,
        date: new Date().toISOString().split('T')[0],
        author: 'You'
      };
      setReviews([newReview, ...reviews]);
      setTeacherRating(0);
      setReviewText('');
      setSelectedTeacher('');
    }
  };

  const handleLike = (id) => {
    setReviews(reviews.map(review => review.id === id ? { ...review, likes: review.likes + 1 } : review));
  };

  const handleDislike = (id) => {
    setReviews(reviews.map(review => review.id === id ? { ...review, dislikes: review.dislikes + 1 } : review));
  };

  // Calculate average teacher ratings
  const teachersAvgRating = 4.6;
  const teachersReviewCount = reviews.length;

  return (
    <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl shadow-xl border border-orange-100">
      <h2 className="text-3xl font-bold text-center mb-6">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-600">
          Teachers Reviews
        </span>
      </h2>

      {/* Rating Summary Card */}
      <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-orange-500 hover:shadow-lg transition-shadow mb-8 max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
          <FaChalkboardTeacher className="text-amber-600 mr-2" />
          Teachers Rating Summary
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-4xl font-bold text-amber-600 mr-4">{teachersAvgRating.toFixed(1)}</div>
            <div>
              <div className="flex mb-1">
                {[...Array(5)].map((_, i) => (
                  i < Math.floor(teachersAvgRating) ? 
                    <FaStar key={i} className="text-yellow-400" /> : 
                    (i < teachersAvgRating ? <FaStar key={i} className="text-yellow-400 opacity-70" /> : <FaRegStar key={i} className="text-gray-300" />)
                ))}
              </div>
              <div className="text-sm text-gray-500">{teachersReviewCount} reviews across {teachers.length} teachers</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
            Excellent
          </div>
        </div>
      </div>

      {/* Rating and Review Form */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FaChalkboardTeacher className="text-amber-600 mr-2" />
          Review a Teacher
        </h3>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Select Teacher</label>
          <select
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition bg-white"
          >
            <option value="">-- Select a Teacher --</option>
            {teachers.map((teacher, index) => (
              <option key={index} value={teacher.name}>
                {teacher.name} ({teacher.subject})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Your Rating</label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleStarClick(star)}
                className="focus:outline-none"
              >
                {star <= teacherRating ? (
                  <FaStar size={28} className="text-amber-500 hover:text-amber-600" />
                ) : (
                  <FaRegStar size={28} className="text-gray-300 hover:text-amber-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleReviewSubmit}>
          <div className="mb-4">
            <label htmlFor="review" className="block text-gray-700 mb-2">Your Review</label>
            <textarea
              id="review"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience with this teacher..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition"
              rows="5"
            />
          </div>
          <button
            type="submit"
            disabled={!teacherRating || !reviewText.trim() || !selectedTeacher}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white shadow-md transition ${!teacherRating || !reviewText.trim() || !selectedTeacher ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700'}`}
          >
            Submit Review
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <span className="bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
            What Parents Say About Teachers
          </span>
          <span className="ml-auto bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
            {reviews.length} Reviews
          </span>
        </h3>

        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border-l-4 border-amber-200">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-lg text-amber-700">{review.teacher}</h4>
                  <p className="text-gray-600 mb-2">{review.subject} Teacher</p>
                  <div className="flex items-center">
                    <div className="flex mr-3">
                      {[...Array(5)].map((_, i) => (
                        i < review.rating ? 
                          <FaStar key={i} className="text-yellow-400" size={16} /> : 
                          <FaRegStar key={i} className="text-gray-300" size={16} />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => handleLike(review.id)} 
                    className="flex items-center text-green-600 hover:text-green-800 transition"
                  >
                    <FaThumbsUp className="mr-1" /> {review.likes}
                  </button>
                  <button 
                    onClick={() => handleDislike(review.id)} 
                    className="flex items-center text-red-600 hover:text-red-800 transition"
                  >
                    <FaThumbsDown className="mr-1" /> {review.dislikes}
                  </button>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{review.text}</p>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">- {review.author}</span>
                <button className="text-amber-600 hover:text-amber-800 font-medium flex items-center transition text-sm">
                  <FaReply className="mr-2" /> Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Review;