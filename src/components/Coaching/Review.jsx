import React, { useState } from 'react';
import { FaStar, FaRegStar, FaThumbsUp, FaThumbsDown, FaReply } from 'react-icons/fa';

const Review = () => {
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([
    { id: 1, text: 'Great coaching with excellent teachers! My child has improved significantly in both academics', rating: 4, likes: 15, dislikes: 2, date: '2023-05-15', author: 'Alex' },
    { id: 2, text: 'Good facilities but fees are high. The quality of education justifies the cost to some extent.', rating: 3, likes: 8, dislikes: 3, date: '2023-04-22', author: 'Maria John' },
    { id: 3, text: 'Outstanding curriculum and caring staff. The school focuses on holistic development.', rating: 5, likes: 25, dislikes: 1, date: '2023-06-10', author: 'Felix' },
  ]);

  const handleStarClick = (rating) => {
    setUserRating(rating);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (userRating > 0 && reviewText.trim()) {
      const newReview = { 
        id: Date.now(), 
        text: reviewText, 
        rating: userRating, 
        likes: 0, 
        dislikes: 0,
        date: new Date().toISOString().split('T')[0],
        author: 'You'
      };
      setReviews([newReview, ...reviews]);
      setUserRating(0);
      setReviewText('');
    }
  };

  const handleLike = (id) => {
    setReviews(reviews.map(review => review.id === id ? { ...review, likes: review.likes + 1 } : review));
  };

  const handleDislike = (id) => {
    setReviews(reviews.map(review => review.id === id ? { ...review, dislikes: review.dislikes + 1 } : review));
  };

  // Calculate average ratings
  const parentsAvgRating = 4.5;
  const raynottAvgRating = 4.3;
  const parentsReviewCount = 150;
  const raynottReviewCount = 200;

  return (
    <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl shadow-xl border border-orange-100">
      <h2 className="text-3xl font-bold text-center mb-6">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-600">
          School Reviews
        </span>
      </h2>

      {/* Rating Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Parents Rating Card */}
        <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Parents Rating</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-4xl font-bold text-amber-600 mr-4">{parentsAvgRating.toFixed(1)}</div>
              <div>
                <div className="flex mb-1">
                  {[...Array(5)].map((_, i) => (
                    i < Math.floor(parentsAvgRating) ? 
                      <FaStar key={i} className="text-yellow-400" /> : 
                      (i < parentsAvgRating ? <FaStar key={i} className="text-yellow-400 opacity-70" /> : <FaRegStar key={i} className="text-gray-300" />)
                  ))}
                </div>
                <div className="text-sm text-gray-500">{parentsReviewCount} reviews</div>
              </div>
            </div>
            <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
              Excellent
            </div>
          </div>
        </div>

        {/* Raynott Rating Card */}
        <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-amber-500 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Raynott Rating</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-4xl font-bold text-amber-600 mr-4">{raynottAvgRating.toFixed(1)}</div>
              <div>
                <div className="flex mb-1">
                  {[...Array(5)].map((_, i) => (
                    i < Math.floor(raynottAvgRating) ? 
                      <FaStar key={i} className="text-yellow-400" /> : 
                      (i < raynottAvgRating ? <FaStar key={i} className="text-yellow-400 opacity-70" /> : <FaRegStar key={i} className="text-gray-300" />)
                  ))}
                </div>
                <div className="text-sm text-gray-500">{raynottReviewCount} reviews</div>
              </div>
            </div>
            <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
              Very Good
            </div>
          </div>
        </div>
      </div>

      {/* Rating and Review Form */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Share Your Experience</h3>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Your Rating</label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleStarClick(star)}
                className="focus:outline-none"
              >
                {star <= userRating ? (
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
              placeholder="Share details of your experience at this school..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition"
              rows="5"
            />
          </div>
          <button
            type="submit"
            disabled={!userRating || !reviewText.trim()}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white shadow-md transition ${!userRating || !reviewText.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700'}`}
          >
            Submit Review
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <span className="bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
            What Parents Say
          </span>
          <span className="ml-auto bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
            {reviews.length} Reviews
          </span>
        </h3>

        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border-l-4 border-orange-200">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center mb-1">
                    <div className="flex mr-3">
                      {[...Array(5)].map((_, i) => (
                        i < review.rating ? 
                          <FaStar key={i} className="text-yellow-400" size={18} /> : 
                          <FaRegStar key={i} className="text-gray-300" size={18} />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <h4 className="font-medium text-gray-800">{review.author}</h4>
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
              
              <button className="text-amber-600 hover:text-amber-800 font-medium flex items-center transition">
                <FaReply className="mr-2" /> Reply
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Review;